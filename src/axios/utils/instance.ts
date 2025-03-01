import Axios, {
  AxiosInstance,
  AxiosInterceptorOptions,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export type RequestInterceptorFulfilled =
  | ((
      value: InternalAxiosRequestConfig,
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>)
  | null;

export type ResponseInterceptorFulfilled =
  | ((value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>)
  | null;

export type InterceptorRejected = (error: any) => any | null;

export type RequestInterceptorOptions = AxiosInterceptorOptions;

export class Instance {
  axiosInstance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    //初始化
    this.axiosInstance = Axios.create(config);
    this.interceptorsRequest();
    this.interceptorsRespose();
  }

  //创建实例
  createdInstance(config?: AxiosRequestConfig) {
    return Axios.create(config);
  }

  // 添加请求拦截器
  interceptorsRequest(
    onFulfilled?: RequestInterceptorFulfilled,
    onRejected?: InterceptorRejected,
    options?: RequestInterceptorOptions,
  ) {
    return this.axiosInstance.interceptors.request.use(
      onFulfilled,
      onRejected,
      options,
    );
  }

  // 添加响应拦截器
  // 2xx 范围内的状态码都会触发onFulfilled函数。
  // 超出 2xx 范围的状态码都会触发onRejected函数。
  interceptorsRespose(
    onFulfilled?: ResponseInterceptorFulfilled,
    onRejected?: InterceptorRejected,
  ) {
    return this.axiosInstance.interceptors.response.use(
      onFulfilled,
      onRejected,
    );
  }

  interceptorsRequestEject(id: number) {
    return this.axiosInstance.interceptors.request.eject(id);
  }

  interceptorsResponseEject(id: number) {
    return this.axiosInstance.interceptors.response.eject(id);
  }
}
