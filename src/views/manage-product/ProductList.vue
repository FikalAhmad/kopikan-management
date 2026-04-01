<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProductStore } from '@/store/useProductStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DeleteIcon, EditIcon } from '@/lib/icons'

const isModal = ref<boolean>(false)
const productStore = useProductStore()

const handleDelete = (id: string) => {
  productStore.deleteProduct(id)
  isModal.value = !isModal.value
}

onMounted(() => {
  productStore.fetchProduct()
})
</script>

<template>
  <div class="mx-10 mt-5">
    <div class="flex justify-between">
      <Button size="sm">
        <router-link to="/product/create">Create Product</router-link>
      </Button>
    </div>
    <Card class="mt-10">
      <CardHeader>
        <CardTitle>Product List</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
      </CardHeader>
      <ScrollArea class="h-96">
        <CardContent>
          <Table class="w-full table-fixed">
            <TableHeader class="sticky top-0 z-20 bg-white border-b-2 border-gray-300 shadow-sm">
              <TableRow>
                <TableHead class="w-16 py-2 pl-2">Image</TableHead>
                <TableHead class="w-36">Title</TableHead>
                <TableHead class="w-24">Price</TableHead>
                <TableHead class="w-96">Description</TableHead>
                <TableHead class="w-28">Category</TableHead>
                <TableHead class="w-20 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow v-for="item in productStore.products" :key="item.id">
                <TableCell class="w-16">
                  <img :src="item.image" :alt="item.product_name" class="w-10 object-cover" />
                </TableCell>
                <TableCell class="truncate">{{ item.product_name }}</TableCell>
                <TableCell>{{ item.price }}</TableCell>
                <TableCell class="truncate">{{ item.description }}</TableCell>
                <TableCell class="truncate">{{ item.category }}</TableCell>
                <TableCell
                  ><div class="flex gap-3 justify-center">
                    <RouterLink :to="`/product/edit/${item.id}`">
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
        </CardContent>
      </ScrollArea>
    </Card>
  </div>
</template>
