若使用 `nest-prisma` 只需在 `app.module` 中注册即可

```ts
PrismaModule.forRootAsync({
  isGlobal: true,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const dbUrl = configService.get('DATABASE_URL');
    return {
      prismaOptions: {
        log: ['info', 'query'],
        datasourceUrl: dbUrl,
      },
      middlewares: [
        async (params, next) => {
          const before = Date.now();
          const result = await next(params);
          const after = Date.now();
          console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
          return prismaBigintSerialize(result);
        },
      ],
      explicitConnect: configService.get('DATABASE_EXPLICIT_CONNECT') === 'True',
    };
  },
}),
```