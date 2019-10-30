<template>
	<div class="container bgf login-out">
		<van-tabs v-model="current" type="card" class="my-tab" @change="changeImage">
			<van-tab :title="$t('login.login_026')">
				<van-field readonly clickable :label="login_022" :value="country" :confirm-button-text="login_023"
				 :cancel-button-text="login_024" :placeholder="login_008" @click="showPicker = true" :left-icon="showPicker?'arrow-up':'arrow-down'" />
				<van-popup v-model="showPicker" position="bottom">
					<van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
				</van-popup>
				<van-field v-model="mobile" clearable type="tel" :placeholder="login_003" />
				<van-cell-group>
					<van-field van-field v-model.trim="imageCode" clearable :placeholder="login_025">
					</van-field>
					<div class="divIdentifyingCode" @click="getIdentifyingCode(1)">
						<img id="imgIdentifyingCode1" style="" />
					</div>
				</van-cell-group>
				<van-field v-model="code" center clearable :placeholder="login_011">
					<van-button slot="button" size="small" :disabled="!!vcodeSend" plain type="danger" @click="handleCodeSend">{{vcodeText}}
					</van-button>
				</van-field>
				<van-field v-model="pwd" :placeholder="login_010" :type="showPwd?'text':'password'" :right-icon="showPwd?'eye-o':'closed-eye'"
				 @click-right-icon="changeIcon(showPwd)" />
				<!--<van-field v-model="invitationCode"
                           center
                           clearable
                           :placeholder="login_027">
                </van-field>
                -->
				<div class="btn-area btn-area-regist">
					<van-button type="danger" round size="large" :disabled=btnAreaRegist @click="formSubmit">{{$t('login.login_026')}}
					</van-button>
				</div>
			</van-tab>
			<van-tab :title="$t('login.login_001')">
				<van-field readonly clickable :label="login_022" :value="country" :placeholder="login_008" :confirm-button-text="login_023"
				 :cancel-button-text="login_024" @click="showPicker1 = true" :left-icon="showPicker?'arrow-up':'arrow-down'" />
				<van-popup v-model="showPicker1" position="bottom">
					<van-picker show-toolbar :columns="columns" :confirm-button-text="login_023" :cancel-button-text="login_024"
					 @cancel="showPicker = false" @confirm="onConfirm" />
				</van-popup>
				<van-field v-model="mobile" clearable type="tel" :placeholder="$t('login.login_003')" />
				<van-field v-model="pwd" :placeholder="login_005" :type="showPwd?'text':'password'" :right-icon="showPwd?'eye-o':'closed-eye'"
				 @click-right-icon="changeIcon(showPwd)" />
				<van-cell-group>
					<van-field van-field v-model.trim="imageCode" clearable :placeholder="login_019">
					</van-field>
					<div class="divIdentifyingCode" @click="getIdentifyingCode(2)">
						<img id="imgIdentifyingCode2" style="" />
					</div>
				</van-cell-group>
				<div class="btn-area btn-area-login">
					<van-button type="danger" round size="large" :disabled=btnAreaLogin @click="formSubmit">{{$t('login.login_001')}}
					</van-button>
				</div>
				<div class="forgotpw">
					<router-link to='/forgot'>{{$t('login.login_035')}}</router-link>
				</div>
			</van-tab>
		</van-tabs>
	</div>
