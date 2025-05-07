<script setup>
import { capitalize, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MainMeteoWeeklySectionDetails from './MainMeteoWeeklySectionDetails.vue';

const props = defineProps({
    weather: Array,
}), messages = {
    fr: {
        temperature: {
            title: 'Temperature',
            min: 'Minimale',
            max: 'Maximale',
        },
        humidity: {
            title: 'Humidité',
            precipitation: 'Precipitation',
            rain: 'Pluie',
            showers: 'Douches',
            snow: 'Neige',
        },
        sunlight: {
            title: 'Luminosité',
            sunrise: 'Levé du soleil',
            sunset: 'Couché du soleil',
            date: 'Date',
        },
        wind: {
            title: 'Vent',
            speed: 'Vitesse',
            direction: 'Direction',
        },
        moredetails: 'Voir plus',
        moredetailslabel: 'Voir plus d\'informations sur la météo de la semaine',
    },
    en: {
        temperature: {
            title: 'Temperature',
            apparent: 'Apparent',
            min: 'Minimum',
            max: 'Maximum',
        },
        humidity: {
            title: 'Humidity',
            precipitation: 'Precipitation',
            rain: 'Rain',
            showers: 'Showers',
            snow: 'Snow',
        },
        sunlight: {
            title: 'Sunlight',
            sunrise: 'Sunrise',
            sunset: 'Sunset',
            date: 'Date',
        },
        wind: {
            title: 'Wind',
            speed: 'Speed',
            direction: 'Direction',
        },
        moredetails: 'See more',
        moredetailslabel: 'See more details on weekly weather',
    },
}, { t } = useI18n({ messages }),
    isOpen = ref(false);
const openCloseWeeklySection = () => {
    if (isOpen.value == false) isOpen.value = true
    else isOpen.value = false;
};
onMounted(() => {
    // console.log('Weekly-section: ', props.weather);
});
</script>

<template>
    <div v-for="weather of props.weather" class="flex flex-col items-center w-full h-full">
        <h3 class="text-xl font-semibold">Weekly weather</h3>
        <button @click="openCloseWeeklySection" class="block w-1/2 h-auto my-2 p-1 text-base font-semibold border border-solid border-currentColor" value="" :aria-label="t('moredetailslabel')">{{ t('moredetails') }}</button>
        <section class="grid cards-section w-full h-full mb-auto gap-4">
            <div v-if="isOpen == false" v-for="data of weather.data"
                class="flex flex-col items-center w-auto h-full border border-solid border-currentColor rounded-xl">
                <p v-for="date of data.date" class="flex flex-row items-start text-xl font-semibold gap-2">
                    {{ t('sunlight.date') }}:
                    <span>{{ capitalize(date.day) }}</span>
                    <span>({{ date.date }})</span>
                </p>
                <div v-for="data of data.data">
                    <div v-for="code of data.code" class="flex flex-row items-center w-auto h-auto gap-2">
                        <img :src="`https://openweathermap.org/img/wn/${code.icon}@2x.png`" alt="">
                        <p class="text-lg font-semibold">{{ capitalize(code.description) }}</p>
                    </div>
                    <ul class="grid grid-cols-1 w-full h-full mb-auto p-6 gap-4">
                        <li v-for="temperature of data.temperature" class="flex flex-col items-center">
                            <section class="flex flex-col items-start w-max">
                                <p class="font-semibold">{{ t('temperature.min') }}: <span>{{ temperature.minimum }}</span></p>
                                <p class="font-semibold">{{ t('temperature.max') }}: <span>{{ temperature.maximum }}</span></p>
                            </section>
                        </li>
                    </ul>
                </div>
            </div>
            <MainMeteoWeeklySectionDetails v-else :weather="weather" :messages="messages"></MainMeteoWeeklySectionDetails>
        </section>
    </div>
</template>

<style lang="css" scoped>
.cards-section {
    grid-template-columns: repeat(1, 1fr);
}

@media (orientation: landscape) and (min-width: 63rem) {
    .cards-section {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>