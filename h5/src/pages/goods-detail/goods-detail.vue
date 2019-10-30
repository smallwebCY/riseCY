  <template>
  <div class="contaienr pd50">
    <van-swipe :autoplay="3000" indicator-color="white" class="goods-swiper">
      <van-swipe-item v-for="item in banner">
        <img :src="item" alt="" />
      </van-swipe-item>
    </van-swipe>

    <div class="countdown mb10" v-if="marketing.type">
      <div class="countdown-title">{{marketing.info.title}}</div>
      <div class="countdown-value" v-if="marketing.info.time > 0">距结束仅剩
        <van-count-down :time="marketing.info.time" format="DD 天 HH 时 mm 分 ss 秒" @finish="countDownEnd"  />
      </div>
      <div class="countdown-value" v-else>
        活动结束
      </div>
    </div>
    <div class="goods-desc mb10">
      <div class="goods-desc-hd">
        <span class="goods-desc-name">{{basicInfo.name}}</span>
        <!-- <div class="btn-fav" v-if="hasFav" @click="onFavDelete($route.query.id)">{{$t('fav_goods.fav_goods_006')}}</div>
        <div class="btn-fav btn-fav-danger"  v-else @click="onFavAdd($route.query.id)">{{$t('fav_goods.fav_goods_005')}}</div> -->
      </div>
      <div class="goods-desc-brief"
        v-if="basicInfo.characteristic">{{basicInfo.characteristic}}</div>
      <div class="goods-desc-price">
        <span class="goods-desc-price_min">{{this.currency}}{{ basicInfo.price | NumFormat}}</span>
        <!--<span class="goods-desc-price_label" v-if="marketing.type">{{marketing.info.label}}</span>-->
      </div>
     <!-- <div class="goods-desc-price_original mb10" v-if="marketing.type">￥{{marketing.type ? marketing.info.originalPrice : basicInfo.originalPrice}}</div>-->

      <div class="goods-desc-more van-hairline--top">
        <div class="goods-desc-more-item" >
          <!--<template v-if="basicInfo.logisticsId">-->
            {{$t('order_detail.order_detail_0032')}} {{basicInfo.freight ? basicInfo.freight : $t('order_detail.order_detail_0033')}}
         <!-- </template>
          <template v-else>
            不需要快递
          </template>-->
          </div>
        <!-- <div class="goods-desc-more-item ui-center">购买：{{basicInfo.numberSells}}</div> -->
       <!-- <div class="goods-desc-more-item ui-right">剩余 {{basicInfo.stores}}</div>-->
      </div>
    </div>

   <!-- <div class="rule mb10" @click="onRuleClick(marketing.rule.path)" v-if="marketing.type">
      <div class="rule-header">
        <div class="rule-header-title">{{marketing.rule.title}}</div>
        <div class="rule-header-value">玩法详情</div>
        <van-icon name="arrow" class="ml5" />
      </div>
      <div class="rule-body">{{marketing.rule.desc}}</div>
    </div>-->

<!--    <div class="goods-section">
      <van-cell class="mb10"
        title="领券"
        is-link
        @click="onShowCoupon"
        v-if="coupons.length&&!marketing.type" />
      <van-cell class="mb10"
        :title="propTitle"
        is-link
        @click="onShowSku"
        v-if="properties.length" />
      <van-cell class="mb10"
        title="服务 担保交易"
        is-link
        @click="onShowPopup" />
    </div>
    <van-cell-group v-if="pintuanList.length">
       <van-cell class="mb10" :value="pintuanList.length+'人在拼单，可直接参与'" />
       <div class="pintuan-list">
        <div class="pintuan-item van-hairline&#45;&#45;bottom" v-for="item in pintuanList" :key="item.id">
          <div class="pintuan-item-media"><img :src="item.avatarUrl" alt=""></div>
          <div class="pintuan-item-name van-ellipsis">{{item.nick}}</div>
          <div class="pintuan-item-info">
            <div class="pintuan-item-info__hd">还差<span class="ui-c-red">{{item.number}}</span>人拼成</div>
            <div class="pintuan-item-info__bd ui-c-dark">剩余<van-count-down millisecond :time="item.time" format="HH:mm:ss" /></div>
          </div>
          <div class="pintuan-item-btn" @click="onCurrentPintuan(item)">去拼单</div>
        </div>
       </div>
    </van-cell-group>
    <template v-if="rateList.length">
      <div class="goods-reputation mb10">
        <van-cell :to="'/goods-reputation?id='+basicInfo.id"
          class="mb10"
          :title="'评价('+rateList.length+')'"
          value="全部评价"
          is-link />
        <div class="goods-reputation-inner">
          <div class="goods-reputation-inner-hd">
            <div class="goods-reputation-inner-media"><img :src="reputation.avatarUrl"
                alt=""></div>
            <div class="goods-reputation-inner-name">{{reputation.nickName}}</div>
            <div class="goods-reputation-inner-stars">
              <van-rate v-model="reputation.rate"
                :size="14"
                color="#f44"
                void-icon="star"
                void-color="#eee"
                readonly />
            </div>
          </div>
          &lt;!&ndash; <div class="goods-reputation-inner-bd"> &ndash;&gt;
            &lt;!&ndash; <span class="goods-reputation-inner-tag">质量不错</span> &ndash;&gt;
            &lt;!&ndash; <span class="goods-reputation-inner-tag">下次再来</span> &ndash;&gt;
          &lt;!&ndash; </div> &ndash;&gt;
          <div class="goods-reputation-inner-ft">
            <p>{{reputation.remark}}</p>
            <p>{{reputation.property}}</p>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <van-cell class="mb10"
        title="暂无评价" />
    </template>-->
    <div class="goods-h2 common-h2">
      <span class="common-h2-title">{{$t('order_detail.order_detail_0031')}}</span>
    </div>
    <div class="goods-content"  >
      <div class="goods-content"  v-html="basicInfo.desc"></div>
    </div>

    <!-- 公用弹层 -->
    <van-popup v-model="showPopup"
      position="bottom">
      <div class="popup">
        <div class="service-desc">
          <img src="../../assets/gif_1.gif" style="margin:20px auto;" />
        </div>
        <van-button class="popup-confirm"
          type="danger"
          size="large"
          @click="onShowPopup">我知道了</van-button>
      </div>
    </van-popup>
