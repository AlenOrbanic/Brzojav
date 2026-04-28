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
            class="btn w-100 theme-action-btn action-btn-hover"
            @click="createConversation"
          >
            {{ showNewChatMenu ? "← Back" : "+ New Chat / Group" }}
          </button>
        </div>
        <div class="contacts">
          <template v-if="showNewChatMenu">
            <template v-if="showNewContactView">
              <div class="new-contact-view px-2 pt-2">
                <input
                  v-model="newContactSearch"
                  type="text"
                  class="form-control"
                  placeholder="Search @username"
                  @focus="showInviteSent = false"
                />
                <div v-if="showInviteSent" class="invite-sent-text">Invite sent!</div>
                <button
                  class="btn theme-action-btn send-invite-btn action-btn-hover"
                  @click="sendInvite"
                >
                  Send invite
                </button>
              </div>
            </template>
            <template v-else-if="showNewGroupView">
              <div class="new-contact-view px-2 pt-2">
                <input
                  v-model="groupSearch"
                  type="text"
                  class="form-control mb-2"
                  placeholder="Search @username"
                />
                <button
                  class="btn theme-action-btn send-invite-btn action-btn-hover mb-2"
                  :disabled="selectedGroupMembers.length < 2"
                  @click="createGroup"
                >
                  Create group
                </button>
                <div class="group-member-list">
                  <div
                    v-for="chat in filteredGroupChats"
                    :key="chat.id"
                    class="contact-item d-flex align-items-center"
                    @click="toggleGroupMember(chat)"
                  >
                    <img
                      :src="chat.avatar"
                      class="rounded-circle me-2 avatar-border"
                      width="40"
                      height="40"
                    />
                    <div class="flex-grow-1">
                      <div class="fw-semibold">{{ chat.name }}</div>
                    </div>
                    <div
                      class="group-select-circle"
                      :class="{ selected: selectedGroupMembers.includes(chat) }"
                    >
                      <svg
                        v-if="selectedGroupMembers.includes(chat)"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="contact-item d-flex justify-content-between align-items-center"
                @click="showNewContactView = true"
              >
                <div class="d-flex align-items-center flex-grow-1">
                  <div class="new-chat-icon-wrap me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-person-fill-add"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
                      />
                      <path
                        d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
                      />
                    </svg>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold">New contact</div>
                  </div>
                </div>
              </div>
              <div
                class="contact-item d-flex justify-content-between align-items-center"
                @click="showNewGroupView = true"
              >
                <div class="d-flex align-items-center flex-grow-1">
                  <div class="new-chat-icon-wrap me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-people-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"
                      />
                    </svg>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold">New group</div>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div
              v-for="chat in filteredChats"
              :key="chat.id"
              class="contact-item d-flex justify-content-between align-items-center"
              :class="{ active: selectedChat?.id === chat.id }"
              @click="selectChat(chat)"
              @contextmenu.prevent="openChatMenu($event, chat)"
            >
              <div class="d-flex align-items-center flex-grow-1">
                <img
                  :src="chat.avatar"
                  class="rounded-circle me-2 avatar-border"
                  width="40"
                  height="40"
                />
                <div class="flex-grow-1">
                  <div class="fw-semibold">
                    {{ chat.name }}
                    <span v-if="chat.pinned" class="pinned-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-pin"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282"
                        />
                      </svg>
                    </span>
                    <span v-if="chat.muted" class="pinned-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-bell-slash"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M5.164 14H15c-.299-.199-.557-.553-.78-1-.9-1.8-1.22-5.12-1.22-6q0-.396-.06-.776l-.938.938c.02.708.157 2.154.457 3.58.161.767.377 1.566.663 2.258H6.164zm5.581-9.91a4 4 0 0 0-1.948-1.01L8 2.917l-.797.161A4 4 0 0 0 4 7c0 .628-.134 2.197-.459 3.742q-.075.358-.166.718l-1.653 1.653q.03-.055.059-.113C2.679 11.2 3 7.88 3 7c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0c.942.19 1.788.645 2.457 1.284zM10 15a2 2 0 1 1-4 0zm-9.375.625a.53.53 0 0 0 .75.75l14.75-14.75a.53.53 0 0 0-.75-.75z"
                        />
                      </svg>
                    </span>
                  </div>
                  <small class="text-muted d-block text-truncate">
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
          </template>
        </div>
      </div>
      <div class="chat-area d-flex flex-column">
        <div v-if="viewingSettings" class="contact-info-wrapper">
          <div class="settings-view">
            <div class="settings-title">Settings</div>
            <div class="settings-row">
              <span class="settings-label">Last seen</span>
              <div class="settings-toggle-group">
                <button
                  class="settings-toggle-btn"
                  :class="{ active: settings.lastSeen === 'shown' }"
                  @click="settings.lastSeen = 'shown'"
                >Shown</button>
                <button
                  class="settings-toggle-btn"
                  :class="{ active: settings.lastSeen === 'hidden' }"
                  @click="settings.lastSeen = 'hidden'"
                >Hidden</button>
              </div>
            </div>
            <div class="settings-row">
              <span class="settings-label">Message notifications</span>
              <div class="settings-toggle-group">
                <button
                  class="settings-toggle-btn"
                  :class="{ active: settings.messageNotifications === 'on' }"
                  @click="settings.messageNotifications = 'on'"
                >On</button>
                <button
                  class="settings-toggle-btn"
                  :class="{ active: settings.messageNotifications === 'off' }"
                  @click="settings.messageNotifications = 'off'"
                >Off</button>
              </div>
            </div>
            <div class="settings-row">
              <span class="settings-label">Allow messages from strangers</span>
              <div class="settings-toggle-group">
                <button
                  class="settings-toggle-btn"
                  :class="{ active: settings.allowStrangers === 'on' }"
                  @click="settings.allowStrangers = 'on'"
                >On</button>
                <button
                  class="settings-toggle-btn"
                  :class="{ active: settings.allowStrangers === 'off' }"
                  @click="settings.allowStrangers = 'off'"
                >Off</button>
              </div>
            </div>
            <div class="settings-row settings-row-column">
              <div class="d-flex align-items-center justify-content-between w-100">
                <span class="settings-label">Blocked accounts</span>
                <button class="settings-expand-btn" @click="showBlockedAccounts = !showBlockedAccounts">
                  {{ showBlockedAccounts ? '▲' : '▼' }}
                </button>
              </div>
              <div v-if="showBlockedAccounts" class="blocked-list">
                <div v-if="chats.filter(c => c.blocked).length === 0" class="blocked-empty">
                  No blocked accounts
                </div>
                <div
                  v-for="chat in chats.filter(c => c.blocked)"
                  :key="chat.id"
                  class="blocked-item"
                >
                  <img :src="chat.avatar" class="rounded-circle avatar-border" width="36" height="36" />
                  <div class="blocked-info">
                    <div class="fw-semibold">{{ chat.name }}</div>
                    <small class="username-tag">{{ chat.username }}</small>
                  </div>
                  <button class="unblock-btn" @click="chat.blocked = false">Unblock</button>
                </div>
              </div>
            </div>
            <div class="settings-row">
              <button class="delete-account-btn" @click="showDeleteConfirm = true">Delete account</button>
            </div>
            <div v-if="showDeleteConfirm" class="delete-confirm-overlay">
              <div class="delete-confirm-box">
                <div class="delete-confirm-text">Are you sure you want to delete your account? This cannot be undone.</div>
                <div class="delete-confirm-actions">
                  <button class="delete-confirm-yes" @click="showDeleteConfirm = false">Yes</button>
                  <button class="delete-confirm-no" @click="showDeleteConfirm = false">No</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="viewingOwnProfile" class="contact-info-wrapper">
          <button class="back-btn" @click="viewingOwnProfile = false">← Back</button>
          <div class="contact-info-view d-flex flex-column align-items-center p-5">

            <div class="profile-avatar-wrap mb-3">
              <img :src="user.avatar" class="rounded-circle" width="80" height="80" style="border: 3px solid #ff0000; box-shadow: 0 0 10px rgba(255,0,0,0.5);" />
              <button class="profile-edit-icon" @click="startEditUserField('avatar')" data-tooltip="Edit photo">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
              </button>
            </div>
            <input v-if="editingUserField === 'avatar'" v-model="editingUserInput" class="form-control mb-2" style="max-width:320px;" placeholder="Paste image URL..." @keydown.enter="saveUserField" @blur="saveUserField" autofocus />
            <div class="d-flex align-items-center gap-2 mb-1">
              <template v-if="editingUserField === 'name'">
                <input v-model="editingUserInput" class="chat-name-input" placeholder="Your name..." @keydown.enter="saveUserField" @blur="saveUserField" autofocus />
              </template>
              <template v-else>
                <span class="fw-bold fs-5">{{ user.name }}</span>
                <svg @click="startEditUserField('name')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square chat-name-edit-icon" viewBox="0 0 16 16" style="cursor:pointer;flex-shrink:0">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
              </template>
            </div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <template v-if="editingUserField === 'username'">
                <input v-model="editingUserInput" class="chat-name-input" placeholder="@username..." @keydown.enter="saveUserField" @blur="saveUserField" autofocus />
              </template>
              <template v-else>
                <span class="username-tag fs-6">Username: {{ user.username }}</span>
                <svg @click="startEditUserField('username')" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-square chat-name-edit-icon" viewBox="0 0 16 16" style="cursor:pointer;flex-shrink:0">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
              </template>
            </div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <template v-if="editingUserField === 'phone'">
                <input v-model="editingUserInput" class="chat-name-input" placeholder="Phone number..." @keydown.enter="saveUserField" @blur="saveUserField" autofocus />
              </template>
              <template v-else>
                <span class="contact-meta fs-6">Phone: {{ user.phone }}</span>
                <svg @click="startEditUserField('phone')" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-square chat-name-edit-icon" viewBox="0 0 16 16" style="cursor:pointer;flex-shrink:0">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
              </template>
            </div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <template v-if="editingUserField === 'email'">
                <input v-model="editingUserInput" class="chat-name-input" placeholder="Email..." @keydown.enter="saveUserField" @blur="saveUserField" autofocus />
              </template>
              <template v-else>
                <span class="contact-meta fs-6">Email: {{ user.email }}</span>
                <svg @click="startEditUserField('email')" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-square chat-name-edit-icon" viewBox="0 0 16 16" style="cursor:pointer;flex-shrink:0">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
              </template>
            </div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="creation-date">Account creation date: {{ user.createdAt }}</span>
            </div>

          </div>
        </div>
        <div v-else-if="viewingContactInfo" class="contact-info-wrapper">
          <button class="back-btn" @click="closeContactInfo">← Back</button>
          <div
            class="contact-info-view d-flex flex-column align-items-center justify-content-center p-5"
          >
            <img
              :src="contactInfoData.avatar"
              class="rounded-circle mb-3"
              width="80"
              height="80"
            />
            <div class="fw-bold fs-5 mb-1 d-flex align-items-center gap-2">
              <template v-if="editingChatName">
                <input
                  v-model="chatNameInput"
                  class="chat-name-input"
                  placeholder="New chat name..."
                  @keydown.enter="saveChatName"
                  @blur="saveChatName"
                  ref="chatNameInput"
                  autofocus
                />
              </template>
              <template v-else>
                {{ contactInfoData.name }}
                <svg
                  @click="startEditingChatName"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil-square chat-name-edit-icon"
                  viewBox="0 0 16 16"
                  style="cursor: pointer; flex-shrink: 0"
                >
                  <path
                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                  />
                </svg>
              </template>
            </div>

            <template v-if="contactInfoData.members?.length">
              <div class="contact-meta fs-6 mb-2">
                {{ contactInfoData.members.length }} Members
              </div>
              <div class="group-members-list w-100 mb-3">
                <div
                  v-for="(member, i) in contactInfoData.members"
                  :key="i"
                  class="group-member-item"
                >
                  <img
                    :src="member.avatar"
                    class="rounded-circle avatar-border"
                    width="36"
                    height="36"
                  />
                  <div class="group-member-info">
                    <div class="fw-semibold">{{ member.name }}</div>
                      <small class="contact-meta">{{ member.username }} · Last seen: {{ member.lastSeen }}</small>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="contact-meta fs-6 mb-1 username-tag">
                {{ contactInfoData.username }}
              </div>
              <div class="contact-meta fs-6 mb-1">
                Last seen: {{ contactInfoData.lastSeen }}
              </div>
              <div class="contact-meta fs-6 mb-1">
                {{ contactInfoData.phone }}
              </div>
            </template>

            <div class="shared-media w-100">
              <div class="fw-bold fs-5 mb-3">Shared Media</div>

              <div class="media-grid">
                <div v-for="media in sharedMedia" :key="media.id">
                  <img
                    v-if="media.type === 'image' || media.type === 'gif'"
                    :src="media.url"
                    class="media-item"
                    @click="openLightbox(media)"
                  />

                  <video
                    v-else-if="media.type === 'video'"
                    class="media-item"
                    @click="openLightbox(media)"
                  >
                    <source :src="media.url" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template v-else-if="!viewingSettings">
          <div
            class="chat-header border-bottom p-3 d-flex align-items-center justify-content-between"
          >
            <div
              v-if="selectedChat"
              class="d-flex align-items-center"
              @mouseenter="hoveredChatName = true"
              @mouseleave="hoveredChatName = false"
            >
              <img
                :src="selectedChat.avatar"
                class="rounded-circle me-2 avatar-border"
                width="40"
                height="40"
              />
              <div
                class="fw-bold d-flex align-items-center gap-2 chat-name-wrapper"
              >
                <template v-if="editingChatName">
                  <input
                    v-model="chatNameInput"
                    class="chat-name-input"
                    placeholder="New chat name..."
                    @keydown.enter="saveChatName"
                    @blur="saveChatName"
                    ref="chatNameInput"
                    autofocus
                  />
                </template>
                <template v-else>
                  {{ selectedChat.name }}
                  <span
                    class="chat-name-icon-slot"
                    @click="startEditingChatName"
                  >
                    <svg
                      v-show="hoveredChatName"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-pencil-square chat-name-edit-icon"
                      viewBox="0 0 16 16"
                      style="cursor: pointer"
                    >
                      <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                  </span>
                </template>
              </div>
            </div>

            <div v-else class="text-muted">Select a conversation</div>
            <div v-if="selectedChat" class="chat-header-actions">
              <div v-if="searchActive" class="chat-search-bar">
                <div class="search-left">
                  <span class="search-count">
                    {{ searchResults.length }} results
                  </span>

                  <button
                    @click="prevResult"
                    data-tooltip="Previous"
                    class="icon-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                      />
                    </svg>
                  </button>

                  <button
                    @click="nextResult"
                    data-tooltip="Next"
                    class="icon-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                      />
                    </svg>
                  </button>

                  <button
                    @click="closeSearch"
                    data-tooltip="Clear search"
                    class="icon-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-x-lg"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
                      />
                    </svg>
                  </button>
                </div>

                <input
                  v-model="chatSearchQuery"
                  @input="searchMessages"
                  type="text"
                  placeholder="Search messages..."
                  class="form-control search-input-inner"
                />
              </div>
              <button
                class="header-icon"
                @click="toggleChatSearch"
                data-tooltip="Search in chat"
              >
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
          <div v-if="pinnedMessage" class="pinned-bar" @click="scrollToPinned">
            📌 <span class="pinned-text">{{ pinnedMessage.text }}</span>
            <button class="unpin-btn" @click.stop="pinnedMessage = null">
              ✕
            </button>
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
                    @click.stop="reactMessage($event, msg)"
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
                <div
                  class="message-bubble-wrap"
                  :class="[
                    msg.sender === 'me' ? 'bubble-me' : 'bubble-other',
                    msg.reactions && msg.reactions.length ? 'has-reaction' : '',
                  ]"
                  @contextmenu.prevent="openMessageMenu($event, msg)"
                >
                  <div
                    v-if="msg.replyTo"
                    class="reply-quote"
                    :class="
                      msg.sender === 'me'
                        ? 'reply-quote-me'
                        : 'reply-quote-other'
                    "
                  >
                    <div class="reply-quote-name">{{ msg.replyTo.sender }}</div>
                    <div class="reply-quote-text">{{ msg.replyTo.text }}</div>
                  </div>
                  <div
                    v-if="msg.media && msg.media.length"
                    class="msg-media-wrap"
                  >
                    <div
                      v-for="(m, i) in msg.media"
                      :key="i"
                      style="display: inline-block"
                    >
                      <img
                        v-if="m.type === 'image'"
                        :src="m.url"
                        class="msg-media"
                        @click="openLightbox(m)"
                      />
                      <video v-else :src="m.url" class="msg-media" controls />
                    </div>
                  </div>
                  <span
                    v-if="msg.text"
                    class="d-inline-block p-2 rounded message"
                    :class="[
                      msg.sender === 'me' ? 'sent' : 'received',
                      isMessageMatched(index) ? 'highlighted' : '',
                      isCurrentMatch(index) ? 'active-highlight' : '',
                    ]"
                  >
                    {{ msg.text }}
                  </span>
                  <div
                    v-if="msg.reactions && msg.reactions.length"
                    class="reaction-row"
                    :class="
                      msg.sender === 'me'
                        ? 'reaction-row-me'
                        : 'reaction-row-other'
                    "
                  >
                    <div
                      v-for="(reaction, ri) in msg.reactions"
                      :key="ri"
                      class="reaction-chip"
                      :class="{
                        'reaction-chip-mine': reaction.sender === 'me',
                      }"
                      @click="removeReaction(msg, reaction)"
                    >
                      <img :src="reaction.avatar" class="reaction-avatar" />
                      <span>{{ reaction.emoji }}</span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="hoveredMessage === index && msg.sender !== 'me'"
                  class="message-actions"
                >
                  <button
                    class="action-btn"
                    @click.stop="reactMessage($event, msg)"
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
        </template>
        <div
          v-if="selectedChat && !viewingContactInfo"
          class="input-area border-top"
        >
          <div
            v-if="selectedChat.blocked"
            class="blocked-text w-100 text-center p-3"
          >
            User is blocked
          </div>
          <template v-else>
            <div v-if="replyingTo" class="reply-preview">
              <div class="reply-preview-inner">
                <div class="reply-preview-label">
                  Replying to <strong>{{ replyingTo.sender }}</strong>
                </div>
                <div class="reply-preview-text">{{ replyingTo.text }}</div>
              </div>
              <button class="reply-cancel-btn" @click="replyingTo = null">
                ✕
              </button>
            </div>
            <div v-if="pendingMedia.length" class="media-preview-bar">
              <div class="media-preview-inner">
                <div
                  v-for="(media, i) in pendingMedia"
                  :key="i"
                  class="media-preview-item"
                >
                  <img
                    v-if="media.type === 'image'"
                    :src="media.url"
                    class="media-preview-thumb"
                  />
                  <video v-else :src="media.url" class="media-preview-thumb" />
                  <button
                    class="media-preview-remove"
                    @click="pendingMedia.splice(i, 1)"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <button
                class="media-clear-btn"
                @click="pendingMedia = []"
                data-tooltip="Clear"
              >
                ✕
              </button>
            </div>
            <div class="input-row p-3">
              <button
                class="attach-btn"
                @click="triggerFileUpload"
                data-tooltip="Add media"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                  />
                </svg>
              </button>
              <input
                type="file"
                ref="fileInput"
                accept="image/*,video/*"
                multiple
                style="display: none"
                @change="handleFileUpload"
              />
              <textarea
                v-model="newMessage"
                @keydown="handleKeyPress"
                ref="messageInput"
                class="form-control me-2"
                placeholder="Type a message..."
                rows="1"
              ></textarea>
              <button class="btn send-btn" @click="sendMessage">Send</button>
            </div>
          </template>
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
        <button
          @click="deleteMessage"
          v-if="messageMenu.message?.sender === 'me'"
          style="color: red"
        >
          Delete message
        </button>
      </div>
    </div>
    <div v-if="showLogoutMessage" class="logout-toast">Logging out...</div>
    <div v-if="showMediaLimitToast" class="media-limit-toast">
      Cannot upload more than 10 media at once :(
    </div>
    <HeaderMenu
      :visible="headerMenu.visible"
      :class="{ measuring: headerMenu.measuring }"
      :x="headerMenu.x"
      :y="headerMenu.y"
      :items="headerMenuItems"
      @close="closeHeaderMenu"
    />
    <div v-if="lightbox.visible" class="lightbox" @click="closeLightbox">
      <div class="lightbox-media-wrapper">
        <div class="lightbox-close" @click.stop="closeLightbox">✕</div>

        <img
          v-if="
            lightbox.media?.type === 'image' || lightbox.media?.type === 'gif'
          "
          :src="lightbox.media?.url"
          class="lightbox-content"
        />

        <video v-else class="lightbox-content" controls autoplay>
          <source :src="lightbox.media?.url" type="video/mp4" />
        </video>
      </div>
    </div>
    <EmojiPicker
      v-if="emojiPicker.visible"
      :theme="theme"
      :style="{
        top: emojiPicker.y + 'px',
        left: emojiPicker.x + 'px',
        position: 'fixed',
      }"
      @select="pickEmoji"
      @close="emojiPicker.visible = false"
    />
  </div>
