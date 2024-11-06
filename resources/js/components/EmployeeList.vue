<template>
  <div class="container">
    <header class="header">
      <div class="actions">
        <div class="search-bar">
          <input
            v-model="search"
            :placeholder="$t('Search')"
            class="form-control"
            @input="searchEmployees"
          />
          <button @click="searchEmployees" class="btn btn-dark">{{ $t('Search') }}</button>
        </div>
        <h1>{{ $t('Employee List') }}</h1>
        <router-link to="/employees/create" class="btn btn-dark">
          {{ $t('Create New Employee') }}
        </router-link>
      </div>
    </header>

    <section class="table-container mt-4">
      <table class="table table-hover">
        <thead>
          <tr>
            <th @click="sortEmployees('name')" :class="{ sorted: sortField === 'name' }">
              {{ $t('Name') }}
              <span v-if="sortField === 'name'">{{ sortDirection === "asc" ? "▲" : "▼" }}</span>
            </th>
            <th @click="sortEmployees('position')" :class="{ sorted: sortField === 'position' }">
              {{ $t('Position') }}
              <span v-if="sortField === 'position'">{{ sortDirection === "asc" ? "▲" : "▼" }}</span>
            </th>
            <th @click="sortEmployees('department')" :class="{ sorted: sortField === 'department' }">
              {{ $t('Department') }}
              <span v-if="sortField === 'department'">{{ sortDirection === "asc" ? "▲" : "▼" }}</span>
            </th>
            <th @click="sortEmployees('age')" :class="{ sorted: sortField === 'age' }">
              {{ $t('Age') }}
              <span v-if="sortField === 'age'">{{ sortDirection === "asc" ? "▲" : "▼" }}</span>
            </th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees.data" :key="employee.id">
            <td>{{ employee.name }}</td>
            <td>{{ employee.position.name }}</td>
            <td>{{ employee.department.name }}</td>
            <td>{{ employee.age }}</td>
            <td>
              <router-link :to="'/employees/' + employee.id" class="btn btn-info btn-sm">
                <i class="fa fa-eye"></i> {{ $t('View') }}
              </router-link>
              <router-link :to="'/employees/edit/' + employee.id" class="btn btn-warning btn-sm ml-2">
                <i class="fa fa-pencil-alt"></i> {{ $t('Edit') }}
              </router-link>
              <button @click="confirmDeleteEmployee(employee.id)" class="btn btn-danger btn-sm ml-2">
                <i class="fa fa-trash-alt"></i> {{ $t('Delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="fetchEmployeesByPage(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-for="page in pages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="fetchEmployeesByPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="fetchEmployeesByPage(currentPage + 1)" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { ref, watch, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const employees = ref({ data: [], links: {}, meta: {} });
    const search = ref("");
    const currentPage = ref(1);
    const totalPages = ref(1);
    const sortField = ref("name");
    const sortDirection = ref("asc");
    const router = useRouter();
    const route = useRoute();

    const loadFromRouter = () => {
      const query = route.query;
      if (query.search) search.value = query.search;
      if (query.page) currentPage.value = parseInt(query.page, 10);
      if (query.sortField) sortField.value = query.sortField;
      if (query.sortDirection) sortDirection.value = query.sortDirection;
    };

    const fetchEmployees = (url = "/api/employees") => {
      axios
        .get(url, {
          params: {
            search: search.value,
            page: currentPage.value,
            sortField: sortField.value,
            sortDirection: sortDirection.value,
          },
        })
        .then((response) => {
          employees.value = response.data;
          currentPage.value = response.data.meta.current_page;
          totalPages.value = response.data.meta.last_page;
          updateRouterQuery();
        })
        .catch((error) => {
          console.error("There was an error fetching the employees!", error);
        });
    };

    const fetchEmployeesByPage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      currentPage.value = page;
      fetchEmployees(`/api/employees?page=${page}`);
    };

    const searchEmployees = () => {
      currentPage.value = 1;
      fetchEmployees();
    };

    const sortEmployees = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      } else {
        sortField.value = field;
        sortDirection.value = "asc";
      }
      fetchEmployees();
      updateRouterQuery();
    };

    const updateRouterQuery = () => {
      router.push({
        query: {
          search: search.value,
          page: currentPage.value,
          sortField: sortField.value,
          sortDirection: sortDirection.value,
        },
      });
    };

    const confirmDeleteEmployee = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this employee record!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteEmployee(id);
          Swal.fire("Deleted!", "The employee has been deleted.", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "The employee deletion was cancelled :)", "error");
        }
      });
    };

    const deleteEmployee = (id) => {
      axios
        .delete(`/api/employees/${id}`)
        .then(() => {
          fetchEmployees();
        })
        .catch((error) => {
          console.error("There was an error deleting the employee!", error);
        });
    };

    onMounted(() => {
      loadFromRouter();
      fetchEmployees();
    });

    const pages = computed(() => {
      let pages = [];
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i);
      }
      return pages;
    });

    watch(route, loadFromRouter, { immediate: true });
    watch([sortField, sortDirection], fetchEmployees);
    watch(search, searchEmployees);

    return {
      employees,
      search,
      currentPage,
      totalPages,
      sortField,
      sortDirection,
      searchEmployees,
      fetchEmployeesByPage,
      sortEmployees,
      confirmDeleteEmployee,
      pages,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 70px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header h1 {
  margin-bottom: 20px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
}

.search-bar .form-control {
  border-radius: 0.25rem 0 0 0.25rem;
  border-right: 0;
  flex: 1;
}

.search-bar .btn-primary {
  border-radius: 0 0.25rem 0.25rem 0;
}

.table-container {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.table thead th {
  cursor: pointer;
}

.table thead th.sorted {
  background-color: #f8f9fa;
}

.table tbody td {
  vertical-align: middle;
}

.table tbody td .btn {
  margin: 0 2px;
}

.pagination {
  justify-content: center;
}

.page-item.disabled .page-link {
  pointer-events: none;
  cursor: default;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}
</style>
