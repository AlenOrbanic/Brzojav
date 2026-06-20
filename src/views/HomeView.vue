<template>
  <div :class="['app-layout', theme]">
    <video class="bg-video" autoplay muted loop playsinline>
      <source src="../assets/framebg.mp4" type="video/mp4" />
    </video>
    <div style="display:none" aria-hidden="true">
      <input type="text" name="username" tabindex="-1" />
      <input type="password" name="password" tabindex="-1" />
    </div>
    <!-- Topbar -->

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
          @click="openSettings"
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
        autocomplete="off"
        readonly
        @focus="($event.target.removeAttribute('readonly'))"
      />
    </div>
    <div class="app-body">
      <div class="sidebar border-end">

        <!--Sidebar profile-->

        <div class="profile-section border-bottom mb-2">
          <div class="d-flex align-items-center justify-content-between w-100">
            <div
              class="d-flex align-items-center flex-grow-1"
              @click="goToProfile"
            >
              <AvatarImg :src="user.avatar" :size="40" :margin="3" />
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

        <!--Sidebar chats-->

        <div class="contacts">
          <template v-if="showNewChatMenu">
            <template v-if="showNewContactView">
              <div class="new-contact-view px-2 pt-2">
                <input
                  v-model="newContactSearch"
                  type="text"
                  class="form-control"
                  placeholder="Search @username"
                  @focus="showInviteSent = false; inviteError = ''"
                />
                <div v-if="inviteError" class="invite-error-text">{{ inviteError }}</div>
                <div v-if="showInviteSent" class="invite-sent-text">User added to chats!</div>
                <button
                  class="btn theme-action-btn send-invite-btn action-btn-hover"
                  @click="sendInvite"
                >
                  Add to chat
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
                    <AvatarImg :src="chat.avatar" :size="40" :margin="2" />
                    <div class="flex-grow-1">
                      <div class="fw-semibold">{{ chat.originalName || chat.name }}</div>
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
            <div v-if="loadingChats" class="chats-loading" data-testid="chats-loading">
              <span class="chats-loading-text">Loading chats</span>
              <span class="chats-loading-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </span>
            </div>
            <div
              v-else
              v-for="chat in filteredChats"
              :key="chat.id"
              class="contact-item d-flex justify-content-between align-items-center"
              :class="{ active: selectedChat?.id === chat.id, 'chat-deleted': chat.deleted }"
              @click="selectChat(chat)"
              @contextmenu.prevent="openChatMenu($event, chat)"
            >
              <div class="d-flex align-items-center flex-grow-1">
                <AvatarImg :src="chat.avatar" :size="40" :margin="2" />
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
                    <span
                      v-if="!chat.isGroup && isUserBlocked(chat.username)"
                        class="blocked-tag"
                      >(Blocked)
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

        <!-- Settings -->

        <div v-if="viewingSettings" class="contact-info-wrapper">
          <button class="back-btn" @click="closeSettings">← Back</button>
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
              <div class="d-flex align-items-center justify-content-between w-100 settings-row-header">
                <span class="settings-label">Blocked accounts</span>
                <span class="settings-show-link" @click="showBlockedAccounts = !showBlockedAccounts">
                  {{ showBlockedAccounts ? 'Hide List' : 'Show List' }}
                </span>
              </div>
              <div class="blocked-list-wrapper" :class="{ open: showBlockedAccounts }">
              <div class="blocked-list">
                <div v-if="chats.filter(c => c.blocked).length === 0" class="blocked-empty">
                  No blocked accounts
                </div>
                <div
                  v-for="chat in chats.filter(c => c.blocked)"
                  :key="chat.id"
                  class="blocked-item"
                >
                  <AvatarImg :src="chat.avatar" :size="36" />
                  <div class="blocked-info">
                    <div class="fw-semibold">{{ chat.name }}</div>
                    <small class="username-tag">{{ chat.username }}</small>
                  </div>
                  <button class="unblock-btn" @click="unblockChat(chat)">Unblock</button>
                </div>
              </div>
              </div>
            </div>
            <div class="settings-row settings-row-column">
              <div class="d-flex align-items-center justify-content-between w-100 settings-row-header">
                <span class="settings-label">Change password</span>
                <button v-if="!showChangePassword" class="settings-change-btn" @click="showChangePassword = true">
                  Change
                </button>
              </div>
              <div class="change-password-wrapper" :class="{ open: showChangePassword }">
              <div class="change-password-row">
              <input
                v-model="oldPassword"
                type="password"
                class="form-control password-input"
                placeholder="Old password"
                autocomplete="current-password"
              />
              <input
                v-model="newPassword"
                type="password"
                class="form-control password-input"
                placeholder="New password"
                autocomplete="new-password"
              />
                <button class="settings-toggle-btn active" @click="changePassword">
                  Change
                </button>
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
                  <button class="delete-confirm-yes" @click="confirmDeleteAccount">Yes</button>
                  <button class="delete-confirm-no" @click="showDeleteConfirm = false">No</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile -->

        <div v-else-if="viewingOwnProfile" class="contact-info-wrapper">
          <button class="back-btn" @click="viewingOwnProfile = false">← Back</button>
          <div class="contact-info-view d-flex flex-column align-items-center p-5">
          <div class="profile-avatar-wrap mb-3">
            <AvatarImg :src="user.avatar" :size="80" :glow="true" />
            <button class="profile-edit-icon" @click="$refs.avatarInput.click()" data-tooltip="Edit photo">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
              </svg>
            </button>
            <input type="file" ref="avatarInput" accept="image/*" style="display:none" @change="handleAvatarUpload" />
          </div>
          <EditableField
            :value="user.name"
            placeholder="Your name..."
            tooltip="Edit name"
            prefix="Name"
            label-class="fw-bold fs-6"
            @save="v => updateProfile('name', v)"
          />
          <EditableField
            :value="user.username"
            placeholder="@username..."
            tooltip="Edit username"
            prefix="Username"
            label-class="username-tag fs-6"
            @save="v => updateProfile('username', v)"
          />
          <EditableField
            :value="user.phone"
            placeholder="Phone number..."
            tooltip="Edit phone"
            prefix="Phone"
            label-class="contact-meta fs-6"
            @save="v => updateProfile('phone', v)"
          />
          <EditableField
            :value="user.email"
            placeholder="Email..."
            tooltip="Edit email"
            prefix="Email"
            label-class="contact-meta fs-6"
            @save="v => updateProfile('email', v)"
          />
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="creation-date">Account creation date: {{ new Date(user.createdAt).toLocaleDateString('hr-HR').replaceAll(' ', '') }}</span>
            </div>

          </div>
        </div>

        <!--Contact info-->

        <div v-else-if="viewingContactInfo" class="contact-info-wrapper">
          <button class="back-btn" @click="closeContactInfo">← Back</button>
          <div
            class="contact-info-view d-flex flex-column align-items-center justify-content-center p-5"
          >
            <div class="profile-avatar-wrap mb-3">
              <AvatarImg :src="contactInfoData.avatar" :size="80" :glow="true" />
              <template v-if="contactInfoData?.isGroup">
                <button class="profile-edit-icon" @click="$refs.groupAvatarInput.click()" data-tooltip="Edit group photo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                  </svg>
                </button>
                <input type="file" ref="groupAvatarInput" accept="image/*" style="display:none" @change="handleGroupAvatarUpload" />
              </template>
            </div>
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
                  :data-tooltip="contactInfoData?.members?.length ? 'Change group name' : 'Change nickname'"
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

            <template v-if="contactInfoData?.isGroup">
              <div class="contact-meta fs-6 mb-2">
                {{ contactInfoData.members.length }} Members
              </div>
              <div class="group-members-list w-100 mb-3">
              <div
                v-for="(member, i) in contactInfoData.members"
                :key="i"
                class="group-member-item"
                :class="{ 'member-deleted': member.deleted }"
                @click.stop="!member.deleted && openMemberMenu($event, member)"
                @contextmenu.prevent.stop="!member.deleted && openMemberMenu($event, member)"
              >
                <AvatarImg :src="member.avatar" :size="36" />
                <div class="group-member-info">
                  <div class="fw-semibold d-flex align-items-center gap-2">
                    <template v-if="editingMember === i">
                      <input
                        v-model="editingMemberInput"
                        class="chat-name-input"
                        placeholder="Nickname..."
                        @keydown.enter="saveMemberName(i)"
                        @blur="saveMemberName(i)"
                        autofocus
                      />
                    </template>
                    <template v-else>
                      {{ member.name }}
                      <span v-if="member.isMe" style="font-size:10px;background:#ff0000;color:white;border-radius:8px;padding:1px 6px;font-weight:600;margin-left:2px;">You</span>
                      <span v-if="member.isOwner" class="owner-tag">Group owner</span>
                       <span v-if="!member.isMe && isUserBlocked(member.username)" class="blocked-tag">(Blocked)</span>
                      <svg
                        @click="startEditMember(i, member.name)"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        class="bi bi-pencil-square chat-name-edit-icon"
                        viewBox="0 0 16 16"
                        style="cursor:pointer;flex-shrink:0"
                        data-tooltip="Change nickname"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                      </svg>
                      <button
                        v-if="!member.isMe && contactInfoData.ownerId === user.username"
                        class="kick-btn"
                        @click="kickMember(contactInfoData, i)"
                      >
                        Kick
                      </button>
                    </template>
                  </div>
                  <small class="contact-meta">{{ member.username ? '@' + member.username.replace(/^@/, '') : '' }} · Last seen: {{ member.lastSeen ? formatTime(member.lastSeen) : 'Hidden' }}</small>
                </div>
              </div>
              </div>
            </template>
            <template v-else>
              <div class="contact-meta fs-6 mb-1 username-tag">
                {{ contactInfoData.username ? '@' + contactInfoData.username.replace(/^@/, '') : '' }}
            <template v-if="!contactInfoData.deleted">
              <div class="contact-meta fs-6 mb-1">
                Last seen: {{ contactInfoData.lastSeen ? formatTimestamp(contactInfoData.lastSeen) : 'Hidden' }}
              </div>
              <div v-if="isContactBlocked" class="blocked-status-row mb-1">
                <span class="blocked-status-text">This user is blocked</span>
                <button class="unblock-btn" @click="unblockContact">Unblock</button>
              </div>
              <div class="contact-meta fs-6 mb-1">
                {{ contactInfoData.phone }}
              </div>
            </template>

            <div v-else class="deleted-user-notice">
              This account has been deleted.
            </div>
              </div>
            </template>
            <div class="group-action-btns">
              <button
                v-if="contactInfoData?.isGroup"
                class="leave-group-btn"
                @click="leaveGroup(contactInfoData)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-box-arrow-left"
                  viewBox="0 0 16 16"
                  style="margin-right: 6px; vertical-align: middle;"
                >
                  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                </svg>
                Leave Group
              </button>
                <button
                  v-if="contactInfoData?.isGroup && contactInfoData.ownerId === user.username"
                  class="leave-group-btn"
                  @click="deleteGroup(contactInfoData)"
                >
                Delete Group
              </button>
            </div>
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

        <!-- Chat -->

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
              <AvatarImg :src="selectedChat.avatar" :size="40" :margin="2" />
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
                    v-if="selectedChat?.isGroup"
                    style="font-size: 13px; font-weight: 400; color: gray; margin-left: 4px;"
                  >
                    · {{ selectedChat.members.length }} Members
                  </span>
                  <span
                    v-if="!selectedChat.isGroup && isUserBlocked(selectedChat.username)"
                      class="blocked-tag"
                    >(Blocked)
                  </span>
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
                    :data-tooltip="selectedChat?.members?.length ? 'Change group name' : 'Change nickname'"
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
          <div
            ref="messagesBox"
            class="messages flex-grow-1 p-3"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
          <div
            v-for="(msg, index) in visibleMessages"
            :key="index"
            class="mb-2"
            :class="msg.sender === 'system' ? 'text-center w-100' : (msg.sender === 'me' ? 'text-end' : 'text-start')"
          >
              <span
                v-if="msg.sender === 'system'"
                class="system-message"
              >
              {{ msg.text }}
              </span>
              <div
                v-if="msg.sender !== 'system'"
                class="message-wrapper w-100 d-flex align-items-end"
                :class="
                  msg.sender === 'me'
                    ? 'justify-content-end'
                    : 'justify-content-start'
                "
                @mouseenter="hoveredMessage = index"
                @mouseleave="hoveredMessage = null"
              >
              <AvatarImg
                v-if="msg.sender !== 'me'"
                :src="senderAvatar(msg)"
                :size="28"
                :margin="2"
                style="flex-shrink: 0; margin-bottom: 2px;"
                :data-tooltip="senderName(msg) + (msg.time ? ' · ' + formatTimestamp(msg.time) : '')"
                class="msg-avatar"
              />
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
                    v-if="msg.files && msg.files.length"
                    class="msg-media-wrap"
                  >
                    <div
                      v-for="(m, i) in msg.media"
                      :key="i"
                      style="display: inline-block"
                    >
                    <img
                      v-if="m.fileType === 'image'"
                      :src="m.url"
                      class="msg-media"
                      @click="openLightbox({
                        type:    m.fileType,
                        url:     m.url,
                        name:    m.name,
                        msgRef:  msg,
                        sender:  msg.sender === 'me' ? user.name : selectedChat?.name,
                        isMine:  msg.sender === 'me',
                        time:    msg.time,
                      })"
                    />
                    <video
                      v-else-if="m.fileType === 'video'"
                      :src="m.url"
                      class="msg-media"
                      controls
                      @click="openLightbox({
                        type:    m.fileType,
                        url:     m.url,
                        name:    m.name,
                        msgRef:  msg,
                        sender:  msg.sender === 'me' ? user.name : selectedChat?.name,
                        isMine:  msg.sender === 'me',
                        time:    msg.time,
                      })"
                    />
                      <div v-else class="msg-file">
                        <span class="msg-file-icon">📄</span>
                        <div class="msg-file-info">
                          <span class="msg-file-name">{{ m.name }}</span>
                          <button
                            class="msg-file-download"
                            @click="downloadFile(m.url, m.name)"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="msg.text"
                    class="d-inline-block p-2 rounded message"
                    :class="[
                      msg.sender === 'me' ? 'sent' : 'received',
                      isMessageMatched(index) ? 'highlighted' : '',
                      isCurrentMatch(index) ? 'active-highlight' : '',
                    ]"
                    @vue:mounted="loadLinkPreview(msg)"
                  >
                    <span v-html="renderMessageText(msg.text)"></span>

                    <!-- Link preview card (now INSIDE the bubble) -->
                    <a
                      v-if="extractUrl(msg.text) && linkPreviews[extractUrl(msg.text)]"
                      :href="extractUrl(msg.text)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="link-preview"
                      :class="msg.sender === 'me' ? 'link-preview-me' : 'link-preview-other'"
                    >
                      <img
                        v-if="linkPreviews[extractUrl(msg.text)].image"
                        :src="linkPreviews[extractUrl(msg.text)].image"
                        class="link-preview-image"
                      />
                      <div class="link-preview-body">
                        <div class="link-preview-title">{{ linkPreviews[extractUrl(msg.text)].title }}</div>
                        <div class="link-preview-desc">{{ linkPreviews[extractUrl(msg.text)].description }}</div>
                        <div class="link-preview-url">{{ extractUrl(msg.text) }}</div>
                      </div>
                    </a>
                  </div>
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
                    v-if="hoveredMessage === index && msg.time"
                    class="msg-timestamp msg-timestamp-delay"
                    :class="msg.sender === 'me' ? 'msg-timestamp-me' : 'msg-timestamp-other'"
                  >
                    {{ formatTimestamp(msg.time) }}
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
            v-if="!selectedChat.isGroup && selectedChat.deleted"
            class="deleted-user-notice w-100 text-center p-3"
          >
            Cannot send messages to deleted accounts
          </div>
          <div
            v-else-if="selectedChat.blocked"
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
                  <img v-if="media.type === 'image'" :src="media.url" class="media-preview-thumb" />
                  <video v-else-if="media.type === 'video'" :src="media.url" class="media-preview-thumb" />
                  <div v-else class="media-preview-file">
                    <span>📄</span>
                    <small class="media-preview-filename">{{ media.name }}</small>
                  </div>
                  <button class="media-preview-remove" @click="pendingMedia.splice(i, 1)">✕</button>
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
                data-tooltip="Add file"
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
                accept="*/*"
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
        <button @click="openMessageInfo">Info</button>
        <button
          @click="deleteMessage"
          v-if="messageMenu.message?.sender === 'me'"
          style="color: red"
        >
          Delete message
        </button>
      </div>
    </div>
    <ToastMessage message="Logging out..." v-model="showLogoutMessage" :duration="2000" />
    <ToastMessage message="Cannot upload more than 10 media at once :(" v-model="showMediaLimitToast" :duration="3000" />
    <ToastMessage message="File is too large! Maximum size is 10MB." v-model="showFileSizeToast" :duration="3000" />
    <ToastMessage message="Password changed!" v-model="showPasswordChangedToast" :duration="3000" />
    <ToastMessage message="Account deleted" v-model="showAccountDeletedToast" :duration="3000" />
    <HeaderMenu
      :visible="headerMenu.visible"
      :x="headerMenu.x"
      :y="headerMenu.y"
      :items="filteredHeaderMenuItems"
      :theme="theme"
      @close="closeHeaderMenu"
    />
    <HeaderMenu
      :visible="memberMenu.visible"
      :x="memberMenu.x"
      :y="memberMenu.y"
      :items="memberMenuItems"
      :theme="theme"
      @close="closeMemberMenu"
    />
    <div v-if="lightbox.visible" class="lightbox" @click="closeLightbox">
      <div class="lightbox-media-wrapper" @click.stop>

        <!-- Info bar -->
        <div class="lightbox-bar">
          <div class="lightbox-bar-left">
            <span class="lightbox-sender">{{ lightbox.media?.sender || 'Unknown' }}</span>
            <span class="lightbox-time">{{ formatTimestamp(lightbox.media?.time) }}</span>
          </div>
          <div class="lightbox-bar-right">
            <button
              class="lightbox-action-btn"
              data-tooltip="Go to message"
              @click="lightboxGoToMessage"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
              </svg>
            </button>
            <button
              class="lightbox-action-btn"
              data-tooltip="Pin message"
              @click="lightboxPin"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354"/>
              </svg>
            </button>
            <button
              class="lightbox-action-btn"
              data-tooltip="Reply"
              @click="lightboxReply"
            >
              ⤶
            </button>
            <button
              v-if="lightbox.media?.isMine"
              class="lightbox-action-btn lightbox-delete-btn"
              data-tooltip="Delete"
              @click="lightboxDelete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
            <div class="lightbox-close" @click="closeLightbox">✕</div>
          </div>
        </div>

        <img
          v-if="lightbox.media?.type === 'image' || lightbox.media?.type === 'gif'"
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
    <div v-if="messageInfo.visible" class="msg-info-overlay" @click.self="messageInfo.visible = false">
      <div class="msg-info-box">
        <div class="msg-info-title">Message Info</div>
        <div class="msg-info-row">
          <span class="msg-info-label">👤 Sent by</span>
          <span class="msg-info-value">{{ messageInfo.sender }}</span>
        </div>
        <div class="msg-info-row">
          <span class="msg-info-label">✅ Delivered</span>
          <span class="msg-info-value">{{ messageInfo.time }}</span>
        </div>
        <div v-if="messageInfo.reactions.length" class="msg-info-row">
          <span class="msg-info-label">😀 Reactions</span>
          <div class="msg-info-reactions">
            <div
              v-for="(r, i) in messageInfo.reactions"
              :key="i"
              class="msg-info-reaction-item"
            >
              <img :src="r.avatar" class="reaction-avatar" />
              <span class="msg-info-reaction-name">{{ r.sender }}</span>
              <span class="msg-info-reaction-emoji">{{ r.emoji }}</span>
            </div>
          </div>
        </div>
        <div v-else class="msg-info-row">
          <span class="msg-info-label" style="opacity:0.5">No reactions</span>
        </div>
        <button class="msg-info-close" @click="messageInfo.visible = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderMenu from "../components/HeaderMenu.vue";
