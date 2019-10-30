import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const i18n = new VueI18n({
    //todo  语言标识获取规则（时区，浏览器或用户主动切换）
    locale: 'vi_VN',
    messages: {
        'zh_CN': require('./common/lang/zh'),
        'vi_VN': require('./common/lang/vi'),
        'en_US': require('./common/lang/en')
    }
})
export default i18n
