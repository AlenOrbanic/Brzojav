<template>
  <div class="page">
    <video autoplay muted loop playsinline class="bg-video">
      <source src="@/assets/bg.mp4" type="video/mp4" />
    </video>

    <div
      class="wrapper"
      :class="{ registerMode: isRegister }"
      ref="formWrapper"
    >
<form @submit.prevent="handleSubmit">
  <h2>
    {{ isForgotPassword ? "Forgot Password?" : isRegister ? "Welcome Chatter!" : "Brzojav Login" }}
  </h2>

  <div v-if="isForgotPassword" class="forgot-password">
    <p>To recover your password please enter your email or username.</p>
    <div class="input-field">
      <input type="text" required class="form-control" />
      <label>Email or Username</label>
    </div>
    <button type="submit">Submit</button>
    <div class="register">
      <span>Remembered your password? </span>
      <a href="#" @click.prevent="isForgotPassword = false">Login!</a>
    </div>
  </div>

  <template v-else>
    <div class="input-field" v-if="isRegister">
      <input type="text" required class="form-control" />
      <label>Username</label>
    </div>

    <div class="input-field">
      <input type="text" required class="form-control" />
      <label>Email</label>
    </div>

    <div class="input-field">
      <input type="password" required class="form-control" />
      <label>Password</label>
    </div>

    <div class="input-field" v-if="isRegister">
      <input type="text" required class="form-control" />
      <label>Phone Number</label>
    </div>

    <!-- Remember / Forgot -->
    <div class="forget">
      <label>
        <input type="checkbox" />
        <span> Remember me</span>
      </label>
      <a href="#" @click.prevent="openForgotPassword">Forgot password?</a>
    </div>

    <button type="submit">{{ isRegister ? "Register" : "Log In" }}</button>

    <div class="register">
      <span>{{ isRegister ? "Already have an account? " : "Don't have an account? " }}</span>
      <a href="#" @click.prevent="toggleRegister">
        {{ isRegister ? " Login!" : " Register!" }}
      </a>
    </div>
  </template>
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

  transition: all 0.4s ease;
}

.wrapper.registerMode {
  padding-bottom: 40px;
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;
}

h2 {
  grid-column: span 2;
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 30px;
  color: #fff;
}

.input-field {
  position: relative;
  margin-bottom: 16px;
}

.input-field input {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border-radius: 6px;
  border: none;
  outline: none;
  background: rgb(255, 255, 255);
  color: #000000;
}

.input-field label {
  position: absolute;
  top: -24px;
  left: 4px;
  font-size: 1rem;
  color: #fff;
}

.forget {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #fff;
}

button {
  grid-column: span 2;
  height: 36px;
  border-radius: 6px;
  border: none;
  background: #fff;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  opacity: 0.65;
}

.register {
  grid-column: span 2;
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
  grid-column: span 2;
  color: #fff;
  font-size: 0.95rem;
  margin: 4px 0 8px 0;
  text-align: center;
}

.forgot-password .input-field {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}

.forgot-password .input-field input {
  width: 50%;
}

.forgot-password .input-field label {
  top: -20px;
  left: 120px;
  width: 50%;
  text-align: center;
  font-size: 0.95rem;
}
.forgot-password button {
  grid-column: span 2;
  height: 36px;
  margin-bottom: 6px;
}

.forgot-password .register {
  grid-column: span 2;
  text-align: center;
  margin-top: 4px;
}
</style>
