<script setup>
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/en-gb";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { reactive, ref } from 'vue';
import MainOpenWeather from "@/components/MainOpenWeather.vue";
import MainOpenMeteo from "@/components/MainOpenMeteo.vue";
import { useHead } from "@unhead/vue";
import { useI18n } from "vue-i18n";
dayjs.extend(customParseFormat), dayjs.extend(updateLocale); // Le site est en français par défaut

const props = defineProps({
    language: String,
    themeColor: String,
}),
    geocodingAPI = ref('https://geocoding-api.open-meteo.com/v1/search?'),
    cityValue = ref(''),
    geocodingValues = reactive([]),
    limit = ref(1),
    messages = {
        fr: {
            message: {
                title: "Aggregateur meteo",
                searchbarPlaceHolder: 'Entrez un nom de ville',
                validateSearch: 'Valider la recherche',
                subtitle: 'Météo de',
            },
        },
        en: {
            message: {
                title: "WeatherApp aggregator",
                searchbarPlaceHolder: 'Enter a city name',
                validateSearch: 'Validate search',
                subtitle: 'Weather at'
            },
        },
    },
    { t } = useI18n({ messages });

const getGeocodingValues = async (city) => {
    geocodingValues.splice(0, geocodingValues.length);
    await fetch(geocodingAPI.value + 'name=' + city + '&count=' + limit.value + '&language=' + props.language + '&format=json').then(res => {
        if (!res.ok) {
            console.log('No weather found');
            throw new Error('No weather found');
        }
        return res.json()
    }).then(data => data.results.map(value => geocodingValues.push(value)))
};

console.log(geocodingValues)

useHead({
    title: 'WeatherApp',
    description: 'WeatherApp Aggregator made with Vue'
});
</script>

<template>
    <div class="flex flex-col items-center">
        <h1 class="text-3xl font-semibold">{{ t('message.title') }}</h1>
        <section class="flex flex-col items-center w-full h-full">
            <div class="w-full h-full m-4 p-8">
                <div class="flex flex-row justify-center items-center w-full h-11">
                    <label for="searchinput" class="sr-only">Search</label>
                    <input v-model="cityValue" @keypress.enter="getGeocodingValues(cityValue)" type="search"
                        id="searchinput" class="w-3/4 h-full py-2 px-4 border-none rounded-3xl placeholder-current"
                        :class="[props.themeColor == 'light' ? 'bg-gray-200' : 'bg-gray-500']"
                        :placeholder="t('message.searchbarPlaceHolder')">
                    <button @click="getGeocodingValues(cityValue)" type="submit" id="submitbtn"
                        class="flex flex-row justify-center items-center w-9 h-9 border-none rounded-xl cursor-pointer relative right-16"
                        :class="[props.themeColor == 'light' ? 'bg-gray-200' : 'bg-gray-500']"
                        :aria-label="t('message.validateSearch')">
                        <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
                    </button>
                </div>
            </div>
        </section>
        <div v-show="geocodingValues.length > 0" class="flex flex-col items-center w-full h-full rounded-3xl card">
            <div v-for="geo of geocodingValues" class="flex flex-col items-center w-full h-full" :key="props.language">
                <h2 class="text-xl font-semibold">{{ t('message.subtitle') }} {{ geo.name }}</h2>
                <MainOpenWeather :language-code="props.language" :city-name="geo.name" :longitude="geo.longitude"
                    :latitude="geo.latitude"></MainOpenWeather>
                <MainOpenMeteo :language-code="props.language" :city-name="geo.name" :longitude="geo.longitude"
                    :latitude="geo.latitude"></MainOpenMeteo>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card {
    background: var(--color-bg-article);
    border: 1px solid var(--color-bg-article-2);
}

input[type="search"]::-webkit-search-cancel-button {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

.description {
    text-transform: capitalize;
    margin-left: 8px;
}

.search {
    right: 15%;
}
</style>