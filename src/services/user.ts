import request from '@/utils/request'
import qs from 'qs'

interface LoginData {
  phone: string;
  password: string;
}

export const login = (data: LoginData) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果data是普通对象，则content-type会默认为application/json
    // 如果data是qs.stringify()转换后的key-value键值对，则为application/x-www-form-urlencoded
    // 如果data是FormData对象，则为multipart/form-data
    data: qs.stringify(data)
  })
}
