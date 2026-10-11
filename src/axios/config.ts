const urlParams = new URL(window.location.href)
const { host, protocol } = window.location

//开发环境下的请求地址
export const devBaseURL = 'http://localhost:3000'

//生产环境下的请求地址
export const prodBaseURL = `${protocol}//${host}${urlParams.pathname}`
