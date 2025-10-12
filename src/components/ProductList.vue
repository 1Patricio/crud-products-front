<template>
  <q-header elevated>
    <q-toolbar style="background-color: #348A65;">
      <q-toolbar-title class="text-center text-bold">
        Inmeta
      </q-toolbar-title>
    </q-toolbar>
  </q-header>

  <q-page padding class="q-pa-md">
    <q-card class="q-mx-xl q-ma-md">
      <q-card-section>
        <q-form ref="formRef" @submit.prevent="handleSubmit" class="q-gutter-md">
          <q-input v-model="form.name" label="Produto" outlined :rules="[val => val.length > 0 || 'Insira um nome de produto']" hide-bottom-space />
          <q-input v-model="form.description" label="Descrição" outlined />
          <q-input v-model="form.quantity" label="Quantidade" type="number" outlined />
          <q-btn type="submit" :label="editId ? 'Atualizar' : 'Adicionar'" color="primary" />
          <q-btn v-if="editId" label="Cancelar" color="orange" type="cancel"></q-btn>
        </q-form>
      </q-card-section>
    </q-card>

    <q-input outlined dense v-model="search" label="Buscar por nome" class="bg-white q-px-xl" style="width: 400px;">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-card v-if="productStore.isLoading" class="q-ma-xl">
      <q-card-section>
        <TodoSpinner class="" />
      </q-card-section>
    </q-card>

    <q-list v-else class="q-mx-xl q-ma-md">
      <q-item v-for="product in filteredProducts" :key="product.id" clickable>

        <q-item-section clickable @click="viewProduct(product)">
          <div class="text-subtitle1">
            <b>Produto: </b>{{ product.name }}
          </div>
          <div>
            <b>Descrição: </b> {{ product.description }}
          </div>
          <div>
            <b>Quantidade: </b> {{ product.quantity }}
          </div>
        </q-item-section>

        <q-item-section side>
          <div class="row items-center q-gutter-sm">
            <q-btn flat round icon="edit" color="orange" @click="editProduct(product)" />
            <q-btn flat round icon="delete" color="negative" @click="() => deleteProduct(product.id)" />
          </div>
        </q-item-section>
        <q-separator spaced />
      </q-item>

      <q-dialog v-model="showModal" persistent>
        <q-card style="width: 400px; height: 520px; display: flex; flex-direction: column;">
          <q-card-section>
            <div class="text-h6 text-center q-ma-md">{{ selectedItem?.name }}</div>
            <q-separator spaced />
            <div class="text-body1"><b>Quantidade: </b>{{ selectedItem?.quantity }}</div>
            <div class="text-body1"><b>Descrição: </b>{{ selectedItem?.description }}</div>
          </q-card-section>

          <q-space />
          <q-separator spaced />

          <q-card-actions align="between">
            <div class="text-italic text-blue-grey-10 text-left">Criado em {{ formattedDate }}</div>
            <q-btn flat label="Fechar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-list>
  </q-page>
</template>

<script setup lang="ts">
let dataAtual = new Date()

import { ref, onMounted, computed } from "vue";
import { useProductStore } from "../stores/productStore";
import type { Product } from "../models/Product";
import TodoSpinner from "./TodoSpinner.vue";
import { QForm } from "quasar";

const productStore = useProductStore();
const formRef = ref<QForm | null>(null)
const form = ref<Product>({ id: "", name: "", description: "", quantity: 0, createdAt: dataAtual });
const editId = ref<string | null>(null);
const showModal = ref(false)
const selectedItem = ref<Product | null>(null)
const formattedDate = ref("")
const search = ref("")

function viewProduct(product: Product) {
  selectedItem.value = product
  showModal.value = true

  const date = new Date(selectedItem.value.createdAt)
  formattedDate.value = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

onMounted(() => {
  productStore.getProducts()
});

function handleSubmit() {
  if (editId.value) {
    productStore.editProduct(editId.value, form.value);
  } else {
    productStore.addProduct(form.value);
  }
  form.value = { id: "", name: "", description: "", quantity: 0, createdAt: dataAtual };
  formRef.value?.reset();
  editId.value = null;
}

const filteredProducts = computed(() => {
  if (!search.value) return productStore.products
  return productStore.products.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

function editProduct(product: Product) {
  editId.value = product.id;
  form.value = { ...product };
}

function deleteProduct(id: string) {
  productStore.deleteProduct(id);
}
</script>