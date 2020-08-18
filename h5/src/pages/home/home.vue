<template>
	<div class="container pd50">
		<p>aaaa</p>
		<cybutton username="cupcup"></cybutton>
		<div class="store">
			<van-row type="flex" align="center" class="row" gutter="0">
				<van-col>
					<!-- <van-image round width="0.8rem" height="0.8rem" fit="cover" src = "https://img.yzcdn.cn/vant/cat.jpeg" /> -->
					<van-icon size='0.8rem' :name="tabbarIcon.logoUrl" />
				</van-col>
				<van-col class="store-name">{{storeName}}</van-col>
			</van-row>
			<van-search v-model="value" :placeholder="order_search_0008" background="none" :left-icon='serchLeftIcon' @click="onSearch">
			</van-search>
		</div>
		<div class="main">
			<div class="list goods-info">
				<van-row>
					<van-list ref="list" v-model="loading" :finished="finished" :immediate-check="false" :finished-text="order_list_0015"
					 :loading-text="order_list_0016" error-text="fail" @load="onLoad">
						<van-cell v-for="arr in products">
							<van-col span="12" v-for="item in arr.item" class="goods-info-col">
								<div class="list-item" @click="onDetailClick(item.id)">
									<img class="list-item-img" :src="item.main_img" :alt="item.name">
									<div class="list-item-hd van-ellipsis">{{item.name}}</div>
									<div class="list-item-bd"><span class="ui-c-red">{{item.price}}</span></div>
								</div>
							</van-col>
						</van-cell>
					</van-list>
				</van-row>
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
    import cybutton from 'cy-button'
	var Mock = require('mockjs')
	var data = Mock.mock({
		// 属性 list 的值是一个数组，其中含有 1 到 10 个元素
		'list|1-10': [{
			// 属性 id 是一个自增数，起始值为 1，每次增 1
			'id|+1': 1
		}]
	})
	var jud = Mock.mock({
		"boolean|1-2": true
	})
	var dnum = Mock.mock({
	"number|+1": 202   // 初始值为2
	})
	var dotnum =  Mock.mock('@natural')
	// 
	console.log(dotnum)
	var logo = require('../../assets/logo.png');
	var homeIcon = require('../../assets/home_icon_active.png');
	var carIcon = require('../../assets/car_icon.png');
	var userIcon = require('../../assets/user_icon.png');
	var serchLeftIcon = require('../../assets/serch-left-icon.png');
	import {
		Tabbar,
		TabbarItem,
		Swipe,
		SwipeItem,
		Search,
		Image,
		Row,
		Col,
		Icon,
		List,
		Toast
	} from 'vant'

	// import util from '@/common/util'
	import {
		storage
	} from '@/common/util'
	export default {
		components: {
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
			[Swipe.name]: Swipe,
			[SwipeItem.name]: SwipeItem,
			[Search.name]: Search,
			[Image.name]: Image,
			[Row.name]: Row,
			[Col.name]: Col,
			[Icon.name]: Icon,
			[List.name]: List,
			cybutton:cybutton,
		},
		data() {
			return {
				active: 0,
				image: '',
				value: '',
				products: [],
				fetchSize: 0,
				page: 1,
				pageSize: 10,
				total: '',
				loading: false,
				finished: false,
				storeName: '', // 店铺名称
				tabbarIcon: {
					homeIcon: homeIcon,
					carIcon: carIcon,
					userIcon: userIcon,
					logoUrl: logo, // logo 路径
				},
				serchLeftIcon: serchLeftIcon,
				order_list_0015: this.$t('order_list.order_list_0015'),
				order_search_0001: this.$t('order_search.order_search_0001'),
				order_search_0002: this.$t('order_search.order_search_0002'),
				order_search_0003: this.$t('order_search.order_search_0003'),
				order_search_0004: this.$t('order_search.order_search_0004'),
				order_search_0005: this.$t('order_search.order_search_0005'),
				order_search_0006: this.$t('order_search.order_search_0006'),
				order_search_0007: this.$t('order_search.order_search_0007'),
				order_search_0008: this.$t('order_search.order_search_0008'),
				order_list_0016: this.$t('order_list.order_list_0016'),
			};
		},
		created() {
			let queryCid = this.QueryCid();
			storage.set("cid", queryCid);
			storage.remove("shopUrl");
			//storage.remove("addChannel");//移除app内打开的表示 下面方法重新添加
			this.getGoodsList(); // 查询第一页
			//console.log(document.title)
			this.judApp();
		},
		methods: {
			onSearch() {
				this.$router.replace({
					path: '/search'
				})
			},
			onLoad() {
				this.loading = true;
				this.page += 1;
				this.getGoodsList();	
			},
			getGoodsList() {
				// window.location.href
				this.$request.get('/goods/list', {
					sid: storage.get('sid'),
					current_page: this.page,
					page_size: this.pageSize,
					with_shop_info: '1',
					shop_url: window.location.href, // 需要修改
					// shop_id: '1', // 需要修改
					status: '1'
				}, {}).then(res => {
					console.log(res);
					if (res.status === '1') {
						console.log("sid:", storage.get("sid"));
						this.storeName = res.data.shop_info.name;
						this.logoUrl = res.data.shop_info.logo_url;
						this.total = res.records_total || 0;
						let shopUrl = res.data.shop_info.url;
						storage.set("shopUrl", shopUrl);
						this.handleData(res.data);
						console.log(res.data);
					} else {
						Toast(res.msg);
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

						//debugger
						//if (products.length >1){
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
						/*} else {
						    let item = [];
						    item[0] = products[k];
						    k++;
						    let obj = {};
						    obj.item = item;
						    obj.id =  item[0].id ;
						    productArr.push(obj);
						}*/
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
			judApp() {
				// this.$router.push({ path: '/home', query: { add_channel:"app", a: "aaa" }})
				let addChannel = this.$route.query.add_channel || 'H5';
				storage.set("addChannel", addChannel)
			},
			Uuid(){
				//生成uuid
				function S4() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}
				return [(S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())];
			},
			QueryCid(){
				//生成cid
				var parseCid = this.$route.query.cid;   
				var parseClient = this.$route.query.client;
				if(parseClient==undefined){
					return false;
				}
				var uuid = this.Uuid();
				uuid = uuid[0].toString();
				if(parseClient == '1'){
					if(parseCid==undefined||parseCid==null||parseCid==""){
						parseCid = "";
					}
					return parseCid;
				}else{
					var storageKey = localStorage.getItem("uuid");
					if(storageKey==""||storageKey==null){
						localStorage.setItem("uuid","uuid:"+uuid);
					}
					return localStorage.getItem("uuid");
				}	
			}
		}
	}
</script>
<style lang="less" scoped>
	div{
		clear: both;
		zoom: 1;
	}
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
				background-color: #F13333;
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
				span{
					color: #F13333;
				}
			}
		}

		&-item:nth-child(even) {
			// margin-left:
		}

	}

	.van-search {
		padding: 8px 0.24rem;

		.van-search__action {
			background: #F13333;
			color: #fff;
		}
	}

	.van-search--show-action {
		padding-right: 10px;
	}

	.store {
		position: relative;
		background: url(../../assets/homeTopimg.png) center no-repeat;
		background-size: 100% 100%;
		background-color: rgba(0, 0, 0, .4);
		left: 0;
		z-index: 9;
		top: 0;
		height: 122px;
		width: 100%;

		.row {
			position: relative;
			padding: 22px 12px 0 12px;

			.van-image {}

			.store-name {
				color: #fff;
				font-size: 16px;
				font-weight: bold;
				width: 100%;
				overflow: hidden;
				/*超出部分隐藏*/
				text-overflow: ellipsis;
				/* 超出部分显示省略号 */
				white-space: nowrap;
				/*规定段落中的文本不进行换行 */
				margin-left: 7px;
			}
		}
	}
</style>
<style>
	
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
