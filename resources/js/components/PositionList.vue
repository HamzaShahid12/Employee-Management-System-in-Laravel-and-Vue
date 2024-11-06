<template>
  <div class="container">
    <header class="header">
      <div class="actions">
        <h1>{{ $t('Position List') }}</h1>
        <router-link to="/positions/create" class="btn btn-primary">
          {{ $t('Create New Position') }}
        </router-link>
      </div>
    </header>

    <section class="table-container mt-4">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>{{ $t('Name') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="position in positions.data" :key="position.id">
            <td>{{ position.name }}</td>
            <td>
              <router-link
                :to="'/positions/edit/' + position.id"
                class="btn btn-warning btn-sm"
              >
                <i class="fas fa-edit"></i> {{ $t('Edit') }}
              </router-link>
              <button
                @click="confirmDeletePosition(position.id)"
                class="btn btn-danger btn-sm ml-2"
              >
                <i class="fas fa-trash-alt"></i> {{ $t('Delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="fetchPositionsByPage(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-for="page in pages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="fetchPositionsByPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="fetchPositionsByPage(currentPage + 1)" aria-label="Next">
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
import { ref, onMounted, computed } from "vue";

export default {
  setup() {
    const positions = ref({ data: [], links: {}, meta: {} });
    const currentPage = ref(1);
    const totalPages = ref(1);

    const fetchPositions = (url = "/api/positions") => {
      axios
        .get(url, { params: { page: currentPage.value } })
        .then((response) => {
          positions.value = response.data;
          currentPage.value = response.data.meta.current_page;
          totalPages.value = response.data.meta.last_page;
        })
        .catch((error) => {
          console.error("Error fetching positions:", error);
        });
    };

    const fetchPositionsByPage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      currentPage.value = page;
      fetchPositions(`/api/positions?page=${page}`);
    };

    const confirmDeletePosition = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this position record!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          deletePosition(id);
          Swal.fire("Deleted!", "The position has been deleted.", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "The position deletion was cancelled :)", "error");
        }
      });
    };

    const deletePosition = (id) => {
      axios
        .delete(`/api/positions/${id}`)
        .then(() => {
          fetchPositions();
        })
        .catch((error) => {
          console.error("Error deleting position:", error);
        });
    };

    onMounted(() => {
      fetchPositions();
    });

    const pages = computed(() => {
      let pages = [];
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i);
      }
      return pages;
    });

    return {
      positions,
      currentPage,
      totalPages,
      fetchPositionsByPage,
      confirmDeletePosition,
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

.table-container {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
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
