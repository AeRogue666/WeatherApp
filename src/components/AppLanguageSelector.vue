<script setup>
import { LanguagesList } from '@/assets/js/MeteoArrayList';
import { onClickOutside, useWindowSize } from '@vueuse/core';
import { reactive, ref, useTemplateRef, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
const props = defineProps({
    language: String,
}),
    emits = defineEmits(['update:language']);
const isOpen = ref(false), language = reactive([]),
    { width } = useWindowSize(), i18n = useI18n(),
    target = useTemplateRef < HTMLElement > ('languages');

const filterLanguagesList = (array, final) => {
    array.filter(content => content.lang == props.language).map(content => final.push({ code: content.code, name: content.name, label: content.label }))
},
    setLanguage = (value) => {
        emits('update:language', value)
        i18n.locale.value = value
    };

watchEffect(() => {
    language.splice(0, language.length);
    filterLanguagesList(LanguagesList, language);
    onClickOutside(target, isOpen.value = false);
});
</script>

<template>
    <div class="flex flex-row justify-center items-center w-auto h-full min-w-28 min-h-12 text-center bg-color border solid rounded-lg relative z-index-99"
        :style="[width > 1000 ? `width: ${width / 10 / 16}rem; height: auto;` : '']">
        <button v-for="lang of language" @click="isOpen = !isOpen"
            class="block w-full h-auto p-1 text-base font-semibold"
            :style="[width >= 1000 ? `font-size: clamp(1.1rem, 1vw, 1.5rem);` : '']" :value="lang.code"
            :aria-label="lang.label">{{ lang.name }}</button>
        <div class="w-0 h-0 arrow absolute right-1" :class="[isOpen == true ? 'arrow-up' : 'arrow-down']"></div>
        <div v-show="isOpen == true" ref="languages"
            class="flex flex-col justify-center items-center w-full h-auto min-w-28 min-h-16 bg-color border solid rounded-lg -mt-0.5 absolute top-12">
            <button v-for="language of LanguagesList" :key="`locale-${language.lang}`" :value="language.code"
                @click="setLanguage(language.lang)" :aria-label="language.label"
                class="block w-full h-full min-h-12 p-1 text-base font-semibold relative"
                :style="[width >= 1000 ? `font-size: clamp(1.1rem, 1vw, 1.5rem);` : '']">{{ language.name }}</button>
        </div>
    </div>
</template>

<style scoped>
.arrow {
    border-left: 0.3rem solid transparent;
    border-right: 0.3rem solid transparent;
}

.arrow-up {
    border-bottom: 0.3rem solid;
}

.arrow-down {
    border-top: 0.3rem solid;
}
</style>