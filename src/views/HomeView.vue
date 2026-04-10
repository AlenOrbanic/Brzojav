<template>
  <div :class="['app-layout', theme]">
    <video class="bg-video" autoplay muted loop playsinline>
      <source src="../assets/framebg.mp4" type="video/mp4" />
    </video>
    <div class="app-topbar border-bottom px-3 py-2 d-flex align-items-center">
      <h5 class="mb-0 me-2">Brzojav</h5>
      <div class="flex-spacer"></div>
      <div class="d-flex align-items-center gap-1">
        <button class="theme-btn" @click="toggleTheme" data-tooltip="Change Theme">
          <span v-if="theme === 'light'">⏾</span>
          <span v-else class="sun">☀︎</span>
        </button>

        <button class="theme-btn" @click="handleSpecialAction" data-tooltip="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-gear-fill"
            viewBox="0 0 16 16">
            <path
              d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.340a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
          </svg>
        </button>
      </div>

      <input v-model="globalSearch" type="text" class="form-control search-input"
        placeholder="Search conversations..." />
    </div>
    <div class="app-body">
      <div class="sidebar border-end">
        <div class="profile-section border-bottom mb-2">
          <div class="d-flex align-items-center justify-content-between w-100">
            <div class="d-flex align-items-center flex-grow-1" @click="goToProfile">
              <img :src="user.avatar" class="rounded-circle me-3 avatar-border" width="40" height="40" />
              <div>
                <div class="fw-bold">{{ user.name }}</div>
                <small class="text-muted">View Profile</small>
              </div>
            </div>

            <button class="theme-btn logout-btn" @click="logout" data-tooltip="Log out">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                  d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                <path fill-rule="evenodd"
                  d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="px-2 py-1">
          <button class="btn w-100 theme-action-btn" @click="createConversation">
            + New Chat / Group
          </button>
        </div>
        <div class="contacts">
          <div v-for="chat in filteredChats" :key="chat.id"
            class="contact-item d-flex justify-content-between align-items-center"
            :class="{ active: selectedChat?.id === chat.id }" @click="selectChat(chat)">
            <div class="d-flex align-items-center flex-grow-1">
              <img :src="chat.avatar" class="rounded-circle me-2 avatar-border" width="40" height="40" />
              <div class="flex-grow-1">
                <div class="fw-semibold">
                  {{ chat.name }}
                  <span v-if="chat.pinned" class="pinned-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin"
                      viewBox="0 0 16 16">
                      <path
                        d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                    </svg>
                  </span>
                  <span v-if="chat.muted" class="pinned-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-bell-slash" viewBox="0 0 16 16">
                      <path
                        d="M5.164 14H15c-.299-.199-.557-.553-.78-1-.9-1.8-1.22-5.12-1.22-6q0-.396-.06-.776l-.938.938c.02.708.157 2.154.457 3.58.161.767.377 1.566.663 2.258H6.164zm5.581-9.91a4 4 0 0 0-1.948-1.01L8 2.917l-.797.161A4 4 0 0 0 4 7c0 .628-.134 2.197-.459 3.742q-.075.358-.166.718l-1.653 1.653q.03-.055.059-.113C2.679 11.2 3 7.88 3 7c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0c.942.19 1.788.645 2.457 1.284zM10 15a2 2 0 1 1-4 0zm-9.375.625a.53.53 0 0 0 .75.75l14.75-14.75a.53.53 0 0 0-.75-.75z" />
                    </svg>
                  </span>
                </div>
                <small class="text-muted text-truncate">
                  {{ chat.lastMessage }}
                </small>
              </div>
            </div>
            <button class="contact-menu-btn" @click.stop="openChatMenu($event, chat)">
              ⋯
            </button>
          </div>
        </div>
      </div>
      <div class="chat-area d-flex flex-column">
        <div v-if="viewingContactInfo" class="contact-info-wrapper">

          <button class="back-btn" @click="closeContactInfo">
            ← Back
          </button>

          <div class="contact-info-view d-flex flex-column align-items-center justify-content-center p-5">

            <img :src="contactInfoData.avatar" class="rounded-circle mb-3" width="50" height="50" />
            <div class="fw-bold fs-5 mb-1">{{ contactInfoData.name }}</div>
            <div class="contact-meta fs-6 mb-1">
              Last seen: {{ contactInfoData.lastSeen }}
            </div>
            <div class="contact-meta fs-6 mb-1">{{ contactInfoData.phone }}</div>

            <div class="shared-media w-100">
              <div class="fw-bold fs-5 mb-3">Shared Media</div>

              <div class="media-grid">
                <div v-for="media in sharedMedia" :key="media.id">

                  <img v-if="media.type === 'image' || media.type === 'gif'" :src="media.url" class="media-item"
                    @click="openLightbox(media)" />

                  <video v-else-if="media.type === 'video'" class="media-item" @click="openLightbox(media)">
                    <source :src="media.url" type="video/mp4" />
                  </video>

                </div>
              </div>
            </div>

          </div>
        </div>

        <template v-else>
          <div class="chat-header border-bottom p-3 d-flex align-items-center justify-content-between">
            <div v-if="selectedChat" class="d-flex align-items-center">
              <img :src="selectedChat.avatar" class="rounded-circle me-2 avatar-border" width="40" height="40" />
              <div class="fw-bold">
                {{ selectedChat.name }}
              </div>
            </div>

            <div v-else class="text-muted">Select a conversation</div>

            <div v-if="selectedChat" class="chat-header-actions">
              <button class="header-icon" data-tooltip="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search"
                  viewBox="0 0 16 16">
                  <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>

              <button class="header-icon" data-tooltip="More" @click.stop="toggleHeaderMenu($event)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                  class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                  <path
                    d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>
              </button>
            </div>
          </div>
          <div ref="messagesBox" class="messages flex-grow-1 p-3">
            <div v-for="(msg, index) in selectedChat?.messages || []" :key="index" class="mb-2"
              :class="msg.sender === 'me' ? 'text-end' : 'text-start'">
              <div class="message-wrapper w-100 d-flex" :class="msg.sender === 'me'
                ? 'justify-content-end'
                : 'justify-content-start'
                " @mouseenter="hoveredMessage = index" @mouseleave="hoveredMessage = null">
                <div v-if="hoveredMessage === index && msg.sender === 'me'" class="message-actions">
                  <button class="action-btn" @click.stop="openMessageMenu($event, msg)" data-tooltip="More">
                    ⋮
                  </button>
                  <button class="action-btn" @click.stop="replyMessage" data-tooltip="Reply">
                    ⤶
                  </button>
                  <button class="action-btn" @click.stop="reactMessage" data-tooltip="React">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-emoji-grin" viewBox="0 0 16 16">
                      <path
                        d="M12.946 11.398A6.002 6.002 0 0 1 2.108 9.14c-.114-.595.426-1.068 1.028-.997C4.405 8.289 6.48 8.5 8 8.5s3.595-.21 4.864-.358c.602-.07 1.142.402 1.028.998a5.95 5.95 0 0 1-.946 2.258m-.078-2.25C11.588 9.295 9.539 9.5 8 9.5s-3.589-.205-4.868-.352c.11.468.286.91.517 1.317A37 37 0 0 0 8 10.75a37 37 0 0 0 4.351-.285c.231-.407.407-.85.517-1.317m-1.36 2.416c-1.02.1-2.255.186-3.508.186s-2.488-.086-3.507-.186A5 5 0 0 0 8 13a5 5 0 0 0 3.507-1.436ZM6.488 7c.114-.294.179-.636.179-1 0-1.105-.597-2-1.334-2C4.597 4 4 4.895 4 6c0 .364.065.706.178 1 .23-.598.662-1 1.155-1 .494 0 .925.402 1.155 1M12 6c0 .364-.065.706-.178 1-.23-.598-.662-1-1.155-1-.494 0-.925.402-1.155 1a2.8 2.8 0 0 1-.179-1c0-1.105.597-2 1.334-2C11.403 4 12 4.895 12 6" />
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14" />
                    </svg>
                  </button>
                </div>
                <span class="d-inline-block p-2 rounded message" :class="msg.sender === 'me' ? 'sent' : 'received'">
                  {{ msg.text }}
                </span>

                <div v-if="hoveredMessage === index && msg.sender !== 'me'" class="message-actions">
                  <button class="action-btn" @click.stop="reactMessage" data-tooltip="React">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-emoji-grin" viewBox="0 0 16 16">
                      <path
                        d="M12.946 11.398A6.002 6.002 0 0 1 2.108 9.14c-.114-.595.426-1.068 1.028-.997C4.405 8.289 6.48 8.5 8 8.5s3.595-.21 4.864-.358c.602-.07 1.142.402 1.028.998a5.95 5.95 0 0 1-.946 2.258m-.078-2.25C11.588 9.295 9.539 9.5 8 9.5s-3.589-.205-4.868-.352c.11.468.286.91.517 1.317A37 37 0 0 0 8 10.75a37 37 0 0 0 4.351-.285c.231-.407.407-.85.517-1.317m-1.36 2.416c-1.02.1-2.255.186-3.508.186s-2.488-.086-3.507-.186A5 5 0 0 0 8 13a5 5 0 0 0 3.507-1.436ZM6.488 7c.114-.294.179-.636.179-1 0-1.105-.597-2-1.334-2C4.597 4 4 4.895 4 6c0 .364.065.706.178 1 .23-.598.662-1 1.155-1 .494 0 .925.402 1.155 1M12 6c0 .364-.065.706-.178 1-.23-.598-.662-1-1.155-1-.494 0-.925.402-1.155 1a2.8 2.8 0 0 1-.179-1c0-1.105.597-2 1.334-2C11.403 4 12 4.895 12 6" />
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14" />
                    </svg>
                  </button>
                  <button class="action-btn" @click.stop="replyMessage" data-tooltip="Reply">
                    ⤶
                  </button>
                  <button class="action-btn" @click.stop="openMessageMenu($event, msg)" data-tooltip="More">
                    ⋮
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-if="selectedChat && !viewingContactInfo" class="p-3 border-top d-flex">

          <div v-if="selectedChat.blocked" class="blocked-text w-100 text-center">
            User is blocked
          </div>

          <template v-else>
            <textarea v-model="newMessage" @keydown="handleKeyPress" @input="autoGrow" ref="messageInput"
              class="form-control me-2" placeholder="Type a message..." rows="1"></textarea>

            <button class="btn send-btn" @click="sendMessage">Send</button>
          </template>

        </div>
      </div>
      <div v-if="messageMenu.visible" class="message-menu"
        :style="{ top: messageMenu.y + 'px', left: messageMenu.x + 'px' }">
        <button @click="replyMessage">Reply</button>
        <button @click="copyMessage">Copy text</button>
        <button @click="reactMessage">React</button>
        <button @click="pinMessage">Pin message</button>
      </div>
    </div>
    <div v-if="showLogoutMessage" class="logout-toast">
      Logging out...
    </div>
    <HeaderMenu :visible="headerMenu.visible" :x="headerMenu.x" :y="headerMenu.y" :items="headerMenuItems"
      @close="closeHeaderMenu" />
    <div v-if="lightbox.visible" class="lightbox" @click="closeLightbox">

      <div class="lightbox-media-wrapper">

        <div class="lightbox-close" @click.stop="closeLightbox">
          ✕
        </div>

        <img v-if="lightbox.media?.type === 'image' || lightbox.media?.type === 'gif'" :src="lightbox.media?.url"
          class="lightbox-content" />

        <video v-else class="lightbox-content" controls autoplay>
          <source :src="lightbox.media?.url" type="video/mp4" />
        </video>

      </div>

    </div>
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
      viewingContactInfo: false,
      contactInfoData: null,
      showLogoutMessage: false,
      selectedChatForMenu: null,
      theme: "light",
      globalSearch: "",
      newMessage: "",
      selectedChat: null,
      activeChat: null,
      hoveredMessage: null,
      lightbox: {
        visible: false,
        media: null,
      },
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
      sharedMedia: [
        {
          id: 1,
          type: "image",
          url: "https://i.pinimg.com/736x/77/36/82/77368296b7a80054a2277233d7bfbe0b.jpg"
        },
        {
          id: 2,
          type: "image",
          url: "https://i.pinimg.com/736x/af/df/bc/afdfbcc120c6602097a0f9a7109214a5.jpg"
        },
        {
          id: 3,
          type: "gif",
          url: "https://i.pinimg.com/originals/32/c3/a7/32c3a75b9d47ea321c108dc076708640.gif"
        },
        {
          id: 4,
          type: "image",
          url: "https://i.pinimg.com/736x/4c/e0/0f/4ce00fd60c54afa644201398dc0533d4.jpg"
        },
        {
          id: 5,
          type: "image",
          url: "https://i.pinimg.com/1200x/1a/1f/7a/1a1f7a9804716669cc2eb68bb80a1d24.jpg"
        },
        {
          id: 6,
          type: "image",
          url: "https://i.pinimg.com/1200x/c6/01/e5/c601e591abec4594bb73db34b12eb812.jpg"
        },
        {
          id: 7,
          type: "video",
          url: "https://cdn.discordapp.com/attachments/869655665575096410/1492082335359959040/PinLoad_ArpWire_TV_on_Instagram_24_Years_of_PlayStation_2_Today_marks_the_24th_annive_1775810540606.mp4?ex=69da0976&is=69d8b7f6&hm=89b3bce93e34b79d8a4c6cb45f35ac857a951ee8fe92188f905030fc770116f3&"
        }
      ],
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
          label: "",
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
          action: () => this.openSharedMedia(this.selectedChatForMenu),
        },
      ],
      chats: [
        {
          id: 1,
          name: "John Doe",
          avatar: "https://i.pinimg.com/736x/10/ff/74/10ff74284ea2b3957b90b9556e05dce2.jpg",
          lastMessage: "Hey!",
          phone: "+1 555 123 4567",
          pinned: false,
          pinnedAt: null,
          muted: false,
          hidden: false,
          blocked: false,
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
      const search = this.globalSearch.toLowerCase();

      return this.sortedChats.filter(chat => {
        const matchesSearch = chat.name.toLowerCase().includes(search);

        if (this.globalSearch) {

          return matchesSearch;
        }

        return !chat.hidden;
      });
    },

    sortedChats() {
      return [...this.chats].sort((a, b) => {
        if (a.pinned && b.pinned) {
          return a.pinnedAt - b.pinnedAt;
        }
        if (a.pinned) return -1;
        if (b.pinned) return 1;

        return 0;
      });
    },
  },
  methods: {
    openLightbox(media) {
      this.lightbox.media = media;
      this.lightbox.visible = true;
    },

    closeLightbox() {
      this.lightbox.visible = false;
      this.lightbox.media = null;
    },
    selectChat(chat) {
      chat.hidden = false;
      this.activeChat = chat;
      this.selectedChat = chat;

      this.selectedChatForMenu = chat;
      this.globalSearch = "";

      this.viewingContactInfo = false;
      this.contactInfoData = null;

      this.$nextTick(this.scrollToBottom);
    },
    closeChat(chat) {
      if (!chat) return;

      chat.hidden = true;

      if (this.selectedChat?.id === chat.id) {
        this.selectedChat = null;
      }

      this.closeHeaderMenu();
    },
    openChatMenu(event, chat) {
      event.stopPropagation();

      const rect = event.currentTarget.getBoundingClientRect();
      this.selectedChatForMenu = chat;

      const pinItem = this.headerMenuItems.find(i =>
        i.action.toString().includes("pinChat")
      );

      const muteItem = this.headerMenuItems.find(i =>
        i.action.toString().includes("muteChat")
      );

      const blockItem = this.headerMenuItems.find(i =>
        i.action.toString().includes("blockUser")
      );

      if (blockItem) {
        blockItem.label = chat.blocked
          ? "🔓 Unblock"
          : "⛔ Block";
      }

      if (muteItem) {
        muteItem.label = chat.muted
          ? "🔔 Unmute Notifications"
          : "🔕 Mute Notifications";
      }

      if (pinItem) {
        pinItem.label = chat.pinned
          ? "📍 Unpin Conversation"
          : "📌 Pin Conversation";
      }

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
      const pinItem = this.headerMenuItems.find(i =>
        i.action.toString().includes("pinChat")
      );
      if (pinItem && this.selectedChatForMenu) {
        pinItem.label = this.selectedChatForMenu.pinned
          ? "📍 Unpin Conversation"
          : "📌 Pin Conversation";
      }

      this.headerMenu.visible = true;
      this.headerMenu.x = rect.right - 180;
      this.headerMenu.y = rect.bottom + 5;
    },

    closeHeaderMenu() {
      this.headerMenu.visible = false;
    },

    contactInfo(chat) {
      if (!chat) return;

      this.activeChat = chat;
      this.contactInfoData = chat;
      this.viewingContactInfo = true;

      this.closeHeaderMenu();
    },
    muteChat(chat) {
      if (!chat) return;

      chat.muted = !chat.muted;

      this.closeHeaderMenu();
    },
    pinChat(chat) {
      if (!chat) return;

      if (!chat.pinned) {
        chat.pinned = true;
        chat.pinnedAt = Date.now();
      } else {
        chat.pinned = false;
        chat.pinnedAt = null;
      }

      this.closeHeaderMenu();
    },
    closeContactInfo() {
      this.viewingContactInfo = false;
      this.contactInfoData = null;
      if (this.activeChat) {
        this.selectedChat = this.activeChat;
      }
    },
    blockUser(chat) {
      if (!chat) return;

      chat.blocked = !chat.blocked;

      // optional UX behavior
      if (chat.blocked && this.selectedChat?.id === chat.id) {
        this.newMessage = "";
      }

      this.closeHeaderMenu();
    },
    deleteChat(chat) {
      if (!chat) return;
      chat.messages = [];
      chat.lastMessage = "";
      chat.hidden = true;

      if (this.selectedChat?.id === chat.id) {
        this.selectedChat = null;
      }

      this.closeHeaderMenu();
    },
    openSharedMedia(chat) {
      if (!chat) return;
      this.activeChat = chat;
      this.contactInfoData = chat;
      this.viewingContactInfo = true;

      this.closeHeaderMenu();
    },
    logout() {
      this.showLogoutMessage = true;

      setTimeout(() => {
        this.showLogoutMessage = false;
        this.$router.replace("/login");
      }, 2000);
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
    sendMessage() {
      if (!this.selectedChat) return;

      if (this.selectedChat.blocked) return;

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
  width: 360px;
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
  background: rgba(255, 50, 50, 0.384);
}

.dark .contact-item:hover {
  background: rgba(255, 54, 54, 0.167);
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
  background: rgba(255, 60, 60, 0.83);
}

.app-layout.dark .contact-item.active {
  background: rgba(255, 0, 0, 0.212);
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
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
  width: 227px;
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

.logout-toast {
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

.pinned-icon svg {
  filter: drop-shadow(0 0 1px currentColor);
}

.contact-info-view {
  width: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  justify-content: flex-start;
  padding-top: 60px;
  padding-bottom: 60px;
}

.contact-info-view img,
.contact-info-view video {
  border: 3px solid #ff0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
}

.shared-media {
  width: 100%;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.media-item {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
  will-change: transform;
}

.media-item:hover {
  transform: scale(1.06);
  box-shadow: 0 10px 25px rgba(255, 0, 0, 0.35);
  z-index: 2;
}

.media-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 9999;
  background: transparent;
  border: 2px solid #ff0000;
  color: #ff0000;

  padding: 6px 12px;
  border-radius: 8px;

  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 0, 0, 0.1);
}

.contact-info-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 99999;

  animation: fadeIn 0.25s ease;
}

.lightbox-content {
  display: block;
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 12px;
  transform: scale(0.9);
  animation: zoomIn 0.25s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  to {
    transform: scale(1);
  }
}

.lightbox-close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;

  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
  color: white;

  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.lightbox-close:hover {
  transform: scale(1.1);
  background: rgba(255, 0, 0, 0.6);
}

.lightbox-media-wrapper {
  position: relative;
  display: inline-block;
  max-width: 90vw;
  max-height: 90vh;
}

.light .contact-meta {
  color: black;
}

.dark .contact-meta {
  color: white;
  opacity: 0.8;
}

.blocked-text {
  color: red;
  font-weight: bold;
  padding: 10px;
}
</style>
