import Api from '@/api';
import { LOCALHOST_ENUMS } from '@/constants/enums';
import { getQueryByKey } from '@/utils/url-utils';
import { history } from '@umijs/max';
import { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import zhCn from 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale(zhCn);

export async function getInitialState(): Promise<Partial<API.UserBaseInfoVO> | undefined> {
  const token = getQueryByKey('token');
  if (token.length > 20) {
    localStorage.setItem(LOCALHOST_ENUMS.TOKEN, token);
  }
  if (!localStorage.getItem(LOCALHOST_ENUMS.TOKEN)) return;
  const res = await Api.User.getUserInfo({ ignoreInterceptErr: true });
  if (res.success) {
    localStorage.setItem(LOCALHOST_ENUMS.TOKEN, res.data.accessToken);
  }
  return res?.data;
}

export const request: {
  baseURL: string;
  responseInterceptors: ((response: any) => any)[];
  requestInterceptors: ((config: AxiosRequestConfig) => AxiosRequestConfig<any>)[];
  timeout: number;
  errorConfig: { errorThrower(): void; errorHandler(): void };
} = {
  timeout: 20000,
  baseURL: '',
  errorConfig: {
    errorHandler() {
      console.log();
    },
    errorThrower() {},
  },
  requestInterceptors: [
    (config: AxiosRequestConfig) => {
      const headers = config.headers || {};
      const jwtToken = localStorage.getItem(LOCALHOST_ENUMS.TOKEN);
      if (jwtToken) {
        headers[LOCALHOST_ENUMS.TOKEN] = jwtToken;
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      const { config, data } = response;
      const hasError = !data?.success;
      const noBlob = config.responseType !== 'blob';
      const noFilter = !config.ignoreInterceptErr;

      if (data.code === 401) {
        localStorage.removeItem(LOCALHOST_ENUMS.TOKEN);
        if (location.pathname !== '/') {
          history.push('/');
        }
        return response;
      }

      if (hasError && noFilter && noBlob) {
        console.log(response.data?.message);
      }

      return response;
    },
  ],
};
