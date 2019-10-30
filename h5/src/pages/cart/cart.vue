<template>
	<div class="container pd100">
		<div class="goods-box" v-if="goods.length">
			<van-cell title="v-shop" icon="shop-o">
				<div slot="default" class="status-tip" @click="onStatusClicked">{{statusTip}}</div>
			</van-cell>

			<van-checkbox-group class="list" v-model="checkedGoods">
				<van-checkbox class="list-item item-cart-style" v-for="(item, index) in goods" :key="index" :name="item.cart_item_id" checked-color="#ff4444"
				 label-disabled>
					<van-card :title="item.title" :desc="item.value" :price="item.price | NumFormat" :thumb="item.icon" :currency="item.currency">
						<div slot="num">
							<van-stepper v-model="item.quantity" @change="onNumberChange(item.quantity, item.cart_item_id)" />
						</div>
					</van-card>

				</van-checkbox>
			</van-checkbox-group>
			<!-- 结算栏 -->
			<van-submit-bar v-if="statusTip === statusTip1" class="submit-bar" :price="totalPrice | NumFormat" :button-text="submitBarText"
			 :disabled="!checkedGoods.length" :currency="this.currency" :label="cart_0021" :decimal-length="0" @submit="onSubmit">
				<van-checkbox v-model="checked" @click="tap()">{{$t('cart.cart_0019')}}</van-checkbox>
			</van-submit-bar>
			<!-- 删除栏 -->
			<van-submit-bar v-else class="delete-bar" :button-text="cart_0020" :disabled="!checkedGoods.length" :currency="this.currency"
			 @submit="onDeleteClicked">
				<van-checkbox v-model="checked" @click="tap()">{{$t('cart.cart_0019')}}</van-checkbox>
			</van-submit-bar>
		</div>
		<!-- 缺省页 -->
		<div class="no-data" v-else>
			<img src="../../assets/no-cart.png" alt="">
			<div class="no-data-title">{{ cart_0003 }}</div>
			<!-- <div class="no-data-title">购物车快饿瘪了 T.T</div> -->
			<!-- <div class="no-data-txt">快给我挑点宝贝</div> -->
			<!-- <van-button class="no-data-btn"
        plain
        type="danger"
        @click="handleHomePage">去逛逛</van-button> -->
		</div>

		<!-- 底部导航栏 -->
		<van-tabbar route v-model="active" active-color="#f44">
			<van-tabbar-item replace to="/home" :icon=tabbarIcon.homeIcon>
				{{$t('user.menu_001')}}
			</van-tabbar-item>
			<van-tabbar-item replace to="/cart" :icon=tabbarIcon.carIcon>
				{{$t('user.menu_002')}}
			</van-tabbar-item>
			<van-tabbar-item replace to="/user" :icon=tabbarIcon.userIcon>
				{{$t('user.menu_003')}}
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	import {
		Tabbar,
		TabbarItem,
		Checkbox,
		CheckboxGroup,
		Card,
		Stepper,
		SubmitBar
	} from 'vant'
	import util from '@/common/util'