import EmojiPicker from "../components/EmojiPicker.vue";
import AvatarImg from "../components/AvatarImg.vue";
import EditableField from "../components/EditableField.vue";
import ToastMessage from "../components/ToastMessage.vue";
import api from '../api/index.js';
import { io } from 'socket.io-client';
export default {
  components: {
  HeaderMenu,
  EmojiPicker,
  AvatarImg,
  EditableField,
  ToastMessage,
  },
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('keydown', this.handleKeyDown);

    try {
      const userData = await api.users.getMe();
      this.user = {
        name:      userData.user.name,
        username:  userData.user.username,
        email:     userData.user.email,
        phone:     userData.user.phone,
        avatar:    userData.user.avatar,
        createdAt: userData.user.createdAt,
      };
      this.settings.lastSeen      = userData.user.showLastSeen ? 'shown' : 'hidden';
      this.settings.allowStrangers = userData.user.allowStrangers ? 'on' : 'off';
      this.settings.messageNotifications = userData.user.notificationsEnabled ? 'on' : 'off';
      this.theme = userData.user.theme === 'dark' ? 'dark' : 'light';

      const chatData = await api.chats.getAll();
      this.chats = chatData.chats.map(this.mapChat);

      // Connect socket
      this.connectSocket();
    } catch (err) {
      console.error('Failed to load data:', err.message);
    } finally {
      this.loadingChats = false;
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
    if (this.socket) this.socket.disconnect();
  },
  data() {
    return {
      previousChat: null,
      DEFAULT_AVATAR: 'https://i.pinimg.com/1200x/c5/ab/41/c5ab41e3f9766798af79b40d535f45e0.jpg',
      linkPreviews: {}, // url -> preview object
      socket: null,
      notificationSound: new Audio('/sounds/notification.mp3'),
      messageInfo: {
        visible: false,
        sender: "",
        time: "",
        reactions: [],
      },
      memberMenu: {
        visible: false,
        x: 0,
        y: 0,
        member: null,
      },
      showFileSizeToast: false,
      showPasswordChangedToast: false,
      showAccountDeletedToast: false,
      showChangePassword: false,
      oldPassword: "",
      newPassword: "",
      editingMember: null,
      editingMemberInput: "",
      viewingSettings: false,
      settings: {
        lastSeen: 'shown',
        messageNotifications: 'on',
        allowStrangers: 'on',
      },
      blockedUsernames: [],
      showBlockedAccounts: false,
      showDeleteConfirm: false,
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
      inviteError: '',
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
          label: "",
          action: () => this.pinChat(this.selectedChatForMenu),
        },
        {
          label: "❌ Close Chat",
          action: () => this.closeChat(this.selectedChatForMenu),
        },
        {
          label: "⛔ Block",
          action: () => {
            if (this.selectedChatForMenu?.members?.length) {
              this.leaveGroup(this.selectedChatForMenu);
            } else {
              this.blockUser(this.selectedChatForMenu);
            }
          },
        },
        {
          label: "🧹 Delete Chat",
          action: () => this.deleteChat(this.selectedChatForMenu),
        },
      ],
      chats: [],
      loadingChats: true,
      emojiPicker: { visible: false, x: 0, y: 0 },
    };
  },
  computed: {
    sharedMedia() {
      if (!this.selectedChat?.messages) return [];
      const media = [];
      for (const msg of this.selectedChat.messages) {
        if (!msg.media?.length) continue;
        for (const m of msg.media) {
          if (m.fileType === 'image' || m.fileType === 'video' || m.fileType === 'gif') {
            media.push({
              url:      m.url,
              type:     m.fileType,
              name:     m.name,
              msgRef:   msg,           // reference to the original message
              sender:   msg.sender === 'me' ? this.user.name : msg.sender,
              isMine:   msg.sender === 'me',
              time:     msg.time,
            });
          }
        }
      }
      return media;
    },
    isContactBlocked() {
      if (!this.contactInfoData || this.contactInfoData.isGroup) return false;
      return this.isUserBlocked(this.contactInfoData.username);
    },
    visibleMessages() {
      const msgs = this.selectedChat?.messages || [];
      if (!this.selectedChat?.isGroup) return msgs;

      return msgs.filter(msg => {
        if (msg.sender === 'system' || msg.sender === 'me') return true;
        // Sakrij ako je pošiljatelj blokiran
        return !this.isUserBlocked(msg.sender);
      });
    },
    memberMenuItems() {
      const m = this.memberMenu.member;
      if (!m) return [];

      const existingChat = this.chats.find(
        c => !c.isGroup && c.username === m.username
      );
      const blocked = this.isUserBlocked(m.username);

      return [
        {
          label: "👤 View Profile",
          action: () => this.viewMemberProfile(m),
        },
        {
          label: existingChat ? "💬 Open Chat" : "➕ Add to chats",
          action: () => this.addMemberToChats(m),
        },
        {
          label: existingChat?.muted ? "🔔 Unmute Messages" : "🔕 Mute Messages",
          action: () => this.muteMember(m),
        },
        {
          label: blocked ? "🔓 Unblock User" : "⛔ Block User",
          action: () => this.blockMember(m),
        },
      ];
    },
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
        (c) => !c.hidden && !c.isGroup &&
        (c.name).toLowerCase().includes(q)
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
    filteredHeaderMenuItems() {
      const chat = this.selectedChatForMenu;
      if (chat && !chat.isGroup && chat.deleted) {
        return this.headerMenuItems.filter(it =>
          /contact info|close chat|delete chat/i.test(it.label)
        );
      }
      return this.headerMenuItems;
    },
  },
  watch: {
    async 'settings.lastSeen'(val) {
      await api.users.updateMe({ showLastSeen: val === 'shown' }).catch(console.error);
      const chatData = await api.chats.getAll();
      this.chats = chatData.chats.map(this.mapChat);
    },
    'settings.allowStrangers'(val) {
      api.users.updateMe({ allowStrangers: val === 'on' }).catch(console.error);
    },
    'settings.messageNotifications'(val) {
      api.users.updateMe({ notificationsEnabled: val === 'on' }).catch(console.error);
    },
    theme(val) {
      api.users.updateMe({ theme: val }).catch(console.error);
    },
  },
  methods: {
    closeSettings() {
      this.viewingSettings = false;
      if (this.previousChat) {
        this.selectedChat = this.previousChat;
        this.previousChat = null;
      }
    },
    senderAvatar(msg) {
      if (!msg || !this.selectedChat) return this.DEFAULT_AVATAR;
      if (this.selectedChat.isGroup && Array.isArray(this.selectedChat.members)) {
        const m = this.selectedChat.members.find(x => x.username === msg.sender);
        if (m && !m.deleted && m.avatar) return m.avatar;
        return this.DEFAULT_AVATAR;
      }
      // DM
      if (this.selectedChat.deleted) return this.DEFAULT_AVATAR;
      return this.selectedChat.avatar || this.DEFAULT_AVATAR;
    },

    senderName(msg) {
      if (!msg || !this.selectedChat) return 'Unknown';
      if (msg.sender === 'me' || msg.sender === this.user.username) return this.user.name;
      if (this.selectedChat.isGroup && Array.isArray(this.selectedChat.members)) {
        const m = this.selectedChat.members.find(x => x.username === msg.sender);
        if (m) return m.deleted ? 'Deleted user' : (m.name || m.username);
        return 'Deleted user'; // sender not in members anymore
      }
      // DM
      return this.selectedChat.deleted ? 'Deleted user' : (this.selectedChat.name || 'Unknown');
    },
    async confirmDeleteAccount() {
      try {
        await api.users.deleteMe();
        this.showDeleteConfirm = false;
        this.showAccountDeletedToast = true;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setTimeout(() => this.$router.replace("/login"), 1500);
      } catch (err) {
        console.error('Failed to delete account:', err.message);
      }
    },
    renderMessageText(text) {
      if (!text) return '';
      const escaped = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      return escaped.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener" class="msg-link">$1</a>'
      );
    },
    extractUrl(text) {
      if (!text) return null;
      const match = text.match(/https?:\/\/[^\s]+/);
      return match ? match[0] : null;
    },

    async loadLinkPreview(msg) {
      const url = this.extractUrl(msg.text);
      if (!url || this.linkPreviews[url] !== undefined) return;
      this.linkPreviews[url] = null;
      try {
        const data = await api.links.preview(url);
        if (data.preview) this.linkPreviews[url] = data.preview;
      } catch {
        this.linkPreviews[url] = null;
      }
    },
    connectSocket() {
      const BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';
      this.socket = io(BASE_URL, {
        auth: { token: api.getToken() },
      });

      // Poruka od drugog usera
      this.socket.on('new_message', ({ chatId, message }) => {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;

        chat.messages = chat.messages || [];
        chat.messages.push({
          id:        message.id,
          sender:    message.sender,
          text:      message.text,
          files:     message.files || [],
          media:     (message.files || []).map(f => ({
            fileType: f.fileType,
            url:      f.url,
            name:     f.name,
          })),
          replyTo:   message.replyTo || null,
          reactions: (message.reactions || []).map(r => ({
            emoji:  r.emoji,
            sender: r.sender,
            avatar: this.chats.find(c => c.id === chatId)?.avatar || '',
          })),
          time: message.time,
        });

        chat.lastMessage = message.text || (message.files?.length ? '📎 File' : '');

        // Sound notification — samo ako je tab/window neaktivan i postavka je 'on'
        const isTabActive = !document.hidden && document.hasFocus();
        if (
          message.sender !== this.user.username &&
          this.settings.messageNotifications === 'on' &&
          !isTabActive
        ) {
          this.notificationSound.currentTime = 0;
          this.notificationSound.play().catch(() => {
            // Browseri mogu blokirati autoplay dok user ne interaktira sa stranicom — ignoriraj
          });
        }

        // Auto scroll ako je chat otvoren
        if (this.selectedChat?.id === chatId) {
          this.$nextTick(this.scrollToBottom);
        }
      });

      // Sidebar refresh kada se metadata promjeni
      this.socket.on('chat_updated', ({ chatId, lastMessage }) => {
        const chat = this.chats.find(c => c.id === chatId);
        if (chat) chat.lastMessage = lastMessage;
      });

      // Netko je napravio novi chat
      this.socket.on('chat_added', async () => {
        const chatData = await api.chats.getAll();
        this.chats = chatData.chats.map(this.mapChat);
      });
    },
    async downloadFile(url, filename) {
      try {
        const res         = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const blob        = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        const a           = document.createElement('a');
        a.href            = URL.createObjectURL(blob);
        a.download        = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      } catch (err) {
        console.error('Download failed:', err);
        window.open(url, '_blank');
      }
    },
    lightboxGoToMessage() {
      const msg = this.lightbox.media?.msgRef;
      if (!msg || !this.selectedChat) return;
      this.closeLightbox();
      this.viewingContactInfo = false;
      this.contactInfoData = null;
      this.$nextTick(() => {
        const index = this.selectedChat.messages.indexOf(msg);
        if (index === -1) return;
        const el = this.$refs.messagesBox?.children[index];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    },

    lightboxPin() {
      const msg = this.lightbox.media?.msgRef;
      if (!msg) return;
      if (this.pinnedMessage === msg) {
        this.pinnedMessage = null;
      } else {
        if (!msg.text) msg.text = '🖼️ Image';
        this.pinnedMessage = msg;
      }
      this.closeLightbox();
    },

    lightboxReply() {
      const msg = this.lightbox.media?.msgRef;
      if (!msg) return;
      const senderName = msg.sender === 'me' ? this.user.name : this.selectedChat?.name;
      this.replyingTo = { sender: senderName, text: '🖼️ Image' };
      this.closeLightbox();
      this.viewingContactInfo = false;
      this.contactInfoData = null;
      this.$nextTick(() => this.$refs.messageInput?.focus());
    },

    async lightboxDelete() {
      const msg = this.lightbox.media?.msgRef;
      if (!msg || msg.sender !== 'me' || !this.selectedChat) return;
      try {
        await api.messages.delete(msg.id);
        const index = this.selectedChat.messages.indexOf(msg);
        if (index !== -1) {
          this.selectedChat.messages.splice(index, 1);
          const msgs = this.selectedChat.messages;
          this.selectedChat.lastMessage = msgs.length ? msgs[msgs.length - 1].text : '';
        }
      } catch (err) {
        console.error('Failed to delete message:', err.message);
      }
      this.closeLightbox();
    },
    unblockChat(chat) {
      if (!chat) return;
      chat.blocked = false;
      this.blockedUsernames = this.blockedUsernames.filter(u => u !== chat.username);
      api.users.blockUser(chat.username, false).catch(err =>
        console.error('Failed to unblock user:', err.message)
      );
    },

    unblockContact() {
      if (!this.contactInfoData) return;
      const username = this.contactInfoData.username;
      const chat = this.chats.find(c => !c.isGroup && c.username === username);
      if (chat) {
        this.unblockChat(chat);
      } else {
        this.blockedUsernames = this.blockedUsernames.filter(u => u !== username);
        api.users.blockUser(username, false).catch(err =>
          console.error('Failed to unblock user:', err.message)
        );
      }
    },
    isUserBlocked(username) {
      return this.blockedUsernames.includes(username);
    },

    blockMember(member) {
      const wasBlocked = this.isUserBlocked(member.username);

      const chat = this.chats.find(
        c => !c.isGroup && c.username === member.username
      );
      if (chat) {
        this.blockUser(chat);
      } else {
        api.users.blockUser(member.username, !wasBlocked).catch(err =>
          console.error('Failed to block user:', err.message)
        );
      }

      if (wasBlocked) {
        this.blockedUsernames = this.blockedUsernames.filter(u => u !== member.username);
      } else {
        this.blockedUsernames.push(member.username);
      }

      this.closeMemberMenu();
    },
    openMemberMenu(event, member) {
      if (member.isMe) return;

      if (this.memberMenu.visible && this.memberMenu.member?.username === member.username) {
        this.closeMemberMenu();
        return;
      }

      this.memberMenu.member = member;
      this.memberMenu.visible = true;
      this.memberMenu.x = 0;
      this.memberMenu.y = 0;
      this.$nextTick(() => {
        const pos = this.clampMenuPosition(event.clientX + 4, event.clientY + 4);
        this.memberMenu.x = pos.x;
        this.memberMenu.y = pos.y;
      });
    },

    closeMemberMenu() {
      this.memberMenu.visible = false;
      this.memberMenu.member = null;
    },

    viewMemberProfile(member) {
      this.contactInfoData = {
        id: `member-${member.username}`,
        name: member.name,
        username: member.username,
        avatar: member.avatar,
        phone: member.phone || '',
        deleted: member.deleted || false,
        lastSeen: member.lastSeen || '',
        isGroup: false,
      };
      this.viewingContactInfo = true;
      this.closeMemberMenu();
    },

    async addMemberToChats(member) {
      this.closeMemberMenu();
      const existing = this.chats.find(
        c => !c.isGroup && c.username === member.username
      );
      if (existing) {
        this.viewingContactInfo = false;
        this.selectChat(existing);
        return;
      }
      try {
        await api.chats.getOrCreate((member.username || '').replace(/^@/, ''));
        const chatData = await api.chats.getAll();
        this.chats = chatData.chats.map(this.mapChat);
        const newChat = this.chats.find(
          c => !c.isGroup && c.username === member.username
        );
        if (newChat) {
          this.viewingContactInfo = false;
          this.selectChat(newChat);
        }
      } catch (err) {
        console.error('Failed to add member to chats:', err.message);
      }
    },

    muteMember(member) {
      const chat = this.chats.find(
        c => !c.isGroup && c.username === member.username
      );
      if (chat) {
        this.muteChat(chat);
      }
      this.closeMemberMenu();
    },
    mapChat(chat) {
      return {
        ...chat,
        name:     chat.isGroup ? chat.name : (chat.otherUser?.name ?? 'Unknown'),
        avatar:   chat.isGroup ? chat.avatar : (chat.otherUser?.avatar ?? ''),
        username: chat.isGroup ? '' : (chat.otherUser?.username ?? ''),
        lastSeen: chat.isGroup ? '' : (chat.otherUser?.lastSeen ?? ''),
        phone:    chat.isGroup ? '' : (chat.otherUser?.phone ?? ''),
        deleted:  chat.isGroup ? false : (chat.otherUser?.deleted ?? false),   // <-- ADD
        members:  chat.isGroup ? chat.members : null,
        messages: [],
        pinned:   chat.pinned  || false,
        muted:    chat.muted   || false,
        hidden:   false,
        blocked:  false,
        pinnedAt: null,
      };
    },
    async updateProfile(field, value) {
      if (field === 'email') {
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!EMAIL_REGEX.test(value.trim())) {
          console.error('Invalid email format');
          return;
        }
      }

      // Update locally first so UI feels instant
      this.user[field] = value;

      try {
        await api.users.updateMe({ [field]: value });
      } catch (err) {
        console.error('Failed to update profile:', err.message);
      }
    },
    openMessageInfo() {
      if (!this.messageMenu.message) return;
      const msg = this.messageMenu.message;
      this.messageInfo.sender = this.senderName(msg);
      this.messageInfo.time = this.formatTimestamp(msg.time);
      this.messageInfo.reactions = (msg.reactions || []).map(r => ({
        emoji:  r.emoji,
        sender: r.sender === 'me' ? this.user.name : r.sender,
        avatar: r.avatar || this.DEFAULT_AVATAR,
      }));
      this.messageInfo.visible = true;
      this.closeMessageMenu();
    },
    formatTime(date) {
      if (!date) return "";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      return `${day}.${month}.${year}. at ${hours}:${mins}`;
    },
    formatTimestamp(raw) {
      if (!raw) return 'Unknown';
      const d = new Date(raw);
      if (isNaN(d)) return raw;

      const day   = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year  = d.getFullYear();

      let hours   = d.getHours();
      const mins  = String(d.getMinutes()).padStart(2, '0');
      const ampm  = hours >= 12 ? 'pm' : 'am';
      hours       = hours % 12 || 12;

      return `${day}.${month}.${year}. ${hours}:${mins} ${ampm}`;
    },
    async changePassword() {
      if (!this.oldPassword || !this.newPassword) return;
      try {
        await api.users.changePassword(this.oldPassword, this.newPassword);
        this.oldPassword = '';
        this.newPassword = '';
        this.showChangePassword = false;
        this.showPasswordChangedToast = true;
      } catch (err) {
        console.error('Failed to change password:', err.message);
      }
    },
    async handleGroupAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file || !this.contactInfoData) return;

      if (file.size > 10 * 1024 * 1024) {
        this.showFileSizeToast = true;
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        this.contactInfoData.avatar = base64;
        // Keep sidebar and chat header in sync
        const chat = this.chats.find(c => c.id === this.contactInfoData.id);
        if (chat) chat.avatar = base64;
        if (this.selectedChat?.id === this.contactInfoData.id) {
          this.selectedChat.avatar = base64;
        }
        try {
          await api.chats.updateGroup(this.contactInfoData.id, { avatar: base64 });
        } catch (err) {
          console.error('Failed to update group avatar:', err.message);
        }
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    },
    async kickMember(groupChat, memberIndex) {
      if (!groupChat?.members) return;
      const kicked = groupChat.members[memberIndex];
      try {
        await api.chats.kickMember(groupChat.id, kicked.username);
        groupChat.members.splice(memberIndex, 1);
        if (!groupChat.hasCustomName) {
          groupChat.name = groupChat.members.map(m => m.name).join(', ');
        }
        groupChat.messages.push({
          sender: 'system',
          text: `${this.user.name} kicked ${kicked.name} from the group.`,
        });
        groupChat.lastMessage = `${this.user.name} kicked ${kicked.name}`;
      } catch (err) {
        console.error('Failed to kick member:', err.message);
      }
    },
    async deleteGroup(chat) {
      await this.leaveGroup(chat);
    },
    async leaveGroup(chat) {
      if (!chat) return;
      try {
        await api.chats.leave(chat.id);
        const index = this.chats.indexOf(chat);
        if (index !== -1) this.chats.splice(index, 1);
        if (this.selectedChat?.id === chat.id) this.selectedChat = null;
        this.viewingContactInfo = false;
        this.contactInfoData = null;
        this.closeHeaderMenu();
      } catch (err) {
        console.error('Failed to leave group:', err.message);
      }
    },
    async handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        this.showFileSizeToast = true;
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        this.user.avatar = base64;
        await this.updateProfile('avatar', base64);
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    },
    startEditMember(index, currentName) {
      this.editingMember = index;
      this.editingMemberInput = currentName;
    },
    async saveMemberName(index) {
      const trimmed = this.editingMemberInput.trim();
      if (trimmed && this.contactInfoData?.members?.[index]) {
        const member = this.contactInfoData.members[index];
        member.name = trimmed;
        if (!this.contactInfoData.hasCustomName) {
          this.contactInfoData.name = this.contactInfoData.members.map(m => m.name).join(', ');
        }
        try {
          await api.chats.setNickname(this.contactInfoData.id, trimmed);
        } catch (err) {
          console.error('Failed to save nickname:', err.message);
        }
      }
      this.editingMember = null;
      this.editingMemberInput = '';
    },
    // Drag and drop fileova u chat
    handleDrop(event) {
      if (!this.selectedChat) return;
      const files = Array.from(event.dataTransfer.files);
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          this.showFileSizeToast = true;
          continue;
        }
        if (this.pendingMedia.length >= 10) {
          this.showMediaLimitToast = true;
          break;
        }
        const previewUrl = URL.createObjectURL(file);
        let type = 'file';
        if (file.type.startsWith('video')) type = 'video';
        else if (file.type.startsWith('image')) type = 'image';
        this.pendingMedia.push({ type, url: previewUrl, name: file.name, blob: file });
      }
      this.$nextTick(() => this.$refs.messageInput?.focus());
    },
    openSettings() {
      if (this.viewingSettings) return;
      this.globalSearch = "";
      this.viewingContactInfo = false;
      this.contactInfoData = null;
      this.viewingOwnProfile = false;
      this.viewingSettings = true;
      this.previousChat = this.selectedChat;
      this.selectedChat = null;
      this.showBlockedAccounts = false;
      this.showDeleteConfirm = false;
    },
    async sendInvite() {
      if (!this.newContactSearch.trim()) {
        this.inviteError = 'Please enter a username';
        return;
      }

      this.inviteError = '';
      this.showInviteSent = false;

      // Check if user is already in chats
      const already = this.chats.find(c => 
        !c.members?.length && c.username === this.newContactSearch.trim().toLowerCase()
      );
      if (already) {
        this.inviteError = 'User already added!';
        return;
      }

      try {
        await api.chats.getOrCreate(this.newContactSearch.trim().replace(/^@/, ''));

        const chatData = await api.chats.getAll();
        this.chats = chatData.chats.map(this.mapChat);

        this.newContactSearch = '';
        this.showInviteSent = true;
      } catch (err) {
        this.inviteError = err.message;
      }
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
    async saveChatName() {
      const chat = this.selectedChat || this.contactInfoData;
      if (!chat) return;
      const trimmed = this.chatNameInput.trim();
      if (trimmed) {
        chat.name = trimmed;
        if (chat.isGroup) {
          chat.hasCustomName = true;
          try {
            await api.chats.updateGroup(chat.id, { name: trimmed });
          } catch (err) {
            console.error('Failed to update group name:', err.message);
          }
        }
      }
      this.editingChatName = false;
      this.chatNameInput = "";
    },
    toggleGroupMember(chat) {
      const i = this.selectedGroupMembers.indexOf(chat);
      if (i === -1) this.selectedGroupMembers.push(chat);
      else this.selectedGroupMembers.splice(i, 1);
    },
    async createGroup() {
      if (this.selectedGroupMembers.length < 2) return;

      // Strip leading @ if present
      const memberUsernames = this.selectedGroupMembers.map(c => 
        (c.username || '').replace(/^@/, '')
      );
      const name = this.selectedGroupMembers.map(c => c.originalName || c.name).join(', ');

      try {
        await api.chats.createGroup(name, memberUsernames);

        const chatData = await api.chats.getAll();
        this.chats = chatData.chats.map(this.mapChat);

        // Select the newly created group
        const newGroup = this.chats.find(c => c.isGroup && c.name === name);
        this.selectedChat = newGroup || null;

        this.showNewChatMenu = false;
        this.showNewGroupView = false;
        this.groupSearch = '';
        this.selectedGroupMembers = [];
        this.viewingOwnProfile = false;
        this.viewingContactInfo = false;
        this.viewingSettings = false;

      } catch (err) {
        console.error('Failed to create group:', err.message);
      }
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      const files = Array.from(event.target.files);
      if (!files.length || !this.selectedChat) return;

      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          this.showFileSizeToast = true;
          continue;
        }
        if (this.pendingMedia.length >= 10) {
          this.showMediaLimitToast = true;
          break;
        }
        // blob + object URL za preview
        const previewUrl = URL.createObjectURL(file);
        let type = 'file';
        if (file.type.startsWith('video')) type = 'video';
        else if (file.type.startsWith('image')) type = 'image';
        this.pendingMedia.push({ type, url: previewUrl, name: file.originalname || file.name, blob: file });
      }

      event.target.value = '';
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
        .filter((msg) => msg.text?.toLowerCase().includes(query));

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
    // Otvori sliku ili video u cijelosti
    openLightbox(media) {
      this.lightbox.media = media;
      this.lightbox.visible = true;
    },

    closeLightbox() {
      this.lightbox.visible = false;
      this.lightbox.media = null;
    },
    async selectChat(chat) {
      chat.hidden = false;
      this.selectedChat = chat;
      this.selectedChatForMenu = chat;
      this.globalSearch = "";
      this.editingChatName = false;
      this.showNewChatMenu = false;
      this.viewingContactInfo = false;
      this.contactInfoData = null;
      this.viewingOwnProfile = false;
      this.viewingSettings = false;

      // Load messages from backend
      try {
        const data = await api.messages.getAll(chat.id);
        chat.messages = data.messages.map(msg => ({
          id:        msg._id,
          sender:    msg.sender === this.user.username ? 'me' : msg.sender,
          text:      msg.text,
          files:     msg.files || [],
          media:     (msg.files || []).map(f => ({ fileType: f.fileType, url: f.url, name: f.name })),
          replyTo:   msg.replyTo || null,
          reactions: (msg.reactions || []).map(r => ({
            emoji:  r.emoji,
            sender: r.sender === this.user.username ? 'me' : r.sender,
            avatar: r.sender === this.user.username
              ? this.user.avatar
              : (this.selectedChat?.members?.find(m => m.username === r.sender)?.avatar
                  || this.selectedChat?.avatar),
          })),
          time: msg.createdAt,
        }));
      } catch (err) {
        console.error('Failed to load messages:', err.message);
        chat.messages = [];
      }

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
        contactInfoItem.label = chat.isGroup ? "👥 Group info" : "👤 Contact Info";
      }

      const previousChat = this.selectedChatForMenu;
      this.selectedChatForMenu = chat;

      const pinItem = this.headerMenuItems.find((i) => i.action.toString().includes("pinChat"));
      const muteItem = this.headerMenuItems.find((i) => i.action.toString().includes("muteChat"));
      const blockItem = this.headerMenuItems.find((i) => i.action.toString().includes("blockUser"));
      if (blockItem) blockItem.label = this.selectedChatForMenu?.isGroup
        ? "🚪 Leave Group" 
        : this.selectedChatForMenu.blocked ? "🔓 Unblock" : "⛔ Block";
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
    //Chat options
    toggleHeaderMenu(event) {
      this.selectedChatForMenu = this.selectedChat;
      event.stopPropagation();
      const contactInfoItem = this.headerMenuItems.find((i) =>
        i.action.toString().includes("contactInfo"),
      );
      if (contactInfoItem) {
        contactInfoItem.label = this.selectedChatForMenu?.isGroup
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
      if (blockItem) blockItem.label = this.selectedChatForMenu?.isGroup
        ? "🚪 Leave Group" 
        : this.selectedChatForMenu.blocked ? "🔓 Unblock" : "⛔ Block";
        if (muteItem) muteItem.label = this.selectedChatForMenu.muted ? "🔔 Unmute Notifications" : "🔕 Mute Notifications";
      }
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
    async contactInfo(chat) {
      if (!chat) return;
      this.contactInfoData = chat;
      this.viewingContactInfo = true;
      this.viewingOwnProfile = false;
      this.viewingSettings = false;
      this.closeHeaderMenu();

      if (chat.isGroup) {
        try {
          const chatData = await api.chats.getAll();
          const fresh = chatData.chats.find(c => c.id === chat.id || c._id === chat.id);
          if (fresh) {
            const mapped = this.mapChat(fresh);
            // Update members in place
            const existing = this.chats.find(c => c.id === chat.id);
            if (existing) existing.members = mapped.members;
            this.contactInfoData = { ...this.contactInfoData, members: mapped.members };
          }
        } catch (err) {
          console.error('Failed to refresh contact info:', err.message);
        }
      }
    },
    async muteChat(chat) {
      if (!chat) return;
      const newMuted = !chat.muted;
      chat.muted = newMuted;
      try {
        await api.chats.updateGroup(chat.id, { muted: newMuted });
      } catch (err) {
        console.error('Failed to mute chat:', err.message);
        chat.muted = !newMuted;
      }
      this.closeHeaderMenu();
    },
    async pinChat(chat) {
      if (!chat) return;
      const newPinned = !chat.pinned;
      chat.pinned = newPinned;
      chat.pinnedAt = newPinned ? Date.now() : null;
      try {
        await api.chats.updateGroup(chat.id, { pinned: newPinned });
      } catch (err) {
        console.error('Failed to pin chat:', err.message);
        // revert
        chat.pinned = !newPinned;
        chat.pinnedAt = !newPinned ? Date.now() : null;
      }
      this.closeHeaderMenu();
    },
    closeContactInfo() {
      this.viewingContactInfo = false;
      this.contactInfoData = null;
    },
    async blockUser(chat) {
      if (!chat) return;
      const newBlocked = !chat.blocked;
      chat.blocked = newBlocked;

      if (newBlocked) {
        if (!this.blockedUsernames.includes(chat.username)) {
          this.blockedUsernames.push(chat.username);
        }
      } else {
        this.blockedUsernames = this.blockedUsernames.filter(u => u !== chat.username);
      }

      if (newBlocked && this.selectedChat?.id === chat.id) this.newMessage = '';
      try {
        await api.users.blockUser(chat.username, newBlocked);
      } catch (err) {
        console.error('Failed to block user:', err.message);
        chat.blocked = !newBlocked;
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
    logout() {
      this.showLogoutMessage = true;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      setTimeout(() => {
        this.showLogoutMessage = false;
        this.$router.replace("/login");
      }, 2000);
    },
    handleKeyDown(event) {
      if (event.key === "Escape") {
        this.closeMessageMenu();
        this.closeMemberMenu();
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
      const isGroupMemberItem = event.target.closest(".group-member-item");

      if (messageMenu && !messageMenu.contains(event.target)) {
        this.closeMessageMenu();
      }
      if (
        headerMenu &&
        !headerMenu.contains(event.target) &&
        !isHeaderButton &&
        !isContactMenuBtn &&
        !isContactItem &&
        !isGroupMemberItem
      ) {
        this.closeHeaderMenu();
        this.closeMemberMenu();
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
    async sendMessage() {
      if (!this.selectedChat || this.selectedChat.blocked) return;
      if (!this.newMessage.trim() && !this.pendingMedia.length) return;

      const text = this.newMessage.replace(/\n+/g, ' ').trim();

      try {
        const data = await api.messages.send(this.selectedChat.id, {
          text,
          replyTo: this.replyingTo || null,
          files:   this.pendingMedia, // pass the full objects including blob
        });

        const msg = data.message;
        this.selectedChat.messages.push({
          id:        msg._id,
          sender:    'me',
          text:      msg.text,
          files:     msg.files || [],
          media:     (msg.files || []).map(f => ({
            fileType: f.fileType,
            url:      f.url,
            name:     f.name,
          })),
          replyTo:   msg.replyTo || null,
          reactions: msg.reactions || [],
          time:      msg.createdAt,
        });

        this.selectedChat.lastMessage = text || (this.pendingMedia.length ? '📎 File' : '');
        this.newMessage   = '';
        this.replyingTo   = null;
        this.pendingMedia = [];
        this.$nextTick(this.scrollToBottom);

      } catch (err) {
        console.error('Failed to send message:', err.message);
      }
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

      this.messageMenu.visible = true;
      this.messageMenu.message = msg;

      // Da bude unutar chat area
      const menuWidth  = 180;
      const menuHeight = 220;
      const padding    = 8;

      const chatArea = this.$refs.messagesBox?.closest('.chat-area');
      const bounds   = chatArea
        ? chatArea.getBoundingClientRect()
        : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };

      let x = event.clientX + 4;
      let y = event.clientY + 4;

      x = Math.min(x, bounds.right  - menuWidth  - padding);
      x = Math.max(x, bounds.left   + padding);
      y = Math.min(y, bounds.bottom - menuHeight - padding);
      y = Math.max(y, bounds.top    + padding);

      this.messageMenu.x = x;
      this.messageMenu.y = y;
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
        const hasFile = msg.media.some((m) => m.type === "file");
        if (hasFile) previewText = "📄 File";
        else if (hasVideo && hasImage) previewText = "🖼️ Image & 🎬 Video";
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
    async pickEmoji(emoji) {
      const msg = this.pendingReactMessage;
      if (!msg) return;
      try {
        await api.messages.react(msg.id, emoji);
        msg.reactions = (msg.reactions || []).filter(r => r.sender !== 'me');
        msg.reactions.push({ emoji, sender: 'me', avatar: this.user.avatar });
      } catch (err) {
        console.error('Failed to react:', err.message);
      }
      this.pendingReactMessage = null;
      this.emojiPicker.visible = false;
    },
    async removeReaction(msg, reaction) {
      if (reaction.sender !== 'me') return;
      try {
        await api.messages.unreact(msg.id);
        msg.reactions = msg.reactions.filter(r => r !== reaction);
      } catch (err) {
        console.error('Failed to remove reaction:', err.message);
      }
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
    async deleteMessage() {
      if (!this.messageMenu.message || !this.selectedChat) return;
      if (this.messageMenu.message.sender !== 'me') return;
      const msg = this.messageMenu.message;
      try {
        await api.messages.delete(msg.id);
        const index = this.selectedChat.messages.indexOf(msg);
        if (index !== -1) {
          this.selectedChat.messages.splice(index, 1);
          const msgs = this.selectedChat.messages;
          this.selectedChat.lastMessage = msgs.length ? msgs[msgs.length - 1].text : '';
        }
      } catch (err) {
        console.error('Failed to delete message:', err.message);
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
  display: inline-block;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-line;
  text-align: left !important;
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
  top: 0; left: 0;
  width: 100%; height: 100%;
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
  max-height: calc(90vh - 56px);
  border-radius: 0 0 12px 12px;
  transform: scale(0.9);
  animation: zoomIn 0.25s ease forwards;
  object-fit: contain;
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  flex-shrink: 0;
}

.lightbox-close:hover {
  transform: scale(1.1);
  background: rgba(255, 0, 0, 0.6);
}

.lightbox-media-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px 10px 0 0;
  gap: 12px;
  backdrop-filter: blur(6px);
}

.lightbox-bar-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lightbox-sender {
  color: white;
  font-weight: 700;
  font-size: 13px;
}

.lightbox-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
}

.lightbox-bar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lightbox-action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.2s ease, transform 0.15s ease;
  position: relative;
}

.lightbox-action-btn:hover {
  background: rgba(255, 0, 0, 0.5);
  transform: scale(1.1);
}

.lightbox-action-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  color: white;
  font-size: 11px;
  padding: 3px 7px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.lightbox-action-btn:hover::after {
  opacity: 1;
}

.lightbox-delete-btn:hover {
  background: rgba(255, 0, 0, 0.8) !important;
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
  position: relative;
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
  cursor: pointer;
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
  padding: 0;
  border-bottom: 1px solid rgba(255, 0, 0, 0.15);
}

.settings-row-header {
  padding: 10px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

.blocked-list {
  width: 100%;
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
.media-preview-file {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid #ff0000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  overflow: hidden;
  padding: 4px;
}

.light .media-preview-file {
  background: rgba(255, 0, 0, 0.05);
}

.dark .media-preview-file {
  background: rgba(255, 0, 0, 0.1);
}

.media-preview-filename {
  font-size: 9px;
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
  max-height: 24px;
  overflow: hidden;
}
.msg-file {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid #ff0000;
  max-width: 440px;
  white-space: nowrap;
}

.light .msg-file {
  background: rgba(255, 0, 0, 0.05);
}

.dark .msg-file {
  background: rgba(255, 0, 0, 0.08);
}

.msg-file-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.msg-file-info {
  display: flex;
  flex-direction: row;
  min-width: 0;
  gap: 4px;
}

.msg-file-name {
  font-size: 12px;
  font-weight: 600;
  word-break: break-all;
  line-height: 1.3;
}

.light .msg-file-name {
  color: black;
}

.dark .msg-file-name {
  color: white;
}

.msg-file-download {
  display: flex;
  align-items: center;
  color: #ff0000;
  transition: transform 0.15s ease, opacity 0.15s ease;
  width: fit-content;
}

.msg-file-download:hover {
  transform: scale(1.2);
  opacity: 0.8;
}
.chat-name-edit-icon::after {
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
.chat-name-edit-icon:hover::after {
  opacity: 1;
}
.leave-group-btn {
  background: none;
  border: 2px solid #ff0000;
  color: #ff0000;
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: background 0.7s ease, color 0.7s ease, border-color 0.7s ease;
}

.leave-group-btn:hover {
  background: rgba(255, 50, 50, 0.384);
  color: inherit;
  border-color: transparent;
}
.owner-tag {
  font-size: 10px;
  color: gray;
  font-weight: 500;
  margin-left: 4px;
  flex-shrink: 0;
}

.kick-btn {
  background: none;
  border: 1px solid rgba(255, 0, 0, 0.4);
  color: #ff0000;
  border-radius: 6px;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.kick-btn:hover {
  background: #ff0000;
  color: white;
}
.group-action-btns {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 24px;
}

.group-action-btns .leave-group-btn {
  margin-bottom: 0;
}
.change-password-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
}


.password-input {
  flex: 1;
  min-width: 120px;
}
.settings-show-link {
  color: #ff0000;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.settings-show-link:hover {
  opacity: 0.7;
}

.settings-change-btn {
  padding: 5px 16px;
  border-radius: 20px;
  border: 2px solid #ff0000;
  background: #ff0000;
  color: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.15s ease;
  flex-shrink: 0;
}

.settings-change-btn:hover {
  background: #cc0000;
  border-color: #cc0000;
  transform: scale(1.05);
}

.blocked-list-wrapper,
.change-password-wrapper {
  width: 100%;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease;
  overflow: hidden;
}

.blocked-list-wrapper.open,
.change-password-wrapper.open {
  grid-template-rows: 1fr;
}

.blocked-list-wrapper > .blocked-list,
.change-password-wrapper > .change-password-row {
  min-height: 0;
  overflow: hidden;
  padding: 0;
}

.blocked-list-wrapper.open > .blocked-list,
.change-password-wrapper.open > .change-password-row {
  padding: 0 0 10px 0;
}
.system-message {
  display: inline-block;
  text-align: center;
  color: gray;
  font-size: 12px;
  font-style: italic;
  padding: 3px 12px;
  border-radius: 12px;
  margin: 2px auto;
}

.light .system-message {
  background: rgba(0, 0, 0, 0.07);
}

.dark .system-message {
  background: rgba(255, 255, 255, 0.08);
}
.message-wrapper {
  gap: 6px;
}
.msg-avatar {
  position: relative;
  cursor: default;
}

.msg-avatar::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  color: white;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 999;
}

.msg-avatar:hover::after {
  opacity: 1;
}
.msg-info-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.msg-info-box {
  border-radius: 12px;
  padding: 24px 28px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}

.light .msg-info-box {
  background: white;
  color: black;
}

.dark .msg-info-box {
  background: #1e1e1e;
  color: white;
}

.msg-info-title {
  font-size: 16px;
  font-weight: 700;
  color: #ff0000;
}

.msg-info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.msg-info-label {
  font-weight: 600;
}

.msg-info-value {
  opacity: 0.75;
  font-size: 13px;
}

.msg-info-close {
  align-self: flex-end;
  background: none;
  border: 2px solid #ff0000;
  color: #ff0000;
  border-radius: 8px;
  padding: 5px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.msg-info-close:hover {
  background: #ff0000;
  color: white;
}
.invite-error-text {
  color: #ff0000;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 8px;
}
.chats-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px 16px;
  font-size: 20px;
  font-style: italic;
  opacity: 0.7;
  animation: chatsLoadingFloat 2.4s ease-in-out infinite;
}

.chats-loading-text {
  letter-spacing: 0.3px;
}

.chats-loading-dots {
  display: inline-flex;
  gap: 3px;
  margin-left: 2px;
}

.chats-loading-dots .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
  animation: chatsLoadingBounce 1.2s ease-in-out infinite;
}

.chats-loading-dots .dot:nth-child(1) { animation-delay: 0s; }
.chats-loading-dots .dot:nth-child(2) { animation-delay: 0.2s; }
.chats-loading-dots .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes chatsLoadingBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-5px); opacity: 1; }
}

@keyframes chatsLoadingFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-3px); }
}
.blocked-tag {
  font-size: 11px;
  color: gray;
  font-weight: 500;
  margin-left: 4px;
  flex-shrink: 0;
  font-style: italic;
}
.blocked-status-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;      
  margin-top: 4px;
}

