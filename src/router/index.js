import { createWebHistory, createRouter } from "vue-router";
import index from '@/components/index';
import ConnectionList from '@/components/ConnectionList';
import OptionsPen from '@/components/OptionsPen';
import TableMap from '@/components/TableMap';
import ReportTable from '@/components/ReportTable';

const baseUrl = process.env.VUE_APP_BASE_URL;

const routes = [
  { path: baseUrl, component: ConnectionList, name: 'home', props: true },
  { path: baseUrl+'/create-connection', component: index, name: 'create-connection', props: true },
  { path: baseUrl+'/preview', component: ReportTable, name: 'preview', props: true },
  { path: baseUrl+'/table-map', component: TableMap, name: 'table-map', props: true },
  { path: baseUrl+'/pen', component: OptionsPen, name: 'pen', props: true },
];

export default createRouter({
  history: createWebHistory(),
  hashbang: false,
  base: baseUrl,
  routes
});