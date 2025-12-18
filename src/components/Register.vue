<template>
  <q-page 
    class="row justify-center items-center window-height" 
    style="background-color: #348A65;"
  >
    <q-card 
      square bordered 
      class="q-pa-lg shadow-1b col-10 col-sm-8 col-md-5 col-lg-4"
    >
      <q-card-section class="flex items-center justify-center q-pa-none">
        <img src="../../src/assets/img/logo.png" alt="Logo Inmeta" class=" q-mr-sm" style="height: 24px;">
        <h5 class="text-h5 text-black text-bold m-0">Teste Técnico</h5>
      </q-card-section>

      <q-card-section class="column items-start q-pa-none q-gutter-y-xs q-ml-sm">
        <h6 class="text-h5 text-green-10 text-bold q-mb-none">Cadastrar</h6>
        <p class="text-grey-9 q-mb-none">Faça o cadastro da sua conta</p>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input 
            outlined 
            hide-bottom-space 
            square 
            clearable 
            v-model="nome" 
            type="text" 
            label="Nome"
            :rules="[val => requiredField(val, 'Nome')]"
          />
          <q-input 
            outlined
            hide-bottom-space 
            square
            clearable
            v-model="email" 
            type="email" 
            label="Email" 
            :rules="[val => requiredField(val, 'Email')]"
          />
          <q-input 
            outlined 
            hide-bottom-space 
            square 
            v-model="password" 
            type="password" 
            label="Senha" 
            :rules="[val => requiredField(val, 'Senha'), val => minLength(val, 6, 'Senha')]"
          />
        </q-form>
      </q-card-section>

      <q-card-section v-if="error" class="text-center q-pa-none">
        <p class="text-red-6">{{ error }}</p>
      </q-card-section>

      <q-card-actions class="q-px-md">
        <q-btn 
          unelevated 
          color="light-green-7" 
          size="sm" 
          class="full-width" 
          label="Cadastrar" 
          @click="handleSubmit()" 
          :disable="isDisabled"
        />
        <q-btn 
          unelevated 
          color="primary" 
          size="sm" 
          class="full-width q-mt-sm" 
          label="Já tenho uma conta"
          @click="returnLogin()" 
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const nome = ref('')
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const isDisabled = computed(() => {
  const anyEmpty = !nome.value || !email.value || !password.value
  const shortPassword = password.value.length > 0 && password.value.length < 6
  return anyEmpty || shortPassword
})


async function handleSubmit() {
  error.value = null

  if(!nome || !email || !password) error.value = "Erro"

  try {
    await auth.register(nome.value, email.value, password.value)

    try {
      await auth.login(email.value, password.value)
      router.push('/')
    } catch (err: any) {
      error.value = err?.message || 'Erro ao cadastrar'
    }
  } catch (err: any) {
    error.value = err?.message || 'Erro ao cadastrar'
  }
}

async function returnLogin() {
  error.value = null

  try {
    router.push('/login')
  } catch (err: any) {
    error.value = err?.message || 'Erro ao retornar ao login'
  }
}

function requiredField(val: string, fieldName = 'Campo') {
  return val.length > 0 || `${fieldName} é obrigatório`
}

function minLength(val: string, length = 6, fieldName = 'Senha') {
  return val.length >= length || `${fieldName} deve ter no mínimo ${length} caracteres`
}
</script>