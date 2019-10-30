<template>
    <div class="revisePassword" style="">
        <van-nav-bar
            v-if= addChannelBar
            :left-arrow = false
            :border = false
            @click-left="onClickLeft"
        >
        <van-icon :name="backArrow" slot="left" />
        </van-nav-bar>
        <div class="modifierPw"><h1>{{login_034}}</h1></div>
        <div class="wrap">

            <div class="general">
                <van-cell-group>
                    <van-field
                            :type="type"
                            v-model.trim="oldPassword"
                            clearable
                            :placeholder="login_028">
                        <!-- <van-icon v-if="type == 'password'" @click="changeStatusOpen" name="eye-o" slot="right-icon"/>
                        <van-icon v-else @click="changeStatusClose" name="closed-eye" slot="right-icon"/> -->
                    </van-field>
                </van-cell-group>
            </div>
            <div class="general">
                <van-cell-group>
                    <van-field
                            :type="type"
                            v-model.trim="newPassword"
                            clearable
                            :placeholder="login_029">
                        <!-- <van-icon v-if="type == 'password'" @click="changeStatusOpen" name="eye-o" slot="right-icon"/>
                        <van-icon v-else @click="changeStatusClose" name="closed-eye" slot="right-icon"/> -->
                    </van-field>
                </van-cell-group>
            </div>
            <div class="general">
                <van-cell-group>
                    <van-field
                            :type="type"
                            van-field
                            v-model.trim="newPasswordPwd"
                            clearable
                            :placeholder="login_032">
                        <!-- <van-icon v-if="type == 'password'" @click="changeStatusOpen" name="eye-o" slot="right-icon"/>
                        <van-icon v-else @click="changeStatusClose" name="closed-eye" slot="right-icon"/> -->
                    </van-field>
                </van-cell-group>
            </div>
        </div>
        <div class="register">
            <van-button round type="danger" size="large" class="login" :disabled = revisePasswordBtn style="margin-top: 50px;" @click="submit">
                {{$t('login.login_034')}}
            </van-button>
        </div>
    </div>
</template>
<script>
    import {Field, Uploader, Area, NavBar} from 'vant'
    //import areaListZH from '@/common/area/area_zh'
    //import areaListVI from '@/common/area/area_vi'
    import {storage} from '@/common/util'
    import {isEmpty} from '@/common/validate'
    var backArrow =  require('../../assets/back-arrow.png');
    export default {
        components: {
            [Field.name]: Field,
            [Uploader.name]: Uploader,
            [Area.name]: Area,
            [NavBar.name]:NavBar,
        },
        data() {
            return {
                oldPassword: '',
                newPassword: '',
                newPasswordPwd: '',
                type: 'password',
                userInfo: {},
                login_010: this.$t('login.login_010'),
                login_028: this.$t('login.login_028'),
                login_029: this.$t('login.login_029'),
                login_030: this.$t('login.login_030'),
                login_031: this.$t('login.login_031'),
                login_032: this.$t('login.login_032'),
                login_033: this.$t('login.login_033'),
                login_034: this.$t('login.login_034'),
                revisePasswordBtn:true,
                addChannelBar:true,
                backArrow:backArrow,
            }
        },
        computed: {},
        beforeRouteEnter(to, from, next) {
            to.meta.title = to.query.title
            next()
        },
        created() {
            //this.userInfo = JSON.parse(storage.get('userInfo'))
            var addChannel = storage.get("addChannel")
            if(addChannel==='app'){
                this.addChannelBar = false;
            }
        },
        mounted() {

        },
        watch: {
           oldPassword:function(){
               console.log(!isEmpty(this.oldPassword));
               if (!isEmpty(this.oldPassword)&&!isEmpty(this.newPassword)&&!isEmpty(this.newPasswordPwd)) {
                    this.revisePasswordBtn = false;
               }else{
                   this.revisePasswordBtn = true;
               }
           },
           newPassword:function(){
                if (!isEmpty(this.oldPassword)&&!isEmpty(this.newPassword)&&!isEmpty(this.newPasswordPwd)) {
                    this.revisePasswordBtn = false;
               }else{
                   this.revisePasswordBtn = true;
               }
           },
           newPasswordPwd:function(){
                if (!isEmpty(this.oldPassword)&&!isEmpty(this.newPassword)&&!isEmpty(this.newPasswordPwd)) {
                    this.revisePasswordBtn = false;
               }else{
                   this.revisePasswordBtn = true;
               }
           },
        },
        methods: {
            changeStatusOpen() {
                this.type = 'text'
            },
            changeStatusClose() {
                this.type = 'password'
            },
            onClickLeft() {
                this.$router.push("/user");
            },
            submit() {
                if (!this.oldPassword) {
                    this.$toast(this.$t('login.login_028'))
                    return
                }
                if (!this.newPassword || !this.newPasswordPwd) {
                    this.$toast(this.$t('login.login_029'))
                    return
                }
                if (!/^[a-zA-Z0-9]{6,22}$/.test(this.newPassword)) {
                    this.$toast(this.$t('login.login_010'))
                    return;
                }
                if (this.newPassword != this.newPasswordPwd) {
                    this.$toast(this.$t('login.login_030'))
                    return
                }
                let data = {
                    old_password: this.oldPassword,
                    password: this.newPassword,
                    captcha: this.newPasswordPwd
                }
                // 修改密码成功
                this.$api.userbase.user_update_pwd(data).then(res => {
                    if (res.status != 1) {
                        this.$toast(res.msg)
                        return;
                    }
                    this.$toast.success({
                        message: this.$t('login.login_031'),
                        duration: 1000
                    })
                    this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : "/setting")
                })
            }
        }
    }
</script>
<style scoped lang="less" >
    body{
        background-color: #ffffff!important;
    }
    .revisePassword{
        height: 100vh;
        overflow: hidden;
        background-color: #ffffff!important;
    }
    .wrap{
        margin: 0 30px;
        margin-top: 1rem;
        .van-cell{
            padding: 16px 0;
        }
    }
    .van-nav-bar .van-icon{
        color: #323233;
        font-size: 20px;
    }
    .modifierPw{
        text-align: center;

        margin-top: 68px;
        h1{
            margin: 0;
            padding: 0;
            font-size: 30px;
            color: #333333;
            text-align: center;
            font-weight: 100;
        }
    }
    .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
        border-width: 0 0 1px 0;
    }
    .van-button--danger{
        background-color:#F13333;
        border-radius: 100px;
        border: 0;
		opacity: 1;
    }
    .van-button--large{
        width: 84%;
        margin-left: 8%;height:45px;
    }
    .van-field__body input{
        font-size: 15px;
		color: #414961;
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
</style>
<style>
    .revisePassword .van-field__body input{
        font-size: 15px;
		color: #414961;
    }
    .revisePassword .van-field__body input::-webkit-input-placeholder { 
	  color: #CCCCCC !important;
	}
	.revisePassword .van-field__body input::-moz-placeholder { 
	  color: #CCCCCC !important;
	}	
	.revisePassword .van-field__body input:-ms-input-placeholder { 
	  color: #CCCCCC !important;
	}  
	.modifierPw h1{font-weight:600 !important;}
</style>
