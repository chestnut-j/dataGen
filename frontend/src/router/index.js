import  { createWebHistory, createRouter }  from 'vue-router'
import Home from '@/views/Home.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/task',
    name: 'Task',
    component: () => import(/* webpackChunkName: "about" */ '../views/Task.vue')
  },
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

export default router
