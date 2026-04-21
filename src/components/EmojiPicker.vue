<template>
    <div class="ep-wrapper" :class="theme" ref="picker">
        <div class="ep-quick-bar">
            <button v-for="item in quickReactions" :key="item.emoji" class="ep-quick-btn"
                @click="$emit('select', item.emoji)">{{ item.emoji }}</button>
            <button class="ep-quick-btn ep-plus-btn" @click="showAll = !showAll">
                {{ showAll ? '✕' : '+' }}
            </button>
        </div>

        <!-- Full picker -->
        <div v-if="showAll" class="ep-full">
            <input v-model="search" class="ep-search" placeholder="Search emoji..." @click.stop />
            <div class="ep-categories">
                <button v-for="cat in emojiCategories" :key="cat.name" class="ep-cat-btn"
                    :class="{ active: activeCategory === cat.name }" @click="activeCategory = cat.name">{{
                        cat.emojis[0].emoji }}</button>
            </div>
            <div class="ep-grid">
                <button v-for="item in filteredEmojis" :key="item.emoji" class="ep-emoji-btn" :title="item.name"
                    @click="$emit('select', item.emoji)">{{ item.emoji }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { emojiCategories, quickReactions } from '../assets/emojis.js';

export default {
    emits: ['select', 'close'],
    props: {
        theme: { type: String, default: 'light' }
    },
    data() {
        return {
            showAll: false,
            search: '',
            activeCategory: emojiCategories[0].name,
            emojiCategories,
            quickReactions,
        };
    },
    computed: {
        filteredEmojis() {
            const q = this.search.trim().toLowerCase();
            if (!q) {
                const cat = emojiCategories.find(c => c.name === this.activeCategory);
                return cat ? cat.emojis : [];
            }
            return emojiCategories.flatMap(c => c.emojis).filter(item =>
                item.name.includes(q) || item.emoji === q
            );
        }
    },
    mounted() {
        setTimeout(() => {
            document.addEventListener('click', this.handleOutside);
        }, 0);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleOutside);
    },
    methods: {
        handleOutside(e) {
            if (this.$refs.picker && !this.$refs.picker.contains(e.target)) {
                this.$emit('close');
            }
        }
    }
};
</script>

<style scoped>
.ep-wrapper {
    position: fixed;
    z-index: 20000;
    border-radius: 14px;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 52px;
}

.light.ep-wrapper {
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
}

.dark.ep-wrapper {
    background: #1e1e1e;
    border: 1px solid rgba(255, 255, 255, 0.12);
}

/* Quick bar */
.ep-quick-bar {
    display: flex;
    gap: 4px;
    align-items: center;
}

.ep-quick-btn {
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    padding: 4px 5px;
    border-radius: 8px;
    line-height: 1;
    transition: transform 0.12s ease, background 0.12s ease;
}

.ep-quick-btn:hover {
    transform: scale(1.3);
    background: rgba(255, 0, 0, 0.1);
}

.ep-plus-btn {
    font-size: 16px;
    font-weight: bold;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50% !important;
    background: rgba(255, 0, 0, 0.1) !important;
}

.light .ep-plus-btn {
    color: #cc0000;
}

.dark .ep-plus-btn {
    color: #ff6666;
}

/* Full picker */
.ep-full {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 280px;
}

.ep-search {
    width: 100%;
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    border: 1px solid rgba(255, 0, 0, 0.3);
    box-sizing: border-box;
}

.light .ep-search {
    background: #fff;
    color: #000;
}

.dark .ep-search {
    background: #2a2a2a;
    color: #fff;
}

.ep-categories {
    display: flex;
    gap: 2px;
    flex-wrap: wrap;
}

.ep-cat-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 3px 5px;
    border-radius: 6px;
    opacity: 0.5;
    transition: opacity 0.15s, background 0.15s;
}

.ep-cat-btn:hover,
.ep-cat-btn.active {
    opacity: 1;
    background: rgba(255, 0, 0, 0.1);
}

.ep-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 2px;
    max-height: 200px;
    overflow-y: auto;
}

.ep-emoji-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 3px;
    border-radius: 6px;
    line-height: 1;
    transition: transform 0.1s ease, background 0.1s ease;
}

.ep-emoji-btn:hover {
    transform: scale(1.25);
    background: rgba(255, 0, 0, 0.1);
}
</style>