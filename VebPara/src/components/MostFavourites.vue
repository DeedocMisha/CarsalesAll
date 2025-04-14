<template>
  <div class="main-content">
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Загрузка автомобилей...</p>
    </div>

    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button @click="fetchCars" class="retry-button">Попробовать снова</button>
    </div>

    <div v-if="!isLoading && !error" class="sections">
      <div v-if="cars.length === 0" class="empty-state">
        <div class="empty-icon">🚗</div>
        <h3>Автомобили не найдены</h3>
        <p>Попробуйте изменить параметры поиска</p>
      </div>

      <div v-if="cars.length > 0">

        <div v-if="topRatedCars.length > 0" class="top-rated-section">
          <div class="top-rated-cards">
            <div
                v-for="car in topRatedCars"
                :key="'top-'+car.product_id"
                class="top-rated-card"
            >
              <img :src="car.image_url || placeholderImage" :alt="car.name">
              <div class="top-rated-info">
                <h4>{{ car.name }}</h4>
                <p class="rating">Рейтинг: {{ car.rating }} / 5 ★</p>
                <p class="price">{{ car.price }} ₽</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const max = 2; // Максимальное количество топовых автомобилей
const cars = ref([]);
const isLoading = ref(true);
const error = ref(null);
const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image';

// Вычисляемое свойство для топовых автомобилей
const topRatedCars = computed(() => {
  // Фильтруем автомобили с рейтингом
  const ratedCars = cars.value.filter(car => car.rating !== null && car.rating !== undefined);

  // Сортируем по рейтингу (по убыванию)
  ratedCars.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // Берем первые max элементов
  return ratedCars.slice(0, max);
});

const fetchCars = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get('api/favourites/getAllFavourites');
    cars.value = response.data;
  } catch (err) {
    error.value = err.message || 'Ошибка загрузки данных';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => { fetchCars(); });
</script>

<style scoped>
.top-rated-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.top-rated-card {
  background: white;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.top-rated-card img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.top-rated-info {
  padding-top: 10px;
}
</style>
