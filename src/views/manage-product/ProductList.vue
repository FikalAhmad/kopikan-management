<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
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
import { DeleteIcon, EditIcon } from '@/lib/icons'
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const isModal = ref<boolean>(false)
const rowPerPage = ref<number>(10)
const currentPage = ref<number>(1)
const productStore = useProductStore()

const handleDelete = (id: string) => {
  productStore.deleteProduct(id)
  isModal.value = !isModal.value
}

const goToNextPage = () => {
  const maxPage = Math.ceil((productStore.products?.pagination.total ?? 0) / rowPerPage.value)

  if (currentPage.value < maxPage) {
    currentPage.value++
  }
}

const categoryGroup: Record<string, string> = {
  'Signature': 'bg-blue-400',
  'Coffee': 'bg-red-900',
  'NonCoffee': 'bg-hijautua',
}

watch(
  () => [currentPage.value, rowPerPage.value],
  async () => {
    try {
      productStore.fetchProduct({
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
            <CardTitle class="text-2xl font-bold">Product Management</CardTitle>
            <CardDescription class="mt-1">Manage and view your products in one place.</CardDescription>
          </div>
          <!-- Add potential actions here like 'Create Order' -->
        </div>
      </CardHeader>
      <CardContent class="flex-1 flex flex-col overflow-hidden p-0">
        <div class="flex-1 overflow-auto relative">
          <Table class="w-full">
            <TableHeader class="sticky top-0 bg-background/95 backdrop-blur-sm border-b">
              <TableRow class="hover:bg-transparent border-none">
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Image</TableHead>
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Title</TableHead>
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Price</TableHead>
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Description</TableHead>
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Category</TableHead>
                <TableHead class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="item in productStore.products?.data"
                :key="item.id"
                class="group border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <TableCell class="px-6 py-4 text-foreground font-medium">
                  <img :src="item.image" alt="Product Image" class="w-12 h-12 object-cover rounded-md" />
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.product_name }}
                </TableCell>
                <TableCell class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground uppercase">
                    {{ item.price }}
                  </span>
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground max-w-[250px]">
                  <div class="truncate" :title="item.description">
                     {{ item.description }}
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4">
                  <span :class="[categoryGroup[item.category], 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white uppercase']">
                    {{ item.category }}
                  </span>
                </TableCell>
                <TableCell class="px-6 py-4 text-right">
                  <div class="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <RouterLink :to="`/product/edit/${item.id}`" title="Edit Order">
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
                          <DialogTitle>Delete Order</DialogTitle>
                          <DialogDescription class="mt-4">
                            Are you sure you want to delete this order? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="flex gap-2 mt-6">
                           <DialogClose as-child>
                              <Button variant="outline" class="flex-1">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" @click="handleDelete(item.id)" class="flex-1">
                              Delete Order
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
            v-if="productStore.products?.pagination.total ?? 0 > 0"
            v-slot="{ page }"
            :items-per-page="productStore.products?.pagination.pageSize || 10"
            :total="productStore.products?.pagination.total"
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