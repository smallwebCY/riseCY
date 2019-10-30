<template>
	<div class="contaienr">
		<!-- <div>
      <van-icon name="arrow-left" size="2em" @click="back"/>
    </div> -->
		<!-- <van-nav-bar
        left-arrow
        :title = "order_list_0014"
        :border = false
        @click-left="onClickLeft"
    /> -->
		<!-- 订单列表缺省 -->
		<div v-if="records_total" class="none-order">
			<div class="none-order-inner">
				<img :src="noneOrderlist" alt="">
				<p>{{order_list_0008}}</p>
			</div>
		</div>
		<!-- <p>{{ $route.meta.title}}</p> -->
		<!-- 订单列表 -->
		<van-list v-else v-model="loading" :finished="finished" :finished-text="finishedTxt" @load="onListLoad">
			<div class="list-item list-bill-style" v-for="item in list" :key="item.bill_no">
				<van-panel class="panel" :title="order_list_0001" :desc="item.bill_no" :status="item.status_name">
					<div>
						<router-link :to="{path:'order-detail', query: {bill_no:item.bill_no}}">
							<van-card :num="item.count" :price="item.goods_price" :desc="item.sku_name" :title="item.goods_name" :thumb="item.icon"
							 :currency="currency" />
							<div class="card-load-more van-hairline--bottom" v-if="item.goods_num>1">{{ $t('order_list.order_list_0002') + item.goods_num + $t('order_list.order_list_0003')}}</div>
						</router-link>
						<div class="panel-money">{{$t('order_list.order_list_0004')+item.goods_num +$t('order_list.order_list_0005') }}
							<span class="ui-c-red fz16">{{item.order_price}}</span>
						</div>
					</div>
					<!-- 货到付款 取消订单暂不开放 -->
								<!-- <div slot="footer" class="panel-actions" v-if="item.status == 0 || item.status == 1">
						<div class="panel-button" @click="onCancelOrder(item.bill_no)">取消订单</div>
					  </div> -->
				</van-panel>
			</div>
		</van-list>
	</div>
</template>

<script>
	var noneOrderlist = require('@/assets/none-orderlist.png');
	import {
		Tab,
		Tabs,
		Card,
		Panel,
		List,
		Loading,
		NavBar
	} from 'vant'

	export default {
		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Card.name]: Card,
			[Panel.name]: Panel,
			[List.name]: List,
			[Loading.name]: Loading,
			[NavBar.name]: NavBar,
		},
		data() {
			return {
				goodsMap: {},
				list: [],
				page: 1,
				pageSize: 10,
				loading: false,
				finished: false,
				finishedTxt: this.$t('order_list.order_list_0007'),
				currency: "",
				order_list_0008: this.$t('order_list.order_list_0008'),
				order_list_0014: this.$t('order_list.order_list_0014'),
				records_total: false,
				noneOrderlist: noneOrderlist,
				order_list_0001: this.$t('order_list.order_list_0001')
			}
		},
		created() {},
		methods: {
			onClickLeft() {
				this.$router.push("/user");
			},
			onListLoad() {
				this.getOrderList(this.page++, this.pageSize);
			},
			getOrderList(page = this.page, pageSize = this.pageSize) {
				const params = {
					current_page: page,
					page_size: pageSize,
					shop_url: window.location.href,
					// shop_id: '1',
				}
				this.$request.get('/order/buyer/list', params).then(res => {
					console.log(res);
					if (res.status == 0) {
						this.loading = false
						this.finished = true
						this.finishedTxt = page > 1 ? this.$t('order_list.order_list_0007') : this.$t('order_list.order_list_0008')
						if (page === 1) {
							console.log(page);
							this.list = [];
							this.records_total = true;
						}
						return;
					}
					if (res.status != 1) {
						this.$toast(res.msg)
						return;
					}
					let list = res.data;
					//console.log("list:", JSON.stringify(list));
					this.list = this.list.concat(list);
					this.loading = false;
					if (this.list.length <= 0) {
						this.records_total = true;
					}
					if (list.length <= 0) {
						this.finished = true;
					}
					this.finishedTxt = this.$t('order_list.order_list_0007')
				})
			},
			onCancelOrder(bill_no) {
				this.$dialog.confirm({
					// title: '提示',
					message: this.$t('order_list.order_list_0009'),
					cancelButtonText: this.$t('order_list.order_list_0010'),
					confirmButtonText: this.$t('order_list.order_list_0011')
				}).then(() => {
					// on confirm
					this.$toast.loading({
						mask: true,
						message: this.$t('order_list.order_list_0016'),
						duration: 0,
					})
					this.$request.post('/order/cancel_order', {
						"bill_no": bill_no
					}).then(res => {
						console.log(`/order/cancel_order：${JSON.stringify(res)}`)
						this.$toast({
							message: this.$t('order_list.order_list_0013'),
							duration: 1500
						})
						// this.getOrderList(this.tabs[this.active].status)
						this.list.splice(this.list.findIndex(item => item.bill_no == bill_no), 1)
					})
				}).catch(() => {
					// on cancel
				});
			},
			back() {
				this.$router.go(-1); //返回上一层
			},
		}
	}
</script>

<style lang="less" scoped>
	.list-item {
		margin: 10px 8px;
		background: #FFFFFF;
		box-shadow: 0 0 4px 0 rgba(223, 223, 223, 0.50);
		border-radius: 4px;

		.van-card {
			background-color: #ffffff;
		}
	}

	.card-load-more {
		font-size: 14px;
		color: #F13333;
		padding: 5px;
		line-height: 28px;
		text-align: center;
	}

	.panel {
		.van-panel__header{
			.van-panel__header-value{
				color: #F13333;
			}
			.van-cell__label{
				color: #323233;
    			font-size: 14px;
			}
		}
		.van-panel__content{
			.van-card__content{
				justify-content: flex-end;
				.van-card__title{
					position: absolute;
					top: 0;
				}
			}
			.van-card__price{
				color: #F13333;
			}
			.panel-money{
				.ui-c-red{
					color: #F13333;
				}
			}
		}
		.van-panel__header-value {
			flex: none;
		}

		&-money {
			padding: 10px 15px;
			font-size: 14px;
			color: #333;
			text-align: right;
		}

		&-actions {
			text-align: right;
		}

		&-button {
			display: inline-block;
			margin-right: 10px;
			font-size: 12px;
			padding: 4px 12px;
			border-radius: 20px;
			color: #666;
			border: 1px solid #b9b9b9;
		}

		&-button-danger {
			color: #f44;
			border: 1px solid #f44;
		}

		&-button::active {
			opacity: 0.8;
		}
	}

	.no-data .van-loading__spinner {
		display: none;
	}

	.van-nav-bar .van-icon {
		color: #323233;
		font-size: 20px;
	}

	.none-order-inner {
		margin-top: 140px;

		img {
			width: 200px;
			display: block;
			margin: 0 auto;
			background: transparent !important;
		}

		p {
			text-align: center;
			font-size: 14px;
			color: #979A9F;
			letter-spacing: 0;
		}
	}
</style>
<style>
	.list-bill-style .van-card__bottom {
		/* position: absolute;
		bottom: 0px;
		width: 100%; */
	}
	.van-cell:not(:last-child)::after{
		left: 0;
	}
</style>
