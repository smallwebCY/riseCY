<template>
	<div class="contaienr">
		<van-nav-bar v-if=addChannelBar left-arrow :title="fav_goods_002" :border=false @click-left="onClickLeft" >
		<van-icon :name="backArrow" slot="left" />
        </van-nav-bar>
		<template v-if="loadingSpinner">
			<van-loading type="spinner" size="24px" class="ui-center">{{fav_goods_007}}</van-loading>
		</template>
		<template v-else>
			<div class="list" v-if="list.length">
				<van-row gutter="10">
					<van-col span="12" v-for="item in list" :key="item.id">
						<div class="list-item">
							<!-- <p>{{item.status}}</p> -->
							<div class="down-cover" v-show="!item.status">
								<div class="down-cover-icon"><img src="../../assets/down-cover.png" alt=""></div>
							</div>
							<router-link :to="'/goods-detail?id='+item.shop_goods_id">
								<div class="list-item-thumb"><img :src="item.icon" alt=""></div>
								<div class="list-item-title mb10">{{item.title}}</div>
								<div class="list-item-actions">
									<div>
										<!-- <span class="symble"></span> -->
										<span>{{item.price}}</span>
									</div>
									<van-button plain size="mini" round type="danger">{{$t('fav_goods.fav_goods_009')}}</van-button>

								</div>
							</router-link>
						</div>
					</van-col>
				</van-row>
			</div>
			<div class="no-data" v-else>
				<!-- <van-loading text-size="16" class="ui-center">{{fav_goods_001}}</van-loading> -->
				<div class="none-fav">
					<div class="none-fav-inner">
						<img :src="noneFavGoods" alt="">
						<p>{{fav_goods_001}}</p>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	import {
		Loading,
		NavBar
	} from 'vant'
	var noneFavGoods = require('@/assets/no-favo.png');
	var backArrow =  require('../../assets/back-arrow.png');
	//import { storage, } from '@/common/util'
	import {
		storage
	} from '@/common/util'
	export default {
		components: {
			[Loading.name]: Loading,
			[NavBar.name]: NavBar,
		},
		data() {
			return {
				list: [],
				loadingSpinner: true,
				noneFavGoods: noneFavGoods,
				downCover: false,
				fav_goods_001: this.$t('fav_goods.fav_goods_001'),
				fav_goods_002: this.$t('fav_goods.fav_goods_002'),
				fav_goods_007: this.$t('fav_goods.fav_goods_007'),
				fav_goods_009: this.$t('fav_goods.fav_goods_009'),
				addChannelBar: true,
				backArrow:backArrow,
			}
		},
		created() {
			var addChannel = storage.get("addChannel")
			if (addChannel === 'app') {
				this.addChannelBar = false;
			}
			this.getFavList()
		},
		methods: {
			onClickLeft() {
				this.$router.push("/user");
			},
			getFavList() {
				this.loadingSpinner = true

				this.$api.userbase.user_get_favorite({}).then(res => {
					console.log(res.data)
					this.loadingSpinner = false
					if (res.status != 1) {
						return;
					}
					this.list = res.data
				})
				/* this.$request.get('/shop/goods/fav/list', { token: storage.get('token'), nameLike,page,pageSize }).then(res => {
				   this.loadingSpinner = false
				   if (res.code !== 0) {
				     return;
				   }
				   this.list = res.data
				 })*/
			},
		}
	}
</script>
<style>
	.van-button--mini {
		min-width: 1.6rem;
	}
</style>
<style lang="less" scoped>
	.no-data .van-loading__spinner {
		display: none;
	}

	.list {
		padding: 15px;
	}

	.list-item {
		overflow: hidden;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0px 2px 4px 2px rgba(228, 228, 228, 0.5);
		margin-bottom: 10px;
		padding: 20px 10px 15px 10px;
		position: relative;

		.down-cover {
			background: rgba(0, 0, 0, 0.5);
			border-radius: 2px;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			position: absolute;
			z-index: 1;

			.down-cover-icon {

				// height: auto;
				// position: relative;
				img {
					width: 72px;
					background: transparent !important;
					position: absolute;
					right: 8px;
					top: 14px;
				}
			}
		}

		&-title {
			// padding:0 15px;
			font-size: 12px;
			line-height: 15px;
			margin-top: 17px;
			color: #333;
			max-height: 0.64rem;
			font-weight: 500;
			line-height: 0.32rem;
			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			// margin-bottom: 5px;
		}

		&-thumb {
			font-size: 12px;
			color: #999;
			height: 0;
			overflow: hidden;
			width: 100%;
			padding-bottom: 100%;
		}

		&-actions {
			// padding:0 15px 5px;
			margin-top: 5px;
			font-size: 14px;
			color: #F13333;
			letter-spacing: -0.47px;
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.symble {
				margin-right: 10px;
			}

			// font-size: 12px;
			// text-align: right;
		}
	}

	.van-nav-bar .van-icon {
		color: #323233;
		font-size: 20px;
	}

	.none-fav-inner {
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
