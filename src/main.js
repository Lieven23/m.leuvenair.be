import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueGeolocation from 'vue-browser-geolocation'
import VueCookies from 'vue-cookies'
import CookieLaw from 'vue-cookie-law'
import SuiVue from 'semantic-ui-vue';

Vue.use(VueGeolocation);
Vue.use(VueCookies);
Vue.use(CookieLaw);
Vue.use(SuiVue);

Vue.config.productionTip = false

new Vue({  
  router,
  render: h => h(App)
}).$mount('#app')
