import { AxiosRequestConfig } from 'axios'
import { CustomConfigType, NewRequest, customConfigDefault } from '../request'

// 记录重连的次数
const connectMap = new Map<string, number>()

export const handleConnect = <T>(
  instance: NewRequest,
  config: AxiosRequestConfig,
  _customConfig: CustomConfigType,
  requestKey: string,
  isDelete: boolean = false
) => {
  const { connectCount = customConfigDefault.connectCount || 0 } = _customConfig

  if (isDelete) {
    connectMap.delete(requestKey)
    return
  }

  // 处理重连
  if (!connectMap.has(requestKey)) {
    connectMap.set(requestKey, 1)
  }

  let _connectCount = connectMap.get(requestKey) || 0

  if (_connectCount <= connectCount) {
    _connectCount += 1
    connectMap.set(requestKey, _connectCount)
    return instance.request<T>(config, _customConfig)
  }
  connectMap.delete(requestKey)
}
