<template>
    <div class="d-flex" style="height:100vh;">
        <!-- Folder Tree -->
        <div class="border-end p-2 bg-light" style="width:250px; overflow-y:auto;">
            <FolderTree v-for="f in rootFolders" :key="f.id" :folder="f" :load-children="fetchChildren"
                @select="selectFolder" />
        </div>

        <!-- Explorer Content -->
        <div class="flex-fill p-3">
            <Breadcrumb :path="breadcrumbPath" :current-folder-name="selectedFolder?.name || 'root'"
                :can-go-back="canGoBack" :can-go-forward="canGoForward" v-model:search-query="searchQuery"
                @navigate="goToBreadcrumb" @back="goBack" @forward="goForward" @search="handleSearch"
                @new-folder="createNewFolder" @new-file="createNewFile" />


            <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th @click="sortBy('name')" class="sortable">
                                Name
                                <i v-if="sortKey === 'name'"
                                    :class="sortAsc ? 'bi bi-caret-up-fill ms-1' : 'bi bi-caret-down-fill ms-1'"></i>
                            </th>
                            <th @click="sortBy('sizeBytes')" class="sortable">
                                Size
                                <i v-if="sortKey === 'sizeBytes'"
                                    :class="sortAsc ? 'bi bi-caret-up-fill ms-1' : 'bi bi-caret-down-fill ms-1'"></i>
                            </th>
                            <th @click="sortBy('mimeType')" class="sortable">
                                Type
                                <i v-if="sortKey === 'mimeType'"
                                    :class="sortAsc ? 'bi bi-caret-up-fill ms-1' : 'bi bi-caret-down-fill ms-1'"></i>
                            </th>
                            <th @click="sortBy('updatedAt')" class="sortable">
                                Date Modified
                                <i v-if="sortKey === 'updatedAt'"
                                    :class="sortAsc ? 'bi bi-caret-up-fill ms-1' : 'bi bi-caret-down-fill ms-1'"></i>
                            </th>
                            <th @click="sortBy('createdAt')" class="sortable">
                                Date Created
                                <i v-if="sortKey === 'createdAt'"
                                    :class="sortAsc ? 'bi bi-caret-up-fill ms-1' : 'bi bi-caret-down-fill ms-1'"></i>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Folders -->
                        <tr v-if="creatingNewFolder">
                            <td>
                                <i class="bi bi-folder-fill text-warning me-2"></i>
                                <input v-model="newFolderName" class="form-control d-inline-block w-auto" />
                            </td>
                            <td>--</td>
                            <td>Folder</td>
                            <td>{{ new Date().toLocaleString() }}</td>
                            <td>{{ new Date().toLocaleString() }}</td>
                            <td>
                                <button class="btn btn-sm btn-success me-1" @click="submitNewFolder">
                                    <i class="bi bi-check"></i>
                                </button>
                                <button class="btn btn-sm btn-secondary" @click="cancelNewFolder">
                                    <i class="bi bi-x"></i>
                                </button>
                            </td>
                        </tr>

                        <tr v-for="folder in filteredItems.folders" :key="folder.id">
                            <td @dblclick="selectFolder(folder)" class="cursor-pointer">
                                <i class="bi bi-folder-fill text-warning me-2"></i>
                                <template v-if="editingFolderId === folder.id">
                                    <input v-model="editedFolder.name" class="form-control d-inline-block w-auto" />
                                </template>
                                <template v-else>
                                    {{ folder.name }}
                                </template>
                            </td>

                            <td>--</td>
                            <td>Folder</td>
                            <td>{{ formatDate(folder.updatedAt) }}</td>
                            <td>{{ formatDate(folder.createdAt) }}</td>
                            <td>
                                <template v-if="editingFolderId === folder.id">
                                    <button class="btn btn-sm btn-success me-1" @click="submitRenameFolder(folder)">
                                        <i class="bi bi-check"></i>
                                    </button>
                                    <button class="btn btn-sm btn-secondary" @click="cancelRenameFolder">
                                        <i class="bi bi-x"></i>
                                    </button>
                                </template>
                                <template v-else>
                                    <button class="btn btn-sm btn-outline-primary me-1"
                                        @click="startRenameFolder(folder)">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger"
                                        @click="openDeleteFolderModal(folder.id)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </template>
                            </td>
                        </tr>

                        <DeleteModal ref="deleteFolderModalRef" modalId="deleteFolderModal" title="Delete Folder"
                            message="Are you sure you want to delete this folder?" :onConfirm="confirmFolderDelete" />


                        <!-- Files -->
                        <tr v-if="creatingNewFile">
                            <td>
                                <i class="bi bi-file-earmark-text me-2 text-secondary"></i>
                                <input v-model="newFile.name" class="form-control d-inline-block w-auto" />
                            </td>
                            <td>
                                <input v-model.number="newFile.sizeBytes" type="number"
                                    class="form-control d-inline-block w-auto" />
                            </td>
                            <td>
                                <input v-model="newFile.mimeType" class="form-control d-inline-block w-auto" />
                            </td>
                            <td>{{ new Date().toLocaleString() }}</td>
                            <td>{{ new Date().toLocaleString() }}</td>
                            <td>
                                <button class="btn btn-sm btn-success me-1" @click="submitNewFile">
                                    <i class="bi bi-check"></i>
                                </button>
                                <button class="btn btn-sm btn-secondary" @click="cancelNewFile">
                                    <i class="bi bi-x"></i>
                                </button>
                            </td>
                        </tr>

                        <tr v-for="file in filteredItems.files" :key="file.id">
                            <td>
                                <i class="bi bi-file-earmark-text me-2 text-secondary"></i>
                                <template v-if="editingFileId === file.id">
                                    <input v-model="editedFile.name" class="form-control d-inline-block w-auto" />
                                </template>
                                <template v-else>
                                    {{ file.name }}
                                </template>
                            </td>

                            <td>
                                <template v-if="editingFileId === file.id">
                                    <input v-model.number="editedFile.sizeBytes" type="number"
                                        class="form-control d-inline-block w-auto" />
                                </template>
                                <template v-else>
                                    {{ formatSize(file.sizeBytes) }}
                                </template>
                            </td>

                            <td>
                                <template v-if="editingFileId === file.id">
                                    <input v-model="editedFile.mimeType" class="form-control d-inline-block w-auto" />
                                </template>
                                <template v-else>
                                    {{ file.mimeType }}
                                </template>
                            </td>

                            <td>
                                {{ formatDate(file.createdAt) }}
                            </td>
                            <td>
                                {{ formatDate(file.updatedAt) }}
                            </td>

                            <td>
                                <template v-if="editingFileId === file.id">
                                    <button class="btn btn-sm btn-success me-1" @click="submitRenameFile(file)">
                                        <i class="bi bi-check"></i>
                                    </button>
                                    <button class="btn btn-sm btn-secondary" @click="cancelRenameFile">
                                        <i class="bi bi-x"></i>
                                    </button>
                                </template>
                                <template v-else>
                                    <button class="btn btn-sm btn-outline-primary me-1" @click="startRenameFile(file)">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="openDeleteFileModal(file.id)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </template>
                            </td>
                        </tr>

                        <DeleteModal ref="deleteFileModalRef" modalId="deleteFileModal" title="Delete File"
                            message="Are you sure you want to delete this file?" :onConfirm="confirmFileDelete" />

                        <!-- Empty state -->
                        <tr v-if="filteredItems.folders.length === 0 && filteredItems.files.length === 0">
                            <td colspan="5" class="text-center text-muted">No items found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Api from "../api";
