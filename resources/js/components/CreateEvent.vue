<template>
    <div class="container">
      <h1>{{ isEditMode ? $t('Edit Event') : $t('Create Event') }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="name" class="form-label">{{ $t('Name') }}</label>
          <input
            type="text"
            v-model="event.name"
            class="form-control"
            id="name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="date" class="form-label">{{ $t('Date') }}</label>
          <input
            type="date"
            v-model="event.date"
            class="form-control"
            id="date"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary">
          {{ isEditMode ? $t('Update') : $t('Create') }}
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        event: {
          name: '',
          date: ''
        },
        isEditMode: false
      };
    },
    created() {
      if (this.$route.params.id) {
        this.isEditMode = true;
        this.fetchEvent();
      }
    },
    methods: {
      fetchEvent() {
        const id = this.$route.params.id;
        axios.get(`/api/events/${id}`)
          .then(response => {
            this.event = response.data;
          })
          .catch(error => {
            console.error('Error fetching event:', error);
            // Handle error
          });
      },
      handleSubmit() {
        if (this.isEditMode) {
          this.updateEvent();
        } else {
          this.createEvent();
        }
      },
      createEvent() {
        axios.post('/api/events', this.event)
          .then(() => {
            this.$router.push('/events');
          })
          .catch(error => {
            console.error('Error creating event:', error);
            // Handle error
          });
      },
      updateEvent() {
        const id = this.$route.params.id;
        axios.put(`/api/events/${id}`, this.event)
          .then(() => {
            this.$router.push('/events');
          })
          .catch(error => {
            console.error('Error updating event:', error);
            // Handle error
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    margin: 2em auto;
    max-width: 600px;
    padding: 2em;
  }
  </style>
  