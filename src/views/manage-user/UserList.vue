<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  Trash2,
  Edit3,
  Users,
  ShieldCheck,
  UserCheck,
  Mail,
  UserPlus,
  AlertCircle,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useUserStore } from '@/store/useUserStore'
import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const userStore = useUserStore()
const rowPerPage = ref<string>('10')
const currentPage = ref<number>(1)
const searchQuery = ref('')

const handleDelete = async (id: string) => {
  await userStore.deleteUser(id)
}

const roleBadges: Record<string, string> = {
  '67e3011960094b86083ac359': 'bg-hijau/10 text-hijau border-hijau/20', // Admin
  '6800a52eea8560606cbc4a25': 'bg-[#44911f]/10 text-[#44911f] border-[#44911f]/20', // Staff/Others
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

watch(
  () => [currentPage.value, rowPerPage.value],
  async () => {
    try {
      await userStore.fetchUsers({
        page: currentPage.value.toString(),
        pageSize: rowPerPage.value,
      })
    } catch (error) {
      console.error(error)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="p-6 space-y-6 flex flex-col h-full overflow-hidden">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Users class="h-8 w-8 text-hijau" />
          Team Management
        </h1>
        <p class="text-slate-500 mt-1">
          Manage system access, roles, and administrative permissions.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          class="hidden md:flex gap-2 rounded-xl border-muted-foreground/20 backdrop-blur-sm"
        >
          <Filter class="h-4 w-4" />
          Roles
        </Button>
        <RouterLink to="/user/create">
          <Button
            class="bg-hijau hover:bg-hijautua text-white rounded-xl shadow-lg shadow-hijau/20 gap-2 px-5 font-bold"
          >
            <UserPlus class="h-4 w-4" />
            Add Member
          </Button>
        </RouterLink>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        class="bg-white/50 backdrop-blur-sm border-slate-200 shadow-sm transition-all hover:shadow-md"
      >
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-hijau/10 flex items-center justify-center">
            <ShieldCheck class="h-6 w-6 text-hijau" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
            <h3 class="text-xl font-black">{{ userStore.users?.pagination.total || 0 }}</h3>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-white/50 border-slate-200 shadow-sm">
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-hijau/10 flex items-center justify-center">
            <UserCheck class="h-6 w-6 text-hijau" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Admins
            </p>
            <h3 class="text-xl font-black">
              {{
                userStore.users?.data.filter((user) => user.role_id === '67e3011960094b86083ac359')
                  .length || 0
              }}
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Table Card -->
    <Card
      class="flex-1 flex flex-col overflow-hidden shadow-xl border-slate-200 bg-white/10 backdrop-blur-sm"
    >
      <CardHeader class="px-6 py-4 border-b border-slate-100">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative w-full sm:w-96 group">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-hijau transition-colors"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search by name, email or role..."
              class="pl-10 h-10 bg-white/50 border-slate-200 group-hover:border-hijau/20 transition-all rounded-xl shadow-none"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Show</span>
            <Select v-model="rowPerPage">
              <SelectTrigger class="h-10 w-20 bg-white/50 border-slate-200 rounded-xl">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0 flex-1 overflow-hidden relative">
        <div class="h-full overflow-auto scrollbar-thin">
          <Table>
            <TableHeader
              class="sticky top-0 z-10 bg-white backdrop-blur-md border-b border-slate-100"
            >
              <TableRow class="hover:bg-transparent">
                <TableHead
                  class="pl-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Team Member</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Permissions / Role</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Email Status</TableHead
                >
                <TableHead
                  class="pr-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500 text-right"
                  >Actions</TableHead
                >
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="user in userStore.users?.data"
                :key="user.id"
                class="group border-b border-slate-100/50 hover:bg-slate-50/50 transition-all duration-200"
              >
                <TableCell class="pl-6 py-4">
                  <div class="flex items-center gap-4">
                    <div
                      class="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-tr from-hijau/20 to-hijau/5 border border-hijau/10 flex items-center justify-center font-bold text-hijau text-sm shadow-sm"
                    >
                      {{ getInitials(user.name) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="font-bold text-foreground">{{ user.name }}</span>
                      <div
                        class="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium uppercase tracking-tight"
                      >
                        <Mail class="h-3 w-3" />
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <Badge
                    :class="
                      cn(
                        'rounded-full font-bold px-3 py-1 border uppercase text-[10px]',
                        roleBadges[user.role_id] || 'bg-slate-100 text-slate-600 border-slate-200',
                      )
                    "
                  >
                    <Shield class="h-3 w-3 mr-1.5" />
                    {{ user.role.role_name }}
                  </Badge>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-hijau animate-pulse"></div>
                    <span class="text-xs font-semibold text-foreground italic">Verified</span>
                  </div>
                </TableCell>

                <TableCell class="pr-6 py-4 text-right">
                  <div
                    class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100"
                  >
                    <RouterLink :to="`/user/edit/${user.id}`">
                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-9 w-9 rounded-full hover:bg-hijau/10 hover:text-hijau"
                      >
                        <Edit3 class="h-4 w-4" />
                      </Button>
                    </RouterLink>

                    <Dialog>
                      <DialogTrigger as-child>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="border-none shadow-2xl rounded-3xl">
                        <DialogHeader>
                          <DialogTitle class="text-2xl font-bold flex items-center gap-2">
                            <AlertCircle class="h-6 w-6 text-destructive" />
                            Revoke Access
                          </DialogTitle>
                          <DialogDescription class="pt-4 text-base">
                            Warning: You are about to permanently delete
                            <span class="font-black">{{ user.name }}</span
                            >'s account. They will immediately lose access to the management
                            platform.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="gap-3 mt-6">
                          <DialogClose as-child>
                            <Button variant="ghost" class="rounded-xl flex-1 h-12">Cancel</Button>
                          </DialogClose>
                          <Button
                            class="bg-destructive hover:bg-destructive/90 text-white rounded-xl flex-1 h-12 font-bold"
                            @click="handleDelete(user.id)"
                          >
                            Confirm Revoke
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Empty State -->
              <TableRow v-if="!userStore.users?.data.length">
                <TableCell colspan="4" class="h-[400px] text-center">
                  <div class="flex flex-col items-center justify-center gap-4 text-slate-300">
                    <div
                      class="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center"
                    >
                      <Users class="h-10 w-10" />
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-xl font-bold text-foreground">No team members found</h3>
                      <p class="text-sm">Start inviting your team to help manage the platform.</p>
                    </div>
                    <RouterLink to="/user/create">
                      <Button class="bg-hijau hover:bg-hijautua mt-2 px-8 rounded-xl shadow-lg"
                        >Add First Member</Button
                      >
                    </RouterLink>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <!-- List Footer -->
      <div
        class="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/10"
      >
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Showing {{ userStore.users?.data.length }} of
          {{ userStore.users?.pagination.total }} results
        </p>

        <Pagination
          v-if="userStore.users?.pagination.total"
          :items-per-page="Number(rowPerPage)"
          :total="userStore.users?.pagination.total"
          :default-page="currentPage"
          @update:page="(v) => (currentPage = v)"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious class="rounded-xl h-9 hover:bg-hijau/10 border-none" />
            <template v-for="(item, index) in items">
              <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value">
                <Button
                  class="w-9 h-9 p-0 rounded-xl transition-all"
                  :variant="item.value === currentPage ? 'default' : 'outline'"
                  :class="
                    item.value === currentPage
                      ? 'bg-hijau text-white border-hijau shadow-lg shadow-hijau/20'
                      : 'border-slate-200 text-slate-600 hover:bg-hijau/5 hover:text-hijau'
                  "
                >
                  {{ item.value }}
                </Button>
              </PaginationItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>
            <PaginationNext class="rounded-xl h-9 hover:bg-hijau/10 border-none" />
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply rounded-full;
}
</style>
