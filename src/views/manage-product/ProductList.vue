<template>
  <div class="mx-10 mt-5">
    <div class="flex justify-between">
      <div class="text-2xl font-semibold">Product Management</div>
      <Button size="sm">
        <router-link to="/product/create">Create Product</router-link>
      </Button>
    </div>
    <Card class="mt-10">
      <CardHeader>
        <CardTitle>Product List</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow class="flex items-center justify-between pr-4">
              <TableHead class="w-16">Image</TableHead>
              <TableHead class="w-32">Title</TableHead>
              <TableHead class="w-20">Price</TableHead>
              <TableHead class="w-52">Description</TableHead>
              <TableHead class="w-20">Category</TableHead>
              <TableHead class="w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <div class="max-h-[50vh] overflow-y-auto">
            <Table>
              <TableBody>
                <TableRow
                  class="flex items-center justify-between"
                  v-for="item in productStore.products"
                  :key="item._id"
                >
                  <TableCell class="w-16">
                    <img :src="item.image" :alt="item.title" class="w-10 object-cover" />
                  </TableCell>
                  <TableCell class="w-32">{{ item.title }}</TableCell>
                  <TableCell class="w-20">{{ item.price }}</TableCell>
                  <TableCell class="w-52">{{ item.desc }}</TableCell>
                  <TableCell class="w-20">{{ item.category }}</TableCell>
                  <TableCell class="w-24"
                    ><div class="flex gap-3">
                      <RouterLink :to="`/product/edit/${item._id}`">
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
                            <!-- <Button
                              size="icon"
                              @click="isModal = false"
                              class="absolute top-2 right-2 text-gray-600 hover:text-black"
                            >
                              ✖
                            </Button> -->
                            <CardContent>
                              <div class="w-full flex gap-3">
                                <Button
                                  variant="danger"
                                  class="w-full"
                                  @click="handleDelete(item._id)"
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
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/ButtonComponent'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/CardComponent'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/TableComponent'
import { useProductStore } from '@/store/useProductStore'
import { Modal, ModalContent, ModalTrigger } from '@/components/ui/ModalComponent'

const isModal = ref<boolean>(false)
const productStore = useProductStore()

const handleDelete = (id: string) => {
  productStore.deleteProduct(id)
  isModal.value = !isModal.value
}

const toggleModal = () => {
  isModal.value = !isModal.value
}

onMounted(() => {
  productStore.fetchProduct()
})
</script>
