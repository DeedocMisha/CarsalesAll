<template>
  <Header/>
  <div class="company-page">
    <header class="header">
      <center>
      <h1>О компании</h1>
      </center>
    </header>
    <section class="content">
      <div class="text-section">
        <h2>Автоцентр «Авалон»</h2>
        <a>
          Автоцентр «Авалон» — один из крупнейших дилеров Санкт-Петербурга. Портфель автоцентра включает более 20 брендов ведущих зарубежных автоконцернов. Все автомобили проходят тщательную проверку и предпродажную подготовку.
        </a>
        <a>
          Мы предоставляем бесплатную помощь в подборе, проводим криминалистическую проверку, а также выкупаем и обмениваем автомобили с пробегом.
        </a>
        <a>
          Мы сотрудничаем с главными банками и страховыми компаниями, предоставляя клиентам возможность оформления страховки КАСКО и ОСАГО, а также автокредита, не выходя из салона.
        </a>
        <a>
          «Авалон» активно развивается и с большим вниманием относится к пожеланиям клиентов, уровню сервиса и квалификации персонала.<br><br><br>
        </a>
      </div>
      <div class="swiper mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <img src="../assets/images/Salon.jpg" alt="Автоцентр Авалон">
          </div>
          <div class="swiper-slide">
            <img style="display: flex; align-items: center" src="../assets/images/Magaz.webp" alt="Автомобили в салоне">
          </div>
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </section>
  </div>
  <Footer/>
</template>

<script>
import Header from "@/components/Header.vue";
import { defineComponent, onMounted } from "vue";
import Footer from "@/components/Footer.vue";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

export default defineComponent({
  components: {Header, Footer},
  setup() {
    onMounted(() => {
      new Swiper('.mySwiper', {
        direction: 'horizontal',
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    });
  }
});
</script>

<style scoped>
.text-section{
  padding-left: 100px;
  padding-right: 100px;
}

.company-page {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.header {
  border-bottom: 2px solid gray;
  margin-bottom: 10px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px
}

.swiper {
  width: 100%;
  max-width: 600px;
  height: 400px;
  margin: 0 auto;
}

.swiper-wrapper {
  display: flex;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
}
.swiper-slide img {
  object-fit: contain;  /* Сохраняет пропорции */
  max-height: 100%;
  max-width: 100%;
  margin: auto;  /* Помогает с центрированием */
}


.swiper-button-prev,
.swiper-button-next {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.swiper-pagination {
  bottom: 10px;
}


h1, h2, a {
  color: black;
}
</style>
