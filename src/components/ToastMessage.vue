<template>
  <transition name="toast">
    <div v-if="visible" class="toast-message">
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ToastMessage',
  props: {
    message:  { type: String,  required: true },
    duration: { type: Number,  default: 3000 },
    modelValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  watch: {
    modelValue(val) {
      if (val) this.show();
    },
  },
  computed: {
    visible() {
      return this.modelValue;
    },
  },
  methods: {
    show() {
      setTimeout(() => {
        this.$emit('update:modelValue', false);
      }, this.duration);
    },
  },
};
</script>

<style scoped>
.toast-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 0, 0, 0.9);
  color: #fff;
  padding: 16px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
  z-index: 9999;
  pointer-events: none;
  animation: fadeInOut 1s ease forwards;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  20% {
    opacity: 1;
    transform: translateY(0);
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>