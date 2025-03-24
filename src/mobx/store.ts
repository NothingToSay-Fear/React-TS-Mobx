import { observable, ObservableMap } from 'mobx'
import { createContext } from 'react'

export interface Store {
  token: string
}

//mobx声明Store
export const store: ObservableMap<String, any> = observable.map({
  token: '123'
} as Store)

// 使用 Context 共享 store
export const MobxContext = createContext<ObservableMap<String, any>>(store)
