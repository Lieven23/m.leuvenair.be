import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import currentLocation from './views/currentLocation.vue'

Vue.use(Router)

var router = new Router({
  
  routes: [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Mobile - Leuvenair.be'
    }
  },
  {
    path: '/currentLocation',
    name: 'currentLocation',
    component: currentLocation
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: 'About - Leuvenair.be'
    },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
    ]
  })

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  document.logo = " "
  next()
})

export default router