<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Coffee, Mail, Lock, LogIn, Loader2 } from 'lucide-vue-next'

const isLoading = ref(false)
const errorMessage = ref('')

const formLoginSchema = toTypedSchema(
  z.object({
    email: z.string().email('Mohon masukkan email yang valid').min(1, 'Email wajib diisi').max(100),
    password: z.string().min(1, 'Password wajib diisi').max(100),
  }),
)
const formLogin = useForm({
  validationSchema: formLoginSchema,
})

const authStore = useAuthStore()

const onSubmit = formLogin.handleSubmit(async (values) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await authStore.login(values.email, values.password)
  } catch (error: any) {
    if (error.response?.data?.msg) {
      errorMessage.value = error.response.data.msg
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Email atau password salah'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden font-sans selection:bg-hijau/30 selection:text-hijau"
  >
    <!-- Sophisticated Background -->
    <div class="fixed inset-0 z-0">
      <img
        src="/images/login-bg.png"
        alt="Coffee Shop Background"
        class="h-full w-full object-cover opacity-40 scale-105 animate-pulse-slow"
      />
      <div class="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-transparent"></div>
    </div>

    <!-- Login Container -->
    <div class="relative z-10 w-full max-w-md px-6 py-12">
      <!-- Brand Logo / Header -->
      <div class="mb-10 flex flex-col items-center text-center">
        <div
          class="group mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-hijau to-hijautua shadow-2xl shadow-hijau/30 transition-transform duration-500 hover:rotate-12"
        >
          <img src="/images/logo-cup-white.webp" alt="Logo" class="w-14 h-14 object-cover" />
        </div>
        <h1 class="text-4xl font-bold tracking-tight text-white drop-shadow-sm">
          Kopikan
          <span class="bg-gradient-to-r from-hijau to-hijautua bg-clip-text text-transparent"
            >Management</span
          >
        </h1>
        <p class="mt-3 text-lg font-medium text-zinc-400">Login to your account</p>
      </div>

      <!-- Glassmorphism Card -->
      <Card
        class="border-white/10 bg-white backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:border-hijau/30"
      >
        <!-- <CardHeader class="pb-2 space-y-1">
          <CardTitle class="text-2xl font-bold text-white tracking-tight">Login</CardTitle>
          <CardDescription class="text-zinc-400 font-medium"
            >Masuk untuk mengelola kedai kopimu</CardDescription
          >
        </CardHeader> -->
        <CardContent>
          <div
            v-if="errorMessage"
            class="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm font-medium text-rose-500 animate-in fade-in slide-in-from-top-1"
          >
            {{ errorMessage }}
          </div>
          <form @submit.prevent="onSubmit" class="space-y-6 pt-4">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem class="group/field space-y-2">
                <FormLabel
                  class="font-semibold ml-1 transition-colors group-focus-within/field:text-hijau"
                  >Email</FormLabel
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500 group-focus-within/field:text-hijau transition-colors"
                  >
                    <Mail class="h-5 w-5" />
                  </div>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="email"
                      placeholder="admin@kopikan.com"
                      class="border-white/10 pl-11 h-12 placeholder:text-zinc-600 focus:border-hijau/50 focus:ring-hijau/20 transition-all rounded-xl border-2"
                    />
                  </FormControl>
                </div>
                <FormMessage
                  class="text-rose-400 font-medium px-1 animate-in fade-in slide-in-from-top-1"
                />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem class="group/field space-y-2">
                <div class="flex items-center justify-between pb-1 ml-1">
                  <FormLabel
                    class="font-semibold transition-colors group-focus-within/field:text-hijau"
                    >Password</FormLabel
                  >
                  <!-- <a
                    href="#"
                    class="text-xs text-hijau hover:text-hijautua transition-colors font-bold uppercase tracking-wider"
                    >Lupa Password?</a
                  > -->
                </div>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500 group-focus-within/field:text-hijau transition-colors"
                  >
                    <Lock class="h-5 w-5" />
                  </div>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="password"
                      placeholder="••••••••"
                      class="border-white/10 pl-11 h-12 placeholder:text-zinc-600 focus:border-hijau/50 focus:ring-hijau/20 transition-all rounded-xl border-2"
                    />
                  </FormControl>
                </div>
                <FormMessage
                  class="text-rose-400 font-medium px-1 animate-in fade-in slide-in-from-top-1"
                />
              </FormItem>
            </FormField>

            <Button
              class="relative w-full h-12 !bg-gradient-to-r from-hijau to-hijautua hover:brightness-110 text-white font-bold transition-all duration-300 shadow-[0_10px_20px_rgba(54,205,29,0.2)] group overflow-hidden rounded-xl border-none active:scale-[0.98]"
              type="submit"
              :disabled="isLoading"
            >
              <div class="flex items-center justify-center gap-2">
                <template v-if="!isLoading">
                  <LogIn class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <span class="text-base">Login</span>
                </template>
                <template v-else>
                  <Loader2 class="h-5 w-5 animate-spin" />
                  <span class="text-base">Loading...</span>
                </template>
              </div>
            </Button>

            <div class="mt-6 text-center text-sm text-zinc-500 font-medium">
              Belum punya akun?
              <a
                href="#"
                class="text-hijau hover:text-white transition-colors font-bold ml-1 border-b border-transparent hover:border-hijau"
                >Hubungi Admin</a
              >
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse-slow 20s infinite alternate ease-in-out;
}

@keyframes pulse-slow {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.15);
  }
}

/* Custom transitions for form inputs */
:deep(.form-field-enter-active),
:deep(.form-field-leave-active) {
  transition: all 0.3s ease;
}
</style>
