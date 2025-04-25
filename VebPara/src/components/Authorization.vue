  <template>
    <Header />
    <div class="navbar-container">
      <div class="form-wrapper">
        <h2 class="form-title">Авторизация</h2>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form class="form-content" @submit.prevent="login">
          <div class="form-group">
            <label for="auth-email" class="form-label">Email</label>
            <input
                type="email"
                id="auth-email"
                class="form-input"
                placeholder="Введите ваш email"
                v-model.trim="email"
                required
            />
          </div>
          <div class="form-group">
            <label for="auth-password" class="form-label">Пароль</label>
            <input
                type="password"
                id="auth-password"
                class="form-input"
                placeholder="Введите ваш пароль"
                v-model.trim="password"
                required
            />
          </div>
          <button type="submit" class="button" :disabled="isLoading">
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>
        </form>
        <div class="form-footer">
          <p>Нет аккаунта?
            <router-link class="nav-link" to="/Registration">Зарегистрироваться</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>

  <script>
  import Header from "@/components/Header.vue";
  import { jwtDecode } from "jwt-decode";

  export default {
    name: "AuthorizationPage",
    components: {
      Header
    },
    data() {
      return {
        email: "",
        password: "",
        errorMessage: null,
        isLoading: false
      };
    },
    methods: {
      async login() {
        // Reset previous errors
        this.errorMessage = null;

        // Validation
        if (!this.email || !this.password) {
          this.errorMessage = "Email и пароль обязательны";
          return;
        }

        this.isLoading = true;

        try {
          const response = await fetch("api/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Ошибка авторизации");
          }
          if (response.ok) {
            const token = data.token;
            const decode = jwtDecode(token);
            const UserId = decode.Id;
            const url = new URL(window.location.href);
            url.searchParams.set('id', UserId);
            window.history.pushState({}, '', url);
          }
          console.log("Авторизация успешна!", data);
          // Сохраняем токен в localStorage или store
          localStorage.setItem('authToken', data.token);
          // Перенаправляем на главную страницу
          this.$router.push('/');

        } catch (error) {
          this.errorMessage = error.message || "Ошибка авторизации";
          console.error("Login error:", error);
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
  </script>