import FolderTree from "../components/FolderTree.vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import DeleteModal from "../components/DeleteModal.vue";

interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    depth: number;
    children?: Folder[];
    expanded?: boolean;
    hasChildren?: boolean;
}
interface File {
    id: string;
    name: string;
    sizeBytes: number;
    createdAt: string;
    updatedAt: string;
    mimeType: string;
}

const rootFolders = ref<Folder[]>([]);
const selectedFolder = ref<Folder | null>(null);
const childFolders = ref<Folder[]>([]);
const breadcrumbPath = ref<Folder[]>([]);
const files = ref<File[]>([]);
const searchQuery = ref("");
const sortKey = ref("name");
const sortAsc = ref(true);
const history = ref<Folder[]>([]);
const historyIndex = ref(-1);
const deleteFolderModalRef = ref()
const deleteFileModalRef = ref()
const folderToDelete = ref<string | null>(null);
const fileToDelete = ref<string | null>(null);
const editingFolderId = ref<string | null>(null)
const editedFolder = ref({ name: "" })
const editingFileId = ref<string | null>(null)
const editedFile = ref<{ name: string; sizeBytes: number; mimeType: string }>({
    name: "",
    sizeBytes: 0,
    mimeType: "",
})
const creatingNewFolder = ref(false)
const creatingNewFile = ref(false)
const newFolderName = ref("")
const newFile = ref<{ name: string; sizeBytes: number; mimeType: string }>({
    name: "",
    sizeBytes: 0,
    mimeType: "",
})
const homeFolder: Folder = {
    id: "virtual-root",
    name: "Home",
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: "",
    depth: -1,
    expanded: true,
    hasChildren: true,
    children: [] 
};
const canGoBack = computed(() => historyIndex.value > 0);
const canGoForward = computed(() => historyIndex.value < history.value.length - 1);

