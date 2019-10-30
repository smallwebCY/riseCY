<template>
  <div class="contaienr">
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      :switchable="isChoose"
      :add-button-text="$t('address_list.address_list_002')"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelect"
    >
    <div class="no-data" slot="top" v-if="!list.length">
      <div class="none-addr" >
        <div class="none-addr-inner">
          <img :src="noneAddr" alt="">
          <p>{{address_list_001}}</p>
        </div>
      </div>
      <!-- {{noTips}} -->
    </div>
    </van-address-list>
  </div>
</template>

<script>
import { AddressList } from 'vant'
import { storage } from '@/common/util'
import { mapMutations } from 'vuex'
var noneAddr = require('@/assets/no-addr.png');
let flag;
export default {
  components: {
    [AddressList.name]: AddressList,
  },
  data() {
    return {
      chosenAddressId: '',
      list: [],
      noTips:this.$t('address_list.address_list_001'),
      isChoose:false,
      noneAddr:noneAddr,
      address_list_001: this.$t('address_list.address_list_001'),
    }
  },
  created() {
    //this.isChoose = this.$route.query.isChoose ? this.$route.query.isChoose : false
    flag=false
    this.$request.get('/address/get_user_address').then(res=>{
        if(res.status == 0 && res.error == 'E00060001') {
            this.$router.push({path:'/login', query:{redirect:"/order-detail"}});
        }
      const list = res.data || []
      list.forEach(item => {
          // item.id= item.id
          item.tel= item.mobile
          // item.address = item.address
      })
      this.list = list
      if (list.length === 0){
        this.updateDefaultAddress({})
      }
    })
    //
    if (this.$route.query.redirect) {
      storage.remove("order_redirect")// 先移除原来的
      storage.set("order_redirect", this.$route.query.redirect)
      this.isChoose = true
    }
    if (storage.get("order_redirect")) {
      this.isChoose = true
    }
  },
  methods: {
    ...mapMutations(['updateDefaultAddress']),
    onAdd() {
      this.$router.push({path:'address-edit'})
    },
    onEdit(item ) {
      this.$router.push({path:'address-edit',query:{id:item.id}})
    },
    onSelect(item) {
      if(!this.isChoose)return;
      // ?会触发2次方法
      if(!flag){
        flag=true;
        // this.$bus.$emit('defaultAddress',item)
        let defaultAddress = {};
        defaultAddress.linkMan = item.name;
        defaultAddress.mobile = item.tel;
        defaultAddress.addressId = item.id;
        defaultAddress.address = item.address;
        this.updateDefaultAddress(defaultAddress);
        // 处理返回原页面
        let order_redirect = storage.get("order_redirect")
        storage.remove("order_redirect")
        if (order_redirect){
          this.$router.push(order_redirect)
        } else {

          this.$router.back(-1);
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .no-data{
    font-size: 16px;
    color:#999;
    text-align: center;
    // padding-top: 150px;
  }
  .none-addr-inner{
  margin-top: 140px;
  img{
    width: 200px;
    display: block;
    margin: 0 auto;
    background: transparent!important;
  }
  p{
    text-align: center;
    font-size: 14px;
    color: #979A9F;
    letter-spacing: 0;
  }
}
</style>


