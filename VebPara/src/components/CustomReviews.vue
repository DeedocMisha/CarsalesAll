<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const reviews = ref([]);
const isLoading = ref(true);
const error = ref(null);
const newReview = ref({
  rating: 5,
  comment: '',
});
const showForm = ref(false);

const fetchReviews = async () => {
  try {
    const response = await axios.get('api/rating/getRating');
    reviews.value = response.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const submitReview = async () => {
  try {


    const token = localStorage.getItem('authToken');
    const decode = jwtDecode(token);
    const UserId = decode.Id;

    const response = await axios.post(
          'api/rating/sendRating',
        {
          rating: newReview.value.rating,
          comment: newReview.value.comment,
          userId: UserId
        },
    );
    location.reload();
    if (response.data.success) {
      await fetchReviews();
      newReview.value.comment = '';
      showForm.value = false;

    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  }
};

onMounted(() => {
  fetchReviews();
});
</script>

<template>
  <div class="reviews-container">
    <h2 class="section-title">Отзывы клиентов</h2>
    <p class="section-subtitle">Что говорят о нас люди</p>

    <!-- Кнопка для показа формы добавления отзыва -->
    <div class="add-review-container">
      <button @click="showForm = !showForm" class="button">
        {{ showForm ? 'Отменить' : 'Добавить отзыв' }}
      </button>
    </div>

    <!-- Форма добавления нового отзыва -->
    <transition name="fade">
      <div v-if="showForm" class="review-form">
        <h3>Оставьте ваш отзыв</h3>
        <div class="form-group">
          <label>Оценка:</label>
          <div class="rating-select">
            <button
                v-for="star in 5"
                :key="star"
                @click="newReview.rating = star"
                :class="{ 'selected': star <= newReview.rating }"
            >
              ★
            </button>
          </div>
        </div>
        <div class="form-group">
          <label for="comment">Комментарий:</label>
          <textarea
              id="comment"
              v-model="newReview.comment"
              placeholder="Ваш отзыв..."
              rows="4"
              required
          ></textarea>
        </div>
        <button @click="submitReview" class="submit-button">Отправить отзыв</button>
      </div>
    </transition>

    <!-- Загрузка -->
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Загружаем отзывы...</p>
    </div>

    <!-- Ошибка -->
    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button @click="fetchReviews" class="button">Попробовать снова</button>
    </div>

    <!-- Список отзывов -->
    <div v-if="!isLoading && !error" class="reviews-grid">
      <transition-group name="fade">
        <div
            v-for="review in reviews"
            :key="review.rating_id"
            class="review-card"
            :class="`rating-${review.rating}`"
        >
          <div class="review-header">
            <div class="user-avatar">
              <span>U{{ review.user_id }}</span>
            </div>
            <div class="user-info">
              <span class="user-name">Пользователь #{{ review.user_id }}</span>
              <div class="rating-stars">
                <span
                    v-for="star in 5"
                    :key="star"
                    :class="{ 'filled': star <= review.rating }"
                >★</span>
              </div>
            </div>
            <span class="review-date">{{ new Date(review.created_at).toLocaleDateString('ru-RU') }}</span>
          </div>
          <div class="review-content">
            <p class="review-text">{{ review.comment }}</p>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Нет отзывов -->
    <div v-if="!isLoading && reviews.length === 0" class="empty-state">

      <h3>Пока нет отзывов</h3>
      <p>Будьте первым, кто оставит отзыв!</p>
    </div>
  </div>
</template>

<style scoped>
/* Основные стили */
.reviews-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
}

.section-title {
  text-align: center;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 3rem;
}

/* Стили для формы добавления отзыва */
.add-review-container {
  text-align: center;
  margin-bottom: 2rem;
}

.add-review-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.add-review-button:hover {
  background: #2980b9;
}

.review-form {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.review-form h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
}

.rating-select {
  display: flex;
  gap: 0.5rem;
}

.rating-select button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #ddd;
  padding: 0;
  transition: color 0.3s;
}

.rating-select button.selected {
  color: #f1c40f;
}

.submit-button {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  transition: background 0.3s;
}

.submit-button:hover {
  background: #27ae60;
}

/* Стили для карточек отзывов */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.review-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.review-card.rating-5 {
  border-top: 4px solid black;
}

.review-card.rating-4 {
  border-top: 4px solid black;
}

.review-card.rating-3 {
  border-top: 4px solid black;
}

.review-card.rating-2 {
  border-top: 4px solid black;
}

.review-card.rating-1 {
  border-top: 4px solid black;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  display: block;
  margin-bottom: 0.2rem;
}

.rating-stars {
  color: #f1c40f;
  font-size: 1.1rem;
  letter-spacing: 2px;
}

.rating-stars .filled {
  color: #f39c12;
}

.review-date {
  font-size: 0.85rem;
  color: #95a5a6;
}

.review-content {
  padding: 0.5rem 0;
}

.review-text {
  color: #34495e;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

/* Стили для состояний */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #fff6f6;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  color: #e74c3c;
  max-width: 500px;
  margin: 2rem auto;
}

.error-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.retry-button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s;
}

.retry-button:hover {
  background: #c0392b;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-top: 2rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #7f8c8d;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .reviews-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>