<script setup lang="ts">
import { ref, watch } from 'vue'
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
import { useOrderStore } from '@/store/useOrderStore'
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
import { Button } from '@/components/ui/button'

const isModal = ref<boolean>(false)
const rowPerPage = ref<number>(10)
const currentPage = ref<number>(1)
const orderStore = useOrderStore()

const handleDelete = (id: string) => {
  orderStore.deleteOrder(id)
  isModal.value = !isModal.value
}

const goToNextPage = () => {
  const maxPage = Math.ceil(orderStore.orders?.pagination.total ?? 0 / rowPerPage.value)

  if (currentPage.value < maxPage) {
    currentPage.value++
  }
}

watch(
  () => [currentPage.value, rowPerPage.value],
  async () => {
    try {
      orderStore.fetchOrders({
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
  <div class="p-5 bg-gray-200">
    <Card class="">
      <CardHeader>
        <CardTitle>Order List</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <Table class="w-full">
            <TableHeader class="">
              <TableRow class="border-b border-border bg-background">
                <TableHead class="px-6 py-3 text-left text-sm font-semibold">Customer ID</TableHead>
                <TableHead class="px-6 py-3 text-left text-sm font-semibold">Order Date</TableHead>
                <TableHead class="px-6 py-3 text-left text-sm font-semibold"
                  >Order Source</TableHead
                >
                <TableHead class="px-6 py-3 text-left text-sm font-semibold"
                  >Delivery Address</TableHead
                >
                <TableHead class="px-6 py-3 text-left text-sm font-semibold">Total</TableHead>
                <TableHead class="px-6 py-3 text-left text-sm font-semibold">Status</TableHead>
                <TableHead class="px-6 py-3 text-left text-sm font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="item in orderStore.orders?.data"
                :key="item.id"
                class="border-b border-border hover:bg-background/50 transition-colors"
              >
                <TableCell class="px-6 py-4 text-foreground font-medium">
                  {{ item.id }}
                </TableCell>
                <TableCell class="px-6 py-4 text-foreground font-medium">{{
                  item.order_date
                }}</TableCell>
                <TableCell class="px-6 py-4 text-foreground font-medium">{{
                  item.order_source
                }}</TableCell>
                <TableCell class="truncate px-6 py-4 text-foreground font-medium">{{
                  item.delivery_address == null ? 'N/A' : item.delivery_address
                }}</TableCell>
                <TableCell class="px-6 py-4 text-foreground font-medium">{{
                  item.total
                }}</TableCell>
                <TableCell class="px-6 py-4 text-foreground font-medium">{{
                  item.status
                }}</TableCell>
                <TableCell class="px-6 py-4"
                  ><div class="flex gap-3">
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
                            <Button variant="destructive" @click="handleDelete(item.id)"
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

            <TableFooter class="py-2 flex gap-3 items-center">
              <span> Rows per page </span>
              <Select v-model="rowPerPage">
                <SelectTrigger>
                  <SelectValue :placeholder="String(rowPerPage)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </TableFooter>
          </Table>
          <Pagination
            v-if="orderStore.orders?.pagination.total ?? 0 > 0"
            v-slot="{ page }"
            :items-per-page="orderStore.orders?.pagination.pageSize || 10"
            :total="orderStore.orders?.pagination.total"
            :default-page="currentPage"
          >
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious @click="currentPage > 1 && currentPage--" />

              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === page"
                  @click="currentPage = item.value"
                >
                  {{ item.value }}
                </PaginationItem>
              </template>

              <PaginationEllipsis :index="4" />

              <PaginationNext @click="goToNextPage" />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
