<template>
	<div class="container pd50">
		<div>
			<van-row type="flex" align="center" class="back">
				<van-col span="1">
					<van-icon @click="backToHome" name="arrow-left" size="24px" />
				</van-col>
				<van-col span="24">
					<form action="/">
						<van-search @focus="onFocus" @blur="lossFocus" :left-icon="serchLeftIcon" v-model="keyword" :placeholder="order_search_0001"
						 @search="onSearch" id='searchId' />
					</form>
				</van-col>
				<!-- <van-col span="2" v-if="cancelFlg">
                    <p @click="onCancel" style=" font-size: 12px;">{{$t('order_search.order_search_0002')}}</p>
                </van-col> -->
			</van-row>
		</div>

		<van-divider :style="{margin: '0'}"></van-divider>
		<div v-if="showSort">
			<van-row type="flex" align="center" class="sort">
				<!-- <van-col span="3" :class="{ active_color:isActive }">
                    <div v-on:click="onFilterBar(0)">{{$t('order_search.order_search_0003')}}</div>
                </van-col> -->


				<van-col span="12">
					<div class="on">
						<a v-on:click="onFilterBar(1)" :class="{ active_color: !isActive }">{{$t('order_search.order_search_0007')}}
							<i v-bind:class="[angleTopClass,activeTopClass]"></i>
							<i v-bind:class="[angleBottomClass, activeBottomClass]"></i>
						</a>
					</div>
				</van-col>
				<van-col span="12" :class="{ active_color:isActive }">
					<div v-on:click="onFilterBar(0)">{{serch_goods_002}}</div>
				</van-col>
			</van-row>
			<div class="main serch-list">
				<!-- <div class="section-header common-h2" ></div> -->
				<div class="list goods-info">
					<van-row>
						<van-list ref="list" v-model="loading" :finished="finished" :immediate-check="false" :finished-text="serch_goods_003"
						 :loading-text="order_list_0016" error-text="fail" @load="onLoad">
							<van-cell v-for="(arr, index) in products" :key="index">
								<van-col span="12" v-for="(item, index) in arr.item" :key="index" class="goods-info-col">
									<div class="list-item" @click="onDetailClick(item.id)">
										<img class="list-item-img" :src="item.main_img" :alt="item.title">
										<!-- <div class="list-item-hd van-ellipsis">{{item.title}}</div> -->
										<div class="list-item-hd van-ellipsis">{{item.name}}</div>

										<div class="list-item-bd"><span class="ui-c-red">{{item.price}}</span></div>
									</div>
								</van-col>
							</van-cell>
						</van-list>
					</van-row>
				</div>
			</div>
		</div>

		<!-- <load-more tip="暂无数据" :loading="false"/> -->
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
		Swipe,
		SwipeItem,
		Search,
		Image,
		Divider,
		NavBar,
		Row,
		Col,
		Icon,
		List
	} from 'vant'

	import {
		storage,
		sessionStorage
	} from '@/common/util'
	var serchLeftIcon = require('../../assets/serch-left-icon.png');

	var homeIcon = require('../../assets/home_icon_active.png');
	var carIcon = require('../../assets/car_icon.png');
	var userIcon = require('../../assets/user_icon.png');
	export default {
		components: {
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
			[Swipe.name]: Swipe,
			[SwipeItem.name]: SwipeItem,
			[Search.name]: Search,
			[Image.name]: Image,
			[Divider.name]: Divider,
			[NavBar.name]: NavBar,
			[Row.name]: Row,
			[Col.name]: Col,
			[Icon.name]: Icon,
			[List.name]: List,
		},
		data() {
			return {
				page: 1,
				pageSize: 10,
				active: 0,
				products: [], // 搜索出的商品
				fetchSize: 0,
				cancelFlg: false,
				showSort: false, // 是否展示排序
				loading: false,
				finished: false,
				//keyword: this.$route.params.keyword  搜索关键字
				keyword: '', // 搜索关键字,
				sortField: '',
				sortOrder: '',
				isActive: true,
				total: '',
				angleTopClass: "angle_top",
				angleBottomClass: 'angle_bottom',
				isFocus: '',
				order_search_0001: this.$t('order_search.order_search_0001'),
				order_search_0002: this.$t('order_search.order_search_0002'),
				order_search_0003: this.$t('order_search.order_search_0003'),
				order_search_0004: this.$t('order_search.order_search_0004'),
				order_search_0005: this.$t('order_search.order_search_0005'),
				order_search_0006: this.$t('order_search.order_search_0006'),
				order_search_0007: this.$t('order_search.order_search_0007'),
				order_list_0015: this.$t('order_list.order_list_0015'),
				order_list_0016: this.$t('order_list.order_list_0016'),
				serchLeftIcon: serchLeftIcon,
				tabbarIcon: {
					homeIcon: homeIcon,
					carIcon: carIcon,
					userIcon: userIcon,
				},
				serch_goods_001: this.$t('serch_goods.serch_goods_001'),
				serch_goods_002: this.$t('serch_goods.serch_goods_002'),
				serch_goods_003: this.$t('serch_goods.serch_goods_003'),
			};
		},
		created() {
			// 暂时没有
		},
		mounted() {
			document.getElementById('searchId').focus(); // 获取焦点
		},
		computed: {
			activeTopClass: function() {
				return {
					angle_border_color: this.isFocus === '' ? true : !this.isFocus,
					angle_border_color_active: this.isFocus === '' ? false : this.isFocus,
				}
			},
			activeBottomClass: function() {
				return {
					angle_border_color: this.isFocus === '' ? true : this.isFocus,
					angle_border_color_active: this.isFocus === '' ? false : !this.isFocus,
				}
			}
		},
		methods: {
			onSearch(keyword) {
				// 设置 keyword
				this.keyword = keyword;
				this.showSort = true;
				// 查询
				this.getGoodsList(keyword, true);
			},
			onLoad() {
				this.page += 1;
				this.getGoodsList(this.keyword, false);
			},
			onFilterBar(value) {
				// 销量排序
				if (value == 0) {
					this.sortField = '';
					this.sortOrder = '';
					this.isFocus = '';
					this.isActive = true; // 字体颜色变化
					this.page = 1;
					this.getGoodsList(this.keyword, true, '');
				} else {
					// 价格排序
					this.sortField = 'sort_rule';
					this.isActive = false; // 字体颜色变化
					this.sortOrder = this.sortOrder == 'price_asc' ? 'price_desc' : 'price_asc';
					if (this.sortOrder == 'price_asc') {
						// 价格升序
						this.isFocus = false;
					} else {
						// 价格降序
						this.isFocus = true;
					}
					this.page = 1;
					this.getGoodsList(this.keyword, true, this.sortOrder);
				}
			},
			// 获取到焦点
			onFocus() {
				this.cancelFlg = true;
			},
			// 失去焦点
			lossFocus() {
				// this.cancelFlg = false;
			},
			// 取消
			onCancel() {
				document.getElementById('searchId').blur();
				this.$router.push({
					path: '/home'
				})
			},
			// 返回
			backToHome() {
				this.$router.replace({
					path: '/home'
				})
			},
			getGoodsList(keyword, restart, sortRule) {
				/* this.$request.post('/goods/list', {
				     kanjia: false,
				     pingtuan: false
				 }).then(res => {
				     if (restart) {
				         this.products = [];
				     }
				     this.handleData(page, res.data || []);
				 })*/
				this.$request.get('/goods/list', {
					sid: storage.get('sid'),
					current_page: this.page,
					page_size: this.pageSize,
					with_shop_info: '0',
					sort_rule: sortRule,
					keyword: keyword,
					shop_url: window.location.href, // 需要修改
					// shop_id: '1', // 需要修改
					status: '1'
				}).then(res => {
					console.log(res)
					if (restart) {
						this.products = [];
					}
					if (res.status === '1') {
						this.total = res.records_total || 0;
						this.handleData(res.data);
					}
				})
			},
			handleData(data) {
				this.loading = false;
				// 数据保存到 list 中
				let products = data.goods_list;
				let productArr = [];
				this.fetchSize += products.length;
				if (products && products.length > 0) {
					let k = 0;
					for (let i = 0, a = Math.ceil(products.length / 2); i < a; i++) {
						/* let item = [];
						 item[0] = products[k];
						 k++;
						 item[1] = products[k];
						 k++;
						 let obj = {};
						 obj.item = item;
						 obj.id =  item[0].id +"-" + item[1].id;
						 productArr.push(obj);*/
						/* if (products.length>1){
						     let item = [];
						     item[0] = products[k];
						     k++;
						     item[1] = products[k];
						     k++;
						     let obj = {};
						     obj.item = item;
						     obj.id =  item[0].id +"-" + item[1].id;
						     productArr.push(obj);
						 } else {
						     let item = [];
						     item[0] = products[k];
						     k++;
						     let obj = {};
						     obj.item = item;
						     obj.id =  item[0].id ;
						     productArr.push(obj);
						 }*/
						let item = [];
						item[0] = products[k];
						k++;
						if (k < products.length) {
							item[1] = products[k];
							k++;
						}
						let obj = {};
						obj.item = item;
						let cc = item[1] ? ("-" + item[1].id) : ""
						obj.id = item[0].id + cc;
						productArr.push(obj);
					}

				}
				this.products.push(...productArr);
				// 判断页数
				if (this.fetchSize >= this.total) {
					this.finished = true;
				}
			},
			onDetailClick(id) {
				this.$router.push({
					path: '/goods-detail',
					query: {
						id
					}
				})
			},
		}
	}
