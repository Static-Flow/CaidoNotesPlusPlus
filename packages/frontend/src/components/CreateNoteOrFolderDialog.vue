<script setup lang="ts">
import {ref, inject, onMounted} from "vue";
import InputText from "primevue/inputtext";

const dialogRef = inject("dialogRef");

onMounted(() => {
  console.log("DIALOG BUILT")

});

const newNoteNameValue = ref(dialogRef.value.data.currentName)


const CreateNewNoteOrFolder = (data) => {
  dialogRef.value.close(data);
};

const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
};

</script>

<template>
  <div style="margin-top:0.25em">
  <div class="flex items-center gap-4 mb-4 p-primary-color">
    <InputText v-focus id="NoteOrFolderName" autofocus v-model="newNoteNameValue" class="flex-auto p-text-color" v-on:keyup.enter="CreateNewNoteOrFolder(newNoteNameValue)" autocomplete="off" />
  </div>
  <div class="flex justify-end gap-2">
    <Button type="button" label="Cancel" severity="secondary" @click="CreateNewNoteOrFolder(null)">Cancel</Button>
    <Button type="button" label="Save" @click="CreateNewNoteOrFolder(newNoteNameValue)">Save</Button>
  </div>
  </div>
</template>

<style scoped>

</style>