import { type } from 'os';
	var homeIcon = require('../../assets/home_icon.png');
	var carIcon = require('../../assets/car_icon_active.png');
	var userIcon = require('../../assets/user_icon.png');
	export default {
		components: {
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
			[Checkbox.name]: Checkbox,
			[CheckboxGroup.name]: CheckboxGroup,
			[Card.name]: Card,
			[Stepper.name]: Stepper,
			[SubmitBar.name]: SubmitBar,
		},
		data() {
			return {
				active: 0,
				statusTip: this.$t('cart.cart_0001'), // 管理,完成
				statusTip1: this.$t('cart.cart_0001'), // 管理,完成
				checkedAll: false,
				checkedGoods: [],
				goods: [],
				itemId: 0,
				currentUser: null,
				currency: "",
				userFlag: false,
				checkSingleFlag: false,
				cart_0003: this.$t('cart.cart_0003'),
				cart_0020: this.$t('cart.cart_0020'),
				cart_0021: this.$t('cart.cart_0021'),
				checked: false,
				tabbarIcon: {
					homeIcon: homeIcon,
					carIcon: carIcon,
					userIcon: userIcon,
				},
				illLive: true,
			}
		},
		computed: {
			submitBarText() {
				const count = this.checkedGoods.length
				return this.$t('cart.cart_0009') + (count ? `(${count})` : '')
			},
			totalPrice() {
				console.log(this.checkedGoods)
				let price = this.goods.reduce((total, item) => total + (this.checkedGoods.indexOf(item.cart_item_id) !== -1 ? item.price *
					item.quantity : 0), 0);
				let price_1 = price;
				// console.log(price_1)
				return price_1
			}
		},
	
		filters: {
			formatPoint(val) {
				return parseFloat((val * 100).toFixed(2))
			},
			NumFormat: function(value) {
				// console.log(1)
				// if (!value) return ''
				// console.log(2)
				let intPart = Number(value).toFixed(0) // 获取整数部分
				let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.') // 将整数部分逢三一断
				// console.log(intPartFormat)
				return intPartFormat

			}
		},
		watch: {
			checkedGoods() {
				if (this.checkedGoods.length != 0 && this.checkedGoods.length === this.goods.length) {
					this.checked = true
				} else {
					this.checked = false
				}
			},
		},
		created() {
			console.log(util.storage.get('cartInfo'));
			this.getCurrentUser();
			util.storage.remove('cartBuyInfo');
			//this.goods = util.storage.get('cartInfo') || [];
			//this.checkedGoods = this.goods.map(item => item.cart_item_id);

			// 处理页面回来保持选中状态
			let storage_checked_goods = util.storage.get('checked_goods');
			if (storage_checked_goods) {
				util.storage.remove('checked_goods'); //移除
				this.checkedGoods = storage_checked_goods;
			}
		},
		destroyed() {
			// 离开页面记录选中状态
			if (this.illLive) {
				util.storage.set("checked_goods", this.checkedGoods)
			}
		},
		methods: {
			
			getCurrentUser() {
				this.$request.get('/user/get_user').then(res => {
					console.log(`/user/get_user：` + res)
					if (res != null && res.status == 1) {
						this.currentUser = res.data;
					}
					this.getCurrentCartItem();
					// eslint-disable-next-line no-unused-vars
				}).catch(err => {
					this.getCurrentCartItem();
				})
			},

			onStatusClicked() {
				this.statusTip === this.$t('cart.cart_0001') ? this.statusTip = this.$t('cart.cart_0002') : this.statusTip = this.$t(
					'cart.cart_0001')
			},
			onDeleteClicked() {
				console.log(this.checkedGoods)
				this.$dialog.confirm({
					cancelButtonText: this.$t('cart.cart_0015'),
					confirmButtonText: this.$t('cart.cart_0022'),
					message: this.$t('cart.cart_0011') + `${this.checkedGoods.length}` + " " + this.$t('cart.cart_0012')
				}).then(() => {
					// console.log(1)
					this.goods = this.goods.filter(item => !(this.checkedGoods.indexOf(item.cart_item_id) !== -1));
					let sid = util.storage.get("sid");
					if (!sid) {
						this.checkedGoods = [];
						util.storage.set('cartInfo', this.goods);
						return;
					}
					if (this.currentUser) {
						this.deleteCartItem(this.checkedGoods.join(","));
						this.checkedGoods = [];
						//console.log("======>",this.checkedGoods)
					} else {
						this.checkedGoods = [];
						util.storage.set('cartInfo', this.goods);
					}
				}).catch(() => {
					// on cancel
				});
			},
			onNumberChange(val, cartItemId) {

				if (this.currentUser) {
					let params = {};
					params.cart_item_id = cartItemId;
					params.count = val;
					this.$request.post('/cart/modify_quantity', params).then(res => {
						console.log(`/modify_quantity：` + JSON.stringify(res));
						if (res.status != 1) {
							this.$toast({
								message: res.msg,
								duration: 1500
							})
						}
					})
				} else {
					util.storage.set('cartInfo', this.goods);
				}
			},
			onSubmit() {
				util.storage.set('cartBuyInfo', this.goods)
				//console.log("=======",this.checkedGoods)
				this.illLive = false; // 正常离开
				this.$router.push({
					path: '/order-submit',
					query: {
						redirect: this.$router.currentRoute.fullPath,
						type: 'cart',
						checkedGoods: this.checkedGoods
					}
				});
			},
			deleteCartItem(goodsIds) {
				let params = {
					cart_item_ids: goodsIds
				}
				this.$request.post('/cart/batch_delete', params).then(res => {
					if (res.status != 1) {
						this.$toast({
							message: res.msg,
							duration: 1500
						})
						return;
					}
					this.checkedGoods = []
					this.goods = [];
					this.getCurrentCartItem();

				})
				this.checkedGoods = []
			},
			getCurrentCartItem() {
				if (this.currentUser != null) {
					this.$request.get('/cart/get_cart').then(res => {
						console.log("get_cart res:", res);
						if (res != null && res.status == 1) {
							for (let i in res.data) {
								let cart = res.data[i];
								for (let j in cart.item_list) {
									let cartItem = cart.item_list[j];
									if (this.currency == '') {
										this.currency = cartItem.currency_symbol;
									}
									this.goods.push({
										"shop_id": cart.shop_id,
										"shop_name": cart.shop_name,
										"shop_url": cart.shop_url,
										"quantity": cartItem.quantity,
										"status": cartItem.status,
										"value": cartItem.value,
										"price": cartItem.price,
										"cart_item_id": cartItem.id,
										"currency": cartItem.currency_symbol,
										"icon": cartItem.icon,
										"title": cartItem.title,
										"sku_id": cartItem.sku_id,
										"goods_id": cartItem.goods_id,
									})
								}
							}
						} else {
							this.goods = util.storage.get('cartInfo') || [];
						}

						//util.storage.set("cartInfo", this.goods);
					})
				} else {
					//this.checkedGoods=[];
					this.goods = util.storage.get('cartInfo') || [];
					if (this.goods && this.goods.length) {
						this.currency = this.goods[0].currency;
					}
				}
			},
			tap() {
				if (this.checked) {
					this.checkedGoods = [];
				} else {
					this.checkedGoods = [];
					this.checkedGoods = this.goods.map(item => item.cart_item_id)
				}
			},
		}
	};
