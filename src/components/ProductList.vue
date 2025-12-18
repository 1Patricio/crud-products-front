<template>
  <q-header elevated>
    <q-toolbar class="q-pa-md" style="background-color: #348A65;">
      <q-btn 
        flat 
        round 
        dense 
        icon="assignment_ind"
      >
        <q-menu>
          <div class="row no-wrap q-pa-md column items-center">
            <p class="text-subtitle1 q-mt-md q-mb-xs">{{ usuarioLogado?.nome }}</p>
            <q-btn 
              v-close-popup 
              push 
              color="primary" 
              label="Sair" 
              size="sm" 
              @click="logout()"
            />
          </div>
        </q-menu>
      </q-btn>

      <q-toolbar-title class="text-center text-bold">
        Inmeta
      </q-toolbar-title>

    </q-toolbar>
  </q-header>

  <q-page padding class="q-pa-md">
    <q-card class="q-mx-xl q-ma-md">
      <q-card-section>
        <q-form ref="formRef" @submit.prevent="handleSubmit" class="q-gutter-md">
          <q-input 
            outlined
            hide-bottom-space
            v-model="form.name" 
            label="Produto" 
            :rules="[(val: string) => val.length > 0 || 'Insira um nome de produto']" 
          />
          <q-input
            outlined 
            hide-bottom-space
            v-model="form.description" 
            label="Descrição" 
            :rules="[(val: string) => val.length < 800 || 'Limite de 800 caracteres']" 
          />
          <q-input 
            outlined
            v-model="form.quantity" 
            label="Quantidade" 
            type="number"  
          />
          <q-btn 
            type="submit" 
            :label="editId ? 'Atualizar' : 'Adicionar'" 
            color="primary" 
          />
          <q-btn 
            v-if="editId" 
            label="Cancelar" 
            color="orange" 
            type="cancel"
          />
        </q-form>
      </q-card-section>
    </q-card>

    <q-input 
      outlined 
      dense 
      v-model="search" 
      label="Buscar por nome" 
      class="bg-white q-px-xl" 
      style="width: 400px;"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-card v-if="productStore.isLoading" class="q-ma-xl">
      <q-card-section>
        <TodoSpinner />
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
            <q-btn 
              flat 
              round 
              icon="edit" 
              color="orange" 
              @click="editProduct(product)" 
            />
            <q-btn 
              flat 
              round 
              icon="delete" 
              color="negative" 
              @click="() => deleteProduct(product.id)" 
            />
          </div>
        </q-item-section>
        <q-separator spaced />
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, onMounted, computed } from "vue";
import { useProductStore } from "../stores/productStore";
import type { Product } from "../models/Product";
import TodoSpinner from "./TodoSpinner.vue";
import { QForm } from "quasar";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from 'vue-router'

let dataAtual = new Date()

const usuarioLogado = ref<{ id: string; nome: string; email: string; password?: string; createdAt: Date } | null>(null)
const productStore = useProductStore();
const formRef = ref<QForm | null>(null)
const form = ref<Product>({ id: "", name: "", description: "", quantity: 0, createdAt: dataAtual, createdByUser: usuarioLogado!.value?.id! });
const editId = ref<string | null>(null);
const selectedItem = ref<Product | null>(null)
const formattedDate = ref("")
const search = ref("")
const auth = useAuthStore();
const router = useRouter()
const $q = useQuasar()

onMounted(async () => {
  usuarioLogado.value = await auth.getUserCurrent()
  
  await productStore.getProducts()
});

function viewProduct(product: Product) {
  selectedItem.value = product

  const date = new Date(selectedItem.value.createdAt)
  formattedDate.value = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })

  $q.dialog({
    persistent:true,
    html: true, 
    style: "width: 540px; height: 620px; display: flex; flex-direction: column; justify-content: flex-end;",
    title: `<h6 class="text-center q-ma-md">${product.name}</h6> <hr/>`,
    message: `
    <div style = "height: 440px">
      <div style = "margin-bottom: 20px; word-break: break-word;">
        <b>Quantidade:</b> ${product.quantity}<br>
        <b>Descrição:</b> ${product.description}
      </div>
      <div>
        <hr/>
        <div style = "font-style: italic; color: grey; align-items: end;">
          Criado em ${formattedDate.value}
        </div>    
      </div>
    </div>
    `,
    ok: {
      label: 'Fechar',
      color: 'primary',
    },
  })
}

function handleSubmit() {
  if (editId.value) {
    form.value.createdByUser = usuarioLogado.value?.id!
    productStore.editProduct(editId.value, form.value);
  } else {
    form.value.createdByUser = usuarioLogado.value?.id!
    productStore.addProduct(form.value);
  }
  form.value = { id: "", name: "", description: "", quantity: 0, createdAt: dataAtual, createdByUser: usuarioLogado.value?.id!};
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
  $q.dialog({
    title: 'Confirmação Necessária',
    message: 'Tem certeza de que deseja deletar este item?',
    cancel: {
      label: 'Cancelar',
      color: 'primary',
      outline: true,
    },
    ok: {
      label: 'Deletar',
      color: 'negative',
      push: true,
    },
    persistent: true, 
  }).onOk(() => {
    productStore.deleteProduct(id)
  })
}

async function logout(){
  await auth.logout()
  router.push('/login')
}
</script>