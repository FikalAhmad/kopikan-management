<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
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
import { DeleteIcon, EditIcon } from '@/lib/icons'

const isModal = ref<boolean>(false)
const paymentStore = usePaymentStore()

const handleDelete = (id: string) => {
  paymentStore.deletePayment(id)
  isModal.value = !isModal.value
}

onMounted(() => {
  paymentStore.fetchPayments()
})
</script>

<template>
  <div class="mx-10 mt-5">
    <div class="flex justify-between">
      <div class="text-2xl font-semibold">Payment Management</div>
      <!-- <Button size="sm">
        <router-link to="/product/create">Create Payment</router-link>
      </Button> -->
    </div>
    <Card class="mt-10">
      <CardHeader>
        <CardTitle>Payment List</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="max-h-[50vh] overflow-y-auto">
          <Table class="w-full table-fixed">
            <TableHeader class="sticky top-0 z-20 bg-white border-b-2 border-gray-300 shadow-sm">
              <TableRow>
                <TableHead class="w-20 py-2 pl-2">Order ID</TableHead>
                <TableHead class="w-20">Payment Date</TableHead>
                <TableHead class="w-20">Amount</TableHead>
                <TableHead class="w-20">Status</TableHead>
                <TableHead class="w-20">Payment Method</TableHead>
                <TableHead class="w-20">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow v-for="item in paymentStore.payments" :key="item.id">
                <TableCell class="">
                  {{ item.orderid }}
                </TableCell>
                <TableCell class="">{{ item.payment_date }}</TableCell>
                <TableCell class="">{{ item.amount }}</TableCell>
                <TableCell class="">{{ item.status }}</TableCell>
                <TableCell class="">{{ item.payment_method }}</TableCell>
                <TableCell class=""
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
        </div>
      </CardContent>
    </Card>
  </div>
</template>
