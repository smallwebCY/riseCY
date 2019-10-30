<template>
	<div class="container bgf forgot">
		<div class="title">
			<h1>{{$t('login.login_035')}}</h1>
		</div>
		<van-cell-group>
			<van-field readonly clickable :label="login_022" :value="country" :confirm-button-text="login_023"
			 :cancel-button-text="login_024" :placeholder="login_008" @click="showPicker = true" :left-icon="showPicker?'arrow-up':'arrow-down'" />
			<van-popup v-model="showPicker" position="bottom">
				<van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
			</van-popup>
			<van-field v-model="mobile" clearable type="tel" :placeholder="login_003" />
			<van-field v-model="code" center clearable :placeholder="login_011">
				<van-button slot="button" size="small" :disabled="!!vcodeSend" plain type="danger" @click="handleCodeSend">{{vcodeText}}
				</van-button>
			</van-field>

			<van-field v-model="pwd" :placeholder="login_010" :type="showPwd?'text':'password'" :right-icon="showPwd?'eye-o':'closed-eye'"
			 @click-right-icon="changeIcon(showPwd)" />


			<van-cell-group>
				<van-field van-field v-model.trim="imageCode" clearable :placeholder="login_025">
				</van-field>
				<div class="divIdentifyingCode" @click="getIdentifyingCode()">
					<img id="imgIdentifyingCode" style="height:38px; width: 100px; cursor: pointer;margin-top: 5px;" />
				</div>
			</van-cell-group>

			<div class="btn-area">
				<van-button type="danger" round size="large" :disabled=resetpw @click="formSubmit">{{$t('login.login_023')}}
				</van-button>
			</div>
		</van-cell-group>

	</div>
</template>
<script>
	import {
		Field,
		Tab,
		Tabs,
		Notify,
		Picker,
		Image
	} from 'vant'
	import {
		isPhone,
		isEmpty
	} from '@/common/validate'
	//import util from '@/common/util'

	var vcodeTimer1;

	export default {
		components: {
			[Field.name]: Field,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Notify.name]: Notify,
			[Picker.name]: Picker,
			[Image.name]: Image
		},
		data() {
			return {
				current: 1, // 0登录,1注册
				mobile: '',
				pwd: '',
				country: '',
				code: '',
				vcodeSend: 0, // 0获取验证码,1验证码倒计时,
				vcodeText: this.$t('login.login_007'),
				hasLogin: false,
				showPicker: false,
				columns: ['Việt nam+84', 'Trung quốc+86', ],
				showPwd: false,
				imageCode: '',
				imgText: '',
				login_008: this.$t('login.login_008'),
				login_022: this.$t('login.login_022'),
				login_011: this.$t('login.login_011'),
				login_023: this.$t('login.login_023'),
				login_024: this.$t('login.login_024'),
				login_003: this.$t('login.login_003'),
				login_025: this.$t('login.login_025'),
				login_010: this.$t('login.login_010'),
				resetpw: true,
			};
		},
		created() {

		},
		mounted: function() {
			this.getIdentifyingCode()
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
				console.log(1)
				if (!isEmpty(this.country) && !isEmpty(this.mobile) && !isEmpty(this.pwd) && !isEmpty(this.imageCode) && !isEmpty(
						this.code)) {
					this.resetpw = false
				} else {
					this.resetpw = true
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
			},
			changeIcon(showPwd) {
				this.showPwd = !showPwd;
			},
			formSubmit() {
				if (isEmpty(this.country)) {
					this.$toast(this.$t('login.login_008'))
					return;
				}
				if (this.mobile === '') {
					this.$toast(this.$t('login.login_003'))
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
					message: this.$t('login.login_020'),
					duration: 0
				})
				// 忘记密码
				this.mobileForgotPwd()
			},
			mobileForgotPwd() {
				const params = {
					mobile: this.mobile,
					password: this.pwd,
					captcha: this.code,
					autoLogin: true, //该参数可以自动完成登录并返回token
					area_code: this.country.replace(/[^0-9]/ig, ""),
					graph_captcha: this.imageCode,
					graph_captcha_token: this.token,
				}
				// 忘记密码
				this.$api.userbase.user_forgot_pwd(params).then(res => {
					if (res.status != 1) {
						this.$toast(res.msg)
						return;
					}
					this.$toast.success({
						message: this.$t('login.login_021'),
						duration: 1500
					})
					this.$router.push("/login")
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
				clearInterval(vcodeTimer1)
				let time = 60
				let t1 = this.$t('login.login_007');
				let t2 = this.$t('login.login_017');
				vcodeTimer1 = setInterval(() => {
					if (time <= 0) {
						this.vcodeSend = 0
						this.vcodeText = t1
					} else {
						this.vcodeSend = 1
						this.vcodeText = t2 + `(${time}s)`
						time--
					}
				}, 1000)

				const params = {
					mobile: this.mobile,
					type: 'change_pwd',
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
			getIdentifyingCode: function() {
				// 修改图片加载base64
				this.$api.userbase.user_captcha({}).then(res => {
					let objs = document.getElementById("imgIdentifyingCode");
					if (res.status == 1) {
						objs.src = res.data.content
						this.token = res.data.token
					}
				})

			},
		}
	}
</script>

<style lang="less" scoped>
	.container {
		height: 100vh;
		padding: 50px 30px 20px 30px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.title {
		margin-bottom: 50px;
	}

	.title h1 {
		font-size: 0.6rem;
		text-align: center;
		color: #333333;
		padding: 0;
		margin: 0;
		font-weight: bold;
	}

	.logo {
		width: 100px;
		height: 100px;
		margin: 0 auto 30px;
		text-align: center;
	}

	.btn-area {
		// width: 80%;
		margin: 50px auto;
	}

	.bgf__pane {
		padding: 20px 15px;
	}

	.divIdentifyingCode {
		position: absolute;
		top: 0px;
		right: 0;
		z-index: 5;
		width: 100px;
		/*设置图片显示的宽*/
		height: 38px;
		/*图片显示的高*/
		//background: #e2e2e2;
		margin: 0;
	}

	.van-cell:not(:last-child)::after {
		left: 0;
	}

	.van-cell {
		padding: 0.28rem 0rem;
		font-size: 15px;
	}

	.van-hairline--top-bottom::after,
	.van-hairline-unset--top-bottom::after {
		border: 0;
	}

	.van-button--plain.van-button--disabled {
		color: #ccc;
		opacity: 1;
		border: 0px solid #f44;
	}

	.van-tabs__nav--card {
		border: none !important;
	}

	.van-button--danger {
		border: 0;
		height: 45px;
	}

	.van-button--small {
		font-weight: 600;
		font-size: 13px;
	}

	.btn-area .van-button--danger {
		background-color: #F13333;
	}

	.van-field__button .van-button {
		height: auto;
		line-height: 0.48rem;
	}
</style>
<style>
    .forgot .van-field__body input{
        font-size: 15px;
		color: #414961;
    }
    .forgot .van-field__body input::-webkit-input-placeholder { 
	  color: #CCCCCC !important;
	}
	.forgot .van-field__body input::-moz-placeholder { 
	  color: #CCCCCC !important;
	}	
	.forgot .van-field__body input:-ms-input-placeholder { 
	  color: #CCCCCC !important;
	}  
</style>
