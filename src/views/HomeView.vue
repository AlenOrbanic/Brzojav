<template>
  <div :class="['app-layout', theme]">
    <div class="app-topbar border-bottom px-3 py-2">
      <input
        v-model="globalSearch"
        type="text"
        class="form-control search-input"
        placeholder="Search conversations..."
      />
    </div>
    <div class="app-body">
      <div class="sidebar border-end">
        <div class="profile-section border-bottom">
          <div class="d-flex align-items-center flex-grow-1"
               @click="goToProfile">
            <img
              :src="user.avatar"
              class="rounded-circle me-2 avatar-border"
              width="40"
              height="40"
            />
            <div>
              <div class="fw-bold">{{ user.name }}</div>
              <small class="text-muted">View Profile</small>
            </div>
          </div>
          <button class="theme-btn" @click="toggleTheme">
            <span v-if="theme === 'light'">🌙</span>
            <span v-else>☀️</span>
          </button>
        </div>
        <div class="p-3">
          <button
            class="btn w-100 theme-action-btn"
            @click="createConversation"
          >
            + New Chat / Group
          </button>
        </div>
        <div class="contacts">
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            class="contact-item"
            :class="{ active: selectedChat?.id === chat.id }"
            @click="selectChat(chat)"
          >
            <img
              :src="chat.avatar"
              class="rounded-circle me-2 avatar-border"
              width="40"
              height="40"
            />
            <div class="flex-grow-1">
              <div class="fw-semibold">{{ chat.name }}</div>
              <small class="text-muted text-truncate">
                {{ chat.lastMessage }}
              </small>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-area d-flex flex-column">
        <div class="chat-header border-bottom p-3">
          <div v-if="selectedChat"
               class="d-flex align-items-center">
            <img
              :src="selectedChat.avatar"
              class="rounded-circle me-2 avatar-border"
              width="40"
              height="40"
            />

            <div class="fw-bold">
              {{ selectedChat.name }}
            </div>
          </div>
          <div v-else class="text-muted">
            Select a conversation
          </div>
        </div>
        <div ref="messagesBox"
             class="messages flex-grow-1 p-3">
          <div
            v-for="(msg, index) in selectedChat?.messages || []"
            :key="index"
            class="mb-2"
            :class="msg.sender === 'me'
              ? 'text-end'
              : 'text-start'"
          >
            <span
              class="d-inline-block p-2 rounded message"
              :class="msg.sender === 'me'
                ? 'sent'
                : 'received'"
            >
              {{ msg.text }}
            </span>
          </div>
        </div>
        <div v-if="selectedChat"
             class="p-3 border-top d-flex">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            class="form-control me-2"
            placeholder="Type a message..."
          />
          <button class="btn send-btn"
                  @click="sendMessage">
            Send
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: "light",
      globalSearch: "",
      newMessage: "",
      selectedChat: null,
      user: {
        name: "Your Name",
        avatar: "https://i.pinimg.com/736x/fa/44/28/fa442865013215368d3e6776730a9bf2.jpg"
      },
      chats: [
        {
          id: 1,
          name: "John Doe",
          avatar: "https://i.pinimg.com/736x/10/ff/74/10ff74284ea2b3957b90b9556e05dce2.jpg",
          lastMessage: "Hey!",
          messages: [
            { sender: "other", text: "Hello!" },
            { sender: "me", text: "Hi there!" }
          ]
        }
      ]
    };
  },
  computed: {
    filteredChats() {
      if (!this.globalSearch) return this.chats;
      return this.chats.filter(c =>
        c.name.toLowerCase().includes(this.globalSearch.toLowerCase())
      );
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
    selectChat(chat) {
      this.selectedChat = chat;
      this.$nextTick(this.scrollToBottom);
    },
    sendMessage() {
      if (!this.newMessage.trim()) return;
      this.selectedChat.messages.push({
        sender: "me",
        text: this.newMessage
      });
      this.newMessage = "";
      this.$nextTick(this.scrollToBottom);
    },
    scrollToBottom() {
      const box = this.$refs.messagesBox;
      if (box) box.scrollTop = box.scrollHeight;
    },
    createConversation() {
      alert("Hello");
    },
    goToProfile() {
      this.$router.push("/profile");
    }
  }
};
</script>

<style scoped>
.app-layout,
.sidebar,
.chat-area,
.app-topbar,
.search-input,
.contact-item,
.message,
.theme-action-btn {
  transition: background-color 1.3s ease,
              color 1.3s ease,
              border-color 1.3s ease;
}
.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
}
.profile-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
}
.contacts {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}
.contact-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}
.contact-item:hover {
  background: rgba(0,0,0,0.05);
}
.dark .contact-item:hover {
  background: rgba(255,255,255,0.05);
}
.contact-item.active {
  background: rgba(220,53,69,0.15);
}
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.messages {
  overflow-y: auto;
}
.message {
  max-width: 70%;
}
.light .sent {
  background: #ff0000;
  color: white;
}
.light .received {
  background: #e9ecef;
  color: black;
}
.dark .sent {
  background: #ff0000;
  color: white;
}
.dark .received {
  background: #2a2a2a;
  color: white;
}
.light {
  background: white;
  color: black;
}
.dark {
  background: #121212;
  color: white;
}
.dark .sidebar {
  background: #1e1e1e;
}
.dark .chat-area {
  background: #181818;
}
.light .app-topbar {
  background: white;
}
.dark .app-topbar {
  background: #1e1e1e;
}
.dark .search-input {
  background: #ff00003c;
  color: white;
  border: 1px solid #ff0000;
}
.dark .search-input::placeholder {
  color: white;
  opacity: 1;
}
.theme-action-btn {
  border: none;
  color: white;
}
.light .theme-action-btn {
  background-color: #ff0000;
}
.dark .theme-action-btn {
  background-color: rgba(255, 0, 25, 0.314);
}
.theme-btn {
  background: none;
  border: none;
  cursor: pointer;
}
.theme-btn span {
  font-size: 2rem;
  line-height: 1;
}
.avatar-border {
  border: 2px solid #ff0000;
  box-shadow: 0 0 6px rgba(255, 0, 0, 0.4);
}
.send-btn {
  background-color: #ff0000;
  color: white;
  border: 1px solid #ff0000;
  transition: all 1.3s ease;
}
.send-btn:hover {
  background-color: #cc0000;
  border-color: #cc0000;
  color: white;
}
.form-control {
  transition: all 1.3s ease;
}
.light .form-control {
  background: white;
  color: black;
  border: 1px solid #ced4da;
}
.dark .form-control {
  background: #ff00003c;
  color: white;
  border: 1px solid #ff0000;
}
.dark .form-control::placeholder {
  color: #ffffff;
  opacity: 1;
}
.dark .profile-section .text-muted {
  color: white !important;
}
.dark .contact-item .text-muted {
  color: white !important;
}
.dark .chat-header .text-muted {
  color: white !important;
}
.app-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 40px solid transparent;
  transition: border-color 1.3s ease, background-color 1.3s ease;
}
.app-layout.light {
  background-color: white;
  border-color: #aa0f0f;
  color: black;
}
.app-layout.dark {
  background-color: #121212;
  border-color: #ff9e9e;
  color: white;
}
</style>