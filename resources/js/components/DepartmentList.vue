<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h3">{{ $t('Department List') }}</h1>
      <router-link to="/departments/create" class="btn btn-primary">{{ $t('Create New Department') }}</router-link>
    </div>
    <table class="table table-striped table-bordered">
      <thead class="thead-dark">
        <tr>
          <th scope="col">{{ $t('Name') }}</th>
          <th scope="col">{{ $t('Actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="department in departments.data" :key="department.id">
          <td>{{ department.name }}</td>
          <td>
            <router-link :to="'/departments/edit/' + department.id" class="btn btn-warning btn-sm">
              <i class="fa fa-pencil-alt"></i> {{ $t('Edit') }}
            </router-link>
            <button @click="confirmDeleteDepartment(department.id)" class="btn btn-danger btn-sm ml-2">
              <i class="fa fa-trash-alt"></i> {{ $t('Delete') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="fetchDepartmentsByPage(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-for="page in pages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="fetchDepartmentsByPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="fetchDepartmentsByPage(currentPage + 1)" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref, onMounted, computed } from 'vue';

export default {
  setup() {
    const departments = ref({ data: [], links: {}, meta: {} });
    const currentPage = ref(1);
    const totalPages = ref(1);

    const fetchDepartments = (url = "/api/departments") => {
      axios.get(url, {
        params: {
          page: currentPage.value,
        }
      })
        .then(response => {
          departments.value = response.data;
          currentPage.value = response.data.meta.current_page;
          totalPages.value = response.data.meta.last_page;
        })
        .catch(error => {
          console.error('There was an error fetching the departments!', error);
        });
    };

    const fetchDepartmentsByPage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      currentPage.value = page;
      fetchDepartments(`/api/departments?page=${page}`);
    };

    const deleteDepartment = (id) => {
      axios.delete(`/api/departments/${id}`)
        .then(() => {
          fetchDepartments();
        })
        .catch(error => {
          console.error('There was an error deleting the department!', error);
        });
    };

    const confirmDeleteDepartment = (id) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this department record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          deleteDepartment(id);
          Swal.fire(
            'Deleted!',
            'The department has been deleted.',
            'success'
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'The department deletion was cancelled :)',
            'error'
          );
        }
      });
    };

    onMounted(() => {
      fetchDepartments();
    });

    const pages = computed(() => {
      let pages = [];
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i);
      }
      return pages;
    });

    return { departments, currentPage, totalPages, confirmDeleteDepartment, fetchDepartmentsByPage, pages };
  }
};
</script>

<style scoped>
.container {
  padding-top: 20px;
}

.table {
  margin-top: 20px;
}

.btn-sm i {
  margin-right: 5px;
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
