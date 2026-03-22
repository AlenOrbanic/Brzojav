<template>
  <div :class="['app-layout', theme]">
    <video class="bg-video" autoplay muted loop playsinline>
      <source src="../assets/framebg.mp4" type="video/mp4" />
    </video>
    <div class="app-topbar border-bottom px-3 py-2 d-flex align-items-center">
      <h5 class="mb-0 me-2">Brzojav</h5>
      <div class="flex-spacer"></div>
      <div class="d-flex align-items-center gap-1">
        <button
          class="theme-btn"
          @click="toggleTheme"
          data-tooltip="Change Theme"
        >
          <span v-if="theme === 'light'">⏾</span>
          <span v-else class="sun">☀︎</span>
        </button>

        <button
          class="theme-btn"
          @click="handleSpecialAction"
          data-tooltip="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="bi bi-gear-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.340a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
            />
          </svg>
        </button>
      </div>

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
          <div class="d-flex align-items-center justify-content-between w-100">
            <div
              class="d-flex align-items-center flex-grow-1"
              @click="goToProfile"
            >
              <img
                :src="user.avatar"
                class="rounded-circle me-3 avatar-border"
                width="40"
                height="40"
              />
              <div>
                <div class="fw-bold">{{ user.name }}</div>
                <small class="text-muted">View Profile</small>
              </div>
            </div>

            <button
              class="theme-btn logout-btn"
              @click="logout"
              data-tooltip="Log out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-box-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                />
                <path
                  fill-rule="evenodd"
                  d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                />
              </svg>
            </button>
          </div>
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
            class="contact-item d-flex justify-content-between align-items-center"
            :class="{ active: selectedChat?.id === chat.id }"
            @click="selectChat(chat)"
          >
            <div class="d-flex align-items-center flex-grow-1">
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
            <button
              class="contact-menu-btn"
              @click.stop="openChatMenu($event, chat)"
            >
              ⋯
            </button>
          </div>
        </div>
      </div>
      <div class="chat-area d-flex flex-column">
        <div
          class="chat-header border-bottom p-3 d-flex align-items-center justify-content-between"
        >
          <div v-if="selectedChat" class="d-flex align-items-center">
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

          <div v-else class="text-muted">Select a conversation</div>

          <div v-if="selectedChat" class="chat-header-actions">
            <button class="header-icon" data-tooltip="Search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                />
              </svg>
            </button>

            <button
              class="header-icon"
              data-tooltip="More"
              @click.stop="toggleHeaderMenu($event)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path
                  d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
                />
              </svg>
            </button>
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
              :class="
                msg.sender === 'me'
                  ? 'justify-content-end'
                  : 'justify-content-start'
              "
              @mouseenter="hoveredMessage = index"
              @mouseleave="hoveredMessage = null"
            >
              <div
                v-if="hoveredMessage === index && msg.sender === 'me'"
                class="message-actions"
              >
                <button
                  class="action-btn"
                  @click.stop="openMessageMenu($event, msg)"
                  data-tooltip="More"
                >
                  ⋮
                </button>
                <button
                  class="action-btn"
                  @click.stop="replyMessage"
                  data-tooltip="Reply"
                >
                  ⤶
                </button>
                <button
                  class="action-btn"
                  @click.stop="reactMessage"
                  data-tooltip="React"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-emoji-grin"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M12.946 11.398A6.002 6.002 0 0 1 2.108 9.14c-.114-.595.426-1.068 1.028-.997C4.405 8.289 6.48 8.5 8 8.5s3.595-.21 4.864-.358c.602-.07 1.142.402 1.028.998a5.95 5.95 0 0 1-.946 2.258m-.078-2.25C11.588 9.295 9.539 9.5 8 9.5s-3.589-.205-4.868-.352c.11.468.286.91.517 1.317A37 37 0 0 0 8 10.75a37 37 0 0 0 4.351-.285c.231-.407.407-.85.517-1.317m-1.36 2.416c-1.02.1-2.255.186-3.508.186s-2.488-.086-3.507-.186A5 5 0 0 0 8 13a5 5 0 0 0 3.507-1.436ZM6.488 7c.114-.294.179-.636.179-1 0-1.105-.597-2-1.334-2C4.597 4 4 4.895 4 6c0 .364.065.706.178 1 .23-.598.662-1 1.155-1 .494 0 .925.402 1.155 1M12 6c0 .364-.065.706-.178 1-.23-.598-.662-1-1.155-1-.494 0-.925.402-1.155 1a2.8 2.8 0 0 1-.179-1c0-1.105.597-2 1.334-2C11.403 4 12 4.895 12 6"
                    />
                    <path
                      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14"
                    />
                  </svg>
                </button>
              </div>
              <span
                class="d-inline-block p-2 rounded message"
                :class="msg.sender === 'me' ? 'sent' : 'received'"
              >
                {{ msg.text }}
              </span>

              <div
                v-if="hoveredMessage === index && msg.sender !== 'me'"
                class="message-actions"
              >
                <button
                  class="action-btn"
                  @click.stop="reactMessage"
                  data-tooltip="React"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-emoji-grin"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M12.946 11.398A6.002 6.002 0 0 1 2.108 9.14c-.114-.595.426-1.068 1.028-.997C4.405 8.289 6.48 8.5 8 8.5s3.595-.21 4.864-.358c.602-.07 1.142.402 1.028.998a5.95 5.95 0 0 1-.946 2.258m-.078-2.25C11.588 9.295 9.539 9.5 8 9.5s-3.589-.205-4.868-.352c.11.468.286.91.517 1.317A37 37 0 0 0 8 10.75a37 37 0 0 0 4.351-.285c.231-.407.407-.85.517-1.317m-1.36 2.416c-1.02.1-2.255.186-3.508.186s-2.488-.086-3.507-.186A5 5 0 0 0 8 13a5 5 0 0 0 3.507-1.436ZM6.488 7c.114-.294.179-.636.179-1 0-1.105-.597-2-1.334-2C4.597 4 4 4.895 4 6c0 .364.065.706.178 1 .23-.598.662-1 1.155-1 .494 0 .925.402 1.155 1M12 6c0 .364-.065.706-.178 1-.23-.598-.662-1-1.155-1-.494 0-.925.402-1.155 1a2.8 2.8 0 0 1-.179-1c0-1.105.597-2 1.334-2C11.403 4 12 4.895 12 6"
                    />
                    <path
                      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14"
                    />
                  </svg>
                </button>
                <button
                  class="action-btn"
                  @click.stop="replyMessage"
                  data-tooltip="Reply"
                >
                  ⤶
                </button>
                <button
                  class="action-btn"
                  @click.stop="openMessageMenu($event, msg)"
                  data-tooltip="More"
                >
                  ⋮
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedChat" class="p-3 border-top d-flex">
          <textarea
            v-model="newMessage"
            @keydown="handleKeyPress"
            @input="autoGrow"
            ref="messageInput"
            class="form-control me-2"
            placeholder="Type a message..."
            rows="1"
          ></textarea>
          <button class="btn send-btn" @click="sendMessage">Send</button>
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
    <HeaderMenu
      :visible="headerMenu.visible"
      :x="headerMenu.x"
      :y="headerMenu.y"
      :items="headerMenuItems"
      @close="closeHeaderMenu"
    />
  </div>
