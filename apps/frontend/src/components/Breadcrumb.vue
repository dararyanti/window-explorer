<template>
    <div class="d-flex align-items-center mb-3">
        <!-- Navigation Buttons -->
        <div class="me-3 d-flex gap-1">
            <button class="btn btn-sm btn-outline-secondary" @click="emit('back')" :disabled="!canGoBack">
                <i class="bi bi-arrow-left"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary" @click="emit('forward')" :disabled="!canGoForward">
                <i class="bi bi-arrow-right"></i>
            </button>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex-grow-1" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 bg-body-tertiary p-2 rounded align-items-center">
                <li class="breadcrumb-item">
                    <a href="#" @click.prevent="emit('navigate', 0)">
                        <i class="bi bi-house-door me-1"></i> Home
                    </a>
                </li>
                <li v-if="path.length > 1" class="mx-1 text-muted">
                    <i class="bi bi-chevron-right"></i>
                </li>
                <template v-for="(folder, index) in path.slice(1)" :key="folder.id">
                    <li class="breadcrumb-item">
                        <a href="#" @click.prevent="emit('navigate', index + 1)">
                            {{ folder.name }}
                        </a>
                    </li>
                    <li v-if="index + 1 < path.length - 1" class="mx-1 text-muted">
                        <i class="bi bi-chevron-right"></i>
                    </li>
                </template>
            </ol>
        </nav>

        <!-- Search + New -->
        <div class="ms-3 d-flex align-items-center gap-1">
            <input v-model="search" class="form-control form-control-sm" :placeholder="`Search ${currentFolderName}`"
                @input="emit('search', search)" />
            <button class="btn btn-sm btn-outline-secondary" @click="emit('search', search)">
                <i class="bi bi-search"></i>
            </button>

            <!-- New dropdown -->
            <div class="dropdown ms-1">
                <button class="btn btn-sm btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i class="bi bi-plus-lg me-1"></i> New
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                        <a class="dropdown-item" href="#" @click.prevent="emit('new-folder')">
                            <i class="bi bi-folder-plus me-2"></i> New Folder
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" @click.prevent="emit('new-file')">
                            <i class="bi bi-file-earmark-plus me-2"></i> New File
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
interface Folder {
    id: string;
    name: string;
    parentId?: string | null;
}

const props = defineProps<{
    path: Folder[];
    currentFolderName: string;
    canGoBack: boolean;
    canGoForward: boolean;
}>();

const emit = defineEmits<{
    (e: 'navigate', index: number): void;
    (e: 'back'): void;
    (e: 'forward'): void;
    (e: 'search', query: string): void;
    (e: 'new-folder'): void;
    (e: 'new-file'): void;
}>();


const search = defineModel<string>('searchQuery', { default: '' });
</script>

<style scoped>
.breadcrumb {
    --bs-breadcrumb-divider: none;
}

.breadcrumb a {
    text-decoration: none;
    color: #213547;
}

.breadcrumb a:hover {
    text-decoration: underline;
}
</style>
