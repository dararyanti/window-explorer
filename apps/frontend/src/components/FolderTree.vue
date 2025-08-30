<template>
  <div>
    <div class="d-flex align-items-center cursor-pointer py-1" @click="handleClick(folder)">
      <!-- Dropdown Arrow -->
      <i v-if="folder.hasChildren" :class="folder.expanded ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"
        style="width: 16px"></i>
      <span v-else style="width: 16px"></span>

      <!-- Folder Icon -->
      <i :class="folder.name.toLowerCase() === 'home'
        ? 'bi bi-house-door'
        : (folder.expanded ? 'bi bi-folder2 text-warning ms-1' : 'bi bi-folder text-warning ms-1')" />

      <!-- Folder Name -->
      <span class="ms-2">{{ folder.name }}</span>
    </div>

    <div v-if="folder.expanded" class="ms-4">
      <FolderTree v-for="child in folder.children" :key="child.id" :folder="child" :load-children="loadChildren"
        @select="$emit('select', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">

interface Folder {
  id: string;
  name: string;
  children?: Folder[];
  expanded?: boolean;
  hasChildren?: boolean;
}

const props = defineProps<{
  folder: Folder;
  loadChildren: (id: string) => Promise<Folder[]>;
}>();

const emit = defineEmits<{
  (e: "select", folder: Folder): void;
}>();

const handleClick = async (folder: Folder) => {
  if (typeof folder.expanded === "undefined") {
    folder.expanded = false;
  }

  if (folder.expanded) {
    folder.expanded = false;
  } else {
    folder.expanded = true;

    if (!folder.children || folder.children.length === 0) {
      const loadedChildren = await props.loadChildren(folder.id);
      folder.children = loadedChildren.map((c) => ({
        ...c,
        hasChildren: c.hasChildren ?? true,
        expanded: false,
        children: c.children ?? [],
      }));
    }
  }

  emit("select", folder);
};

</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
