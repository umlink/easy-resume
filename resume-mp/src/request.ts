import Taro from "@tarojs/taro";

export const baseUrl = process.env.TARO_APP_BASE_URL || "https://api.example.com/resume-api";

//网络请求拦截器
const interceptor = function (chain) {
  const requestParams = chain.requestParams;
  let token = Taro.getStorageSync("TOKEN"); //拿到本地缓存中存的token
  requestParams.header = {
    ...requestParams.header,
    authorization: token,
  };
  return chain.proceed(requestParams).then((res) => {
    return res;
  });
};

Taro.addInterceptor(interceptor);

type RequestOptions = {
  url: string;
  method?: "GET" | "POST";
  data?: any;
  params?: any;
  headers?: any;
};

type ResponseDto<T> = {
  code: number;
  data: T;
  success: boolean;
  message: string;
};

const request = async <T>({
  url,
  method = "GET",
  data,
  params,
  headers = {},
}: RequestOptions): Promise<ResponseDto<T>> => {
  const authorization = Taro.getStorageSync('TOKEN')
  const option: Taro.request.Option = {
    method,
    url: baseUrl + url,
    data: data || params || {},
    header: {
      "content-type": "application/json",
      ...headers,
      authorization
    },
    success: (res) => res,
  };
  const res = await Taro.request(option);
  return res.data;
};

export default request;
