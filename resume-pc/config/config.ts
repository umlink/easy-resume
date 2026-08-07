import { defineConfig } from '@umijs/max';
import proxy from './proxy';
import routes from './routes';
import webpack from './webpack';

const publicPath = process.env.NODE_ENV === 'production' ? `https://static.wktline.com/${process.env.CDN_PREFIX}` : '/';

export default defineConfig({
  title: '轻简历-轻轻松松制作简历',
  hash: true,
  favicons: ['https://static.web3ling.com/logo/fresume.ico'],
  runtimePublicPath: {},
  publicPath,
  headScripts: [`window.publicPath = "${publicPath}"`],
  metas: [
    { name: 'robots', content: 'all' },
    { name: 'baidu-site-verification', content: 'codeva-5bTEUKTrUy' },
    { charset: 'utf-8' },
    {
      name: 'author',
      content: 'wktline,krlin,kr',
    },
    {
      name: 'keywords',
      content:
        '简历，轻简历，AI简历，AI一键优化，个人简历，应届生，求职简历，清爽，精简简历，免费，个人简历，极简简历，简历模板，模板，wktline简历，轻松写简历，简约简历',
    },
    {
      name: 'description',
      content:
        '轻简历，致力于为应届生和社招求职者提供轻量化、极简和易操作的在线简历制作服务。使用我们的平台，你可以轻松创建专业、满意的真 PDF 格式简历，并享受丰富的内容模板，节省时间和精力，助力你在找工作中脱颖而出。无论是初次求职还是职业转型，轻简历都将成为你的得力助手。',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no',
    },
    {
      'http-equiv': 'Content-Security-Policy',
      content: 'upgrade-insecure-requests',
    },
  ],
  analytics: {
    baidu: 'dcdf0bdea8d713f76ecb0f854de4f37b',
  },
  links: [
    { ref: 'dns-prefetch', href: 'https://static.wktline.com' },
    { ref: 'preconnect', href: 'https://wktline.com' },
    { ref: 'preconnect', href: 'https://www.wktline.com' },
    { ref: 'preconnect', href: 'https://static.wktline.com' },
    { ref: 'icon', size: '16x16', href: '/favicon/favicon_16.png', type: 'image/png' },
    { ref: 'icon', size: '32x32', href: '/favicon/favicon_32.png', type: 'image/png' },
    { ref: 'icon', size: '48x48', href: '/favicon/favicon_48.png', type: 'image/png' },
    { ref: 'icon', size: '64x64', href: '/favicon/favicon_64.png', type: 'image/png' },
    { ref: 'icon', size: '128x128', href: '/favicon/favicon_128.png', type: 'image/png' },
  ],
  access: {},
  model: {},
  initialState: {},
  request: {},
  npmClient: 'yarn',
  tailwindcss: {},
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  mfsu: true,
  routes,
  proxy,
  ...webpack,
});
