  <template>
    <Header/>
    <center>
      <h2 class="page-title">АВТОМОБИЛИ С ПРОБЕГОМ</h2>
    </center>

    <div class="main-content">

      <div class="filter">

        <a class="filter-title" style="font-weight: bold;">Поиск/фильтры</a>
        <input
            v-model="searchQuery"
            class="search-input"
            type="text"
            placeholder="Поиск по названию..."
            @input="applyFilters"
        >
        <select
            v-model="selectedFuelType"
            class="select-option"
            @change="applyFilters"
        >
          <option value="">Все типы топлива</option>
          <option value="Бензин">Бензин</option>
          <option value="Дизель">Дизель</option>
          <option value="Электро">Электро</option>
          <option value="Гибрид">Гибрид</option>
        </select>
        <select
            v-model="sortOption"
            class="select-option"
            @change="applyFilters"
        >
          <option value="price-asc">Цена (по возрастанию)</option>
          <option value="price-desc">Цена (по убыванию)</option>
          <option value="mileage-asc">Пробег (по возрастанию)</option>
          <option value="mileage-desc">Пробег (по убыванию)</option>
          <option value="name-asc">Название (А-Я)</option>
        </select>
        <button class="button" @click="resetFilters">Сбросить</button>

      </div>



      <div v-if="!isLoading && !error" class="sections">
        <div v-if="filteredCars.length === 0" class="empty-state">
          <div class="empty-icon">🚗</div>
          <h3>Автомобили не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>

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
            <p class="car-price">{{ formatPrice(car.price) }} ₽</p>
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
                <span>{{ formatMileage(car.mileage) }} км.</span>
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
            <center>
              <button
                  class="details-button"
                  style="padding: 10px 20px;margin: 10px;font-size: 15px"
                  @click="toggleFavorite(car.product_id)"
                  :class="{ 'favorited': car.is_favorite }"
              >
                {{ car.is_favorite ? '❤️ В избранном' : '♡ Добавить в избранное' }}
              </button>

            </center>
          </div>
        </div>

      </div>
    </div>
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Загрузка автомобилей...</p>
    </div>
  <center>
    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button @click="fetchCars" class="retry-button">Попробовать снова</button><br><br>
    </div>
  </center>
    <center v-if="!isLoading && !error && filteredCars.length > 0">
      <div class="pagination" style="margin: 20px">
        <button
            class="button"
            style="width: 150px"
            @click="previousPage"
            :disabled="currentPage === 1"
        >
          Предыдущая
        </button>
        <span style="font-weight: bold; margin: 30px;">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>
        <button
            class="button"
            style="width: 150px"
            @click="nextPage"
            :disabled="currentPage === totalPages"
        >
          Следующая
        </button>
      </div>
    </center>
    <Footer/>
  </template>
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import Header from '../components/Header.vue';
  import Footer from "@/components/Footer.vue";
  import {jwtDecode} from "jwt-decode";

  // Реактивные переменные
  const cars = ref([]);  // Список автомобилей
  const favorites = ref<number[]>([]);  // Список ID избранных авто (тип number[])
  const isLoading = ref(true);  // Флаг загрузки
  const error = ref<string | null>(null);  // Текст ошибки
  const currentPage = ref(1);  // Текущая страница
  const carsPerPage = 6;  // Количество авто на странице
  const searchQuery = ref('');  // Текст поиска
  const selectedFuelType = ref('');  // Выбранный тип топлива
  const sortOption = ref('price-asc');  // Вариант сортировки
  const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image';  // Заглушка для изображений

  // Метод загрузки автомобилей
  const fetchCars = async () => {
    isLoading.value = true;  // Включаем состояние загрузки
    error.value = null;  // Сбрасываем ошибку
    try {
      // Запрос всех автомобилей
      const carsResponse = await axios.get('api/products/GetAllProducts');

      // Загрузка избранного для авторизованных пользователей
      let favoritesData: any[] = [];
      const token = localStorage.getItem('authToken');  // Получаем токен из localStorage

      if (token) {
        try {
          const decoded = jwtDecode(token);  // Декодируем токен
          const userId = decoded.Id;  // Получаем ID пользователя
          const favoritesResponse = await axios.get(
              `api/favourites/getAllFavourites`,
          );
          favoritesData = favoritesResponse.data;  // Получаем данные об избранном
        } catch (err) {
          console.error('Ошибка загрузки избранного:', err);
        }
      }

      // Объединяем данные об автомобилях и избранном
      cars.value = carsResponse.data.map(car => ({
        ...car,
        is_favorite: favoritesData.some(fav => fav.product_id === car.product_id) //Добавл поле
      }));

    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки данных';  // Обработка ошибок
    } finally {
      isLoading.value = false;  // Выключаем состояние загрузки
    }
  };

  // Метод загрузки избранного
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;  // Выход если пользователь не авторизован

      const decoded = jwtDecode(token);
      const userId = decoded.Id;

      const response = await axios.get(
          `api/favourites/getFavouritesFromUser/${userId}`,
      );

      // Сохраняем ID избранных товаров
      favorites.value = response.data.map((fav: any) => fav.product_id);
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err);
    }
  };

  // Проверка, находится ли авто в избранном
  const isFavorite = (productId: number) => {
    const car = cars.value.find(c => c.product_id === productId);
    return car ? car.is_favorite : false;
  };

  // Переключение состояния "избранное"
  const toggleFavorite = async (productId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Для добавления в избранное необходимо авторизоваться');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.Id; // Убедитесь, что в токене есть Id

      if (isFavorite(productId)) {
        // Удаление из избранного
        await axios.delete(`api/favourites/deleteFavourite`, {
          data: {
            UserId: userId,
            ProductId: productId
          },
        });
      } else {
        // Добавление в избранное
        await axios.post('api/favourites/createFavourite', {
          UserId: userId,
          ProductId: productId
        });
      }

      // Обновление локального состояния
      const carIndex = cars.value.findIndex(c => c.product_id === productId);
      if (carIndex !== -1) {
        cars.value[carIndex].is_favorite = !cars.value[carIndex].is_favorite;
      }

      // Обновляем список избранных
      await fetchFavorites();

    } catch (err) {
      console.error('Ошибка при работе с избранным:', err);
      alert('Произошла ошибка при обновлении избранного');
    }
  };
  // Форматирование цены с разделителями
  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price);

  // Форматирование пробега с разделителями
  const formatMileage = (mileage: number) => mileage ? new Intl.NumberFormat('ru-RU').format(mileage) : '0';

  // Вычисляемый список отфильтрованных автомобилей
  const filteredCars = computed(() => {
    let result = [...cars.value];  // Копия массива

    // Фильтрация по поисковому запросу
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(car => car.name.toLowerCase().includes(query));
    }

    // Фильтрация по типу топлива
    if (selectedFuelType.value) {
      result = result.filter(car => car.fuel_type === selectedFuelType.value);
    }

    // Сортировка
    switch (sortOption.value) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'mileage-asc': result.sort((a, b) => (a.mileage || 0) - (b.mileage || 0)); break;
      case 'mileage-desc': result.sort((a, b) => (b.mileage || 0) - (a.mileage || 0)); break;
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  });

  // Вычисляемое количество страниц
  const totalPages = computed(() => Math.ceil(filteredCars.value.length / carsPerPage));

  // Вычисляемый список автомобилей для текущей страницы
  const paginatedCars = computed(() => {
    const start = (currentPage.value - 1) * carsPerPage;
    return filteredCars.value.slice(start, start + carsPerPage);
  });

  // Переход на следующую страницу
  const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

  // Переход на предыдущую страницу
  const previousPage = () => { if (currentPage.value > 1) currentPage.value--; };

  // Применение фильтров (сброс на первую страницу)
  const applyFilters = () => { currentPage.value = 1; };

  // Сброс всех фильтров
  const resetFilters = () => {
    searchQuery.value = '';
    selectedFuelType.value = '';
    sortOption.value = 'price-asc';
    currentPage.value = 1;
  };

  // Хук жизненного цикла - выполняется при монтировании компонента
  onMounted(() => {
    fetchCars();  // Загрузка автомобилей
    fetchFavorites();  // Загрузка избранного
  });
  </script>
  <style scoped>
  .favorited {
    background-color: #ffebee;
    color: #d32f2f;
    border-color: #d32f2f;
  }

  .details-button {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .details-button:hover {
    transform: scale(1.05);
  }
  </style>