
import { post ,get} from '../axios/request'

export const callback = (params) => get('/api/monitor/callback.htm', params)

export const logout = (params) => get('/api/loginpage/logout', params)
// login 页面
export const authorization = () => get('/api/authorization')

// export function getInfo() {
//   return post({
//     url: 'findUserInfo',
//     method: 'post'
//   })
// }
