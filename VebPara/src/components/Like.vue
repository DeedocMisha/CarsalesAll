<template>
  <Header />
  <center><h1>Избранные:</h1></center>
  <main class="container">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Произошла ошибка</h3>
      <p>{{ error }}</p>
      <button class="button" @click="retryLoading">Попробовать снова</button>
    </div>

    <div v-else class="sections">

      <div
          v-for="car in paginatedCars"
          :key="car.product_id"
          class="card"
      >
        <div class="card-image">
          <img :src="car.image_url || placeholderImage" :alt="car.name">
        </div>
        <div class="card-content">
          <h2 class="car-title">{{ car.name }}</h2>
          <p class="car-price">{{car.price }} ₽</p>
          <div class="car-details">
            <div class="detail-item">
              <img src="../assets/images/v88_13.png" alt="Владельцы">
              <span>{{ car.owner_count || 'Нет данных' }} владельца</span>
            </div>
            <div class="detail-item">
              <img src="../assets/images/v88_16.png" alt="Тип топлива">
              <span>{{ car.fuel_type || 'Нет данных' }}</span>
            </div>
            <div class="detail-item">
              <img src="../assets/images/v88_19.png" alt="Объем">
              <span>{{ car.speed || 'Нет данных' }} км/ч</span>
            </div>
            <div class="detail-item">
              <img src="../assets/images/v88_22.png" alt="Пробег">
              <span>{{ car.mileage }} км.</span>
            </div>
            <div class="detail-item">
              <img src="../assets/images/v88_25.png" alt="Рейтинг">
              <span>{{ car.rating || '0' }} / 5 ★</span>
            </div>
          </div>
          <router-link
              :to="`/car/${car.product_id}`"
              class="details-button"
          >
            Подробнее
          </router-link>
        </div>
      </div>


    </div>
    <center>
      <div v-if="filteredCars.length === 0" class="empty-state">

        <h3>Автомобили не найдены</h3>
        <p>Попробуйте изменить параметры поиска</p>
      </div>
    </center>
  </main>
  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const cars = ref([]);
const isLoading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const carsPerPage = 6;
const searchQuery = ref('');
const selectedFuelType = ref('');
const sortOption = ref('price-asc');
const favorites = ref<string[]>([]);
const itemsPerPage = ref(10);
const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image';
const filteredCars = computed(() => {
  return cars.value.filter(car => favorites.value.includes(String(car.product_id)));
});

const paginatedCars = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCars.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCars.value.length / itemsPerPage.value);
});

const fetchFavorites = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Токен не найден - пропускаем загрузку избранного');
      favorites.value = [];
      cars.value = [];
      return;
    }

    const decode = jwtDecode<{ Id: string }>(token);
    if (!decode?.Id) throw new Error('Неверная структура токена');

    const userId = decode.Id;
    const response = await axios.get(`api/favourites/getFavouritesFromUser/${userId}`);

    cars.value = response.data;
    favorites.value = response.data.map((fav: any) => String(fav.product_id));
  } catch (err) {
    console.error('Error fetching favorites:', err);
    favorites.value = [];
    cars.value = [];
    error.value = 'Не удалось загрузить список избранного';
  } finally {
    isLoading.value = false;
  }
};

const retryLoading = async () => {
  error.value = null;
  isLoading.value = true;
  await fetchFavorites();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onMounted(async () => {
  await fetchFavorites();
});
</script>

<style scoped>
.container {
  min-height: 80vh;
  padding: 20px;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}
</style>