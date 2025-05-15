import { createRouter, createWebHistory } from 'vue-router';
import AppAppointment from '../components/AppAppointment.vue';
import AppBuilderApp from '../components/AppBuilderApp.vue';

const routes = [
  {
    path: '/',
    component: AppAppointment,
  },
  {
    path: '/meeting',
    name: 'Meeting',
    component: AppBuilderApp,
    props: route => ({
      meetingId: route.query.meetingId,
      userToken: route.query.token,
      userName: route.query.name,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
