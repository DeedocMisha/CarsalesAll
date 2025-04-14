<template><footer>
<div class="footer-container">

  <div class="info-container">
    <div class="horizontal-container">
      <div class="image-container">
        <img style="height: 59px; width: 59px;" src="../assets/images/v57_116.png" alt="Изображение">
      </div>
      <div class="text-container">
        <h2 class="h100">AUTOSHOP</h2>

        <h2>Новые автомобили</h2>

      </div>
    </div>
  </div>

  <div class="info-container">
    <address class="address">
      г. Санкт-Петербург, Ленинградская ул. 1, Кудрово
      <br>
      <span class="phone-number">+7 963 912 66 85</span>
    </address>
    <!-- Ссылки, центрированные и разделенные на несколько колонок -->

    <div class="navbar1" >
      <a href="#" class="nav-link">В НАЛИЧИИ</a>
      <a href="#/OftenBuy" class="nav-link">ЧАСТО ПОКУПАЕМЫЕ</a>
      <a href="#/Rates" class="nav-link">ОТЗЫВЫ</a>
      <a href="#/AboutCompany" class="nav-link">О КОМПАНИИ</a>
      <a href="#/Kontacts" class="nav-link">КОНТАКТЫ</a>
      <a href="#/Authorization" class="nav-link">ВОЙТИ</a>
    </div>


    <p class="privacy-policy">
      <a style="position: absolute; right: 20px" href="#/Info">Политика конфиденциальности</a>
    </p>
  </div>
</div>
</footer>
</template>
<style>

.nav-link {
  flex: 1;
  text-align: center; /* Центрирует текст */
  text-decoration: none; /* Убирает подчеркивание */
  color: black; /* Цвет текста */
  padding: 10px 0; /* Вертикальные отступы у ссылок */
}
.nav-link:hover {
  background-color: #d3d3d3; /* Серый цвет при наведении */
}
</style>