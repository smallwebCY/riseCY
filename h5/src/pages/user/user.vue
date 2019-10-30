<template>
    <div class="container user">
        <van-nav-bar
            :title="menu_003"
            v-if= addChannelBar
            @click-right="onSettingClick"
            >
            <van-icon size = '19px' :name="userInfoIcon.userSetting" slot="right" />
        </van-nav-bar>
        <!-- <div class="header-setting" @click="onSettingClick">
            <van-icon name="setting-o"/>
        </div> -->
        <!-- <img :src=userInfo.avatarUrl alt=""> -->
        <div class="header">
            <img class="header-img" :src="userInfo.avatarUrl" alt="" height="80px" width="120px">
            <van-uploader :after-read="afterRead" multiple disabled>
                <van-button plain size="small" round icon="photo" type="primary">{{$t('user.menu_007')}}</van-button>
            </van-uploader>
            <!-- <input type="file" accept="image/*" class="van-uploader__input" @change="onChange($event)" @input="onInput"> -->
            <p class="user-tel">{{userInfo.mobile_mask}}</p>
        </div>
        <div class="user_information">
            <van-cell-group>
              <!--  <van-cell title="" class="cell_middle">
                    <van-uploader :afterRead="avatarAfterRead">
                        <div class="user_avatar_upload">
                            <img :src="userInfo.avatarUrl" alt=""
                                 v-if="userInfo.avatarUrl">
                            <van-icon name="camera_full" v-else></van-icon>
                        </div>
                    </van-uploader>
                </van-cell>-->
                <van-cell :icon=userInfoIcon.userCollect :title="menu_004" to="/favgoods" isLink/>
                <van-cell :icon=userInfoIcon.userOrder :title="menu_005" to="/order-list" isLink/>
                <!-- <van-cell title="手机号" to="/user/information/setMobile" :value="mobile" isLink></van-cell>-->
            </van-cell-group>
            <van-cell-group>
                <van-cell  :icon=userInfoIcon.userPw :title="menu_006" to="/setPassword" isLink/>
            </van-cell-group>
        </div>
        <van-tabbar route
                    v-model="active"
                    active-color="#f44">
            <van-tabbar-item replace
                             to="/home"
                             :icon= tabbarIcon.homeIcon>
                {{$t('user.menu_001')}}
            </van-tabbar-item>
            <van-tabbar-item replace
                             to="/cart"
                             :icon= tabbarIcon.carIcon>
                {{$t('user.menu_002')}}
            </van-tabbar-item>
            <van-tabbar-item replace
                             to="/user"
                             :icon= tabbarIcon.userIcon>
                {{$t('user.menu_003')}}
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
    import {Tabbar, TabbarItem, Grid, GridItem, Field, Uploader,NavBar} from 'vant'
    import {storage} from '@/common/util'
    //import Axios from 'axios'
    //import {isEmpty} from '@/common/validate'
    /*import {Field, Uploader, Area} from 'vant'
    import areaListZH from '@/common/area/area_zh'
    import areaListVI from '@/common/area/area_vi'

    import {isEmpty} from '@/common/validate'*/
    //import util from '@/common/util'


    var userSetting = require('../../assets/user-set-icon.png');
    var avatarUrl = require('../../assets/avatar_default.png');
    var userCollect = require('../../assets/user-collect.png');
    var userOrder = require('../../assets/user-order.png');
    var userPw = require('../../assets/user-pw.png');

    var homeIcon =  require('../../assets/home_icon.png');
    var carIcon =  require('../../assets/car_icon.png');
    var userIcon =  require('../../assets/user_icon_active.png');
    export default {
        components: {
            [Tabbar.name]: Tabbar,
            [TabbarItem.name]: TabbarItem,
            [Grid.name]: Grid,
            [GridItem.name]: GridItem,
            [Field.name]: Field,
            [Uploader.name]: Uploader,
            [NavBar.name]: NavBar,
        },
        data() {
            return {
                userInfo: {
                    avatarUrl: avatarUrl,
                },
                userInfoIcon:{
                    userCollect:userCollect,
                    userOrder:userOrder,
                    userPw:userPw,
                    userSetting:userSetting,
                },
                tabbarIcon:{
                    homeIcon:homeIcon,
                    carIcon:carIcon,
                    userIcon:userIcon,
                },
                active: 0,
                menu_001: this.$t('user.menu_001'),
                menu_002: this.$t('user.menu_002'),
                menu_003: this.$t('user.menu_003'),
                menu_004: this.$t('user.menu_004'),
                menu_005: this.$t('user.menu_005'),
                menu_006: this.$t('user.menu_006'),
                menu_007: this.$t('user.menu_007'),
                addChannelBar:true,
            }
        },
        filters: {},
        created() {
            this.getUserInfo();
            if (storage.get('file')){
                this.userInfo.avatarUrl=storage.get('file').content
            }
            var addChannel = storage.get("addChannel")
            if(addChannel==='app'){
                this.addChannelBar = false;
            }
        },
        methods: {
            getUserInfo() {
                this.$api.userbase.user_get_info({}).then(res => {
                    console.log("user info", res)
                    if (res.status != 1) {
                        return;
                    }
                    const baseInfo = res.data
                    this.userInfo = {
                        ...res.data,
                        // avatarUrl: baseInfo.avatar_file_url || `${require('@/assets/avatar_default.png')}`,
                        avatarUrl: baseInfo.avatar_file_url || avatarUrl,
                        nick: baseInfo.nickname || `${baseInfo.sourceStr}${baseInfo.id}`,
                        mobile: baseInfo.mobile || '',
                        mobile_mask:baseInfo.mobile_mask||'',
                    }
                    console.log(this.userInfo)
                })
            },
            afterRead(file) {
                this.$toast.loading({
                    mask: true,
                    message: this.$t('user.file_001'),
                    duration: 0
                })
                let formData = new FormData()
                formData.append('file', file.file)
                formData.append('moudle', 'avatar')
                formData.append('sid', storage.get("sid"))
                this.$request.uploadFile('/file/upload', formData).then(res => {
                    if (res.status != 1) {
                        this.$toast(res.msg)
                        return;
                    }
                    this.$toast(this.$t('user.file_002'))
                    storage.set("file",file)
                    this.getUserInfo();
                })
            },
            avatarAfterRead() {

            },
            onSettingClick() {
                this.$api.userbase.user_get_address_list({}).then(res =>{
                    console.log(res)
                })
                this.$router.push({path: '/setting'})
            }
        }
    }
