import { createRouter, createWebHistory } from 'vue-router';

import EmpleadosPage from './pages/EmpleadosPage.vue';
import ProductosPage from './pages/ProductosPage.vue';
import RegistroPage from './pages/RegistroPage.vue';

const router = createRouter({
	history: createWebHistory(),
	routes:[
	{ path: '/empleados', component: EmpleadosPage},
	{ path: '/productos', component: ProductosPage},
	{ path: '/registro', component: RegistroPage }
	]
});

export default router