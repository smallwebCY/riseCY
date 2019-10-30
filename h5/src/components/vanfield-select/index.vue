<template>
    <div class="row">
        <van-nav-bar
            v-if= addChannelBar
            :title="$t('address_list.address_list_003')"
            left-arrow
            @click-left="onClickLeft"
        >
        <van-icon :name="backArrow" slot="left" />
        </van-nav-bar>
        <div class="select select-outbox">
            <!-- <div class="se-head">{{$t('user.address_021')}}</div> -->
            <select v-model="f.s" @change="sel_state">
                <option :value="0" selected>{{$t('user.address_021')}}</option>
                <option :value="v.id" v-for="(v,i) in state" :key="i">{{v.name}}</option>
            </select>
        </div>
        <div class="col select-outbox">
            <!-- <div class="se-head">{{$t('user.address_022')}}</div> -->
            <select v-model="f.p" @change="sel_pro" id="province">
                <option selected="selected" :value="0">{{$t('user.address_022')}}</option>
                <option :value="v.id" v-for="(v,i) in pro" :key="i">{{v.name}}</option>
            </select>
        </div>

        <div class="col select-outbox">
            <!-- <div class="se-head">{{$t('user.address_023')}}</div> -->
            <select v-model="f.c" @change="sel_city" id="city">
                <option selected="selected" :value="0">{{$t('user.address_023')}}</option>
                <option :value="v.id" v-for="(v,i) in city" :key="i">{{v.name}}</option>
            </select>
        </div>

        <div class="col select-outbox">
            <!-- <div class="se-head">{{$t('user.address_024')}}</div> -->
            <select v-model="f.cc" @change="result()" id="country">
                <option selected="selected" :value="0">{{$t('user.address_024')}}</option>
                <option :value="v.id" v-for="(v,i) in county" :key="i">{{v.name}}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import {storage} from '@/common/util'
    import {ActionSheet, Field, Picker, NavBar} from 'vant';
    var backArrow =  require('../../assets/back-arrow.png');
    export default {
        components: {
            [ActionSheet.name]: ActionSheet,
            [Field.name]: Field,
            [Picker.name]: Picker,
            [NavBar.name]:NavBar,
        },
        data: function () {
            return {
                data: [],
                pro: "",
                city: "",
                county: "",
                state: 0,
                f: {
                    s: '0',
                    p: 0,
                    c: 0,
                    cc: 0,
                },
                mobile: this.$route.params.mobile,
                name: this.$route.params.name,
                re: '',
                addressInfo: this.$route.params,
                address_025:this.$t("user.address_025"),
                addChannelBar:true,
                backArrow:backArrow,
            }
        },
        props: {
            pindex: {type: [Number, String], default: 0},
            cindex: {type: [Number, String], default: 0},
            ccindex: {type: [Number, String], default: 0},

        },
        created: function () {
            var addChannel = storage.get("addChannel")
            if(addChannel==='app'){
                this.addChannelBar = false;
            }
            this.$api.userbase.user_get_area({"all":"1"}).then(res => {
                if (res.status == 1) {
                    this.state = res.data.area
                    console.log(this.state)
                }
            })

        },
        methods: {
            onClickLeft() {
                this.$router.push("/address-edit");
            },
            sel_pro: function () {
                if (this.f.p === '0') {
                    this.$toast(this.$t('user.address_022'))
                    return
                }
                this.$api.userbase.user_get_area({"pid": this.f.p,"all":"1"}).then(res => {
                    console.log(res)
                    if (res.status == 1) {
                        this.city = res.data.area
                    }
                })
            },
            sel_city: function () {
                if (this.f.c === '0') {
                    this.$toast(this.$t('user.address_023'))
                    return
                }
                this.$api.userbase.user_get_area({"pid": this.f.c,"all":"1"}).then(res => {
                    if (res.status == 1) {
                        this.county = res.data.area
                    }
                })
            },
            result: function () {
                if (this.f.cc === '0') {
                    this.$toast(this.$t('user.address_024'))
                    return
                }
                let province_ = document.getElementById('province')
                let city_ = document.getElementById('city')
                let country_ = document.getElementById('country')
                var re = {
                    pro: {id: this.f.p, name: province_.options[province_.selectedIndex].text},
                    city: {id: this.f.c, name: city_.options[city_.selectedIndex].text},
                    county: {id: this.f.cc, name: country_.options[country_.selectedIndex].text},
                };
                this.re = re;
                this.$router.push({
                    name: 'address-edit',
                    params: {addressInfo: this.addressInfo, re: this.re, state: this.f.s}
                });

            },
            sel_state() {
                console.log(this.f.s)
                if (this.f.s === '0') {
                    this.$toast(this.$t('user.address_021'))
                    return
                }
                this.$api.userbase.user_get_area({"pid": this.f.s,"all":"1"}).then(res => {
                    if (res.status == 1) {
                        this.pro = res.data.area
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .row{
        background-color: #fff;
        /* margin-top:10px; */
    }
    .select-outbox{
        margin:0 14px;
        padding: 14px 0;
        border-bottom: 1px solid #EDEDED;
        display: flex;
        align-items: center;
        position: relative;

    }
    .se-head{
        width: 40px;
        position: absolute;


    }
    .select-outbox:last-child{
        border: 0
    }
    select {
        outline: none;
        display: block;
        font-size: 15px;
        box-sizing: border-box;
        min-width: 0;
        margin: 0;
        padding: 0;
        flex: 1;
        color: #323233;
        text-align: left;
        background-color: transparent;
        border: black solid 1px;
        resize: none;
        height: 30px;
        border: 0;
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        background: url("../../assets/select-address.png") no-repeat scroll right center transparent;
        background-size: 8px 13px;
        padding-right: 14px;
        /* padding-left: 40px; */
        /* margin-left: 40px; */
    }

    select:focus{
        border: none;
        outline: none;
    }
    select::-ms-expand { display: none; }

    option {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        height: 0.88rem;
        line-height: 0.88rem;
    }
    .van-nav-bar .van-icon{
        color: #323233;
        font-size: 20px;
    }
    .van-hairline--bottom::after{
        border: 0;
    }
</style>
