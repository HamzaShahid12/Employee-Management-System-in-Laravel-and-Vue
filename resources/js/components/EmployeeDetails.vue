<template>
  <div class="container mt-5">
    <h1>{{ $t('Employee Details') }}</h1>
    <div v-if="employee" class="card">
      <div class="card-header">
        <h3>{{ employee.name }}</h3>
      </div>
      <div class="card-body">
        <p><strong>Position:</strong> {{ employee.position.name }}</p>
        <p><strong>Department:</strong> {{ employee.department.name }}</p>
        <p><strong>Age:</strong> {{ employee.age }}</p>
        <p><strong>Salary:</strong> {{ employee.salary }}</p>
        <button class="btn btn-primary" @click="editEmployee">Edit</button>
      </div>
    </div>
    <div v-else class="alert alert-warning">
      Employee details not available.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const employee = ref(null);

    const fetchEmployee = async (id) => {
      try {
        console.log(`Fetching employee with ID: ${id}`);
        const response = await axios.get(`/api/employees/${id}`);
        console.log('Employee data:', response.data.data);
        employee.value = response.data.data;
      } catch (error) {
        console.error("There was an error fetching the employee details!", error);
      }
    };

    const editEmployee = () => {
      if (employee.value && employee.value.id) {
        router.push({ name: 'EditEmployee', params: { id: employee.value.id } });
      } else {
        console.error('No employee data available for editing');
      }
    };

    onMounted(() => {
      console.log('Route params:', route.params);
      fetchEmployee(route.params.id);
    });

    return {
      employee,
      editEmployee,
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  margin-top: 30px;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.card-body {
  padding: 20px;
}
</style>
