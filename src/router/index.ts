import { createRouter, createWebHistory } from 'vue-router'
import ProductView from '../components/ProductView.vue'
import ProductList from '../components/ProductList.vue'

const routes = [
  { path: '/', component: ProductList },
  { path: '/produto:id', component: ProductView, name: 'product-view' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})