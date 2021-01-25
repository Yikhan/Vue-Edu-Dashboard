import axios from 'axios'
import store from '@/store'

const request = axios.create({})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    console.log('请求发送', config)
    // 统一设置请求头
    const { user } = store.state
    if (user) {
      config.headers.Authorization = user.access_token
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

export default request
