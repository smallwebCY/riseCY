import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    globalData: {
      comment: 'booming',
      desc: 'C端买家H5'
    },
    defaultAddress: {},
    userInfo:{
      avatarUrl: `${require('@/assets/avatar_default.png')}`,
      nick:'',
      province:'',
      city:'',
      mobile:'',
    },
  },
  // mutations: {
  //   increment(state) {
  //     state.count++
  //   },
  //   updateDefaultAddress(state, address) {
  //     state.defaultAddress = address
  //   },
  //   updateUserInfo(state, userInfo) {
  //     state.userInfo = Object.assign(state.userInfo,userInfo)
  //   },
  // }
})
export default store
