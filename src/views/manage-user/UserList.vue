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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUserStore } from '@/store/useUserStore'
import { onMounted, ref } from 'vue'
import { DeleteIcon, EditIcon } from '@/lib/icons'

const userStore = useUserStore()
const isModal = ref<boolean>(false)

const handleDelete = (id: string) => {
  userStore.deleteUser(id)
  isModal.value = !isModal.value
}

onMounted(() => {
  userStore.fetchUsers()
})
</script>

<template>
  <div class="mx-10 mt-5">
    <div class="flex justify-between">
      <div class="text-2xl font-semibold">User Management</div>
      <Button size="sm">
        <router-link to="/user/create">Create User</router-link>
      </Button>
    </div>
    <Card class="mt-10">
      <CardHeader>
        <CardTitle>User List</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="max-h-[50vh] overflow-y-auto">
          <Table class="w-full table-fixed">
            <TableHeader class="sticky top-0 z-20 bg-white border-b-2 border-gray-300 shadow-sm">
              <TableRow>
                <TableHead class="w-56 py-2 pl-2">Name</TableHead>
                <TableHead class="w-56">Email</TableHead>
                <TableHead class="w-56">Role</TableHead>
                <TableHead class="w-56 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow v-for="item in userStore.users" :key="item.id">
                <TableCell>{{ item.name }}</TableCell>
                <TableCell>{{ item.email }}</TableCell>
                <TableCell>{{ item.role.role_name }}</TableCell>
                <TableCell class="w-56"
                  ><div class="flex gap-3 justify-center">
                    <RouterLink :to="`/user/edit/${item.id}`">
                      <Button size="icon" variant="ghost">
                        <EditIcon />
                      </Button>
                    </RouterLink>
                    <Dialog>
                      <DialogTrigger as-child>
                        <Button size="icon" variant="ghost" class="cursor-pointer">
                          <DeleteIcon />
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogDescription class="mb-5">
                            Are you sure to delete this product?
                          </DialogDescription>
                          <DialogFooter class="flex gap-2">
                            <Button
                              variant="destructive"
                              @click="handleDelete(item.id)"
                              class="flex-1"
                              >Yes</Button
                            >
                            <DialogClose as-child>
                              <Button class="flex-1">No</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>

            <TableFooter class="py-2">Rows per page 5</TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
