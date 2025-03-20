<template>
  <div class="mx-10 mt-5">
    <div class="flex justify-between">
      <div class="text-2xl font-semibold">User Management</div>
      <Button size="sm">
        <router-link to="/user/create"> Create User </router-link>
      </Button>
    </div>
    <Card class="mt-10">
      <CardHeader>
        <CardTitle>User List</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow class="flex items-center justify-between">
              <TableHead class="w-56">Name</TableHead>
              <TableHead class="w-56">Email</TableHead>
              <TableHead class="w-56">Role</TableHead>
              <TableHead class="w-56 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <div class="max-h-[50vh] overflow-y-auto">
            <Table>
              <TableBody>
                <TableRow
                  class="flex items-center justify-between"
                  v-for="item in userStore.users"
                  :key="item.id"
                >
                  <TableCell class="w-56">{{ item.name }}</TableCell>
                  <TableCell class="w-56">{{ item.email }}</TableCell>
                  <TableCell class="w-56">Admin</TableCell>
                  <TableCell class="w-56"
                    ><div class="flex gap-3">
                      <RouterLink :to="`/user/edit/${item.id}`">
                        <Button size="icon" variant="ghost">
                          <img src="/src/components/icons/edit-icon.svg" alt="Edit Icon" />
                        </Button>
                      </RouterLink>
                      <Modal>
                        <ModalTrigger>
                          <Button
                            size="icon"
                            variant="ghost"
                            @click="toggleModal"
                            class="cursor-pointer"
                          >
                            <img src="/src/components/icons/delete-icon.svg" alt="Delete Icon" />
                          </Button>
                        </ModalTrigger>
                        <ModalContent :open-modal="isModal">
                          <Card class="w-96 relative">
                            <CardHeader>
                              <CardTitle class="text-md"
                                >Are you sure to delete this product?</CardTitle
                              >
                            </CardHeader>
                            <CardContent>
                              <div class="w-full flex gap-3">
                                <Button
                                  variant="danger"
                                  class="w-full"
                                  @click="handleDelete(item.id)"
                                  >Yes</Button
                                >
                                <Button class="w-full" @click="isModal = false">No</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </ModalContent>
                      </Modal>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <TableFooter class="py-2">Rows per page 5</TableFooter>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/ButtonComponent'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/CardComponent'
import { Modal, ModalContent, ModalTrigger } from '@/components/ui/ModalComponent'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/TableComponent'
import { useUserStore } from '@/store/useUserStore'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const isModal = ref<boolean>(false)

const handleDelete = (id: string) => {
  userStore.deleteUser(id)
  isModal.value = !isModal.value
}
const toggleModal = () => {
  isModal.value = !isModal.value
}

onMounted(() => {
  userStore.fetchUsers()
})
</script>
