<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/store/useUserStore'
import { useRoute, useRouter } from 'vue-router'
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
  UserCheck,
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Info,
  ShieldCheck,
  Settings2,
  Save,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const userId = route.params.id as string
const isSubmitting = ref(false)
const showPassword = ref(false)

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(1, 'Phone number is required').max(15),
    role_id: z.string().min(1, 'Please select a role'),
    password: z.string().optional(), // Password is optional on Edit
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const roleData = ref<Array<{ id: string; role_name: string }>>([])

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true
  try {
    const success = await userStore.updateUser(userId, values)
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
    const roleResponse = await axiosJWT.get('/api/roles')
    if (roleResponse.data) {
      roleData.value = roleResponse.data.data
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }

  const user = userStore.users?.data.find((u) => u.id === userId)
  if (user) {
    form.setValues({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role_id: user.role_id,
    })
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
          class="rounded-full h-11 w-11 border-muted-foreground/20 hover:bg-muted transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <div>
          <h1 class="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            Update Profile
            <Settings2 class="h-5 w-5 text-hijau" />
          </h1>
          <p class="text-sm font-medium text-slate-500">
            Modify user properties and permission levels.
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Info Sidebar -->
      <div class="lg:col-span-1 space-y-6 flex flex-col order-2 lg:order-1">
        <Card
          class="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-hijau/10 via-white to-white h-full rounded-3xl"
        >
          <CardHeader>
            <div
              class="h-16 w-16 rounded-3xl bg-hijau/20 flex items-center justify-center mb-6 border border-hijau/20 shadow-inner"
            >
              <UserCheck class="h-8 w-8 text-hijau" />
            </div>
            <CardTitle class="text-2xl font-black tracking-tighter">Profile Access</CardTitle>
            <CardDescription class="font-medium"
              >Maintain security and data integrity.</CardDescription
            >
          </CardHeader>
          <CardContent class="space-y-8 pt-4">
            <div class="space-y-6">
              <div class="flex gap-4 group">
                <div
                  class="mt-1 h-6 w-6 rounded-lg bg-hijau/10 flex items-center justify-center flex-shrink-0 group-hover:bg-hijau transition-colors"
                >
                  <ShieldCheck
                    class="h-4 w-4 text-hijau group-hover:text-white transition-colors"
                  />
                </div>
                <div>
                  <h4 class="text-sm font-bold">Privilege Update</h4>
                  <p class="text-xs text-slate-500 leading-relaxed mt-1">
                    Changing the role will immediately update the user's sidebar and route access.
                  </p>
                </div>
              </div>

              <div class="flex gap-4 group">
                <div
                  class="mt-1 h-6 w-6 rounded-lg bg-hijau/10 flex items-center justify-center flex-shrink-0 group-hover:bg-hijau transition-colors"
                >
                  <Lock class="h-4 w-4 text-hijau group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 class="text-sm font-bold">Password Override</h4>
                  <p class="text-xs text-slate-500 leading-relaxed mt-1">
                    Leave the password field empty to keep the existing one.
                  </p>
                </div>
              </div>
            </div>

            <div
              class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3 items-start mt-8"
            >
              <Info class="h-5 w-5 text-hijau mt-0.5 shrink-0" />
              <p class="text-xs font-medium text-slate-600 leading-relaxed">
                Verification: Any changes to the email address may require the user to re-verify
                their identity upon next login.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Main Edit Form -->
      <Card
        class="lg:col-span-2 shadow-2xl border-slate-200 bg-white/40 backdrop-blur-md order-1 lg:order-2 rounded-3xl"
      >
        <CardHeader class="pb-4">
          <CardTitle class="text-xl font-black flex items-center gap-2">
            Member Metadata
          </CardTitle>
          <CardDescription class="font-medium text-slate-400"
            >Edit and save member credentials.</CardDescription
          >
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Name -->
              <FormField v-slot="{ componentField }" name="name">
                <FormItem class="md:col-span-2">
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-500 mb-3"
                  >
                    <User class="h-3.5 w-3.5 text-hijau" />
                    Full Legal Name
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

              <!-- Email -->
              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground/70 mb-3"
                  >
                    <Mail class="h-3.5 w-3.5 text-hijau" />
                    Primary Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="email"
                      placeholder="jane@example.com"
                      class="bg-white/50 border-slate-200 focus-visible:ring-hijau/20 h-12 rounded-2xl transition-all font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Phone -->
              <FormField v-slot="{ componentField }" name="phone">
                <FormItem>
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground/70 mb-3"
                  >
                    <Phone class="h-3.5 w-3.5 text-hijau" />
                    Direct Phone Line
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="text"
                      placeholder="+62 8..."
                      class="bg-white/50 border-slate-200 focus-visible:ring-hijau/20 h-12 rounded-2xl transition-all font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Password (Optional) -->
              <FormField v-slot="{ componentField }" name="password">
                <FormItem>
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground/70 mb-3"
                  >
                    <Lock class="h-3.5 w-3.5 text-hijau" />
                    Reset Password (Optional)
                  </FormLabel>
                  <FormControl>
                    <div class="relative group">
                      <Input
                        v-bind="componentField"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Leave blank to keep current"
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

              <!-- Role -->
              <FormField v-slot="{ componentField }" name="role_id">
                <FormItem>
                  <FormLabel
                    class="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground/70 mb-3"
                  >
                    <Shield class="h-3.5 w-3.5 text-hijau" />
                    Authority Level
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger
                        class="w-full bg-white/50 border-slate-200 focus:ring-hijau/20 h-12 rounded-2xl shadow-sm font-semibold"
                      >
                        <SelectValue placeholder="Reassign role" />
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
                Cancel
              </Button>
              <Button
                class="w-full md:w-auto px-12 h-12 bg-hijau hover:bg-hijautua text-white font-black shadow-xl shadow-hijau/20 transition-all hover:scale-[1.03] active:scale-[0.97] rounded-2xl"
                type="submit"
                :disabled="isSubmitting"
              >
                <Save v-if="!isSubmitting" class="h-5 w-5 mr-2" />
                <span
                  v-else
                  class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
                ></span>
                {{ isSubmitting ? 'Finalizing...' : 'Save Changes' }}
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
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