.blocked-status-text {
  color: gray;
  font-style: italic;
  font-size: 14px;
}
.msg-info-reactions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
  width: 100%;
}

.msg-info-reaction-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 8px;
}

.light .msg-info-reaction-item {
  background: rgba(255, 0, 0, 0.05);
}

.dark .msg-info-reaction-item {
  background: rgba(255, 0, 0, 0.1);
}

.msg-info-reaction-name {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
}

.msg-info-reaction-emoji {
  font-size: 18px;
}
.msg-timestamp {
  font-size: 11px;
  white-space: nowrap;
  align-self: flex-end;
  margin-bottom: 4px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white !important;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  animation: timestampFadeIn 0.15s ease 1s forwards;
}

.msg-timestamp-me {
  order: -1;
}

.msg-timestamp-other {
  order: 1;
}
@keyframes timestampFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0);   }
}
.link-preview {
  display: block;
  margin-top: 6px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  max-width: 300px;
  border: 1px solid rgba(255, 0, 0, 0.2);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  text-decoration: none;
  color: inherit;
}

.link-preview:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(255, 0, 0, 0.2);
}

.link-preview-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}

.link-preview-body {
  padding: 8px 10px;
}

.light .link-preview-body {
  background: rgba(255, 0, 0, 0.04);
}

.dark .link-preview-body {
  background: rgba(255, 0, 0, 0.08);
}

.link-preview-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-preview-desc {
  font-size: 11px;
  opacity: 0.7;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 4px;
}

.link-preview-url {
  font-size: 10px;
  color: #ff0000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-link {
  color: #ff6666;
  text-decoration: underline;
  word-break: break-all;
}

.dark .msg-link {
  color: #ff9999;
}
.chat-deleted .fw-semibold,
.chat-deleted small {
  opacity: 0.6;
  font-style: italic;
}

.member-deleted {
  opacity: 0.6;
  font-style: italic;
  cursor: default;
}

.deleted-user-notice {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  opacity: 0.7;
  font-style: italic;
}
</style>
