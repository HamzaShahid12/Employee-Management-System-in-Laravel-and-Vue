<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <span class="text-warning">Employee</span> Management
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">{{ $t('Employee List') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/departments">{{ $t('Departments') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/positions">{{ $t('Positions') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/events">{{ $t('Events') }}</router-link>
          </li>
          <li class="nav-item ms-3">
            <button class="btn btn-custom" @click="toggleLanguage">
              {{ currentLanguage === 'en' ? $t('Switch اردو') : $t('SwitchToEnglish') }}
            </button>
          </li>
          <li class="nav-item ms-3">
            <NotificationBell />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import NotificationBell from './NotificationBell.vue';

export default {
  components: {
    NotificationBell,
  },
  data() {
    return {
      currentLanguage: this.$i18n.locale
    }
  },
  methods: {
    toggleLanguage() {
      const newLanguage = this.currentLanguage === 'en' ? 'ur' : 'en';
      this.$i18n.locale = newLanguage;
      this.currentLanguage = newLanguage;
    }
  }
}
</script>

<style scoped>
.btn-custom {
  border: 2px solid rgb(255, 192, 1);
  color: white;
  background-color: transparent;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.btn-custom:hover {
  background-color: #ffdb0f;
  color: black;
}

.navbar-nav {
  display: flex;
  align-items: center;
}

.nav-item {
  margin-left: 2rem;
}

.nav-item:last-child {
  margin-left: 10rem;
}
</style>
