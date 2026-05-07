<template>
  <div class="d-flex align-items-center gap-2 mb-2">
    <template v-if="editing">
      <input
        v-model="inputValue"
        class="chat-name-input"
        :placeholder="placeholder"
        @keydown.enter="save"
        @blur="save"
        autofocus
      />
    </template>
    <template v-else>
      <span :class="labelClass">{{ prefix ? `${prefix}: ${value}` : value }}</span>
      <svg
        @click="startEdit"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="currentColor"
        class="bi bi-pencil-square edit-icon"
        viewBox="0 0 16 16"
        style="cursor:pointer; flex-shrink:0"
        :data-tooltip="tooltip"
      >
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
      </svg>
    </template>
  </div>
</template>

<script>
export default {
  name: 'EditableField',
  props: {
    value:       { type: String, required: true },
    placeholder: { type: String, default: 'Enter value...' },
    tooltip:     { type: String, default: 'Edit' },
    prefix:      { type: String, default: null },
    labelClass:  { type: String, default: '' },
  },
  emits: ['save'],
  data() {
    return {
      editing: false,
      inputValue: '',
    };
  },
  methods: {
    startEdit() {
      this.inputValue = this.value;
      this.editing = true;
    },
    save() {
      const trimmed = this.inputValue.trim();
      if (trimmed) this.$emit('save', trimmed);
      this.editing = false;
    },
  },
};
</script>

<style scoped>
.chat-name-input {
  border: none;
  border-bottom: 2px solid #ff0000;
  outline: none;
  background: transparent;
  font-size: inherit;
  font-weight: bold;
  color: inherit;
  width: 180px;
  padding: 0 2px;
}
.edit-icon {
  opacity: 0.7;
  transition: opacity 0.15s ease, transform 0.15s ease;
  position: relative;
}
.edit-icon:hover {
  opacity: 1;
  transform: scale(1.15);
}
.edit-icon::after {
  content: attr(data-tooltip);
  position: absolute;
  top: -130%;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  color: white;
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 9999;
}
.edit-icon:hover::after {
  opacity: 1;
}
</style>