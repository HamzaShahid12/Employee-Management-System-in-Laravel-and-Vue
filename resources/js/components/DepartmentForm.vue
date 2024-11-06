<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="mb-4" v-if="isEdit">{{ $t('Edit Department Title') }}</h1>
        <h1 class="mb-4" v-else>{{ $t('Create Department Title') }}</h1>
        <form @submit.prevent="saveDepartment">
          <div class="mb-3">
            <label for="name" class="form-label">{{ $t('name') }}</label>
            <input type="text" v-model="department.name" class="form-control" id="name" required>
          </div>
          <div class="mb-3">
            <label for="location" class="form-label">{{ $t('location') }}</label>
            <input type="text" v-model="department.location" class="form-control" id="location" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">
            {{ isEdit ? $t('Save') : $t('Save') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  setup() {
    const department = ref({ name: '', location: '' });
    const route = useRoute();
    const router = useRouter();
    const isEdit = ref(route.params.id !== undefined);

    const fetchDepartment = () => {
      if (isEdit.value) {
        axios.get(`/api/departments/${route.params.id}`)
          .then(response => {
            department.value = response.data.data; // Ensure this matches the correct data structure
          })
          .catch(error => {
            console.error('There was an error fetching the department data!', error);
          });
      }
    };

    const saveDepartment = () => {
      const saveOrUpdate = isEdit.value
        ? axios.put(`/api/departments/${route.params.id}`, department.value)
        : axios.post('/api/departments', department.value);

      saveOrUpdate.then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Department Saved!',
          showConfirmButton: false,
          timer: 1500
        });
        router.push('/departments');
      }).catch(error => {
        console.error('There was an error saving the department!', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      });
    };

    onMounted(() => {
      if (isEdit.value) {
        fetchDepartment();
      }
    });

    return { department, saveDepartment, isEdit };
  }
};
</script>

<style scoped>
.container {
  padding-top: 50px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
