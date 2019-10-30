/**
 * 对接user相关的API操作
 *
 *
 *
 */
import request from '@/common/request'

// 用户登录
export const user_login = (data) =>{
    return request.post('/user/login', data)
}

//用户退出登录
export const user_logout = (data) =>{
    return request.post('/user/logout', data)
}

// 用户注册
export const user_register = (data) =>{
    return request.post('/user/login', data)
}

// 忘记密码
export const user_forgot_pwd = (data) =>{
    return request.post('/user/change_pwd', data)
}
//获取用户信息
export const user_get_info = (data) =>{
    return request.get('/user/get_user', data)
}

// 修改密码
export const user_update_pwd = (data) =>{
    return request.post('/user/change_pwd', data)
}

// 发送短信
export const user_sms = (data) =>{
    return request.post('/message/send_vcode', data)
}

// 发送图像验证码
export const user_captcha = (data) => {
    return request.get('/message/get_captcha', data)
}

// 修改用户名
export const user_update_name = (data) => {
    return request.post('/shop/goods/pingtuan/list/v2', data)
}

// 获取地区
export const user_get_area = (data) => {
    return request.get('/address/get_area', data)
}
// 用户收藏列表
export const user_get_favorite = (data) => {
    return request.get('/user/favorite_list', data)
}

//获取收货地址列表
export const user_get_address_list = (data) => {
    return request.get('/address/get_user_address', data)
}
//修改或删除
export const user_update_delete_address = (data) => {
    return request.post('/address/update_user_address', data)
}

//增加
export const user_add_address = (data) => {
    return request.post('/address/add_user_address', data)
}
