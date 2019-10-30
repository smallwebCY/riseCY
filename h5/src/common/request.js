import Axios from 'axios'
//import i18n from '@/i18n'
import Qs from 'qs'
import router from '@/router'
import {storage} from '@/common/util'
// import { Dialog } from 'vant';

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.push({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}
    })
}


// 默认请求地址
Axios.defaults.baseURL = process.env.VUE_APP_BASE_API // url = base url + request url
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
Axios.defaults.timeout = 10000
// 请求(http request)拦截器 提前处理
Axios.interceptors.request.use(
    req => {
        // 处理文件
        if (req.headers['Content-Type']=='multipart/form-data') {
            return req;
        }
        const sid = storage.get('sid');
        const shop_url = storage.get('shopUrl');
		const cid = storage.get('cid');
        /*const headersCommon = req.headers.common;
         req.headers.common = {
             'Accept-Language': i18n.locale,
             'X-ENCRIPTION': 0,
             ...headersCommon
         }*/


        if (req.method === 'post') {
            let data = Qs.parse(req.data)
            req.data = Qs.stringify({
                sid: sid,
				cid: cid,
                shop_url: shop_url,
                add_product: 'microshop',
                add_channel: 'microsite',
                market_channel: 'self',
                product_version: '2.0.0',
                ...data
            })
        } else if (req.method === 'get') {
            req.params = {
                sid: sid,
				cid: cid,
                shop_url: shop_url,
                add_product: 'microshop',
                add_channel: 'microsite',
                market_channel: 'self',
                product_version: '2.0.0',
                ...req.params
            }
        }
        return req;
    })
// 响应(http response)拦截器 处理异常
Axios.interceptors.response.use(
    res => {
        const needNotLoginUrls = ['/', '/home', '/cart','/forgot', '/goods-detail', '/login','/search'];
        if (needNotLoginUrls.indexOf(router.currentRoute.path) != -1) {
            if (router.currentRoute.path === '/goods-detail') {
                if (res.request.responseURL==='') {
                   return res
                }
                let favurl = res.request.responseURL;
                favurl = favurl.slice(favurl.lastIndexOf("/"))
                if (favurl === '/favorite_create') {
                    let fav = res.config.data.slice(res.config.data.lastIndexOf("&")+1).split("=")
                    if (fav[0]==='flag' && fav[1]==='0'){
                        return res;
                    }
                }else {
                    return res
                }
            }else {
                return res;
            }
        }
        if (res.status == 200) {
            if (res.data.error === 'E00060001') {
                // 全局错误码[2000]：当前登录token无效，请重新登录
                toLogin()
            }
            return res
        }
    },
    error => {
        console.log(JSON.stringify(error))
        const {response} = error
        if (response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            // console.warn(`web request ${response.config.url}，status： ${response.status}，statusText： ${response.statusText}`)
            return Promise.reject(response)
        } else {
            // 网络超时,断网,请求不存在等
            //this.$toast(this.$t('user.login_037'))
            alert("Ngoại lệ mạng lưới")
            return Promise.reject(error)
        }
    }
)

const request = {
    get(url, data = {}, config = {}) {
        //console.log("request text:", JSON.stringify(data));
        return new Promise((resolve, reject) => {
            Axios.get(url, {params: data, ...config})
                .then(res => {
                       resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    post(url, data = {}, config = {}) {
        //console.log("request text:", JSON.stringify(data));
        return new Promise((resolve, reject) => {
            Axios.post(url, Qs.stringify(data), config)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    uploadFile(url, data = {}) {
        return new Promise((resolve, reject) => {
            Axios.post(url, data, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

export default request
