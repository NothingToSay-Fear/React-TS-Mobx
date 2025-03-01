import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Instance } from "./utils/instance";
import { handleLoading } from "./utils/loading";
import { handleError } from "./utils/error";
import { createError } from "./utils/createError";
import { handleRepeat } from "./utils/repeat";
import { handleConnect } from "./utils/connect";
import { handleToken } from "./utils/token";
import { startsWith, transfromPath } from "./utils/path";
import { message } from "antd";

//1.全局loading
//2.重复请求处理(1.请求前取消请求,2.多次请求取最后一次请求防抖)

const loadingKeyArr: string[] = [];

export interface CustomConfigType {
  // 是否需要 token 默认值 false
  isNeedToken?: boolean;
  // token 处理函数 默认值 undefined
  setToken?: (config: AxiosRequestConfig) => void;
  // 重新刷新 token 函数 默认值 undefined
  refreshToken?: () => Promise<any>;
  // 没有权限的状态码 默认值 401
  notPermissionCode?: number;

  // 是否需要 loading 默认值 false
  isNeedLoading?: boolean;
  // loading 出现的延迟时间 默认值 300ms
  delayLoading?: number;
  // 自定义 loading
  showLoadingFn?: (isShow: boolean) => void;

  // 是否需要统一处理 error 默认值 true
  isNeedError?: boolean;
  // error 的显示方式 默认值 undefined
  showErrorFn?: (error: AxiosError) => void;
  // 是否需要重新请求(请求失败时) 默认值 true
  isNeedReRequest?: boolean;
  // 重新请求次数 默认值 3
  connectCount?: number;
}

//默认配置
export const customConfigDefault: CustomConfigType = {
  isNeedToken: false,
  notPermissionCode: 401,

  isNeedLoading: true,
  delayLoading: 0,

  isNeedError: true,
  isNeedReRequest: true,
  connectCount: 3,
};

const IDENTIFIER = "/";

export class NewRequest {
  instance: Instance;
  customConfigDefault = customConfigDefault;
  config: AxiosRequestConfig = Object.create(null);

  constructor(config: AxiosRequestConfig, customConfig: CustomConfigType) {
    //保存初始化实例axios配置
    this.config = config;
    // 初始化 axios 实例
    this.instance = new Instance(config);
    // 合并自定义配置
    this.customConfigDefault = { ...this.customConfigDefault, ...customConfig };
  }

  async request<T>(
    config?: AxiosRequestConfig,
    customConfig?: CustomConfigType,
  ): Promise<AxiosResponse<T>> {
    const _config = config ? { ...this.config, ...config } : this.config;

    const _customConfig = {
      ...this.customConfigDefault,
      ...customConfig,
    };
    const baseUrl = this.instance.axiosInstance.defaults.baseURL ?? "";
    // 格式化 url
    _config.url &&
      (_config.url = transfromPath(_config.url, IDENTIFIER, startsWith));
    const requestKey = `${window.location.href}_${baseUrl + _config.url}_${
      _config.method
    }`;

    // 网络检查
    if (!window.navigator.onLine) {
      return Promise.reject(createError("网络不可用", _config));
    }

    const request = async (): Promise<AxiosResponse<T>> => {
      let key = "key" + new Date().getTime();
      console.log("key:" + key);
      try {
        if (loadingKeyArr.length === 0) {
          console.log("新建id:" + key);
          message.loading({ content: "请求中", duration: 0, key: key });
        }
        loadingKeyArr.push(key);

        // 请求发起
        const res = await this.instance.axiosInstance.request<T>(_config);

        return res;
      } catch (error: any) {
        // 抛出错误
        return Promise.reject(error);
      } finally {
        loadingKeyArr.pop();

        if (loadingKeyArr.length === 0) {
          message.destroy();
        }
      }
    };

    return request();
  }

  private handleBeforeRequest(
    config: AxiosRequestConfig,
    customConfig: CustomConfigType,
    requestKey: string,
  ) {
    const {
      isNeedToken = false,
      isNeedLoading = false,
      delayLoading,
      setToken,
      showLoadingFn,
    } = customConfig;

    // 处理 token
    isNeedToken && setToken && handleToken(config, setToken);
    // 处理 Loading
    isNeedLoading &&
      delayLoading &&
      delayLoading > 0 &&
      handleLoading(true, requestKey, delayLoading, showLoadingFn);
  }

  private handleAfterRequest(
    customConfig: CustomConfigType,
    requestKey: string,
  ) {
    const { isNeedLoading = false, showLoadingFn, delayLoading } = customConfig;

    // 处理重复请求
    handleRepeat(requestKey, false);

    // 处理 Loading
    isNeedLoading &&
      delayLoading &&
      delayLoading > 0 &&
      handleLoading(false, requestKey, delayLoading, showLoadingFn);
  }

  private handleError(customConfig: CustomConfigType, error: AxiosError) {
    const { isNeedError = false, showErrorFn } = customConfig;

    // 处理错误
    if (isNeedError) handleError(error, showErrorFn);
  }

  async get<T>(
    config: AxiosRequestConfig = Object.create(null),
    customConfig: CustomConfigType = Object.create(null),
  ) {
    const _config = config ? { ...this.config, ...config } : this.config;
    return this.request<T>({ ..._config, method: "get" }, customConfig);
  }

  async post<T>(
    config: AxiosRequestConfig = Object.create(null),
    customConfig: CustomConfigType = Object.create(null),
  ) {
    const _config = config ? { ...this.config, ...config } : this.config;
    return this.request<T>({ ..._config, method: "post" }, customConfig);
  }

  async delete<T>(
    config: AxiosRequestConfig = Object.create(null),
    customConfig: CustomConfigType = Object.create(null),
  ) {
    const _config = config ? { ...this.config, ...config } : this.config;
    return this.request<T>({ ..._config, method: "delete" }, customConfig);
  }

  async put<T>(
    config: AxiosRequestConfig = Object.create(null),
    customConfig: CustomConfigType = Object.create(null),
  ) {
    const _config = config ? { ...this.config, ...config } : this.config;
    return this.request<T>({ ..._config, method: "put" }, customConfig);
  }
}
