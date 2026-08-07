const { generateService } = require('@umijs/openapi');

generateService({
  projectName: '',
  schemaPath: 'http://127.0.0.1:8088/swagger-api-json',
  serversPath: './src/api',
  apiPrefix: '',
  isCamelCase: false,
  requestImportStatement: 'import {request} from "@umijs/max";',
  dataFields: ['code', 'data', 'message', 'success'],
}).then();
