export type EnvConfig = {
  NODE_ENV: string;

  SERVER_PORT: string;
  SERVER_HOST: string;
  SERVER_DOMAIN: string;
  API_PREFIX: string;
  API_ENABLED_SWAGGER: string;

  MAIL_USER_EMAIL: string;
  MAIL_AUTH_CODE: string;
  MAIL_SERVER_HOST: string;
  MAIL_SERVER_PORT: string;
  MAIL_SERVER_SECURE: string;
  MAIL_FORM_NAME: string;

  MD5_SALT: string;

  JWT_SECRET: string;
  JWT_AUTH_KEY: string;
  JWT_EXPIRES_IN: string;

  DATABASE_URL: string;
  DATABASE_LOG_LEVEL: string;

  CACHE_HTTP_GLOBAL_TTL: string;
  CACHE_HTTP_GLOBAL_MAX: string;

  UPLOAD_PATH: string;
  UPLOAD_HOST: string;
  UPLOAD_MAX_SIZE: string;
  UPLOAD_QI_NIU_ACCESS_KEY: string;
  UPLOAD_QI_NIU_SECRET_KEY: string;
  UPLOAD_QI_NIU_BUCKET: string;

  LOG_PATH: string;
  LOG_MAX_SIZE: string;
  LOG_MAX_FILES: string;

  THROTTLE_SHORT_TTL: string;
  THROTTLE_SHORT_LIMIT: string;
  THROTTLE_MEDIUM_TTL: string;
  THROTTLE_MEDIUM_LIMIT: string;
  THROTTLE_LONG_TTL: string;
  THROTTLE_LONG_LIMIT: string;

  MP_APP_ID: string;
  MP_APP_SECRET: string;

  VIP_GIFT_MIN_DAY: string;
  VIP_GIFT_MAX_DAY: string;

  // AI providers
  AI_DEEPSEEK_API_KEY: string;
  AI_DEEPSEEK_BASE_URL: string;
  AI_KIMI_API_KEY: string;
  AI_KIMI_BASE_URL: string;
  AI_BAIDU_ACCESS_KEY: string;
  AI_BAIDU_SECRET_KEY: string;
  AI_XF_APP_ID: string;
  AI_XF_API_SECRET: string;
  AI_XF_API_KEY: string;

  // 支付
  PAY_MCH_ID: string;
  PAY_SIGN_KEY: string;

  // AES 简历分享加密
  AES_KEY: string;
  AES_IV: string;

  // 默认用户
  DEFAULT_USER_AVATAR: string;
  DEFAULT_USER_PASSWORD: string;

  // 反馈邮箱
  MAIL_FEEDBACK_TO: string;

  // 功能开关
  EXPORT_PDF_VIP_CHECK_ENABLED: string;
  AI_CHECK_COUNT_ENABLED: string;
  AI_TOKENS_ENABLED: string;
};
