import Axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { observer } from "mobx-react";
import { ChildrenProps } from "../common/commonType";
import { useCallback, useEffect } from "react";
import useMobxStore from "../mobx/useMobxStore";
import { devBaseURL, prodBaseURL } from "./config";
import { CustomConfigType, NewRequest } from "./request";

export const axios = Axios.create({
  baseURL: process.env.NODE_ENV === "production" ? prodBaseURL : devBaseURL,
  timeout: 30000,
});

const axiosConfig: AxiosRequestConfig = {
  baseURL: process.env.NODE_ENV === "production" ? prodBaseURL : devBaseURL,
  timeout: 30000,
};

const customConfig: CustomConfigType = {};

export const newRequest = new NewRequest(axiosConfig, customConfig);

//这里做一些初始化的
export const AxiosInject: React.FC<ChildrenProps> = observer(({ children }) => {
  const token = useMobxStore("token");

  //请求拦截器
  const requestInterceptor = useCallback(
    (request: InternalAxiosRequestConfig) => {
      if (!token) {
        // 没有token时，尝试调取接口或，从浏览器stroage中获取token
        // 这里模拟一个新token
        const loginToken = Math.random() + "";
        request.headers = {
          "Content-Type": "application/json",
          Authorization: `X-Token=${loginToken}`,
          ...request.headers,
        } as AxiosRequestHeaders;

        return request;
      }

      request.headers = {
        "Content-Type": "application/json",
        Authorization: `X-Token=${token}`,
        ...request.headers,
      } as AxiosRequestHeaders;

      return request;
    },
    [token],
  );

  //响应拦截器
  const responseInterceptor = useCallback((response: AxiosResponse) => {
    //状态码为2xx时会执行该回调
    //这里做一些响应拦截处理,具体操作根据实际的响应数据结构来定
    console.log("response", response);
    return response;
  }, []);

  //响应失败拦截器
  const responseInterceptorReject = useCallback((error: AxiosError) => {
    //1.状态码为非2xx时会执行该回调
    //2.请求超时会执行该回调
    //3.网络错误会执行该回调
    //4.取消请求会执行该回调
    //这里做一些失败的处理
    console.log("error", error);
    return error;
  }, []);

  useEffect(() => {
    // 添加请求拦截器
    const interceptorId =
      newRequest.instance.interceptorsRequest(requestInterceptor);
    // 拦截器优化绑定，仅绑定一个拦截器
    interceptorId > 0 &&
      newRequest.instance.interceptorsRequestEject(interceptorId - 1);
  }, [requestInterceptor]);

  useEffect(() => {
    // 添加请求拦截器
    const interceptorId = newRequest.instance.interceptorsRespose(
      responseInterceptor,
      responseInterceptorReject,
    );
    // 拦截器优化绑定，仅绑定一个拦截器
    interceptorId > 0 &&
      newRequest.instance.interceptorsResponseEject(interceptorId - 1);
  }, [responseInterceptor]);

  return <>{children}</>;
});
