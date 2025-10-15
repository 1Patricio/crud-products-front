<template>
    <q-header elevated>
        <q-toolbar style="background-color: #348A65;">
            <q-icon name="arrow_back" class="cursor-pointer q-ml-lg" size="16px" @click="$router.push('/')"></q-icon>
            <q-toolbar-title class="text-center text-bold">Inmeta</q-toolbar-title>
            <div style="width: 40px;"></div>
        </q-toolbar>
    </q-header>
    <q-card v-if="productStore.isLoading" class="q-ma-md">
        <q-card-section>
            <TodoSpinner />
        </q-card-section>
    </q-card>

    <q-page padding class="q-pa-lg">
        <q-card class="q-my-md q-mx-auto" style="max-width: 800px; text-align: center;">
            <q-card-section>
                <div class="text-subtitle1"><b>Produto: </b>{{ product?.name }}</div>
                <div><b>Descrição: </b>{{ product?.description }}</div>
                <div><b>Quantidade: </b>{{ product?.quantity }}</div>
                <br><br>
                <div class="text-italic text-blue-grey-10">Criado em: {{ formattedDate }}</div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import TodoSpinner from './TodoSpinner.vue'

const route = useRoute()
const productStore = useProductStore()
const product = ref<any>(null)
const formattedDate = ref("")

onMounted(async () => {
    const id = route.params.id as string
    if (id) {
        product.value = await productStore.getProductById(id)

        const date = new Date(product.value.createdAt)
        formattedDate.value = date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }
})
</script>