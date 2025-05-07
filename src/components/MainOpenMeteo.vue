<script setup>
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/en-gb";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { ref, reactive, onMounted } from 'vue';
import MainMeteoCard from "./MainMeteoCard.vue";
import { openMeteoEventsList, WMOCodesIconsList } from "@/assets/js/MeteoArrayList";
import { useI18n } from "vue-i18n";
dayjs.extend(customParseFormat), dayjs.extend(updateLocale); // Le site est en français par défaut

const props = defineProps({
    languageCode: String,
    cityName: String,
    longitude: Number,
    latitude: Number,
}),
    { languageCode, cityName, longitude, latitude } = props;

const weatherAPI = ref('https://api.open-meteo.com/v1/forecast?'),
    count = ref(1),
    timezone = ref('Europe/Berlin'),
    isOpen = ref(false),
    isDay = ref(''),
    messages = {
        fr: {
            buttonOpenMeteoCard: 'Afficher plus de détails sur la météo du jour',
        },
        en: {
            buttonOpenMeteoCard: 'See more details on today weather',
        },
    },
    { t } = useI18n({ messages });

let weatherValues = reactive([]), weatherCode = reactive([]), weeklyWeatherValues = reactive([]),
    current = reactive([]), hourly = reactive([]), daily = reactive([]);

const fetchWeatherValues = async () => {
    const currentList = reactive([1, 4, 5, 6, 10, 12, 14, 16, 17, 18, 19, 20, 21, 22]), hourlyList = reactive([27]), dailyList = reactive([2, 3, 25, 26]);
    filterEventsValues(currentList, openMeteoEventsList, current),
        filterEventsValues(hourlyList, openMeteoEventsList, hourly),
        filterEventsValues(dailyList, openMeteoEventsList, daily),
        count.value = 1;

    await fetch(`${weatherAPI.value}latitude=${latitude}&longitude=${longitude}&current=${current}&hourly=${hourly}&daily=${daily}&timezone=${timezone.value}&language=${languageCode}&forecast_days=${count.value}`).then(res => {
        if (!res.ok) {
            console.log('No weather found');
            throw new Error('No weather found');
        }
        return res.json()
    }).then(data => {
        return weatherValues.push({
            longitude: data.longitude,
            latitude: data.latitude,
            timezone: data.timezone,
            timezone_abbrevation: data.timezone_abbrevation,
            sunshine_duration: [data.hourly],
            data: [{
                time: dayjs(data.current.time).format('HH:mm'),
                interval: data.current.interval + data.current_units.interval,
                temperature: [{
                    now: data.current.temperature_2m + data.current_units.temperature_2m,
                    apparent: data.current.apparent_temperature + data.current_units.apparent_temperature,
                    minimum: data.daily.temperature_2m_min + data.daily_units.temperature_2m_min,
                    maximum: data.daily.temperature_2m_max + data.daily_units.temperature_2m_max,
                }],
                humidity: [{
                    relative_humidity: data.current.relative_humidity_2m + data.current_units.relative_humidity_2m,
                    precipitation: data.current.precipitation + data.current_units.precipitation,
                    rain: data.current.rain + data.current_units.rain,
                    showers: data.current.showers + data.current_units.showers,
                    snowfall: data.current.snowfall + data.current_units.snowfall,
                    cloud: data.current.cloud_cover + data.current_units.cloud_cover,
                }],
                pressure: [{
                    pressure: data.current.pressure_msl + data.current_units.pressure_msl,
                    surface_pressure: data.current.surface_pressure + data.current_units.surface_pressure,
                    sea_pressure: data.current.pressure_msl + data.current_units.pressure_msl,
                }],
                wind: [{
                    speed: data.current.wind_speed_10m + data.current_units.wind_speed_10m,
                    direction: data.current.wind_direction_10m + data.current_units.wind_direction_10m,
                }],
                sunlight: [{
                    sunrise: dayjs(data.daily.sunrise).format('HH:mm'),
                    sunset: dayjs(data.daily.sunset).format('HH:mm'),
                    date: dayjs(data.daily.time).format('DD/MM/YYYY'),
                }],
                weather_code: data.current.weather_code,
            }],
        }),
            data.current.is_day == 1 ? isDay.value = 'day' : isDay.value = 'night'
    })
    if (weatherValues.length > 0) filterWeatherValues(weatherValues, WMOCodesIconsList, weatherCode);
    if(isDay.value.length !== 0) fetchFiveDaysWeatherValues();

    return weatherValues, weatherCode
},
    fetchFiveDaysWeatherValues = async () => {
        const dailyList = reactive([2, 3, 7, 8, 9, 11, 13, 15, 17, 23, 24, 25, 26]);
        count.value = 4, filterEventsValues(dailyList, openMeteoEventsList, daily);
        await fetch(`${weatherAPI.value}latitude=${latitude}&longitude=${longitude}&daily=${daily}&current=is_day&timezone=${timezone.value}&language=${languageCode}&forecast_days=${count.value}`).then(res => {
            if (!res.ok) {
                console.log('No weather found');
                throw new Error('No weather found');
            }
            return res.json()
        }).then(data => {
            let daily = reactive([data.daily]), weekly = reactive([]);
            daily.map(content => {
                return content.time.map((v, i) => weekly.push({
                    date: [{
                        day: dayjs(v).locale(props.languageCode).format('dddd'),
                        date: dayjs(v).format('DD/MM'),
                    }],
                    data: [{
                        code: WMOCodesIconsList.filter(v => v.code == content.weather_code[i]).map(result => result.data.filter(v => v.id == isDay.value)).map(res => res.map(r => {
                            return {
                                id: r.id, description: r.description.map(v => v[
                                    r.description.map(v => Object.keys(v).filter(e => e == props.languageCode)[0]).reduce((acc, value) => acc + value)
                                ]).reduce((acc, value) => acc + value), icon: r.icon
                            }
                        }).reduce((acc, value) => acc + value)),
                        temperature: [{
                            minimum: content.temperature_2m_min[i] + data.daily_units.temperature_2m_min,
                            maximum: content.temperature_2m_max[i] + data.daily_units.temperature_2m_max,
                        }],
                        humidity: [{
                            precipitation: content.precipitation_sum[i] + data.daily_units.precipitation_sum,
                            precipitation_hours: content.precipitation_hours[i] + data.daily_units.precipitation_hours,
                            precipitation_probability_max: content.precipitation_probability_max[i] + data.daily_units.precipitation_probability_max,
                            rain: content.rain_sum[i] + data.daily_units.rain_sum,
                            showers: content.showers_sum[i] + data.daily_units.showers_sum,
                            snowfall: content.snowfall_sum[i] + data.daily_units.snowfall_sum,
                        }],
                        sunlight: [{
                            sunrise: dayjs(content.sunrise[i]).format('HH:mm'),
                            sunset: dayjs(content.sunset[i]).format('HH:mm'),
                        }],
                        wind: [{
                            speed: content.wind_speed_10m_max[i] + data.daily_units.wind_speed_10m_max,
                            direction: content.wind_direction_10m_dominant[i] + data.daily_units.wind_direction_10m_dominant,
                        }],
                    }],
                    weather_code: content.weather_code[i],
                }))
            })
            return weeklyWeatherValues.push({
                longitude: data.longitude,
                latitude: data.latitude,
                timezone: data.timezone,
                timezone_abbreviation: data.timezone_abbreviation,
                data: weekly
            })
        })
        return weeklyWeatherValues
    },
    filterWeatherValues = (array, list, final) => {
        array.map(content => {
            return content.data.map(value => {
                list.filter(weather => weather.code == value.weather_code).map(result => {
                    return result.data.filter(v => v.id == isDay.value)
                        .map(res => final.push({
                            id: res.id,
                            description: res.description.map(v => v[
                                res.description.map(v => Object.keys(v).filter(e => e == props.languageCode)[0]).reduce((acc, value) => acc + value)
                            ]).reduce((acc, value) => acc + value),
                            icon: res.icon
                        }))
                })
            })
        })
    },
    filterEventsValues = (array, list, final) => {
        array.map(value => {
            return list.filter(e => e.id == value).map(result => {
                final.push(result.value)
            })
        })
    };

