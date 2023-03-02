import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),      
    },
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue'),
      children:[
        {
          path: '/article',
          name: 'article',
          component: () => import('../views/article/articlerList.vue')
        },
        {
          path: '/role',
          name: 'role',
          component: () => import('../views/role/roleList.vue')
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/home/home.vue')
        }
      ]
    },


  ]
})

export default router