</script>
<style lang="less" scoped>
	.van-search__content ::-webkit-input-placeholder {
		color: #D6D6D6;
		font-size: 0.3rem;
	}

	.van-search__content :-moz-placeholder {
		color: #D6D6D6;
		font-size: 0.3rem;
	}

	.van-search__content ::-moz-placeholder {
		color: #D6D6D6;
		font-size: 0.3rem;
	}

	.van-search__content :-ms-input-placeholder {
		color: #D6D6D6;
		font-size: 0.3rem;
	}

	.home-swiper,
	.home-swiper img {
		width: 100%;
		height: 188px;
	}

	.common-h2 {
		background: none;
	}

	.list {
		padding-left: 5px;
		padding-right: 5px;

		.van-col {
			box-sizing: border-box;
			padding-left: 5px;
			padding-right: 5px;
			margin-bottom: 10px;

		}

		.van-cell {
			background-color: transparent;

			.van-cell__value {
				display: flex;

				.van-col {
					float: inherit;

					&:first-child {
						// margin-right: 13px;
					}

					.van-ellipsis {
						white-space: inherit;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						overflow: hidden;
						/*! autoprefixer: off */
						-webkit-box-orient: vertical;
					}
				}
			}
		}

		&-item {
			position: relative;
			text-align: left;
			overflow: hidden;
			background: #fff;

			// border-radius: 8px;
			// box-shadow: 0px 2px 4px 3px rgba(243, 243, 243, 0.5);
			&-tag {
				position: absolute;
				top: 15px;
				left: 0;
				background-color: #f44;
				display: inline-block;
				padding: 0.2em 0.5em;
				color: #fff;
				font-size: 10px;
				line-height: normal;
				border-radius: 0 0.8em 0.8em 0;
				padding-right: 0.6em;
			}

			&-img {
				display: block;
				width: 100%;
				height: 160px;
			}

			&-hd {
				padding: 10px 10px 0;
				font-size: 14px;
				color: #333;
				font-size: 14px;
				// margin-bottom: 5px;
			}

			&-ft {
				padding: 10px 10px;
				display: block;
				font-size: 14px;
			}

			&-bd {
				padding: 10px 10px;
				display: block;
				font-size: 14px;
				display: flex;
				justify-content: space-between;
			}
		}

		&-item:nth-child(even) {
			// margin-left:
		}

	}

	.van-search {
		.van-search__content--round {
			margin-right: 10px;
		}

		.van-search__action {
			background: #e93b3d;
			color: #fff;
		}
	}

	.van-search--show-action {
		padding-right: 10px;
	}

	.store {
		position: relative;
		background-size: 100% 100%;
		background-color: rgba(0, 0, 0, .4);
		left: 0;
		z-index: 9;
		top: 0;
		height: 80px;
		width: 100%;

		.row {
			position: absolute;
			padding: 12px 12px 12px 12px;

			.store-name {
				color: #fff;
				font-size: 15px;
				font-weight: bold;
				padding-left: 10px;
			}
		}
	}

	.divider {
		background: #fff;
	}


	.back {
		background: #fff
	}

	.sort {
		height: 35px;
		background: #fff;
		font-size: 12px;
		// margin-bottom: 10px;
		padding-left: 12px;

		.van-col--12 {
			display: flex;
			justify-content: center;
		}
	}

	.on {
		display: table-cell;
		position: relative;
		/*width: 100px;*/
		/*height: 40px;*/

		a {
			/*display: block;*/
			overflow: hidden;
			width: 100%;
			/*height: 40px;*/
			line-height: 30px;
			/*text-align: center;*/
			/*color: #5e5e5e;*/
		}
	}

	.angle_top {
		content: '';
		width: 0;
		height: 0;
		display: block;
		border-style: solid;
		border-width: 0 4px 5px;
		position: absolute;
		transform: rotate(180deg);
		bottom: 9px;
		left: 0.8rem;
	}

	.angle_bottom {
		content: '';
		width: 0;
		height: 0;
		display: block;
		border-style: solid;
		border-width: 0 4px 5px;
		position: absolute;
		top: 9px;
		left: 0.8rem;
	}

	.active_color {
		color: #F13333;
	}

	.angle_border_color {
		border-color: transparent transparent #979A9F;
	}

	.angle_border_color_active {
		border-color: transparent transparent #F13333;
	}
</style>
<style>
	.goods-info .van-row {
		padding: 6px 0;
	}

	.goods-info .van-list .van-cell {
		background-color: transparent;
		padding: 6px 2px;
	}

	.goods-info .van-cell__value--alone .van-col {
		margin-bottom: 0px;
		padding-left: 7px;
		padding-right: 7px;
	}

	.main .list .van-cell:not(:last-child)::after {
		border-bottom: 0px;
		padding-left: 6px;
		padding-right: 6px;
	}

	.goods-info .list-item-img {
		padding: 0.2rem 0.2rem 0;
		box-sizing: border-box;
		background: none;
	}

	.goods-info .list-item-hd {
		padding-top: 0.1rem;
		font-size: 12px;
		color: #333333;
	}

	.goods-info .list-item-bd {
		padding: 0rem 0.2rem 12px;
	}

	.goods-info .van-ellipsis {
		white-space: inherit;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
	}

	.goods-info .list-item-hd {
		height: 32px;
		line-height: 17px;
	}
</style>
