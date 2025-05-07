<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useLocalStorage, usePreferredDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n';

const props = defineProps({
    themeColor: String,
}),
    { themeColor } = props,
    emits = defineEmits(['update:themecolor']);
const isDark = usePreferredDark(), store = useLocalStorage('themeColor'), themeValue = ref(''), themeIcon = ref('moon'),
    messages = {
        fr: {
            label: 'Cliquez sur ce bouton pour changer le thème du site - Thème actuel: ',
        },
        en: {
            label: 'Click on this button to change this site theme - Actual theme: ',
        }
    }, { t } = useI18n({ messages });

const setTheme = (theme) => {
    emits('update:themecolor', theme),
        store.value = theme,
        themeValue.value = theme
},
    toggleTheme = () => {
        if (themeValue.value === 'light') {
            setTheme('dark'),
                themeIcon.value = 'sun'
        } else if (themeValue.value === 'dark') {
            setTheme('light'),
                themeIcon.value = 'moon'
        }
    },
    getMediaPreference = () => {
        if (!isDark) return 'dark'
        else return 'light'
    };

onMounted(() => {
    const initUserTheme = store.value || getMediaPreference();
    setTheme(initUserTheme);
});

watchEffect(() => {
    if (!themeValue.value) setTheme(themeColor)
    else setTheme(themeValue.value)
});
</script>

<template>
    <div class="flex flex-row-reverse items-center w-full h-full">
        <button @click="toggleTheme()" type="button"
            class="flex flex-col justify-center items-center w-auto h-auto cursor-pointer theme-toggle"
            :class="[themeValue == 'light' ? 'night' : 'day']">
            <span class="sr-only">{{ t('label') }} {{ themeValue }}</span>
            <font-awesome-icon :icon="['far', themeIcon]"></font-awesome-icon>
        </button>
    </div>
</template>

<style lang="css" scoped>
.theme-toggle {
    width: calc(var(--element-size) * 0.5);
    height: calc(var(--element-size) * 0.5);
    background-color: rgb(var(--color-background));
    border-radius: 50%;
    transform: translateX(0);
    transition: transform 0.3s ease, background-color 0.5s ease;
}

.night {
    box-shadow: 0px 0px 5px 5px var(--color-blue);
}

.day {
    box-shadow: 0px 0px 5px 5px orange;
}
</style>