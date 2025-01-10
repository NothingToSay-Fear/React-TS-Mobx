import { action } from "mobx"
import { store } from "./store"

/** 改变 token */
const handleToken = (token: string) => {
  store.set('token', token)
}

const changeToken = action('改变token', handleToken)


export {
  changeToken
}