onMounted(async () => {
    const res = await Api.get("/api/v1/folders/");
    const topFolders = res.data.content.filter((f: Folder) => f.depth === 0);

    homeFolder.children = topFolders.map((f: Folder) => ({
        ...f,
        expanded: false,
        hasChildren: true,
        children: [],
    }));

    rootFolders.value = [homeFolder];
    selectedFolder.value = homeFolder;
    breadcrumbPath.value = [homeFolder];
    childFolders.value = topFolders;
    files.value = [];

    history.value = [homeFolder];
    historyIndex.value = 0;
});

const fetchChildren = async (id: string) => {
    const res = await Api.get(`/api/v1/folders/id/${id}/children`);
    return res.data.content.map((f: Folder) => ({
        ...f,
        expanded: false,
        hasChildren: true,
        children: [],
    }));
};
;

const selectFolder = async (folder: Folder, fromHistory = false) => {
    if (folder.id === "virtual-root") {
        selectedFolder.value = folder;
        breadcrumbPath.value = [folder];

        const res = await Api.get("/api/v1/folders/");
        const topFolders = res.data.content.filter((f: Folder) => f.depth === 0);

        folder.children = topFolders.map((f: Folder) => ({
            ...f,
            expanded: false,
            hasChildren: true,
            children: [],
        }));

        childFolders.value = topFolders;
        files.value = [];

        if (!fromHistory) {
            history.value = [folder];
            historyIndex.value = 0;
        }
        return;
    }

    selectedFolder.value = folder;

    if (!fromHistory) {
        if (historyIndex.value < history.value.length - 1) {
            history.value = history.value.slice(0, historyIndex.value + 1);
        }
        history.value.push(folder);
        historyIndex.value++;
    }

    const path: Folder[] = [];
    let currentFolder: Folder | null = folder;
    while (currentFolder) {
        path.unshift(currentFolder);
        if (!currentFolder.parentId) break;

        try {
            const res = await Api.get(`/api/v1/folders/id/${currentFolder.parentId}`);
            currentFolder = res.data.content || null;
        } catch {
            break;
        }
    }

    if (path.length === 0 || path[0].id !== "virtual-root") {
        path.unshift({
            id: "virtual-root",
            name: "Home",
            parentId: null,
            createdAt: "",
            updatedAt: "",
            depth: -1,
            expanded: true,
            hasChildren: true,
            children: [],
        });
    }

    breadcrumbPath.value = path;

    const childrenRes = await fetchChildren(folder.id);
    childFolders.value = childrenRes;
    const fileRes = await Api.get(`/api/v1/folders/${folder.id}/files`);
    files.value = fileRes.data.content;
};

const filteredItems = computed(() => {
    const query = searchQuery.value.toLowerCase();
    let flds = childFolders.value.filter(f => f.name.toLowerCase().includes(query));
    let fls = files.value.filter(f => f.name.toLowerCase().includes(query));

    const sorter = (a: any, b: any) => {
        if (a[sortKey.value] < b[sortKey.value]) return sortAsc.value ? -1 : 1;
        if (a[sortKey.value] > b[sortKey.value]) return sortAsc.value ? 1 : -1;
        return 0;
    };

    return {
        folders: [...flds].sort(sorter),
        files: [...fls].sort(sorter),
    };
});

const sortBy = (key: string) => {
    if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value;
    } else {
        sortKey.value = key;
        sortAsc.value = true;
    }
};

const goToBreadcrumb = async (index: number) => {
    const folder = breadcrumbPath.value[index];
    if (!folder) return;

    if (index === 0) {
        history.value = [folder];
        historyIndex.value = 0;
        await selectFolder(folder, true);
    } else {
        await selectFolder(folder);
    }
};


const goBack = async () => {
    if (historyIndex.value > 0) {
        historyIndex.value--;
        const folder = history.value[historyIndex.value];
        await selectFolder(folder, true);
    }
};

const goForward = async () => {
    if (historyIndex.value < history.value.length - 1) {
        historyIndex.value++;
        const folder = history.value[historyIndex.value];
        await selectFolder(folder, true);
    }
};

const handleSearch = (query: string) => {
    searchQuery.value = query;
};

const openDeleteFolderModal = (id: string) => {
    folderToDelete.value = id
    deleteFolderModalRef.value?.show()
}

