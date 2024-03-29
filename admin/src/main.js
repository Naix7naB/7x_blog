import '@/assets/scss/index.scss'

import plugins from '@/plugins'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(plugins)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this
    }
}).$mount('#app')
