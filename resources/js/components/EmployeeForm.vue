<template>
  <div class="container">
    <div class="form-container">
      <h2>{{ $t(formTitle) }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="name">{{ $t('name') }}</label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                class="form-control"
                :placeholder="$t('namePlaceholder')"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="position_id">{{ $t('position') }}</label>
              <select
                id="position_id"
                v-model="form.position_id"
                class="form-control"
                required
              >
                <option v-for="position in positions" :key="position.id" :value="position.id">
                  {{ position.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="department_id">{{ $t('department') }}</label>
              <select
                id="department_id"
                v-model="form.department_id"
                class="form-control"
                required
              >
                <option v-for="department in departments" :key="department.id" :value="department.id">
                  {{ department.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="age">{{ $t('age') }}</label>
              <input
                type="number"
                id="age"
                v-model="form.age"
                class="form-control"
                :placeholder="$t('agePlaceholder')"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="salary">{{ $t('salary') }}</label>
              <input
                type="number"
                id="salary"
                v-model="form.salary"
                class="form-control"
                :placeholder="$t('salaryPlaceholder')"
                required
              />
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
          <router-link to="/employees" class="btn btn-secondary">{{ $t('cancel') }}</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";

export default {
  setup() {
    const form = ref({
      name: "",
      position_id: "",
      department_id: "",
      age: "",
      salary: "",
    });
    const positions = ref([]);
    const departments = ref([]);
    const formTitle = ref("createEmployeeTitle"); // Use translation key
    const router = useRouter();
    const route = useRoute();

    const fetchPositionsAndDepartments = async () => {
      try {
        const [positionsResponse, departmentsResponse] = await Promise.all([
          axios.get("/api/positions"),
          axios.get("/api/departments"),
        ]);
        positions.value = positionsResponse.data.data;
        departments.value = departmentsResponse.data.data;
      } catch (error) {
        Swal.fire(
          $t('error'),
          $t('fetchError'),
          "error"
        );
      }
    };

    const fetchEmployee = async (id) => {
      try {
        const response = await axios.get(`/api/employees/${id}`);
        form.value = response.data.data;
        formTitle.value = "editEmployeeTitle"; // Use translation key
      } catch (error) {
        Swal.fire($t('error'), $t('fetchEmployeeError'), "error");
      }
    };

    const handleSubmit = () => {
      if (route.params.id) {
        updateEmployee();
      } else {
        createEmployee();
      }
    };

    const createEmployee = async () => {
      try {
        await axios.post("/api/employees", form.value);
        Swal.fire($t('success'), $t('employeeCreated'), "success").then(() => {
          router.push("/");
        });
      } catch (error) {
        Swal.fire($t('error'), $t('createEmployeeError'), "error");
      }
    };

    const updateEmployee = async () => {
      try {
        await axios.put(`/api/employees/${route.params.id}`, form.value);
        Swal.fire($t('success'), $t('employeeUpdated'), "success").then(() => {
          router.push("/");
        });
      } catch (error) {
        Swal.fire($t('error'), $t('updateEmployeeError'), "error");
      }
    };

    onMounted(() => {
      fetchPositionsAndDepartments();
      if (route.params.id) {
        fetchEmployee(route.params.id);
      }
    });

    return {
      form,
      positions,
      departments,
      formTitle,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 70px;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-container h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
}
</style>