<!--    &lt;!&ndash; 拼团弹层  &ndash;&gt;
    <van-popup v-model="showPtPopup" class="my-popup pintuan-popup">
      <div class="my-popup-close" @click="showPtPopup = false"><van-icon name="clear"/></div>
      <div class="my-popup-header">参与的拼单</div>
      <div class="my-popup-body">
        <div class="pintuan-popup-sub">还差<span class="ui-c-red">{{currentPintuan.number}}</span>个名额，<van-count-down millisecond :time="currentPintuan.time" format="HH:mm:ss" />后结束</div>
        <div class="pintuan-popup-inner">
          <div class="pintuan-popup-avatar"><img :src="currentPintuan.avatarUrl" alt=""></div>
          <div class="pintuan-popup-avatar pintuan-popup-avatar&#45;&#45;empty"><van-icon name="plus" /></div>
        </div>

      </div>
      <div class="btn-danger" @click="onShowSku">参与拼单</div>
    </van-popup>
    &lt;!&ndash; 领券弹层 &ndash;&gt;
    <van-popup v-model="showCoupon"
      position="bottom">
      <div class="popup popup-coupon">
        <div class="coupon-list-header van-hairline&#45;&#45;bottom">优惠券</div>
        <div class="coupon-list">
          <div class="coupon-list-item"
            v-for="(coupon, i) in coupons"
            :key="coupon.id">
            <div class="coupon-list-item-hd">
              <div class="coupon-list-item-money">
                <span class="fz12">￥</span>{{coupon.moneyMin}}</div>
              <div class="coupon-list-item-moneyHreshold">满{{coupon.moneyHreshold}}元可用</div>
            </div>
            <div class="coupon-list-item-bd">
              <div class="coupon-list-item-name">{{coupon.moneyMin}}元券</div>
              <div class="coupon-list-item-dateEndDays">领取后{{coupon.dateEndDays}}天有效</div>
            </div>
            <div v-if="coupon.status === 0" class="coupon-list-item-btn" @click="handleCouponClicked(coupon,i)">立即领取</div>
            <div v-else class="coupon-list-item-btn coupon-list-item-btn-clicked">已领取</div>
          </div>
        </div>
        <van-icon name="close"
          class="popup-close"
          @click="onShowCoupon" />
        <van-button class="popup-confirm"
          type="danger"
          size="large"
          @click="onShowCoupon">完成</van-button>
      </div>
    </van-popup>-->
    <!-- 商品规格弹层 -->
    <van-sku
        hide-quota-text
        v-model="showSku"
        :sku="skuData.sku"
        :goods="skuData.goods_info"
        :goods-id="skuData.goods_id"
        :hide-stock="skuData.sku.hide_stock"
        :quota="skuData.quota"
        :quota-used="skuData.quota_used"
        :stepper-title="order_detail_0038"
        :custom-stepper-config = "customStepperConfig"
        :custom-sku-validator="customSkuValidator"
        @buy-clicked="onBuyClicked"
        @add-cart="onAddCartClicked"
        >
          <!-- 自定义 sku-header-price -->
        <template slot="sku-header-price" slot-scope="props">
          <div class="van-sku__goods-price" :class="[marketing.isBuy ? 'xiahua' : '']">
            <span class="van-sku__price-symbol">{{currency}}</span><span class="van-sku__price-num">{{ props.price |NumFormat}}</span>
          </div>
          <div class="van-sku__goods-price" v-if="marketing.isBuy">
            {{ marketing.info.label }}{{currency}}<span class="van-sku__price-num">{{ marketing.info.minPrice | NumFormat }}</span>
          </div>
        </template>
          <!-- 自定义 sku actions -->
          <template slot="sku-actions" slot-scope="props">
            <div class="van-sku-actions" v-if="marketing.type">
              <van-button
                square
                size="large"
                type="danger"
                @click="props.skuEventBus.$emit('sku:buy')"
              >
                {{$t('cart.cart_0014')}}
              </van-button>
            </div>
            <div class="van-sku-actions" v-else>
              <van-button
                square
                size="large"
                type=""
                @click="props.skuEventBus.$emit('sku:addCart')"
              >
                {{$t('cart.cart_0014')}}
              </van-button>
              <!-- 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 -->
              <van-button
                square
                size="large"
                type=""
                @click="props.skuEventBus.$emit('sku:buy')"
              >
                {{$t('cart.cart_0016')}}
              </van-button>
            </div>
          </template>
        </van-sku>


    <!-- 商品导航栏 -->
    <van-goods-action v-if="marketing.type">
      <van-goods-action-icon :icon= "tabBarIcon.goodsDetailHome"
        :text="cart_0017"
        to="/home"
        replace />
      <van-goods-action-icon v-if="hasFav" @click="onFavDelete($route.query.id)" :icon= "tabBarIcon.favoHeartActive"
        :text="fav_goods_006"
         />
      <van-goods-action-icon v-else @click="onFavAdd($route.query.id)" :icon= "tabBarIcon.favoHeartGray"
        :text="fav_goods_005"
         />
      <van-goods-action-icon :icon= "tabBarIcon.goodsDetailCar"
        :text="cart_0007"
        to="/cart"
        :info="cartCount"
        replace />
      <van-goods-action-button type="warning"
        :text="marketing.actions[0].text"
        @click="onClickBuy" />
      <van-goods-action-button type="danger"
        :text="marketing.actions[1].text"
        @click="onClickMarketing(marketing.type)" />
    </van-goods-action>
    <van-goods-action v-else>
      <van-goods-action-icon :icon= "tabBarIcon.goodsDetailHome"
        :text="cart_0017"
        to="/home"
        replace />
      <van-goods-action-icon v-if="hasFav" @click="onFavDelete($route.query.id)" :icon= "tabBarIcon.favoHeartActive"
        :text="fav_goods_006"
         />
      <van-goods-action-icon v-else @click="onFavAdd($route.query.id)" :icon= "tabBarIcon.favoHeartGray"
        :text="fav_goods_005"
         />
      <van-goods-action-icon :icon= "tabBarIcon.goodsDetailCar"
        :text="cart_0007"
        to="/cart"
        :info="cartCount"
        replace />
      <van-goods-action-button type=""
        :text="cart_0014"
        @click="onShowSku" />
      <van-goods-action-button type=""
        :text="cart_0016"
        @click="onShowSku" />
    </van-goods-action>
    <!-- 右侧悬浮图标 -->
   <!-- <div class="side-bar">
      <div class="side-bar-share mb10" @click="goShare"><van-icon :size="22" color="#7d7e80" name="share" /></div>
      <div class="side-bar-backtop anim-scale" @click="goBackTop" v-show="backTop"><van-icon :size="22" color="#7d7e80" name="arrow-up" /></div>
    </div>-->
  </div>
