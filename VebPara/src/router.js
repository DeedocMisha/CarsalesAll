import { createRouter,createWebHashHistory } from "vue-router";
import Main from "@/components/Main.vue";
import Katalog from "@/components/Kontacts.vue";
import Konfidence from "@/components/Konfidence.vue";
import Rates from "@/components/Rates.vue";
import Kontacts from "@/components/Kontacts.vue";
import AboutСompany from "@/components/AboutСompany.vue";
import Basket from "@/components/Basket.vue";
import MoreInfo from "@/components/MoreInfo.vue"
import Authorization from "@/components/Authorization.vue";
import Moreinfo2 from "@/components/Moreinfo2.vue";
import Registration from "@/components/Registration.vue";
import OftenBuy from "@/components/OftenBuy.vue";
import Location from "@/components/Location.vue"
import Like from "@/components/Like.vue";

export default createRouter ({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: Main },
        { path: '/Kontacts',component: Kontacts },
        { path: '/AboutCompany',component: AboutСompany },
        { path: '/Rates',component: Rates },
        { path: '/Info',component: Konfidence },
        { path: '/Moreinfo2/:id',component: Moreinfo2 },
        { path: '/Katalog',component: Katalog },
        { path: '/Authorization', component: Authorization },
        { path: '/Registration', component: Registration },
        { path: '/Basket', component: Basket },
        { path: '/OftenBuy', component: OftenBuy },
        { path: '/Location', component: Location },
        { path: '/Liked', component: Like },
        { path: '/car/:id', component: MoreInfo },
    ],
    scrollBehavior() {
        return { top: 0 };
    }
})