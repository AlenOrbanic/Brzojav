<template>
  <img
    v-bind="$attrs"
    :src="src"
    :width="size"
    :height="size"
    class="rounded-circle avatar-border"
    :class="margin ? `me-${margin}` : ''"
    :style="customStyle"
  />
</template>

<script>
export default {
  name: 'AvatarImg',
  inheritAttrs: false,
  props: {
    src: { type: String, required: true },
    size: { type: Number, default: 40 },
    margin: { type: Number, default: null },
    glow: { type: Boolean, default: false },
  },
  computed: {
    customStyle() {
      return this.glow
        ? 'border: 3px solid #ff0000; box-shadow: 0 0 10px rgba(255,0,0,0.5);'
        : '';
    },
  },
};
</script>

<style scoped>
.avatar-border {
  border: 2px solid #ff0000;
  box-shadow: 0 0 6px rgba(255, 0, 0, 0.4);
}
</style>