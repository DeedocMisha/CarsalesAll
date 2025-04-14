<template>
  <Header/>
  <div class="location-container">
    <h1>Наше местоположение</h1>
    <div id="map" style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto;"></div>
  </div>
  <Footer/>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: { Footer, Header },
  mounted() {
    ymaps.ready(() => {
      const myMap = new ymaps.Map("map", {
        center: [55.76, 37.64], // Координаты центра карты
        zoom: 14 // Увеличение
      });

      // Метка салона
      const salonPlacemark = new ymaps.Placemark(
          [55.76, 37.64], // Координаты салона
          {
            hintContent: "Наш салон",
            balloonContent: `
            <b>Наш салон красоты</b>
            <p>Адрес: г. Москва, ул. Примерная, д. 123</p>
            <p>Часы работы: 9:00 - 21:00</p>
          `
          },
          {
            preset: 'islands#redDotIcon' // Стандартная красная метка
          }
      );

      myMap.geoObjects.add(salonPlacemark);

      // Добавляем кнопки масштабирования
      myMap.controls.add('zoomControl');
    });
  }
};
</script>

<style scoped>
.location-container {
  padding: 20px;
  text-align: center;
}

.address {
  margin-top: 20px;
  font-size: 18px;
  line-height: 1.6;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}
</style>