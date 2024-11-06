<template>
    <div>
      <button @click="setLocale('en')" :class="{ active: currentLocale === 'en' }">English</button>
      
      <button @click="setLocale('ur')" :class="{ active: currentLocale === 'ur' }">اردو</button>
    </div>
  </template>
  
  <script>
  import { useI18n } from 'vue-i18n'
  
  export default {
    setup() {
      const { locale } = useI18n()
  
      const setLocale = (lang) => {
        locale.value = lang
      }
  
      return {
        currentLocale: locale,
        setLocale
      }
    }
  }
  </script>
  
  <style scoped>
  button {
    margin-right: 10px;
  }
  button.active {
    font-weight: bold;
  }
  </style>
  