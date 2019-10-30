<template>

    <div class="container pd100">
        <!-- <van-nav-bar
            left-arrow
            :border = false
            @click-left="onClickLeft"
        /> -->
        <div class="head-status">
            <div class="back-arrow" v-if= addChannelBar>
                <van-icon :name="backArrow" size="" @click="back"/>
            </div>
            <div class="order-return-text">
                <p>{{order_return_0001}}</p>
            </div>

            <div class="waiting-dealing">
                <p>{{order_return_0002}}</p>
            </div>
        </div>
        <div class="order-info-status">

            <div class="order-number">{{order_return_0007}}<span>{{bill_no}}</span></div>
            <div>
                <!-- <van-cell-group>
                    <van-cell :title="title"/>

                </van-cell-group> -->
                <van-button
                        plain
                        size="small"
                        @click="showOrder()"
                        class="check-order">{{order_return_0003}}</van-button>
            </div>

            <div class="order-pay-info">
                <van-cell-group class="mb20">

                    <van-cell :title="order_return_0004" :value="totalPrice"/>
                    <van-cell :title="order_return_0005" :value="order_return_0006"></van-cell>

                </van-cell-group>
            </div>
        </div>


    </div>

</template>

<script>
import {NavBar} from 'vant'
import {storage} from '@/common/util'
var backArrow =  require('../../assets/back-arrow.png');
    export default {
        components: {
            [NavBar.name]:NavBar,
        },
        data() {
            return {
                title:"",
                bill_no: "",
                totalPrice: "",
                order_return_0001:this.$t('order_return.order_return_0001'),
                order_return_0002:this.$t('order_return.order_return_0002'),
                order_return_0003:this.$t('order_return.order_return_0003'),
                order_return_0004:this.$t('order_return.order_return_0004'),
                order_return_0005:this.$t('order_return.order_return_0005'),
                order_return_0006:this.$t('order_return.order_return_0006'),
                order_return_0007:this.$t('order_return.order_return_0007'),
                addChannelBar:true,
                backArrow:backArrow,
            }
        },
        created() {
            var addChannel = storage.get("addChannel")
            if(addChannel === 'app'){
                this.addChannelBar = false;
            }
            if(this.$route.query.bill_no) {
                this.title = this.$t('order_return.order_return_0007')+":" + this.$route.query.bill_no;
                this.bill_no = this.$route.query.bill_no;
            }
            if(this.$route.query.totalPrice) {
                this.totalPrice = this.$route.query.totalPrice;
            }
        },
        methods:{
            showOrder(){
                this.$router.push({path:'/order-detail',query:{bill_no:this.bill_no}})
            },
            back(){
                this.$router.go(-1);//返回上一层
            },
        },
    }
</script>

<style lang="less" scoped>
    .head-status{
        // width: 100%;
        // height: 267px;
        box-sizing: border-box;
        padding: 15px 0 0 16px;
        background-image: linear-gradient(0deg, rgba(238,240,255,0.00) 26%, #CCD8ED 99%);
        .back-arrow{
            height: 0.8rem;
            // padding: 15px 0 0 16px;
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
    }
    .order-return-text {
        margin-top: 14px;
        margin-bottom: 0.1rem;
        margin-left: 9px;
        font-size: 0.3rem;
    }
    .order-return-text p{
        font-size: 22px;
        color: #414961;
        letter-spacing: 0;
        font-weight: bold;
    }
    .check-order{
        color: #2E79E7;
        margin-left: 12px;
        margin-top: 12px;
        line-height:20px!important;
        height: 20px!important;
        border: 0;
        position: relative;
        // border-color: #2E79E7;
    }
    .check-order::after {
        content: "";
        opacity: 1;
        width: 200%;
        height: 200%;
        position: absolute;
        left: -50%;
        top: -50%;
        border: 1px solid #2E79E7;
        -webkit-transform: scale(.5);
        transform: scale(.5);
        box-sizing: border-box;
    }
    .waiting-dealing {
        margin-top: 11px;
        margin-left: 9px;
    }
    .waiting-dealing p{
        font-size: 13px;
        color: #434B63;
        letter-spacing: 0;
    }
    .order-info-status{
        background: #FFFFFF;
        box-shadow: 0 0 4px 0 rgba(223,223,223,0.50);
        border-radius: 4px;
        margin: 0 8px;
        padding: 17px 0 20px 0;
        position: relative;
        box-sizing: border-box;
        // top: -2.6rem;
        margin-top: 12px;
        .order-number{
            font-size: 12px;
            color: #979A9F;
            letter-spacing: 0;
            margin-left: 12px;
        }

    }
.van-cell:not(:last-child)::after{
    border: 0;
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
    border-width: 1px 0 0 0;
}
.order-pay-info{
    margin-top: 15px;
    overflow: hidden;
    .mb20{
        margin-bottom: 0;
        padding-top: 15px;
    }
    .van-cell-group{

    }
    .van-cell{
        padding: 0 12px;
        // line-height: 1em;
        font-size: 12px;
        line-height: 17px;
        .van-cell__title{
            color: #979A9F;
        }

    }
    .van-cell-group .van-cell:first-child{
        .van-cell__value{
            font-size: 12px;
            color: #F13333;
        }
    }
    .van-cell-group .van-cell:last-child{
        margin-top: 10px;
        .van-cell__value{
            font-size: 12px;
            color: #131C33;
        }
    }
}
</style>
