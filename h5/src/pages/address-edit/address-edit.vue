<template>
    <div class="address-edit">
        <!--<van-address-edit :address-info="addressInfo"
          :area-list="areaList"
          show-postal
          :show-delete="status==1"
          show-set-default
          @save="onSave"
          @delete="onDelete"
                          @change-area="tt"
        />-->
        <van-cell-group>
            <van-field
                    v-model="addressInfo.name"
                    clearable
                    :label="address_009"
                    :placeholder="address_015"
            />

            <van-field
                    v-model="addressInfo.mobile"
                    :label="address_010"
                    :placeholder="address_016"
            />
            <van-field
                    v-model="addressInfo.areaStr"
                    :label="address_011"
                    :placeholder="address_017"
                    right-icon="arrow"
                    @click="changeArea"
            />
            <van-field
                    v-model="addressInfo.address"
                    :label="address_012"
                    :placeholder="address_018"
            />

            <van-switch-cell v-model="addressInfo.default_flag" :title="address_019"/>
            <van-button round type="danger" size="large" class="login" @click="updateAddress" style="">
                {{$t('user.address_013')}}
            </van-button>
            <van-button round size="large" class="login" @click="deleteAddress" style="margin-top: 10px;">{{$t('user.address_014')}}
            </van-button>
        </van-cell-group>
    </div>
</template>

