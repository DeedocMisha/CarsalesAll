  <template>
    <Header />
    <div class="navbar-container">
      <div class="form-wrapper">
        <h2 class="form-title">Регистрация</h2>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form class="form-content" @submit.prevent="registration">
          <div class="form-group">
            <label for="reg-first_name" class="form-label">Имя</label>
            <input
                id="reg-first_name"
                class="form-input"
                placeholder="Введите ваше имя"
                v-model.trim="first_name"
                required
            />
          </div>
          <div class="form-group">
            <label for="reg-last_name" class="form-label">Фамилия</label>
            <input
                id="reg-last_name"
                class="form-input"
                placeholder="Введите вашу фамилию"
                v-model.trim="last_name"
                required
            />
          </div>
          <div class="form-group">
            <label for="reg-email" class="form-label">Email</label>
            <input
                type="email"
                id="reg-email"
                class="form-input"
                placeholder="Введите ваш email"
                v-model.trim="email"
                required
            />
          </div>
          <div class="form-group">
            <label for="reg-password" class="form-label">Пароль</label>
            <input
                type="password"
                id="reg-password"
                class="form-input"
                placeholder="Введите ваш пароль"
                v-model.trim="password"
                required
                minlength="6"
            />
          </div>
          <div class="form-group">
            <label for="confirm-password" class="form-label">Подтвердите пароль</label>
            <input
                type="password"
                id="confirm-password"
                class="form-input"
                placeholder="Подтвердите ваш пароль"
                v-model.trim="confirmPassword"
                required
                minlength="6"
            />
          </div>
          <button type="submit" class="button" :disabled="isLoading">
            {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </form>
        <div class="form-footer">
          <p>Уже есть аккаунт?
            <router-link class="nav-link" to="/Authorization">Войти</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>

  <script>
  import Header from "@/components/Header.vue";

  export default {
    name: "RegistrationPage",
    components: {
      Header
    },
    data() {
      return {
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        errorMessage: null,
        isLoading: false
      };
    },
    methods: {
      async registration() {

        this.errorMessage = null;


        if (!this.first_name || !this.last_name) {
          this.errorMessage = "Имя и фамилия обязательны";
          return;
        }

        if (!this.email || !this.password) {
          this.errorMessage = "Email и пароль обязательны";
          return;
        }

        if (this.password.length < 6) {
          this.errorMessage = "Пароль должен содержать минимум 6 символов";
          return;
        }

        if (this.password !== this.confirmPassword) {
          this.errorMessage = "Пароли не совпадают";
          return;
        }

        this.isLoading = true;

        try {
          const response = await fetch("api/users/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
              first_name  : this.first_name,
              last_name: this.last_name,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Ошибка регистрации");
          }

          console.log("Регистрация успешна!", data);
          this.$router.push('/Authorization');

        } catch (error) {
          this.errorMessage = error.message || "Ошибка регистрации";
          console.error("Registration error:", error);
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
  </script>