</template>

<script>
import HeaderMenu from "../components/HeaderMenu.vue";
import EmojiPicker from "../components/EmojiPicker.vue";
export default {
  components: {
    HeaderMenu,
    EmojiPicker,
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
      viewingSettings: false,
      settings: {
        lastSeen: 'shown',
        messageNotifications: 'on',
        allowStrangers: 'on',
      },
      showBlockedAccounts: false,
      showDeleteConfirm: false,
      _skipNextOutsideClick: false,
      showNewContactView: false,
      newContactSearch: "",
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
      pinnedMessage: null,
      pendingReactMessage: null,
      replyingTo: null,
      showMediaLimitToast: false,
      showNewChatMenu: false,
      editingChatName: false,
      hoveredChatName: false,
      chatNameInput: "",
      pendingMedia: [],
      lightbox: {
        visible: false,
        media: null,
      },
      searchActive: false,
      showInviteSent: false,
      chatSearchQuery: "",
      searchResults: [],
      currentSearchIndex: 0,
      showNewGroupView: false,
      groupSearch: "",
      selectedGroupMembers: [],
      user: {
        name: "Your Name",
        username: "@yourname",
        phone: "+1 555 000 0000",
        email: "templatemail@gmail.com",
        avatar: "https://i.pinimg.com/736x/fa/44/28/fa442865013215368d3e6776730a9bf2.jpg",
        createdAt: "April 28, 2026",
      },
      viewingOwnProfile: false,
      editingUserField: null,
      editingUserInput: "",
      messageMenu: {
        visible: false,
        x: 0,
        y: 0,
        message: null,
      },
      headerMenu: {
        visible: false,
        measuring: false,
        x: 0,
        y: 0,
      },
      sharedMedia: [
        {
          id: 1,
          type: "image",
          url: "https://i.pinimg.com/736x/77/36/82/77368296b7a80054a2277233d7bfbe0b.jpg",
        },
        {
          id: 2,
          type: "image",
          url: "https://i.pinimg.com/736x/af/df/bc/afdfbcc120c6602097a0f9a7109214a5.jpg",
        },
        {
          id: 3,
          type: "gif",
          url: "https://i.pinimg.com/originals/32/c3/a7/32c3a75b9d47ea321c108dc076708640.gif",
        },
        {
          id: 4,
          type: "image",
          url: "https://i.pinimg.com/736x/4c/e0/0f/4ce00fd60c54afa644201398dc0533d4.jpg",
        },
        {
          id: 5,
          type: "image",
          url: "https://i.pinimg.com/1200x/1a/1f/7a/1a1f7a9804716669cc2eb68bb80a1d24.jpg",
        },
        {
          id: 6,
          type: "image",
          url: "https://i.pinimg.com/1200x/c6/01/e5/c601e591abec4594bb73db34b12eb812.jpg",
        },
        {
          id: 7,
          type: "video",
          url: "https://cdn.discordapp.com/attachments/869655665575096410/1492082335359959040/PinLoad_ArpWire_TV_on_Instagram_24_Years_of_PlayStation_2_Today_marks_the_24th_annive_1775810540606.mp4?ex=69da0976&is=69d8b7f6&hm=89b3bce93e34b79d8a4c6cb45f35ac857a951ee8fe92188f905030fc770116f3&",
        },
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
          avatar:
            "https://i.pinimg.com/736x/10/ff/74/10ff74284ea2b3957b90b9556e05dce2.jpg",
          lastMessage: "Hey!",
          phone: "+1 555 123 4567",
          username: "@johndoe",
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
        {
          id: 2,
          name: "Alen Orban",
          avatar:
            "https://i.pinimg.com/originals/3e/60/44/3e6044ac70b25c8f767de5c253e521b9.gif",
          lastMessage: "Bok!!!!",
          phone: "+385 092 123 4567",
          username: "@alenorban",
          pinned: false,
          pinnedAt: null,
          muted: false,
          hidden: false,
          blocked: false,
          messages: [
            { sender: "other", text: "Ejla men!" },
            { sender: "me", text: "Ojla" },
          ],
        },
        {
          id: 3,
          name: "Chris Barnes",
          avatar:
            "https://i.pinimg.com/736x/7a/58/22/7a5822bbab7afda54f48cf7d2a64284d.jpg",
          lastMessage: "Yooo!",
          phone: "+1 555 123 4567",
          username: "@chrisbarnes",
          pinned: false,
          pinnedAt: null,
          muted: false,
          hidden: false,
          blocked: false,
          messages: [
            { sender: "other", text: "Sup!" },
            { sender: "me", text: "Hi there!" },
          ],
        },
      ],
      emojiPicker: { visible: false, x: 0, y: 0 },
    };
  },
  computed: {
    filteredChats() {
      const search = this.globalSearch.toLowerCase();

      return this.sortedChats.filter((chat) => {
        const matchesSearch = chat.name.toLowerCase().includes(search);

        if (this.globalSearch) {
          return matchesSearch;
        }

        return !chat.hidden;
      });
    },
    filteredGroupChats() {
      const q = this.groupSearch.toLowerCase();
      return this.chats.filter(
        (c) => !c.hidden && c.name.toLowerCase().includes(q),
      );
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
    handleSpecialAction() {
      if (this.viewingSettings) return;
      
      this.viewingContactInfo = false;
      this.contactInfoData = null;
      this.viewingOwnProfile = false;
      this.viewingSettings = true;
      this.selectedChat = null;
      this.showBlockedAccounts = false;
      this.showDeleteConfirm = false;
    },
    sendInvite() {
      this.newContactSearch = "";
      this.showInviteSent = true;
    },
    startEditUserField(field) {
      this.editingUserField = field;
      this.editingUserInput = field === 'avatar' ? this.user.avatar : this.user[field];
    },
    saveUserField() {
      const trimmed = this.editingUserInput.trim();
      if (trimmed && this.editingUserField) {
        this.user[this.editingUserField] = trimmed;
      }
      this.editingUserField = null;
      this.editingUserInput = "";
    },
    clampMenuPosition(x, y) {
      const menuWidth = 220;
      const menuHeight = 400;
      const padding = 8;
      const clampedX = Math.min(x, window.innerWidth - menuWidth - padding);
      const clampedY = Math.min(y, window.innerHeight - menuHeight - padding);
      return {
        x: Math.max(padding, clampedX),
        y: Math.max(padding, clampedY),
      };
    },
    startEditingChatName() {
      const chat = this.selectedChat || this.contactInfoData;
      if (!chat) return;
      this.chatNameInput = chat.name;
      this.editingChatName = true;
      this.$nextTick(() => this.$refs.chatNameInput?.focus());
    },
    saveChatName() {
      const chat = this.selectedChat || this.contactInfoData;
      if (!chat) return;
      const trimmed = this.chatNameInput.trim();
      if (trimmed) chat.name = trimmed;
      this.editingChatName = false;
      this.chatNameInput = "";
    },
    toggleGroupMember(chat) {
      const i = this.selectedGroupMembers.indexOf(chat);
      if (i === -1) this.selectedGroupMembers.push(chat);
      else this.selectedGroupMembers.splice(i, 1);
    },
    createGroup() {
      if (this.selectedGroupMembers.length < 2) return;
      const name = this.selectedGroupMembers.map((c) => c.name).join(", ");
      const newGroup = {
        id: Date.now(),
        name,
        avatar: this.selectedGroupMembers[0].avatar,
        lastMessage: "",
        phone: "",
        pinned: false,
        pinnedAt: null,
        muted: false,
        hidden: false,
        blocked: false,
        messages: [],
        members: this.selectedGroupMembers.map((c) => ({
          name: c.name,
          avatar: c.avatar,
          username: c.username,
          lastSeen: "Recently",
        })),
      };
      this.chats.push(newGroup);
      this.showNewChatMenu = false;
      this.showNewGroupView = false;
      this.groupSearch = "";
      this.selectedGroupMembers = [];
      this.selectedChat = newGroup;
      this.viewingOwnProfile = false;
      this.viewingContactInfo = false;
      this.viewingSettings = false;
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      if (!files.length || !this.selectedChat) return;

      for (const file of files) {
        if (this.pendingMedia.length >= 10) {
          this.showMediaLimitToast = true;
          setTimeout(() => {
            this.showMediaLimitToast = false;
          }, 3000);
          break;
        }
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith("video") ? "video" : "image";
        this.pendingMedia.push({ type, url });
      }

      event.target.value = "";
      this.$nextTick(() => this.$refs.messageInput?.focus());
    },
    scrollToPinned() {
      if (!this.pinnedMessage || !this.selectedChat) return;
      const index = this.selectedChat.messages.indexOf(this.pinnedMessage);
      if (index === -1) return;
      this.$nextTick(() => {
        const el = this.$refs.messagesBox?.children[index];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    },
    isCurrentMatch(index) {
      return this.searchResults[this.currentSearchIndex]?.index === index;
    },
    isMessageMatched(index) {
      return this.searchResults.some((r) => r.index === index);
    },
    toggleChatSearch() {
      this.searchActive = !this.searchActive;

      if (!this.searchActive) {
        this.closeSearch();
      }
    },
    closeSearch() {
      this.searchActive = false;
      this.chatSearchQuery = "";
      this.searchResults = [];
      this.currentSearchIndex = 0;
    },

    searchMessages() {
      if (!this.selectedChat) return;

      const query = this.chatSearchQuery.toLowerCase();

      this.searchResults = this.selectedChat.messages
        .map((msg, index) => ({ ...msg, index }))
        .filter((msg) => msg.text.toLowerCase().includes(query));

      this.currentSearchIndex = 0;

      this.scrollToMatch();
    },

    nextResult() {
      if (!this.searchResults.length) return;

      this.currentSearchIndex =
        (this.currentSearchIndex + 1) % this.searchResults.length;

      this.scrollToMatch();
    },

    prevResult() {
      if (!this.searchResults.length) return;

      this.currentSearchIndex =
        (this.currentSearchIndex - 1 + this.searchResults.length) %
        this.searchResults.length;

      this.scrollToMatch();
    },
    scrollToMatch() {
      this.$nextTick(() => {
        const index = this.searchResults[this.currentSearchIndex]?.index;

        if (index == null) return;

        const messages = this.$refs.messagesBox.children;

        const el = messages[index];
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    },
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
      this.viewingOwnProfile = false;
      this.viewingSettings = false;
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
      const contactInfoItem = this.headerMenuItems.find((i) =>
        i.action.toString().includes("contactInfo"),
      );
      if (contactInfoItem) {
        contactInfoItem.label = chat.members?.length ? "👥 Group info" : "👤 Contact Info";
      }

      const previousChat = this.selectedChatForMenu;
      this.selectedChatForMenu = chat;

      const pinItem = this.headerMenuItems.find((i) => i.action.toString().includes("pinChat"));
      const muteItem = this.headerMenuItems.find((i) => i.action.toString().includes("muteChat"));
      const blockItem = this.headerMenuItems.find((i) => i.action.toString().includes("blockUser"));
      if (blockItem) blockItem.label = chat.blocked ? "🔓 Unblock" : "⛔ Block";
      if (muteItem) muteItem.label = chat.muted ? "🔔 Unmute Notifications" : "🔕 Mute Notifications";
      if (pinItem) pinItem.label = chat.pinned ? "📍 Unpin Conversation" : "📌 Pin Conversation";

      if (this.headerMenu.visible && previousChat === chat) {
        this.closeHeaderMenu();
        return;
      }

      this.headerMenu.visible = true;
      this.headerMenu.x = 0;
      this.headerMenu.y = 0;
      this.$nextTick(() => {
        const pos = this.clampMenuPosition(event.clientX + 32, event.clientY + 8);
        this.headerMenu.x = pos.x;
        this.headerMenu.y = pos.y;
      });
    },
    toggleHeaderMenu(event) {
      this.selectedChatForMenu = this.selectedChat;
      event.stopPropagation();
      const contactInfoItem = this.headerMenuItems.find((i) =>
        i.action.toString().includes("contactInfo"),
      );
      if (contactInfoItem) {
        contactInfoItem.label = this.selectedChatForMenu?.members?.length
          ? "👥 Group info"
          : "👤 Contact Info";
      }
      if (this.headerMenu.visible) {
        this.closeHeaderMenu();
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      const pinItem = this.headerMenuItems.find((i) => i.action.toString().includes("pinChat"));
      const blockItem = this.headerMenuItems.find((i) => i.action.toString().includes("blockUser"));
      const muteItem = this.headerMenuItems.find((i) => i.action.toString().includes("muteChat"));
      if (this.selectedChatForMenu) {
        if (pinItem) pinItem.label = this.selectedChatForMenu.pinned ? "📍 Unpin Conversation" : "📌 Pin Conversation";
        if (blockItem) blockItem.label = this.selectedChatForMenu.blocked ? "🔓 Unblock" : "⛔ Block";
        if (muteItem) muteItem.label = this.selectedChatForMenu.muted ? "🔔 Unmute Notifications" : "🔕 Mute Notifications";
      }
      this._skipNextOutsideClick = true;
      this.headerMenu.visible = true;
      this.headerMenu.x = 0;
      this.headerMenu.y = 0;
      this.$nextTick(() => {
        const pos = this.clampMenuPosition(rect.right - 220, rect.bottom + 5);
        this.headerMenu.x = pos.x;
        this.headerMenu.y = pos.y;
      });
    },
    closeHeaderMenu() {
      this.headerMenu.visible = false;
    },
    contactInfo(chat) {
      if (!chat) return;
      this.activeChat = chat;
      this.contactInfoData = chat;
      this.viewingContactInfo = true;
      this.viewingOwnProfile = false;
      this.viewingSettings = false;
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
      this.viewingOwnProfile = false;
      this.viewingSettings = false;
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

      if (this.searchActive && this.searchResults.length) {
        if (event.key === "Enter") {
          event.preventDefault();
          this.nextResult();
        }
      }
    },
    handleClickOutside(event) {
      const messageMenu = this.$el.querySelector(".message-menu");
      const headerMenu = this.$el.querySelector(".header-menu");
      const isHeaderButton = event.target.closest(".header-icon");
      const isContactMenuBtn = event.target.closest(".contact-menu-btn");
      const isContactItem = event.target.closest(".contact-item");

      if (messageMenu && !messageMenu.contains(event.target)) {
        this.closeMessageMenu();
      }
      if (
        headerMenu &&
        !headerMenu.contains(event.target) &&
        !isHeaderButton &&
        !isContactMenuBtn &&
        !isContactItem
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
      if (!this.selectedChat || this.selectedChat.blocked) return;
      if (!this.newMessage.trim() && !this.pendingMedia.length) return;

      this.selectedChat.messages.push({
        sender: "me",
        text: this.newMessage,
        media: this.pendingMedia.length ? [...this.pendingMedia] : null,
        replyTo: this.replyingTo || null,
      });

      this.selectedChat.lastMessage = this.pendingMedia.length
        ? this.pendingMedia.some((m) => m.type === "video")
          ? "🎥 Video"
          : "🖼️ Image"
        : this.newMessage;

      this.newMessage = "";
      this.replyingTo = null;
      this.pendingMedia = [];
      this.$nextTick(this.scrollToBottom);
    },
    scrollToBottom() {
      const box = this.$refs.messagesBox;
      if (box) box.scrollTop = box.scrollHeight;
    },
    createConversation() {
      this.showNewChatMenu = !this.showNewChatMenu;
      this.showNewContactView = false;
      this.showNewGroupView = false;
      this.newContactSearch = "";
      this.groupSearch = "";
      this.selectedGroupMembers = [];
      this.selectedChat = null;
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
      const msg =
        this.hoveredMessage !== null
          ? this.selectedChat?.messages[this.hoveredMessage]
          : this.messageMenu.message;
      if (!msg) return;
      const senderName =
        msg.sender === "me" ? this.user.name : this.selectedChat?.name;

      let previewText = msg.text;
      if (!previewText && msg.media?.length) {
        const hasVideo = msg.media.some((m) => m.type === "video");
        const hasImage = msg.media.some((m) => m.type === "image");
        if (hasVideo && hasImage) previewText = "🖼️ Image & 🎬 Video";
        else if (hasVideo) previewText = "🎬 Video";
        else previewText = "🖼️ Image";
      }

      this.replyingTo = { sender: senderName, text: previewText };
      this.closeMessageMenu();
      this.$nextTick(() => this.$refs.messageInput?.focus());
    },
    reactMessage(event, msg) {
      const target = msg || this.messageMenu.message;
      if (!target) return;
      this.pendingReactMessage = target;
      this.closeMessageMenu();
      this.$nextTick(() => {
        const x = event?.clientX || window.innerWidth / 2;
        const y = event?.clientY || window.innerHeight / 2;
        this.emojiPicker.x = Math.min(x - 30, window.innerWidth - 320);
        this.emojiPicker.y = Math.min(y + 10, window.innerHeight - 80);
        this.emojiPicker.visible = true;
      });
    },
    pickEmoji(emoji) {
      const msg = this.pendingReactMessage;
      if (!msg) return;
      msg.reactions = (msg.reactions || []).filter((r) => r.sender !== "me");
      msg.reactions.push({ emoji, sender: "me", avatar: this.user.avatar });
      this.pendingReactMessage = null;
      this.emojiPicker.visible = false;
    },
    removeReaction(msg, reaction) {
      if (reaction.sender !== "me") return;
      msg.reactions = msg.reactions.filter((r) => r !== reaction);
    },
    pinMessage() {
      if (!this.messageMenu.message) return;
      if (this.pinnedMessage === this.messageMenu.message) {
        this.pinnedMessage = null;
      } else {
        this.pinnedMessage = this.messageMenu.message;
      }
      this.closeMessageMenu();
    },
    deleteMessage() {
      if (!this.messageMenu.message || !this.selectedChat) return;
      if (this.messageMenu.message.sender !== "me") return;
      const index = this.selectedChat.messages.indexOf(
        this.messageMenu.message,
      );
      if (index !== -1) {
        this.selectedChat.messages.splice(index, 1);
        // Update lastMessage preview in sidebar
        const msgs = this.selectedChat.messages;
        this.selectedChat.lastMessage = msgs.length
          ? msgs[msgs.length - 1].text
          : "";
      }
      this.closeMessageMenu();
    },
    goToProfile() {
      this.viewingOwnProfile = true;
      this.viewingSettings = false;
      this.selectedChat = null;
      this.viewingContactInfo = false;
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
  transition: background-color 0.7s ease, color 0.7s ease,
    border-color 0.7s ease;
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
  min-width: 0;
}

.messages {
  overflow-y: auto;
}

.message {
  display: block;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
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
  background: rgba(255, 0, 0);
}

.dark .chat-search-bar button:hover {
  background: rgba(255, 0, 0, 0.3);
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

.highlighted {
  outline: 3px solid rgb(247, 0, 255);
}

.chat-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.search-left {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.search-input-inner {
  flex: 1;
  max-width: 200px;
}

.chat-search-bar button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 6px;
  border-radius: 4px;
}

.chat-search-bar button:hover {
  background: rgb(255, 0, 0);
}

.chat-search-bar button {
  position: relative;
}

.chat-search-bar button::after {
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

.chat-search-bar button:hover::after {
  opacity: 1;
}

@keyframes pulseHighlight {
  0% {
    outline-color: rgb(0, 200, 255);
  }

  50% {
    outline-color: rgb(255, 0, 255);
  }

  100% {
    outline-color: rgb(0, 200, 255);
  }
}

.active-highlight {
  outline: 3px solid rgb(255, 0, 217);
  animation: pulseHighlight 1s infinite ease-in-out;
  box-shadow: 0 0 8px rgb(255, 0, 191);
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition: transform 0.15s ease, background 0.2s ease;
}

.icon-btn:hover {
  transform: scale(1.15);
}

.light .icon-btn {
  color: black;
}

.dark .icon-btn {
  color: white;
}

.pinned-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-bottom: 1px solid rgba(255, 0, 0, 0.3);
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
  overflow: hidden;
  min-width: 0;
  max-height: 36px;
  width: 100%;
  box-sizing: border-box;
}

.light .pinned-bar {
  background: rgba(255, 0, 0, 0.07);
  color: black;
}

.dark .pinned-bar {
  background: rgba(255, 0, 0, 0.12);
  color: white;
}

.pinned-bar:hover {
  background: rgba(255, 0, 0, 0.18);
}

.pinned-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.unpin-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.light .unpin-btn {
  color: black;
}

.dark .unpin-btn {
  color: white;
}

.unpin-btn:hover {
  opacity: 1;
}

.message-bubble-wrap {
  display: inline-block;
  vertical-align: top;
  position: relative;
  max-width: 60ch;
  min-width: 0;
}

.message-bubble-wrap.has-reaction .message {
  margin-bottom: 20px;
}

.reaction-row {
  position: absolute;
  bottom: 4px;
  display: flex;
  flex-wrap: nowrap;
  gap: 3px;
  z-index: 1;
}

.reaction-row-me {
  right: 0;
}

.reaction-row-other {
  left: 0;
}

.reaction-chip {
  display: flex;
  align-items: center;
  gap: 2px;
  border-radius: 20px;
  padding: 2px 5px;
  font-size: 13px;
  cursor: default;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.light .reaction-chip {
  background: #fff;
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: black;
}

.dark .reaction-chip {
  background: #2a2a2a;
  border: 1px solid rgba(255, 0, 0, 0.4);
  color: white;
}

.reaction-chip-mine {
  cursor: pointer;
}

.light .reaction-chip-mine:hover {
  background: rgba(255, 0, 0, 0.1);
}

.dark .reaction-chip-mine:hover {
  background: rgba(255, 0, 0, 0.25);
}

.reaction-avatar {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 0, 0, 0.4);
  flex-shrink: 0;
}

.reaction-chip-mine {
  cursor: pointer;
}

.reaction-chip-mine:hover {
  background: rgba(255, 0, 0, 0.25);
}

.input-area {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.input-row {
  display: flex;
  align-items: flex-end;
}

.reply-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 14px 6px;
  border-bottom: 1px solid rgba(255, 0, 0, 0.2);
}

.light .reply-preview {
  background: rgba(255, 0, 0, 0.06);
}

.dark .reply-preview {
  background: rgba(255, 0, 0, 0.1);
}

.reply-preview-inner {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.reply-preview-label {
  font-size: 12px;
  color: #ff0000;
  font-weight: 600;
  margin-bottom: 2px;
}

.reply-preview-text {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.75;
}

.reply-cancel-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  flex-shrink: 0;
  opacity: 0.6;
  padding: 2px 6px;
  transition: opacity 0.15s ease;
}

.reply-cancel-btn:hover {
  opacity: 1;
}

.light .reply-cancel-btn {
  color: black;
}

.dark .reply-cancel-btn {
  color: white;
}

.reply-quote {
  display: block;
  font-size: 12px;
  border-radius: 6px;
  padding: 5px 8px;
  margin-bottom: 4px;
  border-left: 3px solid #ff0000;
  box-sizing: border-box;
  min-width: 0;
  text-align: left;
}

.light .reply-quote {
  background: rgba(0, 0, 0, 0.06);
  color: black;
}

.dark .reply-quote {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.reply-quote-name {
  font-weight: 700;
  color: #ff0000;
  font-size: 11px;
  margin-bottom: 2px;
}

.reply-quote-text {
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  opacity: 0.8;
  max-width: 100%;
  word-break: break-word;
}
.input-row textarea {
  max-height: 120px;
  overflow-y: auto;
  resize: none;
}
.contact-item .flex-grow-1 {
  min-width: 0;
  overflow: hidden;
}
.attach-btn {
  background: #ff0000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  flex-shrink: 0;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.15s ease;
  position: relative;
  padding: 0;
}

.attach-btn:hover {
  background: #cc0000;
  transform: scale(1.1);
}

.attach-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  top: -130%;
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

.attach-btn:hover::after {
  opacity: 1;
}

.msg-media {
  max-width: 220px;
  max-height: 180px;
  border-radius: 10px;
  display: block;
  cursor: pointer;
  object-fit: cover;
}

.msg-media-wrap {
  margin-bottom: 4px;
}
.media-preview-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid rgba(255, 0, 0, 0.2);
  gap: 10px;
}

.light .media-preview-bar {
  background: rgba(255, 0, 0, 0.05);
}

.dark .media-preview-bar {
  background: rgba(255, 0, 0, 0.1);
}

.media-preview-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.media-preview-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ff0000;
  flex-shrink: 0;
}

.light .media-preview-cancel {
  color: black;
}

.dark .media-preview-cancel {
  color: white;
}

.media-preview-cancel:hover {
  opacity: 1;
}
.media-preview-item {
  position: relative;
  display: inline-block;
}

.media-preview-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff0000;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  transition: background 0.2s ease, transform 0.15s ease;
  z-index: 1;
}

.media-preview-remove:hover {
  background: #cc0000;
  transform: scale(1.15);
}
.media-preview-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.media-limit-toast {
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
  animation: fadeInOut 3s ease forwards;
}
.media-clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  flex-shrink: 0;
  opacity: 0.6;
  padding: 2px 6px;
  transition: opacity 0.15s ease, transform 0.15s ease;
  position: relative;
}

.light .media-clear-btn {
  color: black;
}

.dark .media-clear-btn {
  color: white;
}

.media-clear-btn:hover {
  opacity: 1;
  transform: scale(1.15);
}

.media-clear-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  top: -130%;
  right: 0;
  left: auto;
  transform: none;
  background: black;
  color: white;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 99999;
}

.media-clear-btn:hover::after {
  opacity: 1;
}
.new-chat-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 0, 0, 0.2);
}

.new-chat-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  width: 100%;
  transition: background 0.2s ease;
}

.light .new-chat-option {
  color: black;
}

.dark .new-chat-option {
  color: white;
}

.light .new-chat-option:hover {
  background: rgba(255, 0, 0, 0.08);
}

.dark .new-chat-option:hover {
  background: rgba(255, 0, 0, 0.15);
}

.icon-white {
  color: white;
  font-size: 18px;
}

.icon-black {
  color: black;
  font-size: 18px;
}
.new-chat-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ff0000;
  box-shadow: 0 0 6px rgba(255, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.light .new-chat-icon-wrap {
  background: rgba(255, 0, 0, 0.08);
  color: black;
}

.dark .new-chat-icon-wrap {
  background: rgba(255, 0, 0, 0.15);
  color: white;
}
.new-contact-view {
  display: flex;
  flex-direction: column;
}

.send-invite-btn {
  width: 40%;
  align-self: center;
  padding: 5px 16px;
  font-size: 14px;
  font-weight: bold;
  margin-top: 8px;
}
.light .theme-action-btn:hover {
  background-color: #8d0000;
  color: white;
}

.dark .theme-action-btn:hover {
  background-color: #ff0000;
  color: white;
}
.action-btn-hover {
  transition: background-color 0.2s ease !important;
}
.group-select-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ff0000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.group-select-circle.selected {
  background: #ff0000;
  color: white;
}

.group-member-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  max-height: 300px;
}

.send-invite-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.chat-name-wrapper {
  cursor: default;
}

.chat-name-edit-icon {
  opacity: 0.7;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.chat-name-edit-icon:hover {
  opacity: 1;
  transform: scale(1.15);
}

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
.chat-name-icon-slot {
  display: inline-flex;
  align-items: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
}
.group-members-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(255, 0, 0, 0.2);
  border-radius: 10px;
  padding: 8px;
  text-align: left;
}

.group-member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.light .group-member-item:hover {
  background: rgba(255, 0, 0, 0.06);
}

.dark .group-member-item:hover {
  background: rgba(255, 0, 0, 0.12);
}

.group-member-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.header-menu.measuring {
  opacity: 0;
  pointer-events: none;
}
.username-tag {
  color: #ff0000;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.profile-avatar-wrap {
  position: relative;
  display: inline-block;
}

.profile-edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff0000;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.15s ease;
}

