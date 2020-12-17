import axios from 'axios'

//创建axios实例，在这里可以设置请求的默认配置
const instance = axios.create({
  timeout: 100000,
  //baseURL: '/api', //根据自己配置的反向代理去设置不同环境的baeUrl
  withCredentials: true,
})
// 统一设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({ method: 'get', url, params, ...config })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      ...config,
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
