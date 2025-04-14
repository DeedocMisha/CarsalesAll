  <template>
    <Header />
    <div class="container">
      <h1>Контакты</h1>

      <div class="contact-info">
        <h2>Наши данные</h2>
        <p>Адрес: Улица Примеров, дом 42, г. Москва</p>
        <p>Телефон: +7 (495) 123-45-67</p>
        <p>Email: info@example.com</p>
      </div>

      <div class="contact-form">
        <h2>Напишите нам</h2>
        <form @submit.prevent="submitForm">
          <label for="name">Ваше имя</label>
          <input
              type="text"
              id="name"
              v-model="form.name"
              placeholder="Введите ваше имя"
              required
          />

          <label for="email">Ваш email</label>
          <input
              type="email"
              id="email"
              v-model="form.email"
              placeholder="Введите ваш email"
              required
          />

          <label for="message">Сообщение</label>
          <textarea
              id="message"
              v-model="form.message"
              rows="5"
              placeholder="Введите ваше сообщение"
              required
          ></textarea>

          <button style="width: 140px" class="button" type="submit" :disabled="loading">
            {{ loading ? 'Отправка...' : 'Отправить' }}
          </button>
        </form>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
    <Footer/>
  </template>

  <script>
  import Header from "@/components/Header.vue";
  import {defineComponent} from "vue";
  import Footer from "@/components/Footer.vue";
  export default defineComponent({
    components: {Header, Footer},
    data() {
      return {
        form: {
          name: "",
          email: "",
          message: "",
        },
        loading: false,
        successMessage: "",
        errorMessage: "",
      };
    },
    methods: {
      async submitForm() {
        this.loading = true;
        this.successMessage = "";
        this.errorMessage = "";

        try {
          // Пример отправки формы на сервер
          const response = await fetch("api/contact", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.form),
          });

          if (!response.ok) {
            throw new Error("Ошибка при отправке сообщения.");
          }

          this.successMessage = "Ваше сообщение успешно отправлено!";
          this.form.name = "";
          this.form.email = "";
          this.form.message = "";
        } catch (error) {
          this.errorMessage = error.message || "Произошла ошибка. Попробуйте позже.";
        } finally {
          this.loading = false;
        }
      },
    },
  });
  </script>

  <style scoped>
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #1c1c1c;
    color: #f0f0f0;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    text-align: center;
    color: black;
  }

  .contact-info {
    margin: 20px 0;
    padding: 20px;
    background-color: #F2F2F2;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .contact-info h2 {
    margin-top: 0;
    color: black;
  }

  .contact-info p {
    margin: 10px 0;
    line-height: 1.6;
    color: black;
  }

  .contact-form {
    margin-top: 30px;
    padding: 20px;
    background-color: #F2F2F2;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .contact-form label {
    display: block;
    margin-bottom: 5px;
    color: black;
  }

  .contact-form input,
  .contact-form textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;

    border: 1px solid #444;
    border-radius: 5px;
    color: black; /* Устанавливаем черный цвет текста */
  }


  .contact-form button {
    background-color: #444;
    color: #f0f0f0;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .contact-form button:disabled {
    background-color: #333;
    cursor: not-allowed;
  }

  .contact-form button:hover:enabled {
    background-color: #555;
  }

  .success-message {
    color: #4caf50;
    margin-top: 15px;
  }

  .error-message {
    color: #f44336;
    margin-top: 15px;
  }
  </style>
