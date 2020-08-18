import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 配置国际化
const booming_i18n=2; // 1:中文 2:越南文

const routes = [
    {
        path: '/',
        redirect: '/home',
        meta: {
            title: '首页',
            vn_title: 'Trang chủ',
        }
    },
    {
        name: 'home',
        path: '/home',
        component: () => import('@/pages/home/home'),
        meta: {
            title: '首页',
            vn_title: 'Trang chủ',
        }
    },
    {
        name: 'search',
        path: '/search',
        component: () => import('@/pages/search/search'),
        meta: {
            title: '搜索',
            vn_title: 'Tìm kiếm',
        }
    },
    {
        name: 'user',
        path: '/user',
        component: () => import('@/pages/user/user'),
        meta: {
            title: '会员中心',
            vn_title: 'Trung tâm thành viên',
        }
    },
    {
        name: 'cart',
        path: '/cart',
        component: () => import('@/pages/cart/cart'),
        meta: {
            title: '购物车',
            vn_title: 'Giỏ hàng',
        }
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/pages/login/login'),
        meta: {
            title: '登录/注册',
            vn_title: 'Đăng nhập/Đăng ký',
        }
    },
    {
        name: 'forgot',
        path: '/forgot',
        component: () => import('@/pages/user/forgot'),
        meta: {
            title: '忘记密码',
            vn_title: 'Quên mật mã',
        }
    },
    {
        name: 'setPassword',
        path: '/setPassword',
        component: () => import('@/pages/user/revisePassword'),
        meta: {
            title: '修改密码',
            vn_title: 'Thay đổi mật khẩu',
        }
    },
    {
        name: 'setNickname',
        path: '/setNickname',
        component: () => import('@/pages/user/fixUserName'),
        meta: {
            title: '修改昵称',
            vn_title: '',
        }
    },
    {
        name: 'setArea',
        path: '/setArea',
        component: () => import('@/pages/user/setarea'),
        meta: {
            title: '配送地区',
            vn_title: 'Khu vực giao hàng',
        }
    },
    {
        name: 'goods-detail',
        path: '/goods-detail',
        component: () => import('@/pages/goods-detail/goods-detail'),
        meta: {
            title: '商品详情',
            vn_title: 'Chi tiết sản phẩm',
        }
    },
    {
        name: 'goods-reputation',
        path: '/goods-reputation',
        component: () => import('@/pages/goods-reputation/goods-reputation'),
        meta: {
            title: '全部评价'
        }
    },
    {
        name: 'order-submit',
        path: '/order-submit',
        component: () => import('@/pages/order-submit/order-submit'),
        meta: {
            title: '提交订单',
            vn_title: 'Đặt hàng',
        }
    },
    {
        name: 'order-return',
        path: '/order-return',
        component: () => import('@/pages/order-return/order-return'),
        meta: {
            title: '订单已提交',
            vn_title: 'Đơn đặt hàng đã gửi',
        }
    },
    {
        name: 'order-list',
        path: '/order-list',
        component: () => import('@/pages/order-list/order-list'),
        meta: {
            title: '订单列表',
            vn_title: 'Danh sách đặt hàng',
        }
    },
    {
        name: 'order-detail',
        path: '/order-detail',
        component: () => import('@/pages/order-detail/order-detail'),
        meta: {
            title: '订单详情',
            vn_title: 'Tình hình đơn hàng',
        }
    },
    {
        name: 'address-list',
        path: '/address-list',
        component: () => import('@/pages/address-list/address-list'),
        meta: {
            title: '管理收货地址',
            vn_title: 'Quản lý địa chỉ giao hàng',
        }
    },
    {
        name: 'address-edit',
        path: '/address-edit',
        component: () => import('@/pages/address-edit/address-edit'),
        meta: {
            title: '编辑收货地址',
            vn_title: 'Chỉnh sửa địa chỉ nhận hàng',
        }
    },
    {
        name: 'coupons',
        path: '/coupons',
        component: () => import('@/pages/user/coupons'),
        meta: {
            title: '我的优惠券'
        }
    },
    {
        name: 'setting',
        path: '/setting',
        component: () => import('@/pages/user/setting'),
        meta: {
            title: '我的资料',
            vn_title:'Thông tin của tôi'
        }
    },
    {
        name: 'favgoods',
        path: '/favgoods',
        component: () => import('@/pages/user/favgoods'),
        meta: {
            title: '我的收藏',
            vn_title: 'Sưu tầm của tôi',
        }
    },
    {
        name: 'cashlog',
        path: '/cashlog',
        component: () => import('@/pages/user/cashlog'),
        meta: {
            title: '资金明细'
        }
    },
    {
        name: 'refund',
        path: '/refund',
        component: () => import('@/pages/refund/refund'),
        meta: {
            title: '退款/售后'
        }
    },
    {
        name: 'refund-apply',
        path: '/refund-apply',
        component: () => import('@/pages/refund/refund-apply'),
        meta: {
            title: '申请售后'
        }
    },
    {
        name: 'pintuan',
        path: '/pintuan/pintuan',
        component: () => import('@/pages/pintuan/pintuan'),
        meta: {
            title: '拼团详情'
        }
    },
    {
        name: 'pintuan-rule',
        path: '/pintuan/rule',
        component: () => import('@/pages/pintuan/rule'),
        meta: {
            title: '多人拼团玩法'
        }
    },
    {
        name: 'pintuan-joiner',
        path: '/pintuan/joiner',
        component: () => import('@/pages/pintuan/joiner'),
        meta: {
            title: '团员情况'
        }
    },
    {
        name: 'kanjia',
        path: '/kanjia/kanjia',
        component: () => import('@/pages/kanjia/kanjia'),
        meta: {
            title: '砍价购'
        },
    },
    {
        name: 'kanjia-rule',
        path: '/kanjia/rule',
        component: () => import('@/pages/kanjia/rule'),
        meta: {
            title: '玩法详情'
        },
    },
    {
        name: 'test',
        path: '/test',
        component: () => import('@/pages/test/index'),
        meta: {
            title: '测试'
        },
    },
    {
        name: '404',
        path: '/404',
        component: () => import('@/pages/error-page/404'),
        meta: {
            title: '404'
        }
    },
    {path: '*', redirect: '/404', hidden: true}
]


const router = new Router({
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
})

// add route title
router.beforeEach((to, from, next) => {
    // console.log("to:", to);
    console.log(router.currentRoute.path)
    //debugger
    if (to.meta.title) {
        document.title = booming_i18n == 1?to.meta.title:to.meta.vn_title
    }
    const needNotLoginUrls = ['/', '/home', '/cart','/forgot', '/goods-detail','/search'];
    if(needNotLoginUrls.indexOf(to.path) != -1) {
        next();
        return;
    }

    if (localStorage.getItem('sid')) { //判断本地是否存在sid
        next();
    } else {
        console.log("hhh")
        if (to.path === '/login') {
            next();
        } else {
            /*next({
                path: '/login'
            })*/
            // 可以跳回去
            router.push({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath}
            })
        }
    }

    /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
    if (to.fullPath == "/login") {
        if (localStorage.getItem('sid')) {
            next({
                path: from.fullPath
            });
        } else {
            next();
        }
    }
    next()
})


export default router
