<template>
    <div class="container">
        <van-nav-bar
            v-if= addChannelBar
            :title="login_037"
            left-arrow
            @click-left="onClickLeft"
        >
        <van-icon :name="backArrow" slot="left" />
        </van-nav-bar>
        <van-button type="danger" size="large" @click="userLogout">{{login_036}}</van-button>

    </div>
</template>
<script>
    import {Field, Uploader, Area, NavBar} from 'vant'
    //import areaListZH from '@/common/area/area_zh'
    //import areaListVI from '@/common/area/area_vi'
    import {storage} from '@/common/util'
    //import {isEmpty} from '@/common/validate'
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
                userInfo: {},
                showPicker: false,
                login_036:this.$t('login.login_036'),
                login_037:this.$t('login.login_037'),
                addChannelBar:true,
                backArrow:backArrow,
            }
        },
        computed: {},
        created() {
            var addChannel = storage.get("addChannel")
            if(addChannel==='app'){
                this.addChannelBar = false;
            }
        },
        methods: {
            userLogout() {
                this.$api.userbase.user_logout().then(res => {
                    if (res.status == 1) {
                        // 去登录页
                        storage.clearAll();
                        this.$router.push("/login")
                    }
                })
            },
            onClickLeft() {
                this.$router.push("/user");
            },
        },

    }
</script>
<style lang="less" scoped>
    .header {
        height: 180px;
        // background:#FF7871;
        background: linear-gradient(309deg, rgba(255, 112, 61, 1) 0%, rgba(255, 70, 57, 1) 100%);
        display: flex;
        justify-content: space-around;
        align-items: center;

        &-img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
        }
    }

    .main {
        margin: -30px 15px 15px 15px;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
    }
    .van-nav-bar .van-icon{
        color: #323233;
        font-size: 20px;
    }
    .van-nav-bar__text{
        color: #323233;
    }
    .van-button--danger{
        background: #F13333;
        border-radius: 45px;
        border: 0;
    }
    .van-button{
        margin-top: 25px;
        margin: 25px auto;

    }
    .van-button--large{
        width: 80%;
        margin-left: 10%;
    }
</style>



