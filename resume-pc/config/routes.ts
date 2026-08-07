export default [
  {
    path: '/',
    component: '../layouts/HeaderLayout',
    routes: [
      { path: '', component: './Home', layout: false },
      { path: 'template', component: './Template' },
      { path: 'content/:key', component: './Content' },
      { path: 'vip', component: './Vip' },
      {
        path: 'guide',
        component: './Guide',
        routes: [
          { path: '', component: './Guide/PageDefault' },
          { path: ':id', component: './Guide/PageDetail' },
          { path: 'edit', component: './Guide/PageEdit' },
        ],
      },
      { path: 'recruitment', component: './Recruitment' },
      { path: 'user', component: './User' },
    ],
  },
  { path: 'tools', component: './Tools' },
  {
    path: '/editor/:rId',
    component: './EditorOpt',
  },
  {
    path: '/preview/:id',
    component: './Preview',
  },
  {
    path: '/mobile/editor/:rId',
    component: './Mobile/EditorOpt',
  },
  {
    path: '/test',
    component: './Test',
  },
  { path: '/*', component: '@/pages/404' },
];
