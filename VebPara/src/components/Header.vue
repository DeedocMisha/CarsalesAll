<template>
  <header>
    <div class="horizontal-container">
      <div class="image-container">
        <img style="height: 59px; width: 59px" src="../assets/images/v57_116.png" alt="Изображение">
      </div>
      <div class="text-container">
        <h2 class="h100">AUTOSHOP</h2>
        <h2>Новые автомобили</h2>
      </div>
      <div v-if="loading">
        <a class="Bal" v-if="see" style="color: green" >Ваш баланс: {{ballance}} руб.</a><br><br>
        <button @click="showBalanceModal = true" class="Bal">Пополнить баланс</button>
        <a class="Bal" v-if="!see" style="color: red">Создайте аккаунт для просмотра баланса</a>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px; position: absolute; top: 0; right: 0; margin: 20px;">
        <a href="#/Location"><img src="../assets/images/v47_18.png" class="i2"></a>
        <a href="#/Liked"><img src="../assets/images/v48_19.png" class="i2"></a>
        <a href="#/Basket"><img src="../assets/images/v74_4.png" class="i2"></a>
      </div>
    </div>
  </header>

  <div class="navbar5">
    <a href="#" class="nav-link">В НАЛИЧИИ</a>
    <a href="#/Rates" class="nav-link">ОТЗЫВЫ</a>
    <a href="#/AboutCompany" class="nav-link">О КОМПАНИИ</a>
    <a href="#/Kontacts" class="nav-link">КОНТАКТЫ</a>
    <a href="#/Authorization" class="nav-link">ВОЙТИ</a>
  </div>

  <!-- Модальное окно пополнения баланса -->
  <div v-if="showBalanceModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Пополнение баланса</h3>
      <input
          type="number"
          v-model="topUpAmount"
          placeholder="Введите сумму"
          min="1"
          class="balance-input"
      >
      <div class="modal-buttons">
        <button @click="topUpBalance" class="confirm-button">Подтвердить</button>
        <button @click="showBalanceModal = false" class="cancel-button">Отмена</button>
      </div>
      <p v-if="balanceError" style="color: red; margin-top: 10px;">{{ balanceError }}</p>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const ballance = ref<any>(null);
const see = ref(false);
const loading = ref(false);
const Show = ref(false);
const showBalanceModal = ref(false);
const topUpAmount = ref<number | null>(null);
const balanceError = ref<string | null>(null);

const fetchCar = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      loading.value = true;
      return;
    }

    const decode = jwtDecode(token);
    const UserId = decode.Id;
    const response = await axios.get(`api/users/GetBalance/${UserId}`);
    ballance.value = response.data.balance || "0";
    see.value = true;
    loading.value = true;
  } catch (error) {
    console.error('Ошибка при получении баланса:', error);
  }
};

const topUpBalance = async () => {
  if (!topUpAmount.value || topUpAmount.value <= 0) {
    balanceError.value = 'Введите корректную сумму';
    return;
  }

  try {
    const token = localStorage.getItem('authToken');
    const decode = jwtDecode(token);
    const UserId = decode.Id;

    const response = await axios.post(
        'api/users/PostBalance',
        {
          UserId: UserId,
          balance: topUpAmount.value
        },
    );

    if (response.data.success) {
      ballance.value = (parseInt(ballance.value) + topUpAmount.value).toString();
      showBalanceModal.value = false;
      topUpAmount.value = null;
      balanceError.value = null;

    }
    location.reload();
  } catch (error) {
    console.error('Ошибка при пополнении баланса:', error);
    balanceError.value = error.response?.data?.message || 'Ошибка при пополнении баланса';
  }
};

onMounted(() => {
  fetchCar();
});
</script>

<style lang="css">
.Bal {
  font-size: 20px;
  margin-top: 20px;
  margin-right: 1vw;
  position: absolute;
  right: 0;
  font-weight: bold;
  cursor: pointer;
  background: none;
  border: none;
  color: #007bff;
}

.Bal:hover {
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  position: relative;
  color: black;
}

.balance-input {
  width: 100%;
  padding: 10px;
  margin: 15px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.confirm-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-button {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>