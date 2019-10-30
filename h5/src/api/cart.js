import request from '@/common/request'

// 用户登录
export const cart_add = (data) =>{
    return request.post('cart/add_to_cart', data)
}
