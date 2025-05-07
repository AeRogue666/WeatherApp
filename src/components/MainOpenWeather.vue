<script setup>
import dayjs from "dayjs";
import { ref, reactive, onMounted, capitalize } from 'vue';
import MainMeteoCard from "./MainMeteoCard.vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
    languageCode: String,
    cityName: String,
    longitude: Number,
    latitude: Number,
}),
    { languageCode, cityName, longitude, latitude } = props;

const apiKey = ref('67b92f0af5416edbfe58458f502b0a31'),
    weatherAPI = ref('https://api.openweathermap.org/data/2.5/weather?q='),
    weatherValues = reactive([]),
    isOpen = ref(false),
    messages = {
        fr: {
            buttonOpenMeteoCard: 'Afficher plus de détails sur la météo du jour',
        },
        en: {
            buttonOpenMeteoCard: 'See more details on today weather',
        },
    },
    { t } = useI18n({ messages });

const fetchWeatherValues = async () => {
    await fetch(weatherAPI.value + cityName + '&units=metric' + '&lang=' + languageCode + '&appid=' + apiKey.value).then(res => {
        if (!res.ok) {
            console.log('No weather found');
            throw new Error('No weather found');
        }
        return res.json()
    }).then(value => weatherValues.push({
        id: value.id,
        name: value.name,
        timezone: value.timezone,
        longitude: value.coord.lon,
        latitude: value.coord.lat,
        weather: value.weather,
        data: [{
            time: '',
            interval: '',
            temperature: [{
                now: value.main.temp + '°C',
                apparent: value.main.feels_like + '°C',
                minimum: value.main.temp_min + '°C',
                maximum: value.main.temp_max + '°C',
            }],
            humidity: [{
                relative_humidity: value.main.humidity + '%',
            }],
            pressure: [{
                pressure: value.main.pressure + 'hPa',
                surface_pressure: value.main.grnd_level + 'hPa',
                sea_pressure: value.main.sea_level + 'hPa',
            }],
            wind: [{
                speed: value.wind.speed + 'km/h',
                direction: value.wind.deg + '°',
            }],
            sunlight: [{
                sunrise: dayjs.unix(value.sys.sunrise).format('HH:mm'),
                sunset: dayjs.unix(value.sys.sunset).format('HH:mm'),
                date: dayjs().format('DD/MM/YYYY'),
            }],
            weather_code: '',
        }],
        country: value.sys.country
    }))
};

onMounted(() => {
    fetchWeatherValues();
    // console.log(weatherValues);
});
</script>

<template>
    <div v-show="weatherValues" v-for="city of weatherValues"
        class="flex flex-row justify-between items-center w-full h-auto p-2"
        :class="isOpen == false ? 'border-b border-solid' : ''" :key="city.id">
        <div class="flex flex-row items-center">
            <h3 class="flex flex-row items-center text-lg w-auto h-auto min-w-56 gap-2">
                <font-awesome-icon icon="fa-solid fa-cloud-rain"></font-awesome-icon>
                <span>OpenWeatherMap.org</span>
            </h3>
            <div v-for="data of city.data" class="flex flex-row items-center w-auto h-auto gap-2">
                <img v-for="weather of city.weather" :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`" alt="">
                <p v-for="temperature of data.temperature" class="text-lg font-semibold">{{ temperature.now }}</p>
                <p v-for="weather of city.weather" class="text-lg font-semibold">{{ capitalize(weather.description) }}</p>
            </div>
        </div>
        <button @click="isOpen = !isOpen" class="w-12 h-12 m-2 border-none rounded-2xl cursor-pointer">
            <span class="sr-only">{{ t('buttonOpenMeteoCard') }}</span>
            <font-awesome-icon v-if="isOpen == false" icon="fa-solid fa-arrow-down"></font-awesome-icon>
            <font-awesome-icon v-else icon="fa-solid fa-arrow-up"></font-awesome-icon>
        </button>
    </div>
    <MainMeteoCard :weather="weatherValues" :is-open="isOpen"></MainMeteoCard>
</template>

<style scoped></style>