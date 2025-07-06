import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import ShowDetails from '../pages/ShowDetails.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/show/:id', component: ShowDetails },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})