</script>
<style lang="less" scoped>
	.status-tip {
		position: relative;
		overflow: hidden;
		color: #38f;
		text-align: right;
		vertical-align: middle;
	}

	.list {
		padding: 10px 0;
		background-color: #fff;

		&-item {
			position: relative;

			.van-card {
				background-color: #fff;
			}

			/deep/ .van-checkbox__label {
				width: 100%;
				height: auto; // temp
				padding: 0 10px 0 15px;
				box-sizing: border-box;
			}

			/deep/ .van-checkbox__icon {
				top: 50%;
				left: 10px;
				z-index: 1;
				position: absolute;
				margin-top: -10px;
				font-size: 16px;
			}

			.van-card__price {
				color: #F13333;
			}

			.van-card__bottom {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
			}
		}
	}

	.delete-bar {
		.van-submit-bar__bar {
			margin-left: 10px;
			justify-content: space-between;
			align-items: center;
		}

		/deep/.van-checkbox__icon--checked .van-icon {
			background-color: #F13333;
			border-color: #F13333;
		}
	}

	.submit-bar {
		bottom: 50px;

		.van-checkbox {
			margin-left: 10px;
		}

		/deep/.van-checkbox__icon--checked .van-icon {
			background-color: #F13333;
			border-color: #F13333;
		}
	}

	.no-data {
		padding-top: 150px;
		text-align: center;

		>img {
			display: inline-block;
			width: 200px;
			margin-bottom: 20px;
			background: transparent !important;
		}

		&-title {
			font-size: 16px;
			color: #666;
			font-weight: 400;
			margin-bottom: 10px;
		}

		&-txt {
			font-size: 14px;
			color: #999;
			margin-bottom: 10px;
		}

		&-btn {
			padding: 0 20px;
			height: 34px;
			line-height: 32px;
		}	
	}
	.item-cart-style{
		.van-card__bottom{
			position: absolute;bottom:0px;width: 100%;
		}
		.address-box-inner-bottom{
			display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;
		}
	}
	.pd100{
		.van-cell:not(:last-child)::after{
			left: 0px;
		}	
	}
	.van-button--danger{
		background-color: #F13333;
    	border: 1px solid #F13333;
	}
</style>
