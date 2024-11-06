<template>
  <div class="container">
    <div class="header">
      <h1>{{ isEdit ? $t('Edit Position Title') : $t('Create Position Title') }}</h1>
    </div>
    
    <form @submit.prevent="savePosition" class="position-form">
      <div class="mb-3">
        <label for="name" class="form-label">{{ $t('name') }}</label>
        <input type="text" v-model="position.name" class="form-control" id="name" required>
      </div>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  setup() {
    const position = ref({ name: '' });
    const route = useRoute();
    const router = useRouter();
    const isEdit = ref(route.params.id !== undefined);

    const fetchPosition = async () => {
      if (isEdit.value) {
        try {
          const response = await axios.get(`/api/positions/${route.params.id}`);
          position.value = response.data.data; // Adjust according to your API response structure
        } catch (error) {
          console.error('There was an error fetching the position data!', error);
        }
      }
    };

    const savePosition = async () => {
      try {
        const response = isEdit.value
          ? await axios.put(`/api/positions/${route.params.id}`, position.value)
          : await axios.post('/api/positions', position.value);

        Swal.fire({
          icon: 'success',
          title: 'Position Saved!',
          showConfirmButton: false,
          timer: 1500
        });

        router.push('/positions');
      } catch (error) {
        console.error('There was an error saving the position!', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    };

    onMounted(() => {
      if (isEdit.value) {
        fetchPosition();
      }
    });

    return { position, savePosition, isEdit };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 70px;
}

.header {
  margin-bottom: 20px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.position-form {
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.form-label {
  font-weight: 500;
}

.btn-primary {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
</style>
