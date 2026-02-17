<template>
  <div class="page">
    <!-- Background Video -->
    <video autoplay muted loop playsinline class="bg-video">
      <source src="@/assets/bg.mp4" type="video/mp4" />
    </video>

    <!-- Login/Register Card -->
    <div
      class="wrapper"
      :class="{ registerMode: isRegister }"
      ref="formWrapper"
    >
      <form @submit.prevent="handleSubmit">
        <h2>{{ isRegister ? "Welcome Chatter!" : "Brzojav Login" }}</h2>

        <!-- Username field (only in register) -->
        <div class="input-field" v-if="isRegister">
          <input type="text" required />
          <label>Username</label>
        </div>

        <!-- Email -->
        <div class="input-field">
          <input type="text" required />
          <label>Email</label>
        </div>

        <!-- Password -->
        <div class="input-field">
          <input type="password" required />
          <label>Password</label>
        </div>

        <!-- Phone (only in register) -->
        <div class="input-field" v-if="isRegister">
          <input type="text" required />
          <label>Phone Number</label>
        </div>

        <div class="forget">
          <label>
            <input type="checkbox" />
            <span> Remember me</span>
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit">{{ isRegister ? "Register" : "Log In" }}</button>

        <div class="register">
          <span>{{ isRegister ? "Already have an account?" : "Don't have an account?" }}</span>
          <a href="#" @click.prevent="toggleRegister">
            {{ isRegister ? " Login!" : " Register!" }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isRegister = ref(false);

function toggleRegister() {
  isRegister.value = !isRegister.value;
}

function handleSubmit() {
  alert(isRegister.value ? "Register submitted!" : "Login submitted!");
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

/* Video background */
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

/* Login/Register card */
.wrapper {
  width: 520px;
  padding: 16px 28px;
  border-radius: 12px;

  background: rgba(180, 0, 0, 0.45);
  border: 1px solid rgb(255, 0, 0);

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  color: #fff;

  /* Animate height change */
  transition: all 0.4s ease;
}

/* When register is active, slightly taller form */
.wrapper.registerMode {
  padding-bottom: 40px; /* extra space for new fields */
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

/* Inputs */
.input-field {
  position: relative;
  margin-bottom: 16px; /* adds space between each field */
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

/* Remember / forgot */
.forget {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #fff;
}

/* Button */
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

/* Register */
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
</style>