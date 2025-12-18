<template>
  <q-page class="row justify-center items-center window-height" style="background-color: #348A65;">
    <q-card square bordered class="q-pa-lg shadow-1b col-10 col-sm-8 col-md-5 col-lg-4">
      <q-card-section class="flex items-center justify-center q-pa-none">
        <img src="../../src/assets/img/logo.png" alt="Logo Inmeta" class="q-mr-sm" style="height: 24px;">
        <h5 class="text-h5 text-black text-bold">Teste Técnico</h5>
      </q-card-section>

      <q-card-section class="column items-start q-pa-none q-gutter-y-xs q-ml-sm">
        <h6 class="text-h5 text-green-10 text-bold q-mb-none">Entrar</h6>
        <p class="text-grey-9 q-mb-none">Faça o login na sua conta</p>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input 
            outlined 
            square 
            clearable 
            hide-bottom-space
            v-model="email" 
            type="email" 
            label="Email" 
            :rules="[(val: string) => val.length > 0 || 'O e-mail é obrigatório']"  
          />
          <q-input 
            outlined 
            square 
            hide-bottom-space
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
          label="Login" 
          :disable="isDisabled"
          @click="handleSubmit()" 
        />
      </q-card-actions>

      <q-card-section class="q-pa-none q-mt-md">
        <p class="text-grey-7">Não é registrado?</p>
      </q-card-section>

      <q-card-actions class="q-px-lg q-pa-none ">
        <q-btn 
          unelevated 
          color="light-blue-10" 
          size="sm" 
          class="full-width" 
          label="Crie sua conta"
          @click="router.push('/register')" 
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

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

  const isDisabled = computed(() => {
  const anyEmpty = !email.value || !password.value
  const shortPassword = password.value.length > 0 && password.value.length < 6
  return anyEmpty || shortPassword
})

async function handleSubmit() {
  error.value = null
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (err: any) {
    error.value = err?.message || 'Erro ao autenticar'
  }
}

function requiredField(val: string, fieldName = 'Campo') {
  return val.length > 0 || `${fieldName} é obrigatório`
}

function minLength(val: string, length = 6, fieldName = 'Senha') {
  return val.length >= length || `${fieldName} deve ter no mínimo ${length} caracteres`
}
</script>