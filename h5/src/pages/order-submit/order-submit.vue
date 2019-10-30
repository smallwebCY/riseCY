<template>
  <div class="container pd100">
    <div v-if= addChannelBar class="submit-order-back-arrow">
      <van-icon :name="backArrow" size="" @click="back"/>
      <p class="order-submit-text">{{order_submit_0001}}</p>
    </div>
    <template v-if="isNeedLogistics">
      <div class="address-box address-box-sly-updt mb10" v-if="defaultAddress.linkMan" @click="onAddressChoose">
        <div class="address-box-hd">
          <div class="address-box-inner">
            <div class="address-box-inner-title">{{order_submit_0002}}：{{defaultAddress.linkMan}}</div>
            <div class="address-box-inner-title">{{defaultAddress.mobile}}</div>
          </div>
          <div class="address-box-inner">
            <van-icon :name="addAddressIcon" class="address-box-inner-icon"/>
            <div class="address-box-inner-bottom">{{defaultAddress.address}}</div>
          </div>
        </div>
        <div class="address-box-bd"><van-icon name="arrow" color="#979A9F" size="16" /></div>
      </div>
      <div class="address-card-wrap" v-else>
        <van-cell class="address-card mb10" :title="order_submit_0003" :icon="addAddressIcon" is-link @click="onAddressChoose">
          <van-icon
          slot="right-icon"
          :name="toSelectAddress"
          style="line-height: inherit;"
        />
        </van-cell>

      </div>
    </template>
    <div class="order-info order-info-sle-updt">
      <div class="order-info-status">
        <van-cell-group>
        <!-- <van-card
    :num="buyInfo.selectedNum"
    :price="price"
    :desc="buyInfo.basicInfo.characteristic"
    :title="buyInfo.basicInfo.name"
    :thumb="buyInfo.basicInfo.pic"
  /> -->
          <van-card
            v-for="(item,index) in goodsInfo"
            :key="index"
            :num="item.quantity"
            :desc="item.value"
            :price="(item.price/100) | NumFormat"
            :title="item.title"
            :thumb="item.icon"
            :currency="item.currency"
          >
          </van-card>
        </van-cell-group>

        <van-cell-group class="leaveMessage">
          <van-cell :title="order_submit_0005"/>
          <van-field
            class="mb10"
            v-model="remark"
            type="textarea"
            :placeholder="order_submit_0006"
            rows="1"
            autosize
          />
        </van-cell-group>
      </div>
      <van-cell-group class="mb20 order-pay-status">
        <van-cell :title="order_submit_0007" :value="order_submit_0008"></van-cell>
        <van-cell :title="order_submit_0009" :value="totalPrice"/>
      </van-cell-group>
    </div>
    <!--<van-submit-bar
      button-text="确认订单"
      @submit="onSubmit">
  </van-submit-bar>-->
    <button class="submit-button-text" @click="onSubmit">{{order_submit_0001}}</button>

  </div>
</template>

<script>

