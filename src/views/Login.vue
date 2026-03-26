<template>
  <div class="page">
    <video autoplay muted loop playsinline class="bg-video">
      <source src="@/assets/bg.mp4" type="video/mp4" />
    </video>

    <div class="wrapper" :class="{
      registerMode: isRegister,
      forgotMode: isForgotPassword
    }">
      <form @submit.prevent="handleSubmit">
        <transition name="fade-slide" mode="out-in">
          <div :key="isForgotPassword ? 'forgot' : isRegister ? 'register' : 'login'" class="form-content">
            <h2>
              {{ isForgotPassword ? "Forgot Password?" : isRegister ? "Welcome Chatter!" : "Brzojav Login" }}
            </h2>
            <div v-if="isForgotPassword" class="forgot-password">
              <p>To recover your password please enter your email or username.</p>
              <div class="input-field full-width">
                <label>Email or Username</label>
                <input type="text" required class="form-control" />
              </div>
              <div class="button-wrapper">
                <button type="submit">Submit</button>
              </div>
              <div class="register">
                <span>Remembered your password? </span>
                <a href="#" @click.prevent="isForgotPassword = false">Login!</a>
              </div>
            </div>
            <template v-else>
              <template v-if="isRegister">
                <div class="register-grid">
                  <div class="input-field">
                    <label>Username</label>
                    <input type="text" required class="form-control" />
                  </div>

                  <div class="input-field">
                    <label>Email</label>
                    <input type="text" required class="form-control" />
                  </div>

                  <div class="input-field">
                    <label>Password</label>
                    <input type="password" required class="form-control" />
                  </div>

                  <div class="input-field">
                    <label>Phone Number</label>
                    <input type="text" required class="form-control" />
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="input-field full-width">
                  <label>Email</label>
                  <input type="text" required class="form-control" />
                </div>

                <div class="input-field full-width">
                  <label>Password</label>
                  <input type="password" required class="form-control" />
                </div>
              </template>
              <div class="forget">
                <label>
                  <input type="checkbox" />
                  <span> Remember me</span>
                </label>
                <a href="#" @click.prevent="openForgotPassword">Forgot password?</a>
              </div>

              <div class="button-wrapper">
                <button type="submit">{{ isRegister ? "Register" : "Log In" }}</button>
              </div>

              <div class="register">
                <span>{{ isRegister ? "Already have an account? " : "Don't have an account? " }}</span>
                <a href="#" @click.prevent="toggleRegister">
                  {{ isRegister ? " Login!" : " Register!" }}
                </a>
              </div>
            </template>
          </div>
        </transition>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isRegister = ref(false);
const isForgotPassword = ref(false);

function toggleRegister() {
  isRegister.value = !isRegister.value;
  isForgotPassword.value = false;
}

function openForgotPassword() {
  isForgotPassword.value = true;
  isRegister.value = false;
}

function handleSubmit() {
  if (isForgotPassword.value) {
    alert("Forgot password submitted!");
  } else {
    alert(isRegister.value ? "Register submitted!" : "Login submitted!");
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Open Sans", sans-serif;
}

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
  padding: 16px 28px;
  border-radius: 12px;
  background: rgba(180, 0, 0, 0.45);
  border: 1px solid rgb(255, 0, 0);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.wrapper.registerMode {
  padding-bottom: 20px;
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
  margin-bottom: 30px;
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

.full-width {
  width: 100%;
}

.register-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

.forget {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #fff;
}

.button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.button-wrapper button {
  width: 50%;
  height: 36px;
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
  color: #fff;
}

a {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.input-field .form-control:focus {
  outline: none;
  border-color: #ff0000;
  box-shadow: 0 0 0 0.15rem rgb(255, 0, 1);
}

.forgot-password {
  display: contents;
}

.forgot-password p {
  color: #fff;
  font-size: 0.95rem;
  margin: 4px 0 8px 0;
  text-align: center;
}

.forgot-password .input-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.forgot-password .input-field input,
.forgot-password .input-field label {
  width: 60%;
  text-align: center;
}

.forgot-password .register {
  text-align: center;
  margin-top: 4px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.45s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>