<script>
    import {AddressEdit, SwitchCell, Field} from 'vant'
    import areaListZH from '@/common/area/area_zh'
    //import areaListVI from '@/common/area/area_vi'
    ///import {storage} from '@/common/util'
    import {isEmpty, isPhone} from '@/common/validate'
    import setarea from "@/pages/user/setarea"
    var toSelectAddress =  require('../../assets/select-address.png');
    export default {
        components: {
            [AddressEdit.name]: AddressEdit,
            [SwitchCell.name]: SwitchCell,
            [Field.name]: Field,
            [setarea.name]: setarea,
            [isPhone.name]: isPhone,
        },
        data() {
            return {
                status: 0,  // 0添加地址,1修改地址
                addressInfo: {
                    id: '',
                    name: "",
                    mobile: "",
                    country_id: '',
                    province_id: '',
                    city_id: '',
                    district_id: '',
                    address: '',
                    mobile_area: '',
                    tel_area: '',
                    tel: '',
                    default_flag: false,
                    areaStr: '',
                    delete_flag: ''
                },
                areaList: areaListZH,
                searchResult: [],
                address_009:this.$t('user.address_009'),
                address_010:this.$t('user.address_010'),
                address_011:this.$t('user.address_011'),
                address_012:this.$t('user.address_012'),
                address_013:this.$t('user.address_013'),
                address_014:this.$t('user.address_014'),
                address_015:this.$t('user.address_015'),
                address_016:this.$t('user.address_016'),
                address_017:this.$t('user.address_017'),
                address_018:this.$t('user.address_018'),
                address_019:this.$t('user.address_019'),
                timeOut:null,
                toSelectAddress:toSelectAddress,
            }
        },
        created() {
            if ( this.timeOut ) {
                clearTimeout(this.timeOut);
            }
            let id = this.$route.query.id;
            if (id) {
                this.status = 1
                let queryAddressInfo = {}
                this.$api.userbase.user_get_address_list({}).then(res => {
                    if (res.status == 1 && res.data.length>=1) {
                        res.data.forEach(function (item) {
                            if (item.id == id) {
                                queryAddressInfo = item
                            }
                        });
                        //console.log("=========",queryAddressInfo)
                        this.addressInfo = queryAddressInfo
                        this.addressInfo.areaStr = queryAddressInfo.province_name
                            + '/' + queryAddressInfo.city_name + '/' + queryAddressInfo.district_name
                        this.addressInfo.default_flag == 1 ? this.addressInfo.default_flag = true : this.addressInfo.default_flag = false
                    }
                })
            }

            // 赋值
            let addressInfo = this.$route.params.addressInfo
            if (addressInfo) {
                this.addressInfo = addressInfo
            }
            let result = this.$route.params.re
            if (result) {
                let pro = result.pro;
                let city = result.city;
                let county = result.county;
                this.addressInfo.areaStr = pro.name + '/' + city.name + '/' + county.name
                this.addressInfo.province_id = pro.id
                this.addressInfo.city_id = city.id
                this.addressInfo.district_id = county.id
            }
            if (this.$route.params.state) {
                this.addressInfo.country_id = this.$route.params.state;
            }


        },
        methods: {
            updateAddress() {
                if (isEmpty(this.addressInfo.name)) {
                    this.$toast(this.$t('user.address_002'))
                    return;
                }
                if (isEmpty(this.addressInfo.mobile)) {
                    this.$toast(this.$t('user.address_003'))
                    return;
                }
                if (isEmpty(this.addressInfo.country_id)) {
                    this.$toast(this.$t('user.address_004'))
                    return;
                }
                if (isEmpty(this.addressInfo.province_id)) {
                    this.$toast(this.$t('user.address_004'))
                    return;
                }
                if (isEmpty(this.addressInfo.city_id)) {
                    this.$toast(this.$t('user.address_004'))
                    return;
                }
                if (isEmpty(this.addressInfo.district_id)) {
                    this.$toast(this.$t('user.address_004'))
                    return;
                }
                if (isEmpty(this.addressInfo.address)) {
                    this.$toast(this.$t('user.address_005'))
                    return;
                }
                this.$toast.loading({
                    mask: true,
                    message: this.$t('user.address_001'),
                    duration: 1500
                })
                if (this.$route.query.id) {
                    //修改
                    this.addressInfo.default_flag == true ? this.addressInfo.default_flag = 1 : this.addressInfo.default_flag = 0
                    this.$api.userbase.user_update_delete_address(this.addressInfo).then(res => {
                        //console.log("保存地址===", res)
                        if (res.status != 1) {
                            this.$toast(res.msg)
                            return;
                        }
                    });
                } else {
                    this.addressInfo.default_flag == true ? this.addressInfo.default_flag = 1 : this.addressInfo.default_flag = 0
                    //保存
                    this.$api.userbase.user_add_address(this.addressInfo).then(res => {
                        //console.log("新增地址返回结果：", res)
                        if (res.status != 1) {
                            this.$toast(res.msg)
                            return;
                        }
                    });
                }

                this.$toast.success({
                    message: this.$route.query.id?this.$t('user.address_007'):this.$t('user.address_008'),
                    duration: 1500
                })
                //this.$toast.clear()
                this.timeOut = setTimeout(()=>{   //设置延迟执行
                    this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : "/address-list")
                },500);
            },
            deleteAddress() {
                this.$toast.loading({
                    mask: true,
                    message: this.$t('user.address_001'),
                    duration: 1000
                })
                if (this.$route.query.id) {
                    this.addressInfo.delete_flag = 1
                    this.addressInfo.default_flag == true ? this.addressInfo.default_flag = 1 : this.addressInfo.default_flag = 0
                    this.$api.userbase.user_update_delete_address(this.addressInfo).then(res => {
                        if (res.status != 1) {
                            this.$toast(res.msg)
                            return;
                        }
                    });
                    //this.$toast.clear(true)
                    this.timeOut = setTimeout(()=>{   //设置延迟执行
                        this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : "/address-list")
                    },500);

                } else {
                    this.$toast(this.$t('user.address_006'))
                    return;
                }
            },
            changeArea() {
                this.$router.push({name: 'setArea', params: this.addressInfo});
            }

        }
    }
</script>

<style lang="less" scoped>
.address-edit{
    height: 100vh;
    background-color: #fff;
}
.van-button--danger{
    margin-top: 40px;
}
.van-button--danger,.van-button--default{
    width: 90%;
    margin-left: 5%;
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
    border: 0;
}
.van-cell{
    padding: 15px;
}
.van-switch-cell .van-cell__title{
    flex: 2;
}

</style>
<style>
.address-edit .van-field__right-icon .van-icon{
    color: #979A9F;
}
	.van-field__label{
		width:2rem;
	}
</style>