</template>

<script>
import HeaderMenu from "../components/HeaderMenu.vue";
export default {
  components: {
    HeaderMenu,
  },
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
      selectedChatForMenu: null,
      theme: "light",
      globalSearch: "",
      newMessage: "",
      selectedChat: null,
      hoveredMessage: null,
      user: {
        name: "Your Name",
        avatar:
          "https://i.pinimg.com/736x/fa/44/28/fa442865013215368d3e6776730a9bf2.jpg",
      },
      messageMenu: {
        visible: false,
        x: 0,
        y: 0,
        message: null,
      },
      headerMenu: {
        visible: false,
        x: 0,
        y: 0,
      },
      headerMenuItems: [
        {
          label: "👤 Contact Info",
          action: () => this.contactInfo(this.selectedChatForMenu),
        },
        {
          label: "🔕 Mute Notifications",
          action: () => this.muteChat(this.selectedChatForMenu),
        },
        {
          label: "📌 Pin Conversation",
          action: () => this.pinChat(this.selectedChatForMenu),
        },
        {
          label: "❌ Close Chat",
          action: () => this.closeChat(this.selectedChatForMenu),
        },
        {
          label: "⛔ Block",
          action: () => this.blockUser(this.selectedChatForMenu),
        },
        {
          label: "🧹 Delete Chat",
          action: () => this.deleteChat(this.selectedChatForMenu),
        },
        {
          label: "🖼️ Shared Media",
          action: () => this.sharedMedia(this.selectedChatForMenu),
        },
      ],
      chats: [
        {
          id: 1,
          name: "John Doe",
          avatar:
            "https://i.pinimg.com/736x/10/ff/74/10ff74284ea2b3957b90b9556e05dce2.jpg",
          lastMessage: "Hey!",
          messages: [
            { sender: "other", text: "Hello!" },
            { sender: "me", text: "Hi there!" },
          ],
        },
      ],
    };
  },
  computed: {
    filteredChats() {
      if (!this.globalSearch) return this.chats;
      return this.chats.filter((c) =>
        c.name.toLowerCase().includes(this.globalSearch.toLowerCase()),
      );
    },
  },
  methods: {
    openChatMenu(event, chat) {
      event.stopPropagation();

      const rect = event.currentTarget.getBoundingClientRect();

      this.selectedChatForMenu = chat;

      this.headerMenu.visible = true;
      this.headerMenu.x = rect.right - 5;
      this.headerMenu.y = rect.bottom + 20;
    },

    toggleHeaderMenu(event) {
      event.stopPropagation();

      if (this.headerMenu.visible) {
        this.closeHeaderMenu();
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();

      this.headerMenu.visible = true;
      this.headerMenu.x = rect.right - 180;
      this.headerMenu.y = rect.bottom + 5;
    },

    closeHeaderMenu() {
      this.headerMenu.visible = false;
    },

    contactInfo() {
      alert("Contact info");
      this.closeHeaderMenu();
    },
    muteChat() {
      alert("Muted");
      this.closeHeaderMenu();
    },
    pinChat() {
      alert("Pinned");
      this.closeHeaderMenu();
    },
    closeChat() {
      this.selectedChat = null;
      this.closeHeaderMenu();
    },
    blockUser() {
      alert("Blocked");
      this.closeHeaderMenu();
    },
    deleteChat() {
      alert("Deleted");
      this.closeHeaderMenu();
    },
    sharedMedia() {
      alert("Media");
      this.closeHeaderMenu();
    },
    logout() {
      alert("Logging out...");
    },
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
      const messageMenu = this.$el.querySelector(".message-menu");
      const headerMenu = this.$el.querySelector(".header-menu");

      const isHeaderButton = event.target.closest(".header-icon");
      const isContactMenuBtn = event.target.closest(".contact-menu-btn");

      if (messageMenu && !messageMenu.contains(event.target)) {
        this.closeMessageMenu();
      }

      if (
        headerMenu &&
        !headerMenu.contains(event.target) &&
        !isHeaderButton &&
        !isContactMenuBtn
      ) {
        this.closeHeaderMenu();
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
        text: this.newMessage,
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
    },
    handleSpecialAction() {
      alert("New button clicked!");
    },
  },
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
  transition: background-color 1.3s ease, color 1.3s ease,
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  gap: 12px;
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
  background: rgba(0, 0, 0, 0.05);
}
.dark .contact-item:hover {
  background: rgba(255, 255, 255, 0.05);
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
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  max-width: 60ch;
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
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  padding: 0;
  position: relative;
}

