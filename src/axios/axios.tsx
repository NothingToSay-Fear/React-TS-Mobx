
import Axios, { AxiosError, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { observer } from 'mobx-react'
import { ChildrenProps } from '../common/commonType'
import { useCallback, useEffect } from 'react'
import useMobxStore from '../mobx/useMobxStore'


export const axios = Axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 30000
})


export const AxiosInject: React.FC<ChildrenProps> = observer(({ children }) => {

  const token = useMobxStore('token')

  //请求拦截器
  const requestInterceptor = useCallback((request: InternalAxiosRequestConfig) => {

    if (!token) {
      // 没有token时，尝试调取接口或，从浏览器stroage中获取token
      // 这里模拟一个新token
      const loginToken = Math.random() + ''
      request.headers = {
        'Content-Type': 'application/json',
        Authorization: `X-Token=${loginToken}`,
        ...request.headers
      } as AxiosRequestHeaders

      return request
    }

    request.headers = {
      'Content-Type': 'application/json',
      Authorization: `X-Token=${token}`,
      ...request.headers
    } as AxiosRequestHeaders

    return request;
  }, [token])

  //响应拦截器
  const responseInterceptor = useCallback((response: AxiosResponse) => {
    //状态码为2xx时会执行该回调
    //这里做一些响应拦截处理,具体操作根据实际的响应数据结构来定
    console.log('response', response)
    return response
  }, [])

  //响应失败拦截器
  const responseInterceptorReject = useCallback((error: AxiosError) => {
    //1.状态码为非2xx时会执行该回调
    //2.请求超时会执行该回调
    //3.网络错误会执行该回调
    //4.取消请求会执行该回调
    //这里做一些失败的处理
    console.log('error', error)
    return error;
  }, [])


  useEffect(() => {
    // 添加请求拦截器
    const interceptorId = axios.interceptors.request.use(requestInterceptor)
    // 拦截器优化绑定，仅绑定一个拦截器
    interceptorId > 0 && axios.interceptors.request.eject(interceptorId - 1)
  }, [requestInterceptor])


  useEffect(() => {
    // 添加请求拦截器
    const interceptorId = axios.interceptors.response.use(responseInterceptor, responseInterceptorReject)
    // 拦截器优化绑定，仅绑定一个拦截器
    interceptorId > 0 && axios.interceptors.response.eject(interceptorId - 1)
  }, [responseInterceptor])


  return (
    <>
      {children}
    </>
  )

})