.profile-edit-icon:hover {
  background: #cc0000;
  transform: scale(1.1);
}
.creation-date {
  color: gray;
  font-size: 0.9rem;
}
.invite-sent-text {
  color: #ff0000;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 8px;
}
.profile-fields {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.settings-view {
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}
.settings-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ff0000;
}
.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 0, 0, 0.15);
  gap: 12px;
}
.settings-row-column {
  flex-direction: column;
  align-items: flex-start;
}

.settings-label {
  font-size: 15px;
  font-weight: 500;
}

.settings-toggle-group {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.settings-toggle-btn {
  padding: 5px 14px;
  border-radius: 20px;
  border: 2px solid #ff0000;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.light .settings-toggle-btn {
  color: black;
}

.dark .settings-toggle-btn {
  color: white;
}

.settings-toggle-btn.active {
  background: #ff0000;
  color: white;
}

.settings-expand-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #ff0000;
  padding: 2px 6px;
}

.blocked-list {
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.blocked-empty {
  font-size: 14px;
  opacity: 0.6;
  padding: 4px 0;
}

.blocked-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 8px;
}

.light .blocked-item {
  background: rgba(255, 0, 0, 0.05);
}

.dark .blocked-item {
  background: rgba(255, 0, 0, 0.1);
}

.blocked-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.unblock-btn {
  background: none;
  border: 2px solid #ff0000;
  color: #ff0000;
  border-radius: 16px;
  padding: 3px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.unblock-btn:hover {
  background: #ff0000;
  color: white;
}

.delete-account-btn {
  background: none;
  border: none;
  color: #ff0000;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.delete-account-btn:hover {
  opacity: 0.7;
}

.delete-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.delete-confirm-box {
  background: white;
  border-radius: 12px;
  padding: 28px 32px;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dark .delete-confirm-box {
  background: #1e1e1e;
  color: white;
}

.delete-confirm-text {
  font-size: 15px;
  line-height: 1.5;
}

.delete-confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.delete-confirm-yes {
  background: #ff0000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-confirm-yes:hover {
  background: #cc0000;
}

.delete-confirm-no {
  background: none;
  border: 2px solid #ff0000;
  color: #ff0000;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.delete-confirm-no:hover {
  background: #ff0000;
  color: white;
}
</style>
