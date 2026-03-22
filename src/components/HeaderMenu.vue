<template>
  <transition name="dropdown">
    <div
      v-if="visible"
      class="header-menu"
      :style="{ top: y + 'px', left: x + 'px' }"
      @click.stop
    >
      <button
        v-for="(item, index) in items"
        :key="index"
        @click="handleClick(item)"
      >
        {{ item.label }}
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "HeaderMenu",
  props: {
    visible: { type: Boolean, default: false },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    items: { type: Array, default: () => [] },
  },
  emits: ["close", "item-click"],
  methods: {
    handleClick(item) {
      if (item.action && typeof item.action === "function") {
        item.action();
      }
      this.$emit("item-click", item);
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.header-menu {
  position: fixed;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  min-width: 220px;
}

.header-menu button {
  background: none;
  border: none;
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-menu button:hover {
  background: rgba(0, 0, 0, 0.08);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.95);
}

.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-leave-from {
  opacity: 1;
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.95);
}
.dark .header-menu button {
  color: white;
}

.dark .header-menu button:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
