import "@/assets/css/style.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createHead } from "@unhead/vue/client";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHeart, faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { faSlack } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowDown,
  faArrowUp,
  faCloudRain,
  faSearch,
  faTemperatureFull,
  faThermometer,
  faWater,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { createI18n } from "vue-i18n";

library.add(
  faHeart,
  faSlack,
  faCloudRain,
  faArrowUp,
  faArrowDown,
  faTemperatureFull,
  faWater,
  faThermometer,
  faSun,
  faWind,
  faSearch,
  faMoon
);

const app = createApp(App),
  head = createHead(),
  i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: "fr",
  });

app
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(head)
  .use(i18n)
  .mount("#app");