onMounted(() => {
    fetchWeatherValues();
    // console.log(weatherValues, weatherCode, props.languageCode)
});
</script>

<template>
    <div v-show="weatherValues" v-for="city in weatherValues"
        class="flex flex-row justify-between items-center w-full h-auto p-2" :key="city.id">
        <div class="flex flex-row items-center">
            <h3 class="flex flex-row items-center text-lg w-auto h-auto min-w-56 gap-2">
                <font-awesome-icon icon="fa-solid fa-cloud-rain"></font-awesome-icon>
                <span>Open-Meteo.com</span>
            </h3>
            <div v-for="data of city.data" class="flex flex-row items-center w-auto h-auto gap-2">
                <img v-for="code of weatherCode" :src="`https://openweathermap.org/img/wn/${code.icon}@2x.png`" alt="">
                <p v-for="temperature of data.temperature" class="text-lg font-semibold">{{ temperature.now }}</p>
                <p v-for="code of weatherCode" class="text-lg font-semibold">{{ code.description }}</p>
            </div>
        </div>
        <button @click="isOpen = !isOpen" class="w-12 h-12 m-2 border-none rounded-2xl cursor-pointer">
            <span class="sr-only">{{ t('buttonOpenMeteoCard') }}</span>
            <font-awesome-icon v-if="isOpen == false" icon="fa-solid fa-arrow-down"></font-awesome-icon>
            <font-awesome-icon v-else icon="fa-solid fa-arrow-up"></font-awesome-icon>
        </button>
    </div>
    <MainMeteoCard :weather="weatherValues" :weathercode="weatherCode" :weeklyweather="weeklyWeatherValues"
        :is-open="isOpen"></MainMeteoCard>
</template>

<style scoped></style>