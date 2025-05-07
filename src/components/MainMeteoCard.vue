<script setup>
import { capitalize } from 'vue';
import { useI18n } from 'vue-i18n';
import MainMeteoWeeklySection from './MainMeteoWeeklySection.vue';

const props = defineProps({
    weather: Array,
    weathercode: Array,
    weeklyweather: Array,
    isOpen: Boolean,
}),
    messages = {
        fr: {
            temperature: {
                title: 'Temperature',
                now: 'Maintenant',
                apparent: 'Apparente',
                min: 'Minimale',
                max: 'Maximale',
            },
            humidity: {
                title: 'Humidité',
                now: 'Maintenant',
                precipitation: 'Precipitation',
                rain: 'Pluie',
                showers: 'Douches',
                snow: 'Neige',
            },
            pressure: {
                title: 'Pression',
                now: 'Maintenant',
                surface: 'Pression de surface',
                sea: 'Pression maritime',
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
            weekly: 'Météo de la semaine',
            notavailable: 'Ce service n\'est pas disponible gratuitement pour cette API',
        },
        en: {
            temperature: {
                title: 'Temperature',
                now: 'Now',
                apparent: 'Apparent',
                min: 'Minimum',
                max: 'Maximum',
            },
            humidity: {
                title: 'Humidity',
                now: 'Now',
                precipitation: 'Precipitation',
                rain: 'Rain',
                showers: 'Showers',
                snow: 'Snow',
            },
            pressure: {
                title: 'Pressure',
                now: 'Now',
                surface: 'Surface pressure',
                sea: 'Sea pressure',
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
            weekly: 'Weekly weather',
            notavailable: 'Not freely available for this API'
        },
    }, { t } = useI18n({ messages });
</script>

<template>
    <div v-show="isOpen == true" v-for="city in props.weather"
        class="flex flex-col items-center w-full h-auto p-2 [&:not(:last-child)]:border-y last:border-t border-solid"
        :key="city.id">
        <div v-for="data in city.data">
            <div v-if="props.weathercode" class="flex flex-row items-center w-auto h-auto gap-2">
                <img v-for="code of props.weathercode" :src="`https://openweathermap.org/img/wn/${code.icon}@2x.png`" alt="">
                <h2 v-for="temperature of data.temperature" class="text-xl font-semibold">{{ temperature.now }}</h2>
                <p v-for="code of props.weathercode" class="text-lg font-semibold">{{ capitalize(code.description) }}</p>
            </div>
            <div v-else v-for="code of city.weather" class="flex flex-row items-center w-auto h-auto gap-2">
                <img :src="`https://openweathermap.org/img/wn/${code.icon}@2x.png`" alt="">
                <h2 v-for="temperature of data.temperature" class="text-xl font-semibold">{{ temperature.now }}</h2>
                <p class="text-lg font-semibold">{{ capitalize(code.description) }}</p>
            </div>
        </div>
        <ul v-for="data in city.data" class="grid card w-full h-full mb-auto gap-4">
            <li v-for="temperature of data.temperature" class="flex flex-col items-center">
                <h3 class="text-lg font-semibold">
                    <font-awesome-icon icon="fa-solid fa-temperature-full"></font-awesome-icon>
                    {{ t('temperature.title') }}
                </h3>
                <section class="flex flex-col items-start w-max">
                    <p class="font-semibold">{{ t('temperature.now') }}: <span>{{ temperature.now }}</span></p>
                    <p class="font-semibold">{{ t('temperature.apparent') }}: <span>{{ temperature.apparent }}</span>
                    </p>
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
                    <p class="font-semibold">{{ t('humidity.now') }}: <span>{{ humidity.relative_humidity }}</span></p>
                    <p class="font-semibold">{{ t('humidity.precipitation') }}: <span>{{ humidity.precipitation }}</span></p>
                    <p class="font-semibold">{{ t('humidity.rain') }}: <span>{{ humidity.rain }}</span></p>
                    <p class="font-semibold">{{ t('humidity.showers') }}: <span>{{ humidity.showers }}</span></p>
                    <p class="font-semibold">{{ t('humidity.snow') }}: <span>{{ humidity.snowfall }}</span></p>
                </section>
            </li>
            <li v-for="pressure of data.pressure" class="flex flex-col items-center">
                <h3 class="text-lg font-semibold">
                    <font-awesome-icon icon="fa-solid fa-thermometer"></font-awesome-icon>
                    {{ t('pressure.title') }}
                </h3>
                <section class="flex flex-col items-start w-max">
                    <p class="font-semibold">{{ t('pressure.now') }}: <span>{{ pressure.pressure }}</span></p>
                    <p class="font-semibold">{{ t('pressure.surface') }}: <span>{{ pressure.surface_pressure }}</span>
                    </p>
                    <p class="font-semibold">{{ t('pressure.sea') }}: <span>{{ pressure.sea_pressure }}</span></p>
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
                    <p class="font-semibold">{{ t('sunlight.date') }}: <span>{{ sunlight.date }}</span></p>
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
        <MainMeteoWeeklySection v-if="props.weeklyweather" :weather="props.weeklyweather"></MainMeteoWeeklySection>
        <div v-else class="flex flex-col items-center w-full h-full">
            <h3 class="text-xl font-semibold">{{ t('weekly') }}</h3>
            <section class="flex flex-col items-center w-full h-full">
                <p class="text-lg font-semibold text-red-500">{{ t('notavailable') }}</p>
            </section>
        </div>
    </div>
</template>

<style lang="css" scoped>
.card {
    grid-template-columns: repeat(2, 1fr);
}

@media (orientation: landscape) and (min-width: 63rem) {
    .card {
        grid-template-columns: repeat(5, 1fr);
    }
}
</style>