</template>
<script>
	import {
		Field,
		Tab,
		Tabs,
		Notify,
		Picker
	} from 'vant'
	import {
		isPhone,
		isEmpty
	} from '@/common/validate'
	import util from '@/common/util'

	var vcodeTimer;
	export default {
		components: {
			[Field.name]: Field,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Notify.name]: Notify,
			[Picker.name]: Picker,
		},
		data() {
			return {
				current: 1, // 1登录,0注册
				mobile: '',
				pwd: '',
				country: '',
				code: '',
				vcodeSend: 0, // 0获取验证码,1验证码倒计时,
				vcodeText: this.$t('login.login_007'),
				hasLogin: false,
				showPicker: false,
				showPicker1: false,
				columns: ['Việt nam+84', 'Trung quốc+86', ],
				showPwd: false,
				invitationCode: '',
				imageCode: '',
				isRegister: true,
				login_008: this.$t('login.login_008'),
				login_022: this.$t('login.login_022'),
				login_011: this.$t('login.login_011'),
				login_023: this.$t('login.login_023'),
				login_024: this.$t('login.login_024'),
				login_003: this.$t('login.login_003'),
				login_025: this.$t('login.login_025'),
				login_019: this.$t('login.login_019'),
				login_010: this.$t('login.login_010'),
				login_027: this.$t('login.login_027'),
				login_005: this.$t('login.login_005'),
				token: '',
				btnAreaLogin: true,
				btnAreaRegist: true,
			};
		},
		created() {},
		mounted() {
			this.getIdentifyingCode(2);
		},
		computed: {
			address() {
				const {
					country,
					mobile,
					pwd,
					code,
					imageCode
				} = this
				return {
					country,
					mobile,
					pwd,
					code,
					imageCode

				}
			}
		},
		watch: {
			address: function() {
				// console.log(1)
				if (!isEmpty(this.country) && !isEmpty(this.mobile) && !isEmpty(this.pwd) && !isEmpty(this.imageCode)) {
					this.btnAreaLogin = false
				} else {
					this.btnAreaLogin = true
				}
				if (!isEmpty(this.country) && !isEmpty(this.mobile) && !isEmpty(this.pwd) && !isEmpty(this.imageCode) && !isEmpty(
						this.code)) {
					this.btnAreaRegist = false
				} else {
					this.btnAreaRegist = true
				}
			},
			btnAreaLogin: function() {
				// if (!isEmpty(this.country)){
				//     return false;
				// }
			},
			btnAreaRegist: function() {

			}
		},
		methods: {
			onConfirm(country) {
				console.log(country)
				this.country = country;
				this.showPicker = false;
				this.showPicker1 = false;
			},
			changeIcon(showPwd) {
				this.showPwd = !showPwd;
			},
			formSubmit() {
				console.log("提交打印", this.country)
				if (isEmpty(this.country)) {
					this.$toast(this.$t('login.login_008'))
					return;
				}
				if (!isPhone(this.mobile)) {
					this.$toast(this.$t('login.login_009'))
					return;
				}
				if (!/^[a-zA-Z0-9]{6,22}$/.test(this.pwd)) {
					this.$toast(this.$t('login.login_010'))
					return;
				}
				// 短信验证码4位数字
				if (!this.current && !/^\d{4}$/.test(this.code)) {
					this.$toast(this.$t('login.login_011'))
					return;
				}
				if (isEmpty(this.imageCode)) {
					this.$toast(this.$t('login.login_019'))
					return;
				}
				// 登录中
				this.$toast.loading({
					mask: true,
					message: this.current ? this.$t('login.login_012') : this.$t('login.login_013'),
					duration: 1500
				})
				// 注册&登录...
				this.current ? this.mobileLogin() : this.mobileRegister();
			},
			mobileRegister() {
				const params = {
					mobile: this.mobile,
					password: this.pwd,
					captcha: this.code,
					autoLogin: true, //该参数可以自动完成登录并返回token
					area_code: this.country.replace(/[^0-9]/ig, ""),
					graph_captcha: this.imageCode,
					graph_captcha_token: this.token,
				}
				// 用户注册
				this.$api.userbase.user_register(params).then(res => {
					// 状态说明
					if (res.status != 1) {
						this.$toast(res.msg)
						return;
					}
					util.storage.set('sid', res.data.sid)
					util.storage.set('uid', res.data.id)
					util.storage.set('nickName', res.data.nickname)
					util.storage.set("userInfo", res.data)
					this.$toast.success({
						message: this.$t('login.login_014'),
						duration: 1500
					})
					// 跳转首页
					clearInterval(vcodeTimer)
					this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : "/home")
				})
			},
			mobileLogin() {
				if (isEmpty(this.country)) {
					this.$toast(this.$t('login.login_008'))
					return;
				}
				// 固定为0529，小米note3
				const params = {
					area_code: this.country.replace(/[^0-9]/ig, ""),
					mobile: this.mobile,
					password: this.pwd,
					graph_captcha: this.imageCode,
					graph_captcha_token: this.token,
				}
				this.$api.userbase.user_login(params).then(res => {
					//console.log("登录返回结果：", res)
					if (res.status != 1) {
						this.$toast(res.msg)
						return;
					}
					util.storage.set('sid', res.data.sid)
					util.storage.set('uid', res.data.id)
					util.storage.set('nickName', res.data.nickname)
					util.storage.set('userInfo', res.data)
					this.$toast.success({
						message: this.$t('login.login_015'),
						duration: 1500
					})
					/* this.$api.userbase.user_get_area({}).then(res => {
					     if (res.status == 1) {
					         let area = res.data.area;
					         util.storage.set("area", area);
					     }
					 })*/
					let cartInfo = util.storage.get("cartInfo");
					if (cartInfo && cartInfo.length) {
						let skuList = [];
						for (let index in cartInfo) {
							let cart = cartInfo[index];
							if (cart) {
								skuList.push({
									sku_id: cart.sku_id,
									count: cart.quantity
								});
							}
						}
						if (skuList.length) {
							let params2 = {};
							params2.sku_list = JSON.stringify(skuList);
							params2.shop_url = util.storage.get("shopUrl");
							this.$api.cartbase.cart_add(params2).then(res => {
								//console.log("添加购物车:", JSON.stringify(res));
								if (res.status == 1) {
									util.storage.remove("cartInfo");
								}
							});
						}
					}
					this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : "/home")
				})

			},
			handleCodeSend() {
				if (isEmpty(this.country)) {
					this.$toast(this.$t('login.login_008'))
					return;
				}
				if (!isPhone(this.mobile)) {
					this.$toast(this.$t('login.login_009'))
					return;
				}
				if (this.vcodeSend === 1) {
					this.$toast(this.$t('login.login_016'))
					return;
				}
				clearInterval(vcodeTimer)
				let time = 60
				vcodeTimer = setInterval(() => {
					if (time <= 0) {
						this.vcodeSend = 0
						this.vcodeText = this.$t('login.login_007')
					} else {
						this.vcodeSend = 1
						this.vcodeText = this.$t('login.login_017') + `(${time}s)`
						time--
					}
				}, 1000)

				const params = {
					mobile: this.mobile,
					type: this.current ? 'login' : 'register',
					send_type: 'sms',
					area_code: this.country.replace(/[^0-9]/ig, ""),
				}
				this.$api.userbase.user_sms(params).then(res => {
					if (res.status !== 1) {
						this.$toast(res.msg)
						this.vcodeSend = 0 // 发送失败可以重新发送
						return;
					} else {
						this.$toast(this.$t('login.login_018'))
					}
				})
			},
			//获取验证码
			getIdentifyingCode: function(num) {
				this.$api.userbase.user_captcha({}).then(res => {
					let objs = document.getElementById("imgIdentifyingCode" + num);
					if (res.status == 1) {
						objs.src = res.data.content
						this.token = res.data.token
					}
				})
			},
			changeImage(number) {
				this.getIdentifyingCode(number + 1)
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../styles/login.css';

	.container {
		height: 100vh;
		padding: 50px 0 20px 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.logo {
		width: 100px;
		height: 100px;
		margin: 0 auto 30px;
		text-align: center;
	}

	.btn-area {
		// width: 80%;
		height: 45px;
		margin: 40px auto 24px;
	}

	.my-tab .van-tab__pane {
		padding: 20px 15px;
	}

	.my-tab .van-tab__pane {
		padding: 0.4rem 0.6rem;
	}

	.divIdentifyingCode {
		position: absolute;
		top: 50%;
		right: 0;
		z-index: 5;
		width: 1.3rem;
		/*设置图片显示的宽*/
		height: 0.64rem;
		/*图片显示的高*/
		//background: #e2e2e2;
		margin-top: -0.32rem;
	}

	.divIdentifyingCode img {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* // 登录注册按钮样式 更改 */
	.my-tab .van-button--plain.van-button--disabled {
		color: #ccc;
		opacity: 1;
		border: 0px solid #f44;
	}

	.my-tab .forgotpw {
		font-size: 15px;
		text-align: center;
		/* border-bottom: 1px solid #5E6A8F ; */
		color: #5E6A8F;
		/* width: 1.6rem; */
	}

	.my-tab .forgotpw a {
		text-decoration: underline;
	}

	.my-tab .van-field__control {
		color: #131C33;
	}

	.my-tab .van-cell {
		padding: 0.28rem 0rem;
		font-size: 15px;
	}

	/* .van-cell{
        background-color: rgb(228, 27, 27);
    } */
	.my-tab .van-cell:not(:last-child)::after {
		left: 0;
	}
    .my-tab .van-button--danger{
        border: 0;
    }
	.my-tab .btn-area-regist .van-button--danger,.my-tab .btn-area-login .van-button--danger {
        background-color:#F13333;
		height: 45px;
	}

	.my-tab .van-hairline--top-bottom::after,
	.my-tab .van-hairline-unset--top-bottom::after {
		border: 0;
	}

	.van-button--small {
		font-weight: 600;
		font-size: 13px;
    }
    
</style>
<style>
	.van-field__body input {
		font-size: 15px;
		color: #131C33;
	}
	.van-field__body input::-webkit-input-placeholder {
		font-size: 15px !important;
		color: #CCCCCC !important;
	}
	.my-tab .van-tabs__nav--card{
		margin: 0 0.5rem;
	}
	.my-tab .van-tabs__nav--card .van-tab:first-child{
		text-align: right;
	}
	.my-tab .van-tabs__nav--card .van-tab:nth-child(2){
		text-align: left;
	}
	.van-tab{
		padding: 0 0.4rem;
	}
	.van-field__body input::-webkit-input-placeholder { 
	  color: #CCCCCC !important;
	}
	.van-field__body input::-moz-placeholder { 
	  color: #CCCCCC !important;
	}	
	.van-field__body input:-ms-input-placeholder { 
	  color: #CCCCCC !important;
	}  
	.my-tab .van-cell__value--alone .van-button--danger[data-v-23b3be22]{
		height:24px !important;line-height: 24px !important;
	}
	.van-field__body .van-field__button{
        position: absolute;
		right: 0;
		height: 0.48rem;
    }
</style>
