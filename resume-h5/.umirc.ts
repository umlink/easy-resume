import { defineConfig } from '@umijs/max';

const publicPath = process.env.NODE_ENV === 'production' ? `https://static.wktline.com/resume-h5/` : '/';
export default defineConfig({
  hash: true,
  routes: [{ path: '/editor', component: 'Editor' }],
  publicPath,
  base: '/h5/',
  analytics: {
    baidu: 'dcdf0bdea8d713f76ecb0f854de4f37b',
  },
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  metas: [
    { name: 'baidu-site-verification', content: 'codeva-5bTEUKTrUy' },
    { charset: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1,user-scalable=no',
    },
    {
      'http-equiv': 'Content-Security-Policy',
      content: 'upgrade-insecure-requests',
    },
  ],
  headScripts: [
    `window.publicPath = "${publicPath}"`,
    {
      src: 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js',
    },
  ],

  model: {},
  npmClient: 'yarn',
  request: {},
  proxy: {
    '/resume-api/puppeteer/pdf': {
      target: 'https://www.wktline.com',
      changeOrigin: true,
    },
    '/resume-api': {
      target: 'https://www.wktline.com',
      changeOrigin: true,
    },
  },
  initialState: {},
  tailwindcss: {},
});
