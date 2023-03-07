import { createRouter, createWebHistory } from 'vue-router';
import { mainStore } from '../store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),      
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test/test.vue'),    
    },
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue'),
      children:[
        {
          path: '/article',
          name: 'article',
          component: () => import('../views/article/articleList.vue')
        },
        {
          path: '/role',
          name: 'role',
          component: () => import('../views/role/roleList.vue')
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('../views/user/userList.vue')
        },
        {
          path: '/authority',
          name: 'authority',
          component: () => import('../views/authority/authorityList.vue')
        },
        {
          path: '/classify',
          name: 'classify',
          component: () => import('../views/classify/classify.vue')
        },
        {
          path: '/tags',
          name: 'tags',
          component: () => import('../views/tags/tags.vue')
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

//配置导航守卫
// 全局守卫：登录拦截 本地没有存token,请重新登录
router.beforeEach((to, from, next) => {
  //Pinia在 Vue 文件夹中是挂载到 setup 上面的，但在js文件夹中使用呢就会报错，说在调用的时候没有激活Pinia,在方法内使用即可
  const store = mainStore();
	// 判断有没有登录
	if (!store.getToken) {
		if (to.name == "login") {
			next();
		} else {
			router.push('/login')
		}
	} else {
		next();
	}
});



export default router