.theme-btn span {
  display: inline-block;
  line-height: 1;
  font-size: 1.8rem;
  transform: scale(1);
}

.theme-btn span.sun {
  transform: scale(0.8);
}

.theme-btn span,
.theme-btn svg {
  transition: transform 0.2s ease;
}

.theme-btn:hover span,
.theme-btn:hover svg {
  transform: scale(1.2) rotate(20deg);
}
.theme-btn {
  position: relative;
}

.theme-btn:hover span.sun {
  transform: scale(1.05) rotate(20deg);
}
.theme-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  color: white;
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.theme-btn:hover::after {
  opacity: 1;
}

.logout-btn svg {
  width: 32px;
  height: 32px;
}

.logout-btn:hover svg {
  transform: scale(1.2);
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
  font-weight: bold;
  opacity: 1;
  padding: 0;
  margin: 0 6px;
}

.message-dots:hover {
  opacity: 1;
}

.message-menu {
  position: fixed;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dark .message-menu {
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .message-menu button {
  color: white;
}

.dark .message-menu button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.message-menu button {
  background: none;
  border: none;
  padding: 6px 10px;
  text-align: left;
  cursor: pointer;
}

.message-menu button:hover {
  background: rgba(0, 0, 0, 0.05);
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
.form-control:focus {
  outline: none;
  border-color: #ff0000;
  box-shadow: 0 0 0 0.2rem rgba(255, 0, 0, 0.25);
}
.message-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 6px;
}

.action-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.8;
  padding: 2px;
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.light .action-btn {
  color: black;
}

.dark .action-btn {
  color: white;
}
.action-btn:hover {
  transform: scale(1.2);
  opacity: 1;
}

.action-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  color: white;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.action-btn:hover::after {
  opacity: 1;
}
.action-btn[data-tooltip="More"] {
  font-size: 20px;
}
.flex-spacer {
  width: 157px;
}
.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s ease, transform 0.15s ease;
}

.light .header-icon:hover {
  background: rgba(255, 0, 0, 0.5);
}

.dark .header-icon:hover {
  background: rgba(255, 0, 0, 0.3);
}

.header-icon:hover {
  transform: scale(1.1);
}
.header-icon {
  position: relative;
}
.header-icon::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  color: white;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.header-icon:hover::after {
  opacity: 1;
}
.light .header-icon {
  color: rgb(0, 0, 0);
}

.dark .header-icon {
  color: white;
}
.header-menu {
  position: fixed;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 180px;
}

.dark .header-menu {
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-menu button {
  background: none;
  border: none;
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}

.header-menu button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dark .header-menu button {
  color: white;
}

.dark .header-menu button:hover {
  background: rgba(255, 255, 255, 0.1);
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
  gap: 10px;
}

.header-menu button:hover {
  background: rgba(0, 0, 0, 0.08);
}

.contact-menu-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  opacity: 1;
  padding: 4px;
  border-radius: 50%;
  color: black;
  transition: color 0.3s ease, opacity 0.2s ease, background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.contact-menu-btn:hover {
  opacity: 1;
  background: rgba(255, 0, 0, 0.55);
}

.dark .contact-menu-btn:hover {
  opacity: 1;
  background: rgba(255, 0, 0, 0.25);
}

.dark .contact-menu-btn {
  color: white;
}
</style>
