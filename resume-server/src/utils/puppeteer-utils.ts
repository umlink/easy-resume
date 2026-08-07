import * as puppeteer from 'puppeteer';
import * as genericPool from 'generic-pool';

export const waitTime = (n: number) => new Promise((r) => setTimeout(r, n));

export const initPuppeteerPool = () => {
  const opt = {
    max: 4, //最多产生多少个 puppeteer 实例 。
    min: 2, //保证池中最少有多少个实例存活
    testOnBorrow: true, // 在将 实例 提供给用户之前，池应该验证这些实例。
    autostart: false, //是不是需要在 池 初始化时 初始化 实例
    idleTimeoutMillis: 1000 * 60 * 60, //如果一个实例 60分钟 都没访问就关掉他
    evictionRunIntervalMillis: 1000 * 60 * 3, //每 3分钟 检查一次 实例的访问状态
    maxUses: 2048, //自定义的属性：每一个 实例 最大可重用次数。
    validator: () => Promise.resolve(true),
  };
  const executablePath =
    process.env.NODE_ENV === 'production'
      ? '/opt/google/chrome/chrome'
      : '//Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  console.log('executablePath:', executablePath);
  const factory: any = {
    create: () =>
      puppeteer
        .launch({
          headless: true,
          timeout: 30000,
          // executablePath,
          args: [
            '--no-zygote',
            '--no-sandbox',
            '--disable-gpu',
            '--no-first-run',
            '--single-process',
            '--disable-extensions',
            '--disable-xss-auditor',
            '--disable-dev-shm-usage',
            '--disable-popup-blocking',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--enable-features=NetworkService',
          ],
        })
        .then((instance: any) => {
          instance.useCount = 0;
          return instance;
        }),
    destroy: (instance: any) => {
      instance.close();
    },
    validate: (instance: any) => {
      return opt
        .validator()
        .then((valid) =>
          Promise.resolve(
            valid && (opt.maxUses <= 0 || instance.useCount < opt.maxUses),
          ),
        );
    },
  };
  const pool: any = genericPool.createPool(factory, opt);
  const genericAcquire = pool.acquire.bind(pool);
  // 重写了原有池的消费实例的方法。添加一个实例使用次数的增加
  pool.acquire = () =>
    genericAcquire().then((instance) => {
      instance.useCount += 1;
      return instance;
    });

  pool.use = (fn: any) => {
    let resource: any;
    return pool
      .acquire()
      .then((r) => {
        resource = r;
        return resource;
      })
      .then(fn)
      .then(
        (result: any) => {
          // 不管业务方使用实例成功与后都表示一下实例消费完成
          pool.release(resource);
          return result;
        },
        (err: any) => {
          pool.release(resource);
          throw err;
        },
      );
  };
  return pool;
};
