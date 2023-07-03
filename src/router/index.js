import { createWebHistory, createRouter } from "vue-router";
import index from '@/components/index';
import ConnectionList from '@/components/ConnectionList';

const baseUrl = process.env.VUE_APP_BASE_URL;

const routes = [
  { path: baseUrl, component: ConnectionList, name: 'home', props: true },
  { path: baseUrl+'/create-connection', component: index, name: 'create-connection', props: true },
];

export default createRouter({
  history: createWebHistory(),
  hashbang: false,
  base: baseUrl,
  routes
});