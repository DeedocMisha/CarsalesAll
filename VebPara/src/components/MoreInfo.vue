<template>
  <Header></Header>

  <div class="car-details-container">
    <h1>ПОДРОБНЕЕ О МАШИНЕ</h1>

    <template v-if="isLoading">
      <p>Загрузка данных...</p>
    </template>
    <template v-else-if="error">
      <p class="error">{{ error }}.Проверьсте регистранию или авторизацию или балланс</p>
    </template>
    <template v-else-if="car">
      <h2>{{ car.name }}</h2>
      <div class="card-image">
        <img :src="car.image_url" :alt="car.name">
      </div>
      <hr class="divider">

      <h3>Технические характеристики</h3>

      <table class="specs-table">
        <tbody>
        <tr>
          <td>Тип топлива</td>
          <td>{{ car.fuel_type || "Нету"}}</td>
        </tr>
        <tr>
          <td>Максимальная скорость</td>
          <td>{{ (car.speed ) || "Нету" }} </td>
        </tr>
        <tr>
          <td>Пробег</td>
          <td>{{ car.mileage || "Нету"}} </td>
        </tr>
        <tr>
          <td>Количество владельцев</td>
          <td>{{ car.owner_count || "Нету"}}</td>
        </tr>
        <tr>
          <td>Рейтинг</td>
          <td>{{ car.rating /5 || "Нету"}}</td>
        </tr>
        <tr>
          <td>Описание</td>
          <td>{{ car.description }}</td>
        </tr>
        <tr>
          <td>Наличие на складе</td>
          <td>{{ car.stock_quantity }} шт.</td>
        </tr>
        </tbody>
      </table>

      <p class="price"><strong>Цена: {{ formatPrice(car.price) }} ₽</strong></p>

      <div class="actions">
        <div class="checkbox-group">
          <label>
            <input type="checkbox" v-model="buyChecked"> Согласие на обработку персональных данных
          </label>
        </div>
        <button class="buy-button" @click="handleBuy" :disabled="!buyChecked">
          Оформить заказ
        </button>
      </div>

      <hr class="divider">

      <h3>Часто покупаемые:</h3>
      <div v-if="popularCarsLoading" class="loading-popular">
        Загрузка популярных автомобилей...
      </div>
      <div v-else-if="popularCarsError" class="error-popular">
        {{ popularCarsError }}
      </div>
      <div v-else-if="popularCars && popularCars.length" class="popular-cars-grid">
        <div v-for="popularCar in popularCars" :key="popularCar.id" class="popular-car-card">
          <img :src="popularCar.image_url" :alt="popularCar.name" class="popular-car-image">
          <div class="popular-car-info">
            <h4>{{ popularCar.name }}</h4>
            <p>{{ formatPrice(popularCar.price) }} ₽</p>
            <p>Рейтинг: {{ popularCar.rating }}/5</p>
          </div>
          <router-link
              :to="`/car/${popularCar.product_id}`"
              class="details-button"
              @click.native="refreshData"
          >
            Подробнее
          </router-link>
        </div>

      </div>
      <div v-else class="no-popular-cars">
        <MostFavourites></MostFavourites>
      </div>
    </template>
  </div>
  <Footer></Footer>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue';
import Footer from "@/components/Footer.vue";
import MostFavourites from "@/components/MostFavourites.vue";
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const route = useRoute();

const car = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const buyChecked = ref(false);
const popularCars = ref<any[]>([]);
const popularCarsLoading = ref(false);
const popularCarsError = ref<string | null>(null);

const refreshData = () => {
setTimeout(()=>window.location.reload(), 10);

}

// Получение популярных автомобилей
const fetchPopularCars = async () => {
  popularCarsLoading.value = true;
  popularCarsError.value = null;
  try {
    // 1. Получаем все автомобили
    const carsResponse = await axios.get('api/favourites/getAllFavourites');
    const allCars = carsResponse.data;

    // 2. Сортируем по рейтингу (предполагая, что rating есть в данных)
    const sortedCars = [...allCars].sort((a, b) => b.rating - a.rating);

    // 3. Фильтруем автомобили и исключаем текущий
    const currentCarId = parseInt(route.params.id as string);
    popularCars.value = sortedCars
        .filter(car => car.id !== currentCarId)
        .slice(0, 3); // Берем топ 3 по рейтингу

  } catch (err: any) {
    popularCarsError.value = 'Не удалось загрузить популярные автомобили';
    console.error('Ошибка при загрузке популярных автомобилей:', err);
  } finally {
    popularCarsLoading.value = false;
  }
};

// Форматирование цены
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

// Форматирование пробега
const formatMileage = (mileage: number) => {
  return new Intl.NumberFormat('ru-RU').format(mileage);
};

// Получение данных конкретного автомобиля
const fetchCar = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const carId = route.params.id;
    const response = await axios.get(`api/products/GetProdById/${carId}`);
    car.value = response.data;
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки данных';
    console.error('Ошибка при загрузке автомобиля:', err);
  } finally {
    isLoading.value = false;
  }
};

const handleBuy = async () => {
  if (!buyChecked.value || !car.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');

    const decode = jwtDecode(token);
    const Userid = decode.Id;

    console.log('Car object:', car.value); // Debug log

    const orderData = {
      userId: Userid,
      product_id: car.value.product_id, // Changed from product_Id to id
      amount: car.value.price
    };

    console.log('Order payload:', orderData); // Debug log

    const response = await axios.post('api/orders/createOrder', orderData);

    if (response.data.message) {
      alert(response.data.message);
    } else {
      alert(`Заказ на автомобиль ${car.value.name} успешно оформлен!`);
    }

    await Promise.all([fetchCar(), fetchPopularCars()]);

  } catch (err: any) {
    const errorMessage = err.response?.data?.message ||
        err.response?.data?.error?.message ||
        err.message ||
        'Ошибка при оформлении заказа';
    error.value = errorMessage;
    alert(`Ошибка: ${errorMessage}`);
    console.error('Order error details:', {
      error: err,
      response: err.response?.data
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCar();
  fetchPopularCars();
});
</script>

<style scoped>
.car-details-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  text-align: center;
  margin-bottom: 15px;
}

h3 {
  font-size: 18px;
  margin: 20px 0 10px;
}

.divider {
  border: 0;
  height: 1px;
  background: #ccc;
  margin: 20px 0;
}

.card-image {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.card-image img {
  height: 400px;
  width: auto;
  border-radius: 8px;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.specs-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.specs-table td:first-child {
  font-weight: bold;
  width: 30%;
  color: #555;
}

.price {
  font-size: 24px;
  text-align: right;
  margin: 25px 0;
  color: #d32f2f;
  font-weight: bold;
}

.actions {
  margin: 30px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.buy-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy-button:hover {
  background-color: #45a049;
}

.buy-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #d32f2f;
  text-align: center;
  padding: 20px;
  background: #ffebee;
  border-radius: 4px;
}

.popular-cars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.popular-car-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.3s;
}

.popular-car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.popular-car-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.popular-car-info {
  margin-top: 10px;
}

.popular-car-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.popular-car-info p {
  margin: 5px 0;
  font-size: 14px;
}

.loading-popular,
.error-popular,
.no-popular-cars {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  background: #f5f5f5;
  border-radius: 4px;
}

.error-popular {
  color: #d32f2f;
  background: #ffebee;
}
</style>