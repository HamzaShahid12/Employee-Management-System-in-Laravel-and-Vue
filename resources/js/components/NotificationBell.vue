<template>
  <div class="notification-container" @click.stop="toggleDropdown">
    <div class="notification-bell">
      <i :class="{'fa fa-bell': !showDropdown, 'fa fa-bell-slash': showDropdown}">
        <span v-if="notifications.length" class="badge">{{ notifications.length }}</span>
      </i>
    </div>
    <transition name="fade">
      <div v-if="showDropdown" class="dropdown-menu">
        <div v-if="notifications.length === 0" class="dropdown-item no-notifications">
          No notifications
        </div>
        <div v-for="notification in notifications" :key="notification.id" class="dropdown-item" @click="showNotificationDetails(notification)">
          <div class="notification-content">
            <strong>{{ notification.event_name }}</strong>
            <p class="notification-date">{{ notification.event_date }}</p>
          </div>
        </div>
        <button @click="markAsRead" class="btn btn-primary">Mark all as read</button>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      notifications: [],
      showDropdown: false,
      selectedNotification: null
    };
  },
  created() {
    this.fetchNotifications();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    fetchNotifications() {
      axios.get('/api/notifications').then(response => {
        this.notifications = response.data;
      }).catch(error => {
        console.error('Error fetching notifications:', error);
      });
    },
    markAsRead() {
      axios.post('/api/notifications/mark-as-read').then(() => {
        this.notifications = [];
        this.showDropdown = false;
      }).catch(error => {
        console.error('Error marking notifications as read:', error);
      });
    },
    showNotificationDetails(notification) {
      this.selectedNotification = notification;
      this.$router.push(`/events/${notification.event_id}`);
      this.showDropdown = false;
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showDropdown = false;
      }
    }
  }
};
</script>

<style scoped>
.notification-container {
  position: relative;
  display: inline-block;
}

.notification-bell {
  cursor: pointer;
}

.badge {
  background-color: #ff5c5c;
  color: white;
  border-radius: 50%;
  padding: 0.2em 0.5em;
  position: absolute;
  top: -5px;
  right: -10px;
  font-size: 0.75em;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 35px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5em;
  z-index: 1000;
  width: 250px;
  border-radius: 8px;
  overflow: hidden;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-menu.fade-enter-active,
.dropdown-menu.fade-leave-active {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-menu.fade-enter, 
.dropdown-menu.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-item {
  padding: 0.75em 1em;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.dropdown-item.no-notifications {
  text-align: center;
  color: #999;
}

.notification-content {
  display: flex;
  flex-direction: column;
}

.notification-date {
  color: #ffffff;
  font-size: 0.9em;
}

.btn-primary {
  display: block;
  width: 100%;
  padding: 0.5em;
  margin-top: 1em;
  border: none;
  border-radius: 8px;
  background-color: #fafafa;
  color: white;
  font-weight: bold;
}

.fa-bell-slash {
  color: #ffffff;
}
</style>
