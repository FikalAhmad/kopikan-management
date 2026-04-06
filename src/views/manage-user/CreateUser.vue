<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'vue-router'
import { axiosJWT } from '@/lib/axios'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const isSubmitting = ref(false)
const showPassword = ref(false)

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Full name is required').max(100),
    password: z.string().min(5, { message: 'Password must be at least 5 characters' }).max(100),
    email: z.string().email({ message: 'A valid email is required' }),
    phone: z.string().min(1, 'Phone number is required').max(15),
    role_id: z.string().min(1, 'Please assign a role'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    email: '',
    password: '',
    phone: '',
    role_id: '',
  },
})

const roleData = ref<Array<{ id: string; role_name: string }>>([])

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true
  try {
    const success = await userStore.createUser(values)
    if (success) {
      router.push('/user')
    }
  } catch (err) {
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
})

onMounted(async () => {
  try {
    const response = await axiosJWT.get('/api/roles')
    if (response.data) {
      roleData.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="p-6 w-full mx-auto space-y-6 overflow-y-auto scrollbar-hide">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-10">
      <div class="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          @click="goBack"
          class="rounded-full h-11 w-11 border-muted-foreground/20 hover:bg-muted transition-all active:scale-90"
        >
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <div>
          <h1 class="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            Onboard Member
            <Sparkles class="h-5 w-5 text-hijau" />
          </h1>
          <p class="text-sm text-slate-500 font-medium">
            Grant system access and define operational responsibilities.
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Info / Tips Sidebar -->
      <div class="lg:col-span-1 space-y-6 flex flex-col order-2 lg:order-1">
        <Card
          class="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-hijau/10 via-white to-white h-full"
        >
          <CardHeader class="pb-2">
            <div
              class="h-16 w-16 rounded-3xl bg-hijau/20 flex items-center justify-center mb-6 border border-hijau/20 shadow-inner group-hover:scale-110 transition-transform duration-500"
            >
              <UserPlus class="h-8 w-8 text-hijau" />
            </div>
            <CardTitle class="text-2xl font-black">Registration Hub</CardTitle>
            <CardDescription class="text-sm font-medium"
              >Standard onboarding procedures.</CardDescription
            >
          </CardHeader>
          <CardContent class="space-y-8 pt-6">
            <div class="space-y-6">
              <div class="flex gap-4 group">
                <div
                  class="mt-1 h-6 w-6 rounded-lg bg-hijau/10 flex items-center justify-center flex-shrink-0 group-hover:bg-hijau group-hover:text-white transition-colors"
                >
                  <CheckCircle2
                    class="h-4 w-4 text-hijau group-hover:text-white transition-colors"
                  />
                </div>
                <div>
                  <h4 class="text-sm font-bold">Secure Credentials</h4>
                  <p class="text-xs text-slate-500 leading-relaxed mt-1">
                    Passswords must be unique and complex to prevent unauthorized access.
                  </p>
                </div>
              </div>

              <div class="flex gap-4 group">
                <div
                  class="mt-1 h-6 w-6 rounded-lg bg-hijau/10 flex items-center justify-center flex-shrink-0 group-hover:bg-hijau group-hover:text-white transition-colors"
                >
                  <CheckCircle2
                    class="h-4 w-4 text-hijau group-hover:text-white transition-colors"
                  />
                </div>
                <div>
                  <h4 class="text-sm font-bold">Role-Based Access</h4>
                  <p class="text-xs text-slate-500 leading-relaxed mt-1">
                    Assign 'Admin' for full control or 'Staff' for daily operations only.
                  </p>
                </div>
              </div>
            </div>

            <div
              class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3 items-start mt-8"
            >
              <Info class="h-5 w-5 text-hijau mt-0.5 shrink-0" />
              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                Tip: After creation, an automated welcome email will be queued (if configured)
                allowing users to verify their identities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Main Registration Form -->
      <Card
        class="lg:col-span-2 shadow-2xl border-slate-200 bg-white/40 backdrop-blur-md order-1 lg:order-2 rounded-3xl"
      >
        <CardHeader class="pb-4">
          <CardTitle class="text-xl font-black flex items-center gap-2">
            Identity & Auth
          </CardTitle>
          <CardDescription class="font-medium text-slate-400"
            >Configure core profile data and security settings.</CardDescription
          >
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Name Field -->
              <FormField v-slot="{ componentField }" name="name">
                <FormItem class="md:col-span-2">
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-500 mb-3"
                  >
                    <User class="h-3.5 w-3.5 text-hijau" />
                    Preferred Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="e.g. Ahmad Fikal"
                      class="bg-white/50 border-slate-200 focus-visible:ring-hijau/20 h-12 rounded-2xl transition-all font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Email Field -->
              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-500 mb-3"
                  >
                    <Mail class="h-3.5 w-3.5 text-hijau" />
                    Contact Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="email"
                      placeholder="fikal@kopikan.com"
                      class="bg-white/50 border-slate-200 focus-visible:ring-hijau/20 h-12 rounded-2xl transition-all font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Phone Field -->
              <FormField v-slot="{ componentField }" name="phone">
                <FormItem>
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-500 mb-3"
                  >
                    <Phone class="h-3.5 w-3.5 text-hijau" />
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="text"
                      placeholder="08123456789"
                      class="bg-white/50 border-slate-200 focus-visible:ring-hijau/20 h-12 rounded-2xl transition-all font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Password Field -->
              <FormField v-slot="{ componentField }" name="password">
                <FormItem>
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-500 mb-3"
                  >
                    <Lock class="h-3.5 w-3.5 text-hijau" />
                    Security Key
                  </FormLabel>
                  <FormControl>
                    <div class="relative group">
                      <Input
                        v-bind="componentField"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="••••••••"
                        class="bg-white/50 border-slate-200 focus-visible:ring-hijau/20 h-12 rounded-2xl transition-all pr-12 font-semibold"
                      />
                      <button
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-hijau transition-colors focus:outline-none"
                        @click="showPassword = !showPassword"
                      >
                        <component :is="showPassword ? EyeOff : Eye" class="h-4 w-4" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Role Field -->
              <FormField v-slot="{ componentField }" name="role_id">
                <FormItem>
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-500 mb-3"
                  >
                    <Shield class="h-3.5 w-3.5 text-hijau" />
                    User Authority
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger
                        class="w-full bg-white/50 border-slate-200 focus:ring-hijau/20 h-12 rounded-2xl shadow-sm font-semibold"
                      >
                        <SelectValue placeholder="Select responsibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem v-for="role in roleData" :key="role.id" :value="role.id">
                            {{ role.role_name }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                @click="goBack"
                class="hover:bg-destructive/10 hover:text-destructive transition-all px-8 rounded-2xl font-bold h-12"
              >
                Discard
              </Button>
              <Button
                class="w-full md:w-auto px-12 h-12 bg-hijau hover:bg-hijautua text-white font-black shadow-xl shadow-hijau/20 transition-all hover:scale-[1.03] active:scale-[0.97] rounded-2xl"
                type="submit"
                :disabled="isSubmitting"
              >
                <UserPlus v-if="!isSubmitting" class="h-5 w-5 mr-2" />
                <span
                  v-else
                  class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
                ></span>
                {{ isSubmitting ? 'Verifying...' : 'Onboard Now' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