</script>
<style lang="less" scoped>
@import url(../../styles/user.css);
    .style-box() {
        box-sizing: border-box;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
    }

    .header {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        // height: 180px;
        color: #fff;
        padding: 0 15px;
        .header-img{
            width: 78px;
            height: 78px;
            display: inline-block;
            background-color: transparent;

        }
        .user-tel{
            font-size: 16px;
            color: #333333;
            margin-top: 8px;
        }
        .van-uploader{
            position: absolute;
            width: 78px;
            height: 78px;
            opacity: 0;
        }
        // background-color: #fe4140;
        &-media {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
        }

        &-title {
            font-size: 18px;
        }

        &-setting {
            position: absolute;
            top: 30px;
            right: 30px;
            font-size: 24px;
        }
    }
    .van-cell-group{
        background: #FFFFFF;
        border-radius: 2px;
        margin: 0 12px;
        margin-top: 20px;
        margin-bottom: 20px;
        padding: 0 16.5px;
    }

    .van-cell{
        padding: 22px 0rem;
        align-items: center;
    }
    .van-cell:not(:last-child)::after{
        left: 0;
    }
    .van-cell__right-icon{
        height: initial;
        line-height: initial;
    }
    .main {
        // padding:0 20px;
        margin-top: -50px;
    }

    .group {
        .style-box();
        margin: 0 15px 15px 15px;

        &-inner {
            padding: 10px 0;
        }
    }

    .balance-group {
        .style-box();

        .van-row {
            text-align: center;
        }

        .van-col {
            text-align: center;
        }

        &-title {
            font-size: 14px;
            font-weight: bold;
            color: #000;
            margin-bottom: 5px;
        }

        &-txt {
            font-size: 12px;
            color: #999;
        }
    }

    .changy-group {
        .van-icon {
            font-size: 24px;
        }

        .van-col {
            margin-bottom: 10px;
        }
    }

    .user-gruop {
        &-name {
            // padding: 10px 0;
            color: #333;
            font-size: 12px;
            margin-bottom: 10px;
        }
    }

    .user-section {
        .style-box();
        margin: 0 20px 15px 20px;

        &-title {
            font-size: 14px;
            color: #000;
            font-weight: bold;
        }

        &-hd {
            box-sizing: border-box;
            width: 100%;
            padding: 10px 0px;
            overflow: hidden;
            color: #323233;
            font-size: 14px;
            line-height: 24px;
            background-color: #fff;
            display: flex;
            align-items: center;
        }

        &-bd {
            box-sizing: border-box;
            width: 100%;
            padding: 15px 0;
        }

        &-grid {
            box-sizing: border-box;
            width: 20%;
            float: left;
            text-align: center;

            .van-icon {
                font-size: 24px;
                margin-bottom: 5px;
            }

            &-img {
                display: inline-block;
                width: 30px;
                height: 30px;
                // margin-bottom: 5px;
            }

            &-title {
                color: #333;
                font-size: 12px;
            }
        }
    }
</style>