const openDeleteFileModal = (id: string) => {
    fileToDelete.value = id
    deleteFileModalRef.value?.show()
}

const confirmFolderDelete = async () => {
    if (!folderToDelete.value) return
    try {
        await Api.delete(`/api/v1/folders/${folderToDelete.value}`)
        if (selectedFolder.value) await selectFolder(selectedFolder.value)
    } catch (err) {
        console.error("Error deleting folder:", err)
    } finally {
        folderToDelete.value = null
        deleteFolderModalRef.value?.hide()
    }
}

const confirmFileDelete = async () => {
    if (!fileToDelete.value) return
    try {
        await Api.delete(`/api/v1/files/${fileToDelete.value}`)
        if (selectedFolder.value) await selectFolder(selectedFolder.value)
    } catch (err) {
        console.error("Error deleting file:", err)
    } finally {
        fileToDelete.value = null
        deleteFileModalRef.value?.hide()
    }
}

const startRenameFolder = (folder: Folder) => {
    editingFolderId.value = folder.id
    editedFolder.value = { name: folder.name }
}

const cancelRenameFolder = () => {
    editingFolderId.value = null
    editedFolder.value = { name: "" }
}

const submitRenameFolder = async (folder: Folder) => {
    try {
        await Api.patch(`/api/v1/folders/${folder.id}`, {
            name: editedFolder.value.name.trim(),
            updatedAt: new Date().toISOString()
        })
        await selectFolder(selectedFolder.value!)
    } catch (err) {
        console.error("Rename folder failed:", err)
    } finally {
        cancelRenameFolder()
    }
}

const startRenameFile = (file: File) => {
    editingFileId.value = file.id
    editedFile.value = {
        name: file.name,
        sizeBytes: file.sizeBytes,
        mimeType: file.mimeType,
    }
}

const cancelRenameFile = () => {
    editingFileId.value = null
    editedFile.value = { name: "", sizeBytes: 0, mimeType: "" }
}

const submitRenameFile = async (file: File) => {
    try {
        await Api.patch(`/api/v1/files/${file.id}`, {
            name: editedFile.value.name.trim(),
            sizeBytes: editedFile.value.sizeBytes,
            mimeType: editedFile.value.mimeType.trim(),
            updatedAt: new Date().toISOString()
        })
        await selectFolder(selectedFolder.value!)
    } catch (err) {
        console.error("Rename file failed:", err)
    } finally {
        cancelRenameFile()
    }
}

const createNewFolder = () => {
    creatingNewFolder.value = true
    newFolderName.value = ""
}

const createNewFile = () => {
    creatingNewFile.value = true
    newFile.value = { name: "", sizeBytes: 0, mimeType: "" }
}

const cancelNewFolder = () => {
    creatingNewFolder.value = false
    newFolderName.value = ""
}

const submitNewFolder = async () => {
    if (!newFolderName.value.trim() || !selectedFolder.value) return
    try {
        let newParentId = null;
        if (selectedFolder.value.parentId === 'virtual-root') {
            newParentId = null
        } else {
            newParentId = selectedFolder.value.id
        }
        await Api.post("/api/v1/folders/", {
            name: newFolderName.value.trim(),
            parentId: newParentId,
            depth: selectedFolder.value.depth + 1,
            updatedAt: new Date().toISOString()
        })
        await selectFolder(selectedFolder.value)
    } catch (err) {
        console.error("Error creating folder:", err)
    } finally {
        cancelNewFolder()
    }
}

const cancelNewFile = () => {
    creatingNewFile.value = false
    newFile.value = { name: "", sizeBytes: 0, mimeType: "" }
}

const submitNewFile = async () => {
    const { name, sizeBytes, mimeType } = newFile.value;

    if (!name.trim() || !selectedFolder.value) return;

    try {
        await Api.post("/api/v1/files/", {
            name: name.trim(),
            sizeBytes,
            mimeType: mimeType.trim(),
            folderId: selectedFolder.value.id,
            updatedAt: new Date().toISOString()

        });
        await selectFolder(selectedFolder.value);
    } catch (err) {
        console.error("Error creating file:", err);
    } finally {
        cancelNewFile();
    }
};

// Helpers
const formatSize = (bytes: number) => (bytes ? `${(bytes / 1024).toFixed(1)} KB` : "--");
const formatDate = (d: string) => new Date(d).toLocaleString();
</script>

<style scoped>
.sortable {
    cursor: pointer;
    user-select: none;
}

.cursor-pointer {
    cursor: pointer;
}
</style>
