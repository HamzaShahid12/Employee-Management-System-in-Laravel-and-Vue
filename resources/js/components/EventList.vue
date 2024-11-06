<template>
<div class="container">
    <h1 class="page-title">{{ $t('Events') }}</h1>
    <div class="table-container">
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>{{ $t('Name') }}</th>
                    <th>{{ $t('Date') }}</th>
                    <th>{{ $t('Actions') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in events" :key="event.id">
                    <td>{{ event.name }}</td>
                    <td>{{ event.date }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" @click="confirmEdit(event.id)">
                            <i class="fa fa-edit"></i> {{ $t('edit') }}
                        </button>
                        <button class="btn btn-danger btn-sm" @click="confirmDelete(event.id)">
                            <i class="fa fa-trash"></i> {{ $t('delete') }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <router-link to="/events/create" class="btn btn-primary btn-lg">
            <i class="fa fa-plus"></i> {{ $t('Create New Event') }}
        </router-link>
    </div>
</div>
</template>

  
<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            events: []
        };
    },
    methods: {
        fetchEvents() {
            axios.get('/api/events').then(response => {
                this.events = response.data.data;
            }).catch(error => {
                console.error('Error fetching events:', error);
            });
        },
        confirmEdit(id) {
            Swal.fire({
                title: 'Edit Event',
                text: 'Are you sure you want to edit this event?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, edit it!',
                cancelButtonText: 'Cancel',
            }).then(result => {
                if (result.isConfirmed) {
                    this.editEvent(id);
                }
            });
        },
        confirmDelete(id) {
            Swal.fire({
                title: 'Delete Event',
                text: 'Are you sure you want to delete this event?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
            }).then(result => {
                if (result.isConfirmed) {
                    this.deleteEvent(id);
                }
            });
        },
        editEvent(id) {
            this.$router.push(`/events/edit/${id}`);
        },
        deleteEvent(id) {
            axios.delete(`/api/events/${id}`).then(() => {
                this.fetchEvents();
                Swal.fire('Deleted!', 'The event has been deleted.', 'success');
            }).catch(error => {
                console.error('Error deleting event:', error);
                Swal.fire('Error!', 'There was an error deleting the event.', 'error');
            });
        }
    },
    mounted() {
        this.fetchEvents();
    }
};
</script>

<style scoped>
.container {
    margin: 2em auto;
    max-width: 1200px;
    padding: 3em;
}

.page-title {
    margin-bottom: 1em;
    font-size: 2em;
    font-weight: bold;
    text-align: center;
}

.table-container {
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
}

.table thead {
    background-color: #f8f9fa;
}

.table th {
    padding: 0.75em;
    text-align: left;
    color: #495057;
}

.table td {
    padding: 0.75em;
}

.table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

.table tbody tr:hover {
    background-color: #e9ecef;
}

.btn {
    margin-right: 0.5em;
}

.btn-sm {
    padding: 0.25em 0.5em;
    font-size: 0.875em;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
}

.btn-primary i {
    margin-right: 0.5em;
}

.btn-warning,
.btn-danger {
    display: inline-flex;
    align-items: center;
}

.btn-warning i,
.btn-danger i {
    margin-right: 0.25em;
}
</style>
