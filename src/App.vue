<script setup>
import Main from '@/views/Main.vue'
import AppThemeSelector from '@/components/AppThemeSelector.vue';
import AppLanguageSelector from './components/AppLanguageSelector.vue';
import { ref, watchEffect } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

const language = ref('en'), themeColor = ref('light'), storeTheme = useLocalStorage('themeColor'), storeLang = useLocalStorage('languageCode'),
  messages = {
    fr: {
      copyright: 'Fait avec amour par AurelDev',
    },
    en: {
      copyright: 'Made with love by AurelDev',
    },
  }, 
  { t } = useI18n({ messages });

const getLanguage = () => {
  if (!storeLang.value) {
    storeLang.value = language.value
  }
},
  getTheme = () => {
    if (!storeTheme.value) {
      storeTheme.value = themeColor.value
      document.documentElement.className = themeColor.value
      getTheme();
    } else {
      document.documentElement.className = themeColor.value
    }
  },
  setTheme = (theme) => {
    themeColor.value = theme
  },
  setLanguage = (value) => {
    language.value = value;
    document.documentElement.lang = language.value,
      storeLang.value = language.value;
  };


watchEffect(() => {
  getLanguage();
  getTheme();
});
</script>

<template>
  <header>
    <div class="flex flex-row items-center w-auto h-auto gap-2">
      <AppThemeSelector :theme-color="themeColor" @update:themecolor="setTheme" />
      <AppLanguageSelector :language="language" @update:language="setLanguage" />
    </div>
  </header>

  <main>
    <Main v-slot="language" :language="language" :theme-color="themeColor"></Main>
  </main>

  <footer>
    <div class="flex flex-row justify-center">
      <p>Copyrights 2025-Now - {{ t('copyright') }}</p>
    </div>
  </footer>
</template>

<style scoped></style>