</template>
<script>
import { Swipe, SwipeItem, Sku, GoodsAction, GoodsActionIcon, GoodsActionButton, Rate, Tag ,CountDown  } from 'vant'

import { storage, sessionStorage } from '@/common/util'
import { scrollTo } from '@/common/scroll-to'
var favoHeartActive = require('../../assets/favo-heart-active.png');
var favoHeartGray = require('../../assets/favo-heart-gray.png');
var goodsDetailCar = require('../../assets/goods-detail-car.png');
var goodsDetailHome = require('../../assets/goods-detail-home.png');
export default {
  name:'GoodsDetail',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Sku.name]: Sku,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
    [Rate.name]: Rate,
    [Tag.name]: Tag,
    [CountDown.name]: CountDown,
  },
  data() {
    return {
      marketing:{},
      pintuanList:[],
      cartCount:'',
      backTop:false,
      banner: [],
      rateList: [],
      reputation: {},
      basicInfo: {},
      logistics:{},
      properties: [],
      showCoupon: false,
      hasFav:false,
      favorite_id : 0,
      coupons: [],
      showPopup: false,
      showPtPopup: false,
      currentPintuan:{},  // 当前选中拼团数据
      propTitle: '选择',
      showSku: false,
      skuData: {
        goods_id: '',
        quota:0,  // 0表示不限购
        quota_used:0,
        goods_info: {},
        sku: {
          price: '1.00', // 默认价格（单位元）
          stock_num: 9999, // 商品总库存
          none_sku: false, // 是否无规格商品
          hide_stock: true, // 是否隐藏剩余库存
          collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
          tree: [],
          list: [],
          messages:[],
        },
      },
      currentUser:null,
      cartInfo:[],
      currency: "",
      cart_0007:this.$t('cart.cart_0007'),
      cart_0016:this.$t('cart.cart_0016'),
      cart_0017:this.$t('cart.cart_0017'),
      cart_0018:this.$t('cart.cart_0018'),
      cart_0014:this.$t('cart.cart_0014'),
      fav_goods_005:this.$t('fav_goods.fav_goods_005'),
      fav_goods_006:this.$t('fav_goods.fav_goods_006'),
      order_detail_0038:this.$t('order_detail.order_detail_0038'),
      tabBarIcon:{
        goodsDetailCar:goodsDetailCar,
        favoHeartGray:favoHeartGray,
        favoHeartActive:favoHeartActive,
        goodsDetailHome:goodsDetailHome,
      },
      customSkuValidator: () => this.$t('order_detail.order_detail_0039'),
      customStepperConfig:{
        handleOverLimit: (data) => {
          console.log(data)
          const { action, limitType, quota, quotaUsed } = data;
          if (action === 'minus') {
            
            this.$toast(this.$t('goods_detail.goods_detail_001'));
          } 
        },
      },
    }
  },
  created() {
    this.getGoodsDetail(this.$route.query.id,this.$route.query.sid||'');
    this.getCurrentUser();
    this.checkGoodsFav(this.$route.query.id);
    storage.remove("buyInfo");
/*    this.getDiscountsCoupons()
    this.getGoodsReputation(this.$route.query.id)
    this.checkGoodsFav(this.$route.query.id)
    this.getCartCount()*/

  },
  mounted() {
    window.addEventListener('scroll', this.onPageScroll, false)

  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onPageScroll, false);
  },
  filters:{
    NumFormat:function (value) {
      if (!value) return ''
      let intPart = Number(value).toFixed(0) // 获取整数部分
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.') // 将整数部分逢三一断
      return intPartFormat

    }
  },
  methods: {
    marketingType(type,set={}){
      /*
        砍价忽略规格,拼团支持规格
        活动到期，商品恢复原价
      */
     let time
     if(type !== 'default'){
        let endTime = new Date(set.dateEnd.replace(/-/g,'/')).getTime()
        let nowTime = Date.now()
        time = endTime > 0 ? Math.floor(endTime-nowTime) : 0
     }

      const marketing = {
        'default':{
          type:'',
          info:{
            title:'普通',
            minPrice:this.basicInfo.minPrice,
            originalPrice:this.basicInfo.originalPrice,
          },
        },
        'kanjia':{
          type,set,
          isBuy:true,
          info:{
            title:'砍价',
            time,
            label:'砍价享',
            minPrice:this.basicInfo.kanjiaPrice,
            originalPrice:this.basicInfo.originalPrice,
          },
          rule:{
            title:'[砍价购]',
            desc:'邀请好友砍价，超低价购买心仪商品。',
            path:'/kanjia/rule',
          },
          actions:[
            {text:`￥${this.basicInfo.minPrice}购买`},
            {text:`￥${this.basicInfo.kanjiaPrice}砍价拿`},
          ]
        },
        'pintuan':{
          type,set,
          isBuy:true,
          info:{
            title:'拼团',
            time,
            label:`${set.numberPersion}人拼团价`,
            minPrice:this.basicInfo.pingtuanPrice,
            originalPrice:this.basicInfo.originalPrice,
          },
          rule:{
            title:'[多人拼团]',
            desc:'支付开团邀请一人成团，人数不足自动退款。',
            path:'/kanjia/rule',
          },
          actions:[
            {text:`￥${this.basicInfo.minPrice}购买`},
            {text:`￥${this.basicInfo.pingtuanPrice}开团`},
          ]
        },
        'miaosha':{
          type:type,
          isBuy:true,
          info:{
            title:'秒杀',
            time:0
          },
          rule:{
            title:'[秒杀]',
            desc:'订单5分钟内未支付将被取消。'
          }
        },
      }
      this.marketing = marketing[type]
      console.log("market....",this.marketing)
    },
    getCartCount(){
      const cartInfo = storage.get('cartInfo') || []
      this.cartCount = cartInfo.length || ''
    },
    onPageScroll(){
      const sTop = document.documentElement.scrollTop || document.body.scrollTop
      this.backTop = sTop >= 500
    },
    goShare(){
      this.$toast('未开放')
    },
    goBackTop(){
      scrollTo(0,800)
    },
    onClickIcon() {
      // this.$toast('点击图标');
    },
    onShowSku() {
      // this.$toast('点击按钮弹出sku规格弹层');
      this.showSku = !this.showSkugetSkuData
    },
    onMarketingAction(path){
      console.log(path)
      if(path.includes('order')){
        this.onShowSku()
      }else{
        this.$router.push({path})
      }
    },
    onClickBuy(){
      this.marketing.isBuy = false
      this.onShowSku()
    },
    onClickKanjia(){
      let kjid = this.marketing.set.id
      if(this.marketing.actions[1].text === '正在砍价'){
        this.$router.push({path:'/kanjia/kanjia',query:{joiner:storage.get('uid'),kjid }})
        return;
      }
      // 发起砍价活动
      this.$toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      })
      this.$request.post('/shop/goods/kanjia/join',{token:storage.get('token'),kjid}).then(res=>{
        if(res.code !== 0){
          this.$toast({message:res.msg || '发起砍价失败，请重试！',duration:1500})
        }
        this.$toast.clear()
        this.marketing.actions[1].text = '正在砍价'
        this.$router.push({path:'/kanjia/kanjia',query:{joiner:storage.get('uid'),kjid }})

      })
    },
    onClickPintuan(){
      if(this.marketing.actions[1].text === '查看我的团'){
        let tuanId = this.marketing.set.tuanId
        this.$router.push({path:'/pintuan/pintuan',query:{ tuanId ,goodsId:this.basicInfo.id}})
        return;
      }
      this.marketing.isBuy = true
      this.onShowSku()
    },
    onjoinPintuan(){
      // this.tuanId =
      this.onShowPtPopup()
      this.onShowSku()
    },
    onClickMarketing(type){
      if(type === 'pintuan'){
        this.onClickPintuan()
      }
      if(type === 'kanjia'){
        this.onClickKanjia()
      }
    },
    onShowPopup() {
      this.showPopup = !this.showPopup
    },
    onCurrentPintuan(item){
      this.currentPintuan = item
      this.marketing.isBuy = true
      this.onShowPtPopup()
    },
    onShowPtPopup() {
      this.showPtPopup = !this.showPtPopup
    },
    onShowCoupon() {
      this.showCoupon = !this.showCoupon
    },
    checkGoodsFav(id){
      this.$request.post('/user/favorite_create', { shop_goods_id:id, sid: storage.get('sid'), type:'goods',flag:0 }).then(res => {
        if(res.status == 1 && res.data.length>0 && res.data[0].status == 0){
          this.favorite_id = res.data[0].id
          this.hasFav = true
        }else{
          this.hasFav = false
        }

      })
    },
    onFavAdd(id){
      this.$request.post('/user/favorite_create', { shop_goods_id:id, sid: storage.get('sid'), type:'goods',flag:1 }).then(res => {
        if(res.status == 1 && res.data[0].status == 0){
          this.favorite_id = res.data[0].id
          this.$toast({message:this.$t('fav_goods.fav_goods_003'),duration:1500})
          this.hasFav = true
        }else{
          this.hasFav = false
        }
      })
    },
    onFavDelete(){
      this.$request.post('/user/favorite_delete', { favorite_id:this.favorite_id, sid: storage.get('sid') }).then(res => {
        if(res.status == 1){
          this.$toast({message:this.$t('fav_goods.fav_goods_004'),duration:1500})
          this.hasFav = false
        }else{
          this.hasFav = true
        }
      })
    },
    handleCouponClicked(coupon,index) {
      if(coupon.pwd){
        this.$toast({ message: '本券需要使用口令才能领取', duration: 1500 })
        return;
      }
      this.$request.post('/discounts/fetch', { id:coupon.id, token: storage.get('token') }).then(res => {
        if (res.code === 0) {
          // this.$toast('领取成功')
          this.$toast({ message: '恭喜,抢到了~', duration: 1500 })
          this.coupons[index].status = 0
        } else if (res.code === 20001 || res.code === 20002 || res.code === 20003) {
          // this.$toast(res.msg)
          this.$toast({ message: '很遗憾,没抢到~', duration: 1500 })
          this.coupons[index].status = 1
        } else {
          this.$toast(res.msg)
        }
      })
    },
    rate2star(rateValue) {
      let value = 5
      switch (rateValue) {
        case 0:
          value = 1
          break;
        case 1:
          value = 3
          break;
        case 2:
          value = 5
          break;
        default:
          value = 5
      }
      return value
    },
    getGoodsReputation(goodsId, page = 1, pageSize = 50) {
      this.$request.post('/shop/goods/reputation', { goodsId, page, pageSize }).then(res => {
        if (res.code !== 0) {
          // this.$toast(res.msg)
          return;
        }
        this.rateList = res.data
        // user.avatarUrl
        this.reputation = {
          id:res.data[0].goods.id,
          avatarUrl: res.data[0].user.avatarUrl || `${require('@/assets/avatar_default.png')}`,
          nickName: res.data[0].user.nickName || res.data[0].user.mobile.replace(res.data[0].user.mobile.substring(3, 7), '****'),
          rate: this.rate2star(res.data[0].goods.goodReputationStr),
          remark: res.data[0].goods.goodReputationRemark || '此用户没有填写评价',
          date: res.data[0].goods.dateReputation.slice(0,10),
          property:res.data[0].goods.property
        }
      })
    },
    onBuyClicked(data) {
      console.log(data)
      if(this.$route.query.sid){
        this.$toast(this.$t('goods_detail.goods_detail_002'));
        return;
      }
      // 立即购买商品数据定义格式
      let goodsInfo = []
      goodsInfo.push({
          goods_id : this.basicInfo.shop_goods_id,
          shop_id:this.basicInfo.shop_id,
          icon:this.basicInfo.main_img,
          quantity:data.selectedNum,
          status: 1,
          value : data.selectedSkuComb.value,
          price : data.selectedSkuComb.price,
          currency : this.currency,
          title : this.basicInfo.name_transl,
          sku_id :data.selectedSkuComb.id,
      })

      sessionStorage.set('buyInfo', goodsInfo)
      this.$router.push({ path: '/order-submit', query: { type: 'buy' } })
    },

    onAddCartClicked(data) {
      //console.log("data:", data);
        let goods = {};
        goods = {sku_id: data.selectedSkuComb.id,count:data.selectedNum}
        if(this.currentUser == null) {
            let cartInfo = storage.get('cartInfo') || []
            let index = cartInfo.findIndex(item => item.goods_id == data.goodsId && item.sku_id == data.selectedSkuComb.id)
            if (cartInfo.length && index > -1) {
                cartInfo[index].quantity = cartInfo[index].quantity + data.selectedNum
            } else {

                cartInfo.push({
                    goods_id : this.basicInfo.shop_goods_id,
                    shop_id:this.basicInfo.shop_id,
                    icon:this.basicInfo.main_img,
                    quantity:data.selectedNum,
                    status: 1,
                    value : data.selectedSkuComb.value,
                    price : (data.selectedSkuComb.price/100),
                    currency : this.currency,
                    title : this.basicInfo.name,
                    sku_id :data.selectedSkuComb.id,
                    cart_item_id:this.basicInfo.shop_goods_id, // 未登录没有购物车的id默认使用商品Id
                })
            }
            this.$toast({ message: this.$t('cart.cart_0013'), duration: 1500 })
            storage.set('cartInfo', cartInfo)
            this.showSku = !this.showSku
            return;
        }
        //console.log("cartInfo:", storage.get("cartInfo"));
      //
     /* if (this.properties.length) {*/
        // 添加相同且规格一致的商品

      this.$request.post('/cart/add_to_cart', {shop_id:this.basicInfo.shop_id,sku_list: JSON.stringify([goods])}).then(res => {
          if(res && res.status == 1) {
              this.$toast({ message:this.$t('cart.cart_0013'), duration: 1000 })
          } else {
              this.$toast({ message:res.msg, duration: 1000 })
          }
      })

        /*} else {
          // 添加相同且规格一致的商品
          let index = goodsInfo.findIndex(item => item.goodsId === data.goodsId)
          if (goodsInfo.length && index > -1) {
            goodsInfo[index].selectedNum = goodsInfo[index].selectedNum + data.selectedNum
          } else {
            goodsInfo.push({
              id: `${Date.now()}`,
              goodsId: data.goodsId,
              propertyChildIds: '',
              propTitle: this.propTitle.replace('已选 ', ''),
              price: this.basicInfo.minPrice,
              selectedNum: data.selectedNum,
              messages: data.messages,
              name: this.basicInfo.name,
              characteristic: this.basicInfo.characteristic,
              pic: this.basicInfo.pic,
              marketing:{},
            })
          }
        }*/

    },
    onSkuSelected(data) {
      //console.log("---------------------",data)
      if (data.selectedSkuComb) {
        let title = []
        this.properties.forEach((item, index) => {
          let current = item.childsCurGoods.find(v => v.id === data.selectedSku[`s${index + 1}`])
          title.push(current.name)
        })
        this.propTitle = this.$t('order_detail.order_detail_0030')+` ${title.join(',')}`
        this.getGoodsPrice(this.basicInfo.id, data.selectedSkuComb.propertyChildIds, (res) => {
          if(this.marketing.type === 'pintuan'){
            this.marketing.info.minPrice = res.data.pingtuanPrice
            this.marketing.info.originalPrice = res.data.originalPrice
          }

          this.basicInfo.minPrice = res.data.price
          this.basicInfo.originalPrice = res.data.originalPrice
          this.basicInfo.pingtuanPrice = res.data.pingtuanPrice
          this.basicInfo.stores = res.data.stores

          data.selectedSkuComb.price =  parseFloat((res.data.price*100))// 价格（单位分）
          data.selectedSkuComb.stock_num = res.data.stores
          data.selectedSkuComb.propertyChildIds = res.data.propertyChildIds
        })
      }
    },
    getCurrentUser() {
        this.$request.get('/user/get_user').then(res => {
            console.log(`/user/get_user：` + res)
            if(res != null && res.status == 1) {
                this.currentUser = res.data;
            }
        })
    },
    getDiscountsCoupons() {
      this.$request.get('/discounts/coupons', { token: storage.get('token') }).then(res => {
        const data = res.data || []
        this.coupons = data.filter(item => !item.pwd)
      })
    },
    getGoodsPrice(goodsId, propertyChildIds, callback) {
      // this.$toast.loading({
      //   mask: true,
      //   message: '加载中...',
      //   duration:0
      // })
      this.$request.post('/shop/goods/price', { goodsId, propertyChildIds }).then(res => {
        callback(res)
        // this.$toast.clear()
      })
    },
    getGoodsDetail(id,sid) {
      this.$request.get('/goods/buyer/get_detail', { "shop_goods_id":id,"sid":sid, "with_detail_img" : 1,"with_sku_list" : 1,"with_desc" : 1 }).then(res => {
        console.log(res)
        if(res.status != 1){
          this.$toast(res.msg)
          return;
        }
        this.banner.push(res.data.main_img)
        this.banner.push(...res.data.detail_img);
        this.basicInfo = res.data
       /* if(res.data.currency_symbol == "VND") {
            this.currency = "₫";
        } else {
            this.currency = "¥";
        }*/
       this.currency=res.data.currency_symbol;
  /*      this.content = res.data.content
        // 如果 basicInfo.logisticsId 为0,则是 虚拟商品 [不使用物流（不需要用户填写收货地址的商品）]
        this.logistics = res.data.logistics || {}
        this.properties = res.data.properties || []*/
 /*       // 商品营销玩法相关
        const marketingFn = ()=>{
          if(this.basicInfo.kanjia&&this.basicInfo.kanjiaPrice){
            this.$request.get('/shop/goods/kanjia/set',{goodsId:id}).then(res =>{
              if(res.code === 700){
                // 暂无数据：活动时间截止了或者后台设置了禁用
                this.$toast('砍价活动已结束,商品恢复原价')
              }
              if(res.code !== 0){
                return;
              }
              const set = res.data
              //
              this.marketingType('kanjia',set)

              this.$request.get('/shop/goods/kanjia/my',{token:storage.get('token'),kjid:set.id}).then(res => {
                if(res.code !== 0){
                  return;
                }
                this.marketing.actions[1].text = '正在砍价'
              })
            })

            return;
          }
          else if(this.basicInfo.pingtuan){
            // pingtuan 官方拼团拼写错误
            this.$request.get('/shop/goods/pingtuan/set',{goodsId:id}).then(res =>{
              if(res.code !== 0){
                return;
              }
              const set = res.data
              if(new Date(set.dateEnd.replace(/-/g,'/')).getTime()<Date.now()){
                this.$toast('拼团活动已结束,商品恢复原价')
                console.log('活动结束，时间截止到'+set.dateEnd)
                return;
              }
              if(set.status === 1){
                console.log('后台设置了禁用' )
                return;
              }
              this.marketingType('pintuan',set)
              // 进行中的拼团
              this.$request.post('/shop/goods/pingtuan/list/v2',{goodsId:id,page:1,pageSize:10,status:0}).then(res => {
                if(res.code === 0){
                  let nowTime = Date.now()
                  this.pintuanList = res.data.result.map(item =>({
                    id:item.id,
                    avatarUrl:item.apiExtUser.avatarUrl || `${require('@/assets/avatar_default.png')}`,
                    nick:item.apiExtUser.nick || '神秘用户',
                    time: Math.floor(((new Date(item.dateEnd.replace(/-/g,'/')).getTime()) - nowTime)),
                    number:set.numberPersion - item.helpNumber,
                  }))
                  // 查看我的团
                  this.$request.get('/shop/goods/pingtuan/my-join-list',{token:storage.get('token'),goodsId:id}).then(res => {
                    if(res.code !== 0){
                      return;
                    }
                    const myList = res.data.result.map(item => item.tuanInfo.id)
                    const pintuanList = this.pintuanList.map(item => item.id)
                    const isMyTuan = myList.some(item => pintuanList.includes(item))
                    if(isMyTuan){
                      this.marketing.actions[1].text = '查看我的团'
                      this.marketing.set.tuanId = res.data.result[0].tuanInfo.id  // 团号
                    }
                  })
                }
              })
            })
            return;
          }
          else if(this.basicInfo.miaosha){
            this.marketingType('miaosha')
            return;
          }
          else {
            this.marketingType('default')
          }
        }
        marketingFn()
        // 商品已下架
        if(this.basicInfo.status === 1){
          this.$toast(this.basicInfo.statusStr)
        }
        // 商品库存为0
        if(this.basicInfo.stores === 0){
          this.$dialog.confirm({
            title: '提示',
            message: '该商品已售罄,去看看其他商品吧！',
            showCancelButton:false,
          }).then(() => {
            // on confirm
            this.$router.replace({path:'/home'})
          })
          return;
        }*/
        this.initSkuData(id)
      })
    },
    initSkuData(id) {
      let basicInfo =  this.basicInfo
      this.skuData.sku.price = basicInfo.price
      if(basicInfo.sku_list && basicInfo.sku_list.length > 0){
        this.skuData.sku.none_sku = false

        let obj = {}
        obj.k = this.$t('order_detail.order_detail_0029')
        obj.v = basicInfo.sku_list.map((item) => ({
          name: item.value,
          id: item.id,
        }))
        obj.k_s = 's1';
        this.skuData.sku.tree.push(obj)

        this.skuData.sku.list.push(...basicInfo.sku_list.map((item) => ({
          id: item.id,
          price : item.price*100, // 单位是分专化
          s1 : item.id,
          stock_num : 9999,
          value : item.value,
        })));

      }else{
        this.skuData.sku.none_sku = true
      }

      this.skuData.goods_id = id  // 商品id
      this.skuData.goods_info = {
        title: basicInfo.name,
        picture: basicInfo.main_img
      }
    },
    onRuleClick(path){
      console.log(path)
      this.$router.push({path})
    },
    countDownEnd(){
      this.$toast({
        type:'text',
        mask: true,
        message: '活动结束，该商品恢复原价！',
        duration:2500,
      })
      this.marketingType('default')
    }
  }
}
</script>
<style>
	.van-sku-messages{
		padding-bottom: 0px !important;
	}
</style>
<style lang="less" scoped>
.xiahua{
  text-decoration:line-through;
  color:#999;
}
.text-left {
  text-align: left;
}
// .goods-swiper,.goods-swiper img{
//   width: 100%;
//   height: 410px;
// }
.goods-desc {
  box-sizing: border-box;
  padding: 0 15px;
  background: #fff;
  &-hd {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding:10px 0;
  }
  &-name {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    flex:1;

  }
  &-price {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &_min{
      font-size: 24px;
      color: #F13333;
    }
    &_original{
      font-size: 12px;
      color: #999;
      text-decoration: line-through;
    }
    &_label{
      margin-left: 10px;
      box-sizing: border-box;
      display: inline-block;
      font-size: 10px;
      padding:2px 4px;
      border-radius:4px;
      color: #f44;
      border: 1px solid #f44;
    }
  }

  &-brief {
    font-size: 12px;
    color: #888;
    margin-bottom: 10px;
  }

  &-more {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding:10px 0;
    &-item {
      flex: 1;
      font-size: 12px;
      color: #999;
    }
  }
  .btn-fav{
    box-sizing: border-box;
    display: inline-block;
    font-size: 12px;
    width:60px;
    text-align: center;
    padding:2px 10px;
    border-radius:10em;
    background-color: #fff;
    color: #666;
    border: 1px solid #ebedf0;
  }
  .btn-fav-danger{
    color: #f44;
    border: 1px solid #f44;
  }
}

