import { Message } from 'element-ui'
import axios, { AxiosPromise } from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store'

const request = axios.create({})

const redirectToLogin = () => {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

const refreshToken = () => {
  return axios.create({})({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    console.log('请求发送=>', config)
    // 统一设置请求头，设置token
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

// 响应拦截器
/*
  可在这里处理token过期刷新
  一般有两种解决方法
  1. 在发送请求时通过expire_in等字段判断token是否已经失效，如果失效就先发请求刷新，再发送正常请求
  2. 在接收请求时判断返回的状态，如果是401错误就发送请求刷新，再发送一次上次的请求

  方法1的弊端在于如果本地时间和服务器端不同步，判断就可能无效，所以我们这里使用方法2
*/

let isRefreshing = false // 控制token刷新的状态
let requests: any[] = [] // 存储刷新token期间过来的其他401请求，等待之后重发

request.interceptors.response.use(
  function (response) {
    // 状态码为2xx的成功响应执行这里
    console.log('响应成功=>', response)
    return response
  },
  async function (error) {
    // 其他状态码则进入这里
    if (error.response) {
      // 收到响应，但状态码不是2xx
      const { status } = error.response
      if (status === 400) {
        Message.error('请求参数错误')
      } else if (status === 401) {
        // token无效（没有提供token，无效token，过期token）
        // 如果有refresh_token则尝试使用其获取新的token
        // 先检测当前是否登录
        if (!store.state.user) {
          redirectToLogin()
        }
        if (!isRefreshing) {
          // 防止多个请求都触发刷新
          isRefreshing = true
          // 尝试刷新token
          // 注意不能使用request，一旦刷新请求也失败了就会无限循环请求
          // 创建一个新的axios对象来发起请求
          //! 注意refresh_token只能使用一次
          return refreshToken()
            .then((res) => {
              if (!res.data.success) {
                throw new Error('Token刷新失败')
              }
              // 刷新token成功
              // 1. 保存新的用户数据
              store.commit('setUser', res.data.content)
              // 2. 重新发送挂起的其他401请求，这些请求被存在requests数组里
              requests.forEach((cb) => cb())
              // 3. 重置requests数组
              requests = []
              // 4. 重发当前的401请求并且返回
              return request(error.config)
            })
            .catch((err) => {
              // 刷新失败 -> 跳转到登录页让用户重新登录获取新的token
              // 清除用户数据
              console.log(err)
              store.commit('setUser', null)
              redirectToLogin()
            })
            .finally(() => {
              isRefreshing = false // 重置刷新状态
            })
        }
        // 如果当前正在刷新，把其他的请求挂起
        return new Promise((resolve) => {
          requests.push(() => {
            resolve(request(error.config))
          })
        })
      } else if (status === 403) {
        Message.error('没有权限，请联系管理员')
      } else if (status === 404) {
        Message.error('请求资源不存在')
      } else {
        Message.error('服务端错误，请联系管理员')
      }
    } else if (error.request) {
      // 请求发出，但没有收到响应
      Message.error('请求超时，请刷新重试')
    } else {
      // 准备请求时发生错误
      Message.error(`请求失败: ${error.message}`)
    }

    return Promise.reject(error)
  }
)

export default request
