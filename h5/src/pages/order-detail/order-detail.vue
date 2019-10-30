<template>
	<div class="container">
		<div class="head-status">
			<div>
				<van-icon v-if=addChannelBar :name="backArrow" size="20px" @click="back" />
			</div>
			<div>
				<p class="distributing">{{this.orderInfo.statusStr}}</p>
			</div>
		</div>

		<div class="address-box mb10 address-box-sly-top">
			<div class="address-box-hd">
				<div class="address-box-inner">
					<div class="address-box-inner-title">{{$t('order_detail.order_detail_0001')}}：{{express.name}}</div>
					<div class="address-box-inner-title">{{express.mobile}}</div>
				</div>
				<div class="address-box-inner">
					<div class="address-icon-sly"><img src="../../../src/assets/van-icon-location-o.png"/></div>
					<div class="address-box-inner-bottom">{{$t('order_detail.order_detail_0002')}}：{{express.address}}</div>
				</div>
			</div>
			<!-- 物流公司 物流单号 -->
			<div class="logistics-info" v-if="this.express.express_no">
				<!-- <div class="logistics-info"> -->
				<van-cell-group>
					<van-cell :title="order_detail_0003" :value="this.express.express_name" />
					<van-cell>
						<div id="left">
							{{$t('order_detail.order_detail_0004')}}
						</div>
						<div id="right">
							{{express.express_no}}
							<van-button plain type="default" size="mini" style="margin-left:5px;" @click="handleClipboard(express.express_no,$event)">{{$t('order_detail.order_detail_0005')}}</van-button>
						</div>
					</van-cell>
				</van-cell-group>
			</div>
			<div class="logistics-info" v-else>
				<!-- <div class="logistics-info"> -->
				<van-cell-group>
					<van-cell :title="order_detail_0003" :value="noExpresSta" />
					<van-cell>
						<div id="left">
							{{$t('order_detail.order_detail_0004')}}
						</div>
						<div id="right">
							{{noExpresSta}}
						</div>
					</van-cell>
				</van-cell-group>
			</div>
		</div>
		<div class="order-goods-info order-detail-style">
			<van-panel>
				<van-cell :title="order_detail_0006" :value="this.orderInfo.bill_no" />
				<template slot="default">
					<van-card v-for="(good,index) in goods" :key="index" :num="good.count" :price="good.price" :desc="good.sku_name"
					 :title="good.title" :thumb="good.icon" :currency="currency">
					</van-card>
				</template>
			</van-panel>

			<van-cell v-if="orderInfo.remark" class="van-cell-slele" :value="orderInfo.remark" />
		</div>

		<div class="footer">

			<van-cell :title="order_detail_0008+'：'" :value="orderInfo.createDate || order_detail_0009" />
			<van-cell :title="order_detail_0010" :value="pay_type" />
			<!-- <van-cell :title=this.countStr
                :value='order_detail_0027+":"+goods[0].price' /> -->
			<van-cell :title=this.countStr>
				<p class="total-info">{{order_detail_0027}} <span>{{orderInfo.price}}</span></p>
			</van-cell>
		</div>
		<!-- test -->
		<!-- <div>1111{{goods[0].price}}</div> -->
		<!--  暂不支持取消订单-->
		<!-- <div class="affix-bar">
      <div class="affix-bar__bar">
        <div class="affix-bar__inner" v-if="orderInfo.status == 0 || orderInfo.status == 1">
          <van-button class="ml5" plain size="small" type="default" @click="onCancelOrder">取消订单</van-button>
        </div>
      </div>
    </div> -->
	</div>
</template>

