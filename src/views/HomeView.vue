<template>
  <div :class="['app-layout', theme]">
      <video class="bg-video" autoplay muted loop playsinline>
    <source src="../assets/framebg.mp4" type="video/mp4">
  </video>
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
        <div class="profile-section border-bottom mb-2">
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
            <span v-if="theme === 'light'">⏾</span>
            <span v-else>☀︎</span>
          </button>
        </div>
        <div class="px-2 py-1">
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
        <div ref="messagesBox" class="messages flex-grow-1 p-3">

          <div
            v-for="(msg, index) in selectedChat?.messages || []"
            :key="index"
            class="mb-2"
            :class="msg.sender === 'me' ? 'text-end' : 'text-start'"
          >

            <div
              class="message-wrapper w-100 d-flex"
              :class="msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'"
              @mouseenter="hoveredMessage = index"
              @mouseleave="hoveredMessage = null"
            >

              <!-- dots sender-->
              <button
                v-if="hoveredMessage === index && msg.sender === 'me'"
                class="message-dots"
                @click.stop="openMessageMenu($event, msg)"
              >
                ⋮
              </button>

              <span
                class="d-inline-block p-2 rounded message"
                :class="msg.sender === 'me' ? 'sent' : 'received'"
              >
                {{ msg.text }}
              </span>

              <!-- dots me-->
              <button
                v-if="hoveredMessage === index && msg.sender !== 'me'"
                class="message-dots"
                @click.stop="openMessageMenu($event, msg)"
              >
                ⋮
              </button>

            </div>

          </div>

        </div>
        <div v-if="selectedChat"
             class="p-3 border-top d-flex">
          <textarea
            v-model="newMessage"
            @keydown="handleKeyPress"
            @input="autoGrow"
            ref="messageInput"
            class="form-control me-2"
            placeholder="Type a message..."
            rows="1"
          ></textarea>
          <button class="btn send-btn"
                  @click="sendMessage">
            Send
          </button>
        </div>

      </div>
      <div
        v-if="messageMenu.visible"
        class="message-menu"
        :style="{ top: messageMenu.y + 'px', left: messageMenu.x + 'px' }"
      >
        <button @click="replyMessage">Reply</button>
        <button @click="copyMessage">Copy text</button>
        <button @click="reactMessage">React</button>
        <button @click="pinMessage">Pin message</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
  document.addEventListener("click", this.handleClickOutside);
  document.addEventListener("keydown", this.handleKeyDown);
},
beforeUnmount() {
  document.removeEventListener("click", this.handleClickOutside);
  document.removeEventListener("keydown", this.handleKeyDown);
},
  data() {
    return {
      theme: "light",
      globalSearch: "",
      newMessage: "",
      selectedChat: null,
      hoveredMessage: null,
      user: {
        name: "Your Name",
        avatar: "https://i.pinimg.com/736x/fa/44/28/fa442865013215368d3e6776730a9bf2.jpg"
      },
      messageMenu: {
        visible: false,
        x: 0,
        y: 0,
        message: null
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
    autoGrow() {
      const el = this.$refs.messageInput;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    },
    handleKeyDown(event) {
      if (event.key === "Escape") {
        this.closeMessageMenu();
      }
    },
    handleClickOutside(event) {
      const menu = this.$el.querySelector(".message-menu");

      if (
        menu &&
        !menu.contains(event.target) &&
        !event.target.classList.contains("message-dots")
      ) {
        this.closeMessageMenu();
      }
    },
    handleKeyPress(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    },
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
    openMessageMenu(event, msg) {
      event.stopPropagation();

      const rect = event.currentTarget.getBoundingClientRect();

      this.messageMenu.visible = true;
      this.messageMenu.message = msg;

      if (msg.sender === "me") {
        this.messageMenu.x = rect.left - 150;
      } else {
        this.messageMenu.x = rect.right + 10;
      }

      this.messageMenu.y = rect.bottom + 5;
    },

  closeMessageMenu() {
    this.messageMenu.visible = false;
    this.messageMenu.message = null;
  },

  copyMessage() {
    if (!this.messageMenu.message) return;
    navigator.clipboard.writeText(this.messageMenu.message.text);
    this.closeMessageMenu();
  },

  replyMessage() {
    if (!this.messageMenu.message) return;
    this.newMessage = `> ${this.messageMenu.message.text}\n`;
    this.closeMessageMenu();
  },

  reactMessage() {
    alert("React feature placeholder");
    this.closeMessageMenu();
  },

  pinMessage() {
    alert("Pin feature placeholder");
    this.closeMessageMenu();
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
  padding-left: 0;
}
.sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
}
.app-topbar {
  width: 100%;
  box-sizing: border-box;
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
.app-layout.light {
  background-color: #ffffff;
  border-color: #aa0f0f;
  color: black;
}

.app-layout.dark {
  background-color: #121212;
  border-color: #ff9e9e;
  color: white;
}
.app-layout.light .contact-item.active {
  background: rgba(249, 83, 83, 0.83);
}
.app-layout.dark .contact-item.active {
  background: rgba(255, 0, 0, 0.212);
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

.dark .sidebar {
  background: #1e1e1e;
}

.dark .chat-area {
  background: #181818;
}
.light .sidebar {
  background: #ffffff;
}

.light .chat-area {
  background: #ffffff;
}

.light .app-topbar {
  background: #ffffff;
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
.app-layout.dark .theme-btn span {
  color: white;
  font-size: 2.5rem;
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
  position: relative;
  z-index: 1;
}

.app-layout.light .search-input {
  color: black;
}
.app-layout.light .search-input::placeholder {
  color: #000000;
  opacity: 1;
}
.app-layout.light .chat-header .text-muted {
  color: black !important;
}
.app-layout.light .contact-item .text-muted {
  color: black !important;
}
.app-layout.light .profile-section .text-muted {
  color: black !important;
}
.message-wrapper {
  position: relative;
  display: inline-block;
  transition: transform 0.2s ease;
}

.text-end .message-wrapper:hover {
  transform: translateX(-6px);
}

.text-start .message-wrapper:hover {
  transform: translateX(6px);
}

.message-dots {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.7;
  padding: 0;
  margin: 0 6px;
}

.message-dots:hover {
  opacity: 1;
}

.message-menu {
  position: fixed;
  background: white;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.dark .message-menu {
  background: #1e1e1e;
  border: 1px solid rgba(255,255,255,0.2);
}

.message-menu button {
  background: none;
  border: none;
  padding: 6px 10px;
  text-align: left;
  cursor: pointer;
}

.message-menu button:hover {
  background: rgba(0,0,0,0.05);
}
.bg-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
.dark .profile-section .fw-bold {
  color: white;
}

.light .profile-section .fw-bold {
  color: black;
}
</style>