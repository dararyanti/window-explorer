<template>
    <div class="modal fade" :id="modalId" tabindex="-1" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>{{ message }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="handleConfirm">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps<{
    modalId: string
    title: string
    message: string
    onConfirm: () => void
}>()

const modalRef = ref<HTMLElement | null>(null)
let modalInstance: Modal | null = null

onMounted(() => {
    if (modalRef.value) {
        modalInstance = new Modal(modalRef.value)
    }
})

const show = () => {
    modalInstance?.show()
}

const hide = () => {
    modalInstance?.hide()
}

const handleConfirm = () => {
    props.onConfirm()
    hide()
}

defineExpose({
    show,
    hide
})
</script>