<script>
	var backArrow =  require('../../assets/back-arrow.png');
	import {
		Tab,
		Tabs,
		Card,
		Panel,
		List,
		Step,
		Steps,
		Rate,
		Field
	} from 'vant'
	import clipboard from '@/common/clipboard'
	import {
		storage
	} from '@/common/util'
	export default {
		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Card.name]: Card,
			[Panel.name]: Panel,
			[List.name]: List,
			[Step.name]: Step,
			[Steps.name]: Steps,
			[Rate.name]: Rate,
			[Field.name]: Field,
		},
		data() {
			return {
				extJson: {}, // 扩展对象
				marketing: {},
				steps: [this.$t('order_detail.order_detail_0034'), this.$t('order_detail.order_detail_0035'), this.$t(
					'order_detail.order_detail_0036')],
				orderInfo: {},
				goods: [],
				logistics: {},
				active: 1,
				hasSteps: false,
				visible: false,
				rateValue: 5,
				// reputation:2,   // 0 差评 1 中评 2 好评
				rateRemark: '', // 评价备注，限200字符
				closeTime: 0,
				countStr: "",
				priceStr: "",
				express: {},
				currency: "",
				pay_type: "",
				order_detail_0027: this.$t('order_detail.order_detail_0027'),
				order_detail_0010: this.$t('order_detail.order_detail_0010'),
				order_detail_0008: this.$t('order_detail.order_detail_0008'),
				order_detail_0006: this.$t('order_detail.order_detail_0006'),
				order_detail_0003: this.$t('order_detail.order_detail_0003'),
				order_detail_0007: this.$t('order_detail.order_detail_0007'),
				order_detail_0009: this.$t('order_detail.order_detail_0009'),
				addChannelBar: true,
				backArrow:backArrow,
				noExpresSta:"- -",
			}
		},
		computed: {

		},
		created() {
			var addChannel = storage.get("addChannel")
			if (addChannel === 'app') {
				this.addChannelBar = false;
			}
			this.getOrderDetail(this.$route.query.bill_no)
		},
		methods: {
			formatPrice(price) {
				return parseFloat(price).toFixed(2)
			},
			onShowPopup() {
				this.visible = !this.visible
			},

			back() {
				this.$router.go(-1); //返回上一层
			},
			onCancelOrder() {
				this.$dialog.confirm({
					// title: '提示',
					message: this.$t("order_detail.order_detail_0012"),
					cancelButtonText: this.$t("order_detail.order_detail_0013"),
					confirmButtonText: this.$t("order_detail.order_detail_0014")
				}).then(() => {
					// on confirm
					this.$toast.loading({
						mask: true,
						message: this.$t("order_list.order_list_0016"),
						duration: 0,
					})
					this.$request.post('/order/cancel_order', {
						bill_no: this.orderInfo.bill_no
					}).then(res => {
						if (res.status == "1") {
							this.$toast({
								message: this.$t("order_detail.order_detail_0016"),
								duration: 1500
							})
						} else {
							this.$toast({
								message: res.msg,
								duration: 1500
							})
						}
						this.$router.go(-1)
					})
				}).catch(() => {
					// on cancel
				});
			},
			getOrderDetail(bill_no) {
				var that = this;
				this.$request.get('/order/buyer/detail', {
					bill_no: bill_no
				}).then(res => {

					if (res.status !== "1") {
						this.$toast(res.msg);
						return;
					}
					//console.log("res:", JSON.stringify(res));
					this.order = res.data.sub_order[0].item;
					this.express = res.data.express[0];
					this.orderInfo.bill_no = res.data.bill_no;
					this.orderInfo.price = res.data.price;
					this.orderInfo.remark = res.data.remark;
					console.log(res.data)
					this.pay_type = res.data.pay_type;
					if (this.pay_type == "") {
						this.pay_type = this.$t('order_detail.order_detail_0037');
					}
					if (this.order.length) {
						for (let p in this.order) {
							this.goods.push({
								"goods_id": this.order[p].goods_id,
								"count": this.order[p].count,
								"goods_name": this.order[p].goods_name,
								"sku_name": this.order[p].sku_name,
								"price": this.order[p].goods_price,
								"icon": this.order[p].goods_icon,
								"title": this.order[p].title,
							});
						}
					}
					console.log("this.goods: " + JSON.stringify(this.goods))

					this.price = this.price;
					this.count = this.count;

					let status = res.data.status;
					let statusStr = "";
					if (status) {
						this.orderInfo.status = status;
						if (status == 0) {
							statusStr = this.$t("order_detail.order_detail_0018");
						} else if (status == 1) {
							statusStr = this.$t("order_detail.order_detail_0019");
						} else if (status == 2) {
							statusStr = this.$t("order_detail.order_detail_0020");
						} else if (status == 3) {
							statusStr = this.$t("order_detail.order_detail_0021");
						} else if (status == 4) {
							statusStr = this.$t("order_detail.order_detail_0022");
						} else if (status == 5) {
							statusStr = this.$t("order_detail.order_detail_0023");
						} else if (status == 6) {
							statusStr = this.$t("order_detail.order_detail_0024");
						} else if (status == 7) {
							statusStr = this.$t("order_detail.order_detail_0025");
						} else if (status == 99) {
							statusStr = this.$t("order_detail.order_detail_0026");
						}
					}
					this.orderInfo.statusStr = statusStr;
					this.orderInfo.createDate = this.timestampToTime(res.data.create_time / 1000);
					this.orderInfo.count = res.data.goods_num;
					this.countStr = this.$t("order_detail.order_detail_0027") + res.data.goods_num + this.$t(
						"order_detail.order_detail_0028");
					this.priceStr = this.orderInfo.price;
					console.log("priceStr:", this.priceStr);

					if (!this.express) {
						this.express = {};
					}
					this.express.name = res.data.name;
					this.express.mobile = res.data.mobile_area + " " + res.data.mobile;
					this.express.address = res.data.address;

				})
			},
			handleClipboard(text, event) {
				clipboard(text, event)
			},
			timestampToTime(timestamp) {
				var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = date.getDate() + ' ';
				var h = date.getHours() + ':';
				var m = date.getMinutes() + ':';
				var s = date.getSeconds();
				return Y + M + D + h + m + s;
			}
		}
	}
