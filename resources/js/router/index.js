import { createRouter, createWebHistory } from 'vue-router';
import EmployeeList from '../components/EmployeeList.vue';
import EmployeeForm from '../components/EmployeeForm.vue';
import EmployeeDetails from '../components/EmployeeDetails.vue';
import DepartmentList from '../components/DepartmentList.vue';
import DepartmentForm from '../components/DepartmentForm.vue';
import PositionList from '../components/PositionList.vue';
import PositionForm from '../components/PositionForm.vue';
import EventList from '../components/EventList.vue';
import CreateEvent from '../components/CreateEvent.vue';

const routes = [
  // Employee Routes
  { path: '/', component: EmployeeList },
  { path: '/employees/create', component: EmployeeForm },
  { path: '/employees/edit/:id', component: EmployeeForm, props: true },
  { path: '/employees/:id', component: EmployeeDetails, props: true },

  // Department Routes
  { path: '/departments', component: DepartmentList },
  { path: '/departments/create', component: DepartmentForm },
  { path: '/departments/edit/:id', component: DepartmentForm, props: true },

  // Position Routes
  { path: '/positions', component: PositionList },
  { path: '/positions/create', component: PositionForm },
  { path: '/positions/edit/:id', component: PositionForm, props: true },

  // Event Routes
  { path: '/events', component: EventList },
  { path: '/events/create', component: CreateEvent },
  { path: '/events/edit/:id', component: CreateEvent, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