import { Card,Field ,CouponCell, CouponList, SubmitBar, Switch } from 'vant'
import { storage, sessionStorage } from '@/common/util'
import { mapState, mapMutations } from 'vuex'
var addAddressIcon = require('../../assets/add-address-icon.png');
var toSelectAddress =  require('../../assets/select-address.png');
var backArrow =  require('../../assets/back-arrow.png');
export default {
  components: {
    [Card.name]: Card,
    [Field.name]: Field,
    [CouponCell.name]: CouponCell,
    [CouponList.name]: CouponList,
    [SubmitBar.name]: SubmitBar,
    [Switch.name]: Switch,
  },
  data() {
    return {
      remark:'',
      chosenCoupon: -1,
      coupons: [],
      disabledCoupons: [],
      showList:false,
      isNeedLogistics:true, // 是否需要物流信息
      hasDiscount:false,
      goodsInfo:[],
      isBalancePay:true, //  钱包支付
      balance:0,
      expireMinutes:60,
      marketing:{},
      currentUser: null,
      currency:"",
      order_submit_0001:this.$t("order_submit.order_submit_0001"),
      order_submit_0002:this.$t("order_submit.order_submit_0002"),
      order_submit_0003:this.$t("order_submit.order_submit_0003"),
      order_submit_0004:this.$t("order_submit.order_submit_0004"),
      order_submit_0005:this.$t("order_submit.order_submit_0005"),
      order_submit_0006:this.$t("order_submit.order_submit_0006"),
      order_submit_0007:this.$t("order_submit.order_submit_0007"),
      order_submit_0008:this.$t("order_submit.order_submit_0008"),
      order_submit_0009:this.$t("order_submit.order_submit_0009"),
      addAddressIcon:addAddressIcon,
      addChannelBar:true,
      toSelectAddress:toSelectAddress,
      backArrow:backArrow,
    }
  },
  computed:{
    ...mapState(['defaultAddress']),
    totalPrice(){
        let price = this.goodsInfo.reduce((total,item)=> total+item.quantity*item.price,0);
        price =  price > 0 ? (price/100) :0;
        let intPart = Number(price).toFixed(0) // 获取整数部分
        let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.') // 将整数部分逢三一断
        if(this.goodsInfo.length) {
            let item = this.goodsInfo[0];
            let currency = item.currency;
            price = currency + "  " + intPartFormat;
        } else {
            price = this.currency + "  " +  intPartFormat;
        }
        return price;
    },
  },
  filters:{
    NumFormat:function (value) {
      if (!value) return ''
      let intPart = Number(value).toFixed(0) // 获取整数部分
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.') // 将整数部分逢三一断
      return intPartFormat

    }
  },
  created() {
    var addChannel = storage.get("addChannel")
    if(addChannel==='app'){
        this.addChannelBar = false;
    }
    //debugger
    // 立即购买buy,加入购物车cart,
    if(this.$route.query.type === 'buy'){
      this.goodsInfo = sessionStorage.get('buyInfo') || []
      console.log("goodsInfo:" + JSON.stringify(this.goodsInfo));
      this.marketing = this.goodsInfo[0].marketing
    }else{
      let cartBuyInfo = storage.get('cartBuyInfo'),checkedGoods=this.$route.query.checkedGoods || [];
      cartBuyInfo = checkedGoods.length ? cartBuyInfo.filter(item => checkedGoods.indexOf(item.cart_item_id) !== -1) : cartBuyInfo;
      // 处理下金额
      cartBuyInfo.forEach((item)=>{
        //console.log(item)
        item.price=item.price*100
      });
      this.goodsInfo = cartBuyInfo;
      console.log("goodsInfo:" + JSON.stringify(this.goodsInfo));
    }
    console.log(this.defaultAddress)
    // 默认地址
    if(!this.defaultAddress.linkMan){
        this.getDefaultAddress()
    }
    this.getCurrentUser();
  },
  methods: {
    ...mapMutations(['updateDefaultAddress']),
    onAddressChoose(){
      this.$router.push({path:'/address-list',query:{redirect: this.$router.currentRoute.fullPath,isChoose:true}})
    },
    onSubmit(){
      if(!this.defaultAddress.linkMan){
        this.$toast({message:this.$t('order_submit.order_submit_0010'),duration:1000})
        return;
      }
      // 提交订单
      this.$toast.loading({
        mask: true,
        message: this.$t('order_submit.order_submit_0011'),
        duration:0,
      })
      const sku_list = this.goodsInfo.map(item=>({sku_id:item.sku_id, count:item.quantity}));
      const params = {
        address_id:this.defaultAddress.addressId,
        remark:this.remark,
        sku_list:JSON.stringify(sku_list),
        sid:storage.get("sid"),
        shop_url:storage.get("shopUrl"),
      }
      // 创建订单
      this.createOrder(params)
    },
    createOrder(params){
      console.log(params)
      if(this.currentUser == null) {
          return;
      }
      this.$request.post('/order/create',params).then(res=>{
        //console.log(res)
        let totalPrice = this.totalPrice;
        if(res.status !== "1"){
          this.$toast(res.msg)
          return;
        } else {
          this.$toast.clear();
          const orderResult = res.data;
            if(this.$route.query.type === 'buy'){
                this.goodsInfo = [];
                sessionStorage.remove('buyInfo');
            }else{
                // 处理是否数组
                let redirectArr = this.$route.query.checkedGoods
                let checkedGoods = Array.isArray(redirectArr)?redirectArr:[redirectArr] || [];
                storage.remove("cartBuyInfo");
                this.goodsInfo = [];
                let params = {};
                params.cart_item_ids = checkedGoods.join(",");
                this.$request.post('/cart/batch_delete', params);
            }
          if(orderResult.bill_no) {
              this.$router.replace({path:'/order-return',query:{bill_no:orderResult.bill_no, totalPrice:totalPrice}})
          }
        }

      });
    },
    back(){
        this.$router.go(-1);//返回上一层
    },
    getCurrentUser() {
        this.$request.get('/user/get_user').then(res => {
            if(res != null && res.status == 1) {
                this.currentUser = res.data;
            }
        })
    },
    getDefaultAddress(){
      this.$request.get('/address/get_user_address',{sid:storage.get('sid')}).then(res=>{
        if(res.data != null && res.data.length) {
            let defaultAddress = {};
            let adrArr = res.data.filter(item => item.default_flag == 1);
            if(adrArr.length) {
                defaultAddress.linkMan = adrArr[0].name;
                defaultAddress.mobile = adrArr[0].tel;
                defaultAddress.addressId = adrArr[0].id;
                defaultAddress.address = adrArr[0].address;
            } else {
                defaultAddress.linkMan = res.data[0].name;
                defaultAddress.mobile = res.data[0].tel;
                defaultAddress.addressId = res.data[0].id;
                defaultAddress.address = res.data[0].address;
            }
            this.updateDefaultAddress(defaultAddress);
        } else {
            this.updateDefaultAddress({});
        }
      })
    },
  }
}
</script>
<style>
	.address-card{
		padding: 0.2rem 12px;
	}
	.van-cell__right-icon{color: #414961;font-size:14px}
	.van-card__thumb{
		width: 80px;height:80px;
	}
	.van-card__content{min-height:80px}
	.van-card{
		padding: 20px 12px;
	}
	.van-cell__value{font-size:12px;color:#131C33;}
	.mb20 .van-cell:nth-child(2) .van-cell__value{
		font-size: 14px;color: #F13333;
	}
	.pd100 .van-card__content{
		/* -webkit-box-pack: start !important;
		-webkit-justify-content: flex-start !important;
		justify-content: flex-start !important; */
	}
</style>
<style lang="less" scoped>
  .address-box{
    position: relative;
    box-sizing: border-box;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding:16px 15px;
    margin: 0 8px;
    margin-top: 10px;
    background: #FFFFFF;
    box-shadow: 0 0 4px 0 rgba(223,223,223,0.50);
    border-radius: 2px;
    &-hd{
      flex: 1;
      // padding:0 10px;
      padding-left: 37.5px;
    }
    &-bd{
      padding-left: 5px;

    }
    &-inner{
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &-icon{
        position: absolute;
        // top:2px;
        left: -37.5px;
        font-size: 22px;
      }
      &-title{
        font-size: 16px;
        color: #333;
        font-weight: bold;
        margin-bottom: 5px;
       &:last-child{
         margin-left: 17px;
       }
      }
      &-bottom{
        font-size: 13px;
        color: #666;
        word-break: break-all;
        line-height: 18px;
      }
    }
    // 地址彩条边框
    // &:before{
    //   position: absolute;
    //   right: 0;
    //   bottom: 0;
    //   left: 0;
    //   height: 2px;
    //   background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    //   background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    //   background-size: 80px;
    //   content: '';
    // }
  }
  .address-card-wrap{
    background: #FFFFFF;
    box-shadow: 0 0 4px 0 rgba(223,223,223,0.50);
    border-radius: 2px;
    margin: 0 8px;
    margin-top: 10px;
  }
  .address-card{
    position: relative;
    padding: 16px 15px;
    align-items: center;
    display: flex;
    align-items: center;
    .van-icon{
      font-size: 16px;
    }
    // 添加地址底边彩条
    // &:before{
    //   position: absolute;
    //   right: 0;
    //   bottom: 0;
    //   left: 0;
    //   height: 2px;
    //   background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    //   background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    //   background-size: 80px;
    //   content: '';
    // }
  }
  .address-card .van-cell__left-icon{
    color: #1989fa;
    // font-size: 40px;
  }
  .order-info{
    box-sizing: border-box;
    width:100%;
    margin-top: 10px;
    .order-info-status{
      background: #FFFFFF;
      box-shadow: 0 0 4px 0 rgba(223,223,223,0.50);
      border-radius: 4px 0 4px 4px 4px;
      margin:0 8px;
      .van-card{
        background-color: #ffffff;
        .van-card__num{
          color: #979A9F;
          font-size: 14px;
          font-weight: 500;
        }
        .van-card__content{
          justify-content: flex-end;
          .van-card__title{
            position: absolute;
            top: 0;
            font-size: 13px;
            color: #414961;
          }
          .van-card__price{
            color: #F13333;
          }
        }
      }
      .van-card:not(:first-child)::after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        top: -50%;
        right: -50%;
        bottom: -50%;
        left: -50%;
        border-top: 1px solid #ebedf0;
        -webkit-transform: scale(.5);
        transform: scale(.5);
      }
      .van-card:not(:first-child){
        margin-top: 0px;
      }
    }
    .leaveMessage{
      margin-top:0.1rem;
      .van-cell:not(:last-child)::after{
        border: 0;
      }
      .van-cell{
        padding:5px 0.32rem;
      }
	  .van-cell:nth-child(2){
		  padding:0px 0.32rem 10px;
	  }
      .van-field__body{
           .van-field__control{
             font-size: 12px;
             color: #414961;
           }  
      }
    }
    .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
      border-width:0 0 1px 0;
    }
    // padding:0 15px;
    // background: #fff;
  }
  .order-pay-status{
    background: #FFFFFF;
    box-shadow: 0 0 4px 0 rgba(223,223,223,0.50);
    border-radius: 2px;
    margin:0 8px;
    .van-cell:not(:last-child)::after{
      border: 0;
    }
    .van-cell:nth-of-type(1){
      padding-bottom: 0;
    }
    .van-cell:nth-child(2){
      padding-top:3px;
    }
  }
  .submit-bar-left{
    flex: 1;
    padding-right: 12px;
    color: #323233;
    font-weight: 500;
    text-align: right;
  }
  .submit-bar-left span{
    display: inline-block;
  }
  .submit-bar-price{
    color: #F13333;
    font-size: 18px;
  }

  .submit-order-back-arrow{
    height: 0.8rem;
    // padding: 15px 0 0 16px;
    background: #FFFFFF;
    .van-icon{
      font-size: 20px;
      vertical-align: middle;
      line-height: 0.8rem;
      margin-left: 0.16rem;
    }
    .van-icon::before{
      margin-left: 16px;
      vertical-align: middle;
    }
  }

  .order-submit-text{
    display:inline-block;
    position: absolute;
    left:50%;
    transform: translateX(-50%);
    // margin-top:0.3rem;
    font-size:0.3rem;
    vertical-align: middle;
    line-height: 0.8rem;
    .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
      border: 0;
    }
  }
  .submit-button-text {
    width: 100%;
    height: 50px;
    position:fixed;
    bottom:0;
    font-size:0.3rem;
    color: white;
    background-color:#F13333;
    border:none;
  }
  .van-cell .van-cell__title span{
    font-size: 12px;
    color: #979A9F;
    letter-spacing: 0;
    // font-weight:bold; 
  }

</style>
<style>
.order-info textarea{
  font-size: 12px;
}
.order-info textarea::-webkit-input-placeholder {
color: #CED0D7!important;
font-size: 12px;
}
.order-info-sle-updt .van-card__bottom{
	/* position: absolute;width: 100%;bottom:0px; */
}
.address-box-sly-updt{
    padding: 0.32rem 0.3rem !important;
}
.address-box-sly-updt .van-image{
	width: 22px;height: 22px;
}
.address-box-sly-updt .address-box-inner-bottom{
	display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;
}
.address-box-sly-updt .address-box-bd{
	margin-top: 14px;
}
.address-box-sly-updt .address-box-hd{
	padding-left: .5rem;
}
.address-box-sly-updt .address-box-inner-icon{
	left: -.55rem;
}
</style>


