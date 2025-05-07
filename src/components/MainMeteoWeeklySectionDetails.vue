<script setup>
import { capitalize } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    weather: Object,
    messages: Object,
}),
    { weather, messages } = props,
    { t } = useI18n({ messages });
</script>

<template>
    <div v-for="data of weather.data"
        class="flex flex-col items-center w-auto h-full border border-solid border-currentColor rounded-xl">
        <p v-for="date of data.date" class="flex flex-row items-start text-xl font-semibold gap-2">
            {{ t('sunlight.date') }}:
            <span>{{ capitalize(date.day) }}</span>
            <span>({{ date.date }})</span>
        </p>
        <div v-for="data of data.data" class="flex flex-col items-center w-full h-full">
            <div v-for="code of data.code" class="flex flex-row items-center w-auto h-auto gap-2">
                <img :src="`https://openweathermap.org/img/wn/${code.icon}@2x.png`" alt="">
                <p class="text-lg font-semibold">{{ capitalize(code.description) }}</p>
            </div>
            <ul class="grid cards-list w-full h-full mb-auto px-3 py-6 gap-4">
                <li v-for="temperature of data.temperature" class="flex flex-col items-center">
                    <h3 class="text-lg font-semibold">
                        <font-awesome-icon icon="fa-solid fa-temperature-full"></font-awesome-icon>
                        {{ t('temperature.title') }}
                    </h3>
                    <section class="flex flex-col items-start w-max">
                        <p class="font-semibold">{{ t('temperature.min') }}: <span>{{ temperature.minimum }}</span></p>
                        <p class="font-semibold">{{ t('temperature.max') }}: <span>{{ temperature.maximum }}</span></p>
                    </section>
                </li>
                <li v-for="humidity of data.humidity" class="flex flex-col items-center">
                    <h3 class="text-lg font-semibold">
                        <font-awesome-icon icon="fa-solid fa-water"></font-awesome-icon>
                        {{ t('humidity.title') }}
                    </h3>
                    <section class="flex flex-col items-start w-max">
                        <p class="font-semibold">{{ t('humidity.precipitation') }}: <span>{{ humidity.precipitation }}</span></p>
                        <p class="font-semibold">{{ t('humidity.rain') }}: <span>{{ humidity.rain }}</span></p>
                        <p class="font-semibold">{{ t('humidity.showers') }}: <span>{{ humidity.showers }}</span></p>
                        <p class="font-semibold">{{ t('humidity.snow') }}: <span>{{ humidity.snowfall }}</span></p>
                    </section>
                </li>
                <li v-for="sunlight of data.sunlight" class="flex flex-col items-center">
                    <h3 class="text-lg font-semibold">
                        <font-awesome-icon icon="fa-solid fa-thermometer"></font-awesome-icon>
                        {{ t('sunlight.title') }}
                    </h3>
                    <section class="flex flex-col items-start w-max">
                        <p class="font-semibold">{{ t('sunlight.sunrise') }}: <span>{{ sunlight.sunrise }}</span></p>
                        <p class="font-semibold">{{ t('sunlight.sunset') }}: <span>{{ sunlight.sunset }}</span></p>
                    </section>
                </li>
                <li v-for="wind of data.wind" class="flex flex-col items-center">
                    <h3 class="text-lg font-semibold">
                        <font-awesome-icon icon="fa-solid fa-wind"></font-awesome-icon>
                        {{ t('wind.title') }}
                    </h3>
                    <section class="flex flex-col items-start w-max">
                        <p class="font-semibold">{{ t('wind.speed') }}: <span>{{ wind.speed }}</span></p>
                        <p class="font-semibold">{{ t('wind.direction') }}: <span>{{ wind.direction }}</span></p>
                    </section>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="css" scoped>
.cards-list {
    grid-template-columns: repeat(2, 1fr);
}

@media (orientation: landscape) and (min-width: 63rem) {
    .cards-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>