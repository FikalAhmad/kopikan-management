<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserStore } from '@/store/useUserStore'
import { ref, watch } from 'vue'
import { DeleteIcon, EditIcon } from '@/lib/icons'

const userStore = useUserStore()
const isModal = ref<boolean>(false)
const rowPerPage = ref<number>(10)
const currentPage = ref<number>(1)

const handleDelete = (id: string) => {
  userStore.deleteUser(id)
  isModal.value = !isModal.value
}

const goToNextPage = () => {
  const maxPage = Math.ceil((userStore.users?.pagination.total ?? 0) / rowPerPage.value)

  if (currentPage.value < maxPage) {
    currentPage.value++
  }
}

const roleGroup: Record<string, string> = {
  '67e3011960094b86083ac359': 'bg-red-400',
  '6800a52eea8560606cbc4a25': 'bg-blue-400',
}

watch(
  () => [currentPage.value, rowPerPage.value],
  async () => {
    try {
      userStore.fetchUsers({
        page: currentPage.value.toString(),
        pageSize: rowPerPage.value.toString(),
      })
    } catch (error) {
      console.error(error)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <Card class="flex-1 flex flex-col overflow-hidden border-none shadow-sm">
      <CardHeader class="flex-none px-6 py-6 border-b">
        <div class="flex justify-between items-start">
          <div>
            <CardTitle class="text-2xl font-bold">User Management</CardTitle>
            <CardDescription class="mt-1">Manage user access and track member engagement across the editorial platform.</CardDescription>
          </div>
          <Button class="bg-primary text-white hover:bg-primary/90" >Add User</Button>
          <!-- Add potential actions here like 'Create Order' -->
        </div>
      </CardHeader>
      <CardContent class="flex-1 flex flex-col overflow-hidden p-0">
        <div class="flex-1 overflow-auto relative">
          <Table class="w-full">
            <TableHeader class="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
              <TableRow class="hover:bg-transparent border-none">
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">#</TableHead>
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Name</TableHead>
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Role</TableHead>
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="(item, index) in userStore.users?.data"
                :key="item.id"
                class="group border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                <TableCell class="px-6 py-4 text-muted-foreground">
                   {{ index + 1 }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                   <div class="flex flex-col">
                      <div class="font-semibold text-black">
                        {{ item.name }}
                      </div>
                      <div class="text-xs text-gray-500">{{ item.email }}</div>
                   </div>
                </TableCell>
                <TableCell class="px-6 py-4">
                  <span :class="[roleGroup[item.role_id] || 'bg-gray-400', 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white uppercase']">
                    {{ item.role.role_name }}
                  </span>
                </TableCell>
                <TableCell class="px-6 py-4 text-right">
                  <div class="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <RouterLink :to="`/user/edit/${item.id}`" title="Edit User">
                      <Button size="icon" variant="ghost" class="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                        <EditIcon class="w-4 h-4" />
                      </Button>
                    </RouterLink>
                    <Dialog>
                      <DialogTrigger as-child>
                        <Button size="icon" variant="ghost" title="Delete Order" class="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                          <DeleteIcon class="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete User</DialogTitle>
                          <DialogDescription class="mt-4">
                            Are you sure you want to delete this user? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="flex gap-2 mt-6">
                           <DialogClose as-child>
                              <Button variant="outline" class="flex-1">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" @click="handleDelete(item.id)" class="flex-1">
                              Delete User
                            </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Sticky Footer for Pagination and Rows Per Page -->
        <div class="flex-none p-4 px-6 border-t flex flex-wrap items-center justify-between gap-4 bg-muted/10">
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground whitespace-nowrap"> Rows per page </span>
            <Select v-model="rowPerPage">
              <SelectTrigger class="h-8 w-[70px] bg-background">
                <SelectValue :placeholder="String(rowPerPage)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Pagination
            v-if="userStore.users?.pagination.total ?? 0 > 0"
            v-slot="{ page }"
            :items-per-page="userStore.users?.pagination.pageSize || 10"
            :total="userStore.users?.pagination.total"
            :default-page="currentPage"
          >
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious class="h-8" @click="currentPage > 1 && currentPage--" />

              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === page"
                  class="h-8 w-8 p-0"
                  @click="currentPage = item.value"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else-if="item.type === 'ellipsis'" :key="item.type" :index="index" />
              </template>

              <PaginationNext class="h-8" @click="goToNextPage" />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
