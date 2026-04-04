<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePaymentStore } from '@/store/usePaymentStore'
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
import { DeleteIcon, EditIcon } from '@/lib/icons'

const isModal = ref<boolean>(false)
const paymentStore = usePaymentStore()
const rowPerPage = ref<string>('10')
const currentPage = ref<number>(1)

const handleDelete = (id: string) => {
  paymentStore.deletePayment(id)
}

// Reset ke halaman 1 jika jumlah baris per halaman diubah
watch(rowPerPage, () => {
  currentPage.value = 1
})

watch(
  () => [currentPage.value, rowPerPage.value],
  async () => {
    try {
      await paymentStore.fetchPayments({
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
  <div class="h-full flex flex-col overflow-hidden">
    <Card class="flex-1 flex flex-col overflow-hidden border-none shadow-sm">
      <CardHeader class="flex-none px-6 py-6 border-b">
        <div class="flex justify-between items-start">
          <div>
            <CardTitle class="text-2xl font-bold">Payment Management</CardTitle>
            <CardDescription class="mt-1"
              >Manage and view your payments in one place.</CardDescription
            >
          </div>
          <!-- Add potential actions here like 'Create Order' -->
        </div>
      </CardHeader>
      <CardContent class="flex-1 flex flex-col overflow-hidden p-0">
        <div class="flex-1 overflow-auto relative">
          <Table class="w-full">
            <TableHeader class="sticky top-0 bg-background/95 backdrop-blur-sm border-b">
              <TableRow class="hover:bg-transparent border-none">
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Order ID</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Payment Date</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Amount</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Status</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Payment Method</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap text-center"
                  >Action</TableHead
                >
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="item in paymentStore.payments?.data"
                :key="item.id"
                class="group border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <TableCell class="px-6 py-4 text-foreground font-medium">
                  {{ item.order_id }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.payment_date }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.amount }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.status }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.payment_method }}
                </TableCell>
                <TableCell class="px-6 py-4 text-right">
                  <div
                    class="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RouterLink :to="`/payment/edit/${item.id}`" title="Edit Payment">
                      <Button
                        size="icon"
                        variant="ghost"
                        class="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      >
                        <EditIcon class="w-4 h-4" />
                      </Button>
                    </RouterLink>
                    <Dialog>
                      <DialogTrigger as-child>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Delete Order"
                          class="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <DeleteIcon class="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete Order</DialogTitle>
                          <DialogDescription class="mt-4">
                            Are you sure you want to delete this order? This action cannot be
                            undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="flex gap-2 mt-6">
                          <DialogClose as-child>
                            <Button variant="outline" class="flex-1">Cancel</Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            @click="handleDelete(item.id)"
                            class="flex-1"
                          >
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
        <div
          class="flex-none p-4 px-6 border-t flex flex-wrap items-center justify-between gap-4 bg-muted/10"
        >
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground whitespace-nowrap"> Rows per page </span>
            <Select v-model="rowPerPage">
              <SelectTrigger class="h-8 w-[70px] bg-background">
                <SelectValue :placeholder="rowPerPage" />
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
            v-if="paymentStore.payments?.pagination.total"
            v-model:page="currentPage"
            :items-per-page="Number(rowPerPage)"
            :total="paymentStore.payments?.pagination.total"
          >
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious class="h-8" />

              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === currentPage"
                  class="h-8 w-8 p-0"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis
                  v-else-if="item.type === 'ellipsis'"
                  :key="item.type"
                  :index="index"
                />
              </template>

              <PaginationNext class="h-8" />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