.goods-content /deep/ img {
  max-width: 100% !important;
  height: auto !important;
}
.goods-content {
  box-sizing: border-box;
  background: #fff;
}

.goods-reputation {
  background: #fff;
  &-inner {
    padding: 0 15px;
    &-hd {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      font-size: 12px;
      color: #666;
    }
    &-media {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      background: #eee;
      margin-right: 5px;
    }
    &-name {
      flex: 1;
    }
    &-stars {
    }
    &-tag {
      padding: 2px 10px;
      border-radius: 10px;
      border: 1px solid #979797;
      font-size: 10px;
      color: #999;
      margin-right: 10px;
    }
    &-bd {
      padding: 10px 0;
    }
    &-ft {
      padding: 5px 0 10px;
      font-size: 14px;
      color: #999;
    }
  }
}
.service-desc {
  height: 70vh;
  padding: 10px 15px;
  font-size: 14px;
  color: #666;
}
.popup-coupon {
  position: relative;
  padding-top: 44px;
  padding-bottom: 50px;
}
.coupon-list {
  padding: 10px 15px;
  max-height: 70vh;
  overflow-y: auto;
  &-header {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    top: 0;
    left: 0;
    font-size: 14px;
    color: #333;
    padding: 10px 0;
    text-align: center;
  }
}
.coupon-list-item {
  box-sizing: border-box;
  height: 76px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #ffeeee;
  color: #ff4b52;
  margin-bottom: 10px;
  border-radius: 10px;
  &-hd {
    width: 100px;
    text-align: center;
    border-right: 1px slategrey #eee;
  }
  &-money {
    font-size: 24px;
    font-weight: bold;
    // margin-bottom:10px;
  }
  &-moneyHreshold {
    font-size: 12px;
  }
  &-bd {
    flex: 1;
  }
  &-name {
    font-size: 14px;
    padding: 5px 0;
  }
  &-dateEndDays {
    font-size: 12px;
    color: #d7a0a5;
  }
  &-btn {
    margin-right: 25px;
    display: inline-block;
    padding: 0.2em 0.5em;
    color: #fff;
    background: #ff4444;
    font-size: 10px;
    line-height: normal;
    border-radius: 0.8em;
  }
  &-btn-clicked {
    color: #ff4444;
    background: #ffffff;
    border: 1px solid #ff4444;
    pointer-events: none;
  }
}
/* 商品玩法 */
.countdown{
  box-sizing:border-box;
  padding:0 15px;
  height:45px;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content: space-between;
  background: linear-gradient(
    180deg,
    rgba(255, 70, 57, 1) 0%,
    rgba(255, 112, 61, 1) 100%
  );
  &-title{
    font-size: 18px;
    font-weight:bold;
  }
  &-value{
    font-size: 12px;
    color:#fff;
  }
  /deep/.van-count-down, .van-divider{
    font-size: 12px;
    color:#fff;
  }
}
.rule{
  background-color: #fffbe8;
  font-size: 14px;
  color: #999;
  padding:10px 15px;
  &-header{
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:10px;
    &-title{
      color:#ed6a0c;
      flex:1;
    }
    &-value{
      font-size: 12px;
    }
  }
  &-body{
    font-size: 12px;
    color: #999;
  }
}
.pintuan{
  &-list{
    }
  &-item{
    padding:10px 15px;
    display:flex;
    align-items: center;
    justify-content: flex-start;
    &-media{
      width:40px;
      height:40px;
      overflow: hidden;
      border-radius:50%;
      margin-right:5px;
    }
    &-name{
      flex: 1;
    }
    &-info{
      flex:1;
      text-align:right;
      margin-right:10px;
      &__bd{
        display:flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
    &-btn{
      font-size: 14px;
      padding:8px 15px;
      border-radius:20px;
      color: #fff;
      background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);
    }
    &-btn:active{
      opacity:.8
    }
  }
}
@border-radius: 25px;
.btn-danger{
  flex:1;
  box-sizing: border-box;
  width:100%;
  display:inline-block;
  border-radius:@border-radius;
  text-align:center;
  padding:12px 0;
  font-size: 14px;
  color:#fff;
  background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);
}
/* 弹层*/
.my-popup{
  box-sizing: border-box;
  background:#fff;
  padding:25px 46px;
  text-align:center;
  width:260px;
  border-radius:16px;
  &-header{
    font-weight: bold;
    color:#1A1A1A;
    font-size: 16px;
    padding:10px 0;
  }
  &-close{
    position: absolute;
    top:15px;
    right:15px;
    font-size: 22px;
    color:#bfbfbf;
  }
}
.pintuan-popup{
  padding:25px 30px;
  &-sub{
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    color:#666;
    margin-bottom:10px;
  }
  &-inner{
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom:20px;
  }
  &-avatar+&-avatar{
    margin-left:10px;
  }
  &-avatar{
    box-sizing: border-box;
    width:60px;
    height:60px;
    border-radius:50%;
    overflow:hidden;
    border:1px solid #c0c0c0;
    &--empty{
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.popup {
  position: relative;
  padding-bottom: 50px;
  &-confirm {
    position: absolute;
    left: 0;
    bottom: 0;
  }
  &-close {
    position: absolute;
    top: 10px;
    right: 15px;
    color: #969799;
    font-size: 20px;
    text-align: center;
  }
}
.side-bar{
  position:fixed;
  right: 15px;
  bottom:60px;
  z-index:99;
  min-height:80px;
  &-share,&-backtop{
    box-sizing: border-box;
    background: #fff;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #7d7e80;
    width: 32px;
    height: 32px;
    box-shadow: 0 0 2px 3px hsla(0,0%,86.3%,.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.anim-scale {
    animation-name: anim-scale;
    animation-duration: .3s;
    animation-fill-mode: both;
}
@keyframes anim-scale {
    0% {
        opacity: .3;
        -ms-transform: scale(.5);
        transform: scale(.5)
    }

    100% {
        opacity: 1;
        -ms-transform: scale(1);
        transform: scale(1)
    }
}
// van 样式覆盖
.van-sku__price-symbol{
  font-size: 21px;
  font-weight: 500;
}
.van-sku__goods-price span{
  color: #F13333;
}
.van-goods-action-button{
  height: 1rem;
  line-height: 1rem;
}
.van-goods-action-button--last{
  border-radius: inherit;
  background: #F13333;
  color: #ffffff;
  margin-right:0;
}
.van-goods-action-button--first{
  border-radius: inherit;
  background-color: #ff976a;
  color: #ffffff;
}
.van-sku-actions .van-button{
  height: 50px;
}
.van-goods-action-button .van-button__text{
  color: #ffffff;
}
.van-sku-actions .van-button:last-of-type{
  border-radius: inherit;
  background: #F13333;
}
.van-sku-actions .van-button:first-of-type{
  border-radius: inherit;
  background-color: #ff976a;
}
.van-sku-actions .van-button .van-button__text{
  color: #ffffff;
}

.van-sku-actions{
  padding: 0;
}
</style>