</script>

<style lang="less" scoped>
	.color-red {
		color: #f44 !important;
	}

	.container {
		padding-bottom: 100px;
	}

	//
	.header {
		min-height: 80px;
		padding: 0 5px;
		background: #fff;

		&-title {
			font-size: 14px;
			color: #333;
		}

		&-txt {
			font-size: 12px;
			color: #979797;
		}

		&-hd {
			display: flex;
			align-items: center;
			padding: 10px 10px 0;
		}

		&-media {
			display: inline-block;
			padding: 5px 5px;
			background: #00c062;
			border-radius: 4px;
			margin-right: 10px;

			/deep/ .van-icon {
				font-size: 32px;
				vertical-align: top;
				color: #fff;
			}
		}

		&-media-gray {
			background: #c9c9c9;
		}
	}

	//
	.address-box {
		position: relative;
		box-sizing: border-box;
		min-height: 60px;
		// display: flex;
		// justify-content: flex-start;
		// align-items: center;
		padding: 8px 15px;
		background: #FFFFFF;
		box-shadow: 0 0 4px 0 rgba(223, 223, 223, 0.50);
		border-radius: 4px;
		margin: 0 8px;
		// margin-top: -3.6rem;
		margin-top: 12px;

		&-hd {
			flex: 1;
			// padding:0 10px;
			padding-left: 20px;
		}

		&-bd {
			margin-top: 10px;
			padding: 10px 15px 5px;
			font-size: 14px;
			color: #333;
		}

		&-inner {
			position: relative;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			&-icon {
				position: absolute;
				top: 2px;
				left: -20px;
			}

			&-title {
				font-size: 14px;
				color: #333;
				font-weight: bold;
				margin-bottom: 10px;
			}

			&-bottom {
				font-size: 12px;
				color: #999;
			}
		}

		// 彩条底边
		// &:before {
		//   position: absolute;
		//   right: 0;
		//   bottom: 0;
		//   left: 0;
		//   height: 2px;
		//   background: -webkit-repeating-linear-gradient(
		//     135deg,
		//     #ff6c6c 0,
		//     #ff6c6c 20%,
		//     transparent 0,
		//     transparent 25%,
		//     #1989fa 0,
		//     #1989fa 45%,
		//     transparent 0,
		//     transparent 50%
		//   );
		//   background: repeating-linear-gradient(
		//     -45deg,
		//     #ff6c6c 0,
		//     #ff6c6c 20%,
		//     transparent 0,
		//     transparent 25%,
		//     #1989fa 0,
		//     #1989fa 45%,
		//     transparent 0,
		//     transparent 50%
		//   );
		//   background-size: 80px;
		//   content: "";
		// }
	}

	.address-card {
		position: relative;
		padding: 10px 15px;
		align-items: center;

		&:before {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			height: 2px;
			background: -webkit-repeating-linear-gradient(135deg,
				#ff6c6c 0,
				#ff6c6c 20%,
				transparent 0,
				transparent 25%,
				#1989fa 0,
				#1989fa 45%,
				transparent 0,
				transparent 50%);
			background: repeating-linear-gradient(-45deg,
				#ff6c6c 0,
				#ff6c6c 20%,
				transparent 0,
				transparent 25%,
				#1989fa 0,
				#1989fa 45%,
				transparent 0,
				transparent 50%);
			background-size: 80px;
			content: "";
		}
	}

	.address-card .van-cell__left-icon {
		color: #1989fa;
		font-size: 40px;
	}

	.address-card .van-cell__title {
		line-height: 40px;
	}

	//
	.cell-group {
		box-sizing: border-box;
		padding: 10px 0;
		background: #fff;
	}

	.cell {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 12px;
		color: #555;
		line-height: 20px;
		padding-left: 15px;
		padding-right: 15px;
		background: #fff;

		&-hd {}

		&-bd {
			flex: 1;
			text-align: right;
		}
	}

	//
	.footer {
		margin: 0.1rem 8px;
		background: #FFFFFF;
		box-shadow: 0 0 4px 0 rgba(223, 223, 223, 0.50);
		border-radius: 2px;
		.van-cell:not(:last-child)::after{
			border-bottom: 0;
		}
		.van-cell:nth-of-type(1){
			border-bottom: 1px solid #ebedf0;
		}
		.van-cell:nth-of-type(2){
			padding-bottom: 0;
			padding-top: 15px;
			line-height: 1;
		}
		.van-cell:nth-of-type(3){
			padding-bottom: 18px;
			padding-top: 13px;
			line-height: 1;
		}
	}

	.footer-p {
		font-size: 12px;
		line-height: 20px;
		color: #999;
	}

	.card-button {
		display: inline-block;
		margin-right: 10px;
		font-size: 12px;
		padding: 4px 12px;
		border-radius: 20px;
		color: #666;
		border: 1px solid #b9b9b9;
	}

	.card-button-danger {
		color: #f44;
		border: 1px solid #f44;
	}

	.card-button:active {
		opacity: 0.8;
	}

	//
	.popup {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		min-height: 300px;

		&-close {
			position: absolute;
			top: 10px;
			right: 15px;
			z-index: 20;
			color: #969799;
			font-size: 20px;
			text-align: center;
		}

		&-body {
			width: 100%;
			flex: 1;
		}

		&-title {
			font-size: 16px;
			text-align: center;
			padding: 10px 0;
		}

		&-bottom {
			width: 100%;
		}

		.rate-box {
			padding: 0px 15px;
			margin-bottom: 30px;
		}
	}

	.panel-actions {
		text-align: right;

		.van-button {
			margin-left: 10px;
		}
	}

	.affix-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		background-color: #fff;
		user-select: none;

		&__bar {
			// padding:0 15px;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 50px;
			font-size: 14px;
		}

		&__button {
			// width: 100%;
			// height: 50px;
			// line-height: 48px;
		}

		&__left {
			max-width: 110px;
		}

		&__inner {
			padding-right: 15px;
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}

	#left {
		float: left;
		color: #979A9F;
	}

	#right {
		float: right;
		.van-button--default{
			color: #979A9F;
		}
		//display: inline;
	}

	.head-status {
		// width: 100%;
		// height: 267px;
		box-sizing: border-box;
		padding: 15px 0 0 16px;
		background-image: linear-gradient(0deg, rgba(238, 240, 255, 0.00) 26%, #CCD8ED 99%);
	}

	.distributing {
		font-size: 22px;
		color: #414961;
		letter-spacing: 0;
		font-weight: 500;
		margin-left: 0.18rem;
		margin-top: 0.28rem;

	}

	.address-box-inner {
		position: relative
	}

	.logistics-info {
		margin-top: 15px;
		border-top: 1px dotted #CED0D7;

		.van-cell:not(:last-child)::after {
			border: 0;
		}

		.van-cell {
			padding: 11px 0 0 0;
			font-size: 12px;
			color: #979A9F;
			letter-spacing: 0;
			line-height: 1.2;
			.van-cell__title {
				font-size: 12px;
				color: #979A9F;
				letter-spacing: 0;

				span {
					font-size: 12px;
					color: #979A9F;
					letter-spacing: 0;
				}
			}
		}

		.van-cell:nth-of-type(2){
			// color: #979A9F;
			// padding-bottom: 0.36rem;
    		padding-top: 0.26rem;
			
		}
	}

	.van-hairline--top-bottom::after,
	.van-hairline-unset--top-bottom::after {
		border: 0;
	}

	.order-goods-info {
		background: #FFFFFF;
		box-shadow: 0 0 4px 0 rgba(223, 223, 223, 0.50);
		border-radius: 4px;
		margin: 10px 8px 0 8px;
		.van-card__content{
			justify-content: flex-end;
			.van-card__title{
				position: absolute;
				top: 0;
			}
			.van-card__bottom{
				.van-card__price{
					color: #F13333;
				}
			}
		} 
		.van-panel__header {
			padding: 0;
		}

		.van-cell:not(:last-child)::after {
			left: 0;
			border-bottom: 1px solid #E5E5E5;
		}

		.van-card {
			background-color: #ffffff;
		}
	}

	.van-cell {
		.van-cell__title {
			span {
				font-size: 12px;
				color: #979A9F;
				letter-spacing: 0;
			}
		}
	}
	.van-cell__value{
		color:#414961;
	}
	.total-info {
		span {
			font-size: 12px;
			color: #F13333;
			letter-spacing: 0;
			text-align: right;
			line-height: 17px;
		}
	}
    // .order-detail-style .van-card__bottom{
	// 	position: absolute;bottom:0px;width:100%;
	// }
	.address-box-inner-bottom{
		color:#414961;
	}
	
	.order-detail-style{
		.van-card{
			// border-bottom:solid 1px #E5E5E5;
		}
		.van-card:not(:last-child)::after {
			position: absolute;
			box-sizing: border-box;
			content: ' ';
			pointer-events: none;
			right: 0;
			bottom: 0;
			left: 0;
			border-bottom: 1px solid #E5E5E5;
			-webkit-transform: scaleY(.5);
			transform: scaleY(.5);
		}
		.van-card:not(:first-child){
			margin-top:0px;padding:0.32rem;
		}	
		.van-card:last-child{
			border-bottom:none;
		}
		.van-cell-slele{
			line-height: 0.4rem;padding: 0rem 0.32rem 0.32rem;font-size: 12px;color: #414961;
			display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;
		}
	}
	.address-icon-sly{
		position: absolute;
		width: 22px;
		height: 22px;
		left: -28px;
	}
	.address-box-hd{
		padding-left: 0.5rem;
	}
	.address-box-sly-top{
		padding: 0.32rem 0.36rem;
	}
</style>

