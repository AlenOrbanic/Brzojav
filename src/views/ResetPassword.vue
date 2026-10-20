<template>
  <div class="page">
    <video autoplay muted loop playsinline class="bg-video">
      <source src="@/assets/bg.mp4" type="video/mp4" />
    </video>

    <div class="wrapper">
      <form @submit.prevent="handleSubmit">
        <h2>Choose a New Password</h2>

        <template v-if="!done">
          <div class="input-field full-width">
            <label>New password</label>
            <input v-model="newPassword" type="password" required class="form-control" />
          </div>

          <div class="input-field full-width">
            <label>Confirm new password</label>
            <input v-model="confirmPassword" type="password" required class="form-control" />
          </div>

          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

          <div class="button-wrapper">
            <button type="submit" :disabled="loading">
              {{ loading ? "Saving..." : "Reset password" }}
            </button>
          </div>
        </template>

        <div v-else class="success-message">
          Your password has been reset. Redirecting to login...
        </div>

        <div class="register">
          <a href="#" @click.prevent="router.replace('/login')">Back to login</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api";

const route = useRoute();
const router = useRouter();

const token = route.query.token || "";
const newPassword = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const loading = ref(false);
const done = ref(false);

async function handleSubmit() {
  errorMessage.value = "";

  if (!token) {
    errorMessage.value = "Reset link is missing its token. Please request a new one.";
    return;
  }
  if (newPassword.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  loading.value = true;
  try {
    await api.auth.resetPassword(token, newPassword.value);
    done.value = true;
    setTimeout(() => router.replace("/login"), 2000);
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.bg-video {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  filter: blur(5px);
  transform: scale(1.1);
}

.wrapper {
  width: 520px;
  max-width: 92vw;
  padding: 16px 28px 20px;
  border-radius: 12px;
  background: rgba(180, 0, 0, 0.45);
  border: 1px solid rgb(255, 0, 0);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

h2 {
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 20px;
  color: #fff;
}

.input-field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-field label {
  margin-bottom: 4px;
  color: #fff;
}

.input-field input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: none;
  outline: none;
  background: #fff;
  color: #000;
}

.input-field .form-control:focus {
  box-shadow: 0 0 0 0.15rem rgb(255, 0, 1);
}

.button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.button-wrapper button {
  min-width: 160px;
  height: 36px;
  padding: 0 22px;
  border-radius: 6px;
  border: none;
  background: #fff;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.button-wrapper button:hover {
  opacity: 0.65;
}

.register {
  text-align: center;
  font-size: 0.9rem;
}

a {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.error-message {
  color: #fff;
  background: rgba(255, 0, 0, 0.4);
  border: 1px solid #ff0000;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  text-align: center;
}

.success-message {
  color: #fff;
  background: rgba(0, 160, 60, 0.45);
  border: 1px solid #00c853;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 0.95rem;
  text-align: center;
}
</style>