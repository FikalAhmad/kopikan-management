<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
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
  DialogTitle,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Search,
  Trash2,
  Eye,
  MoreVertical,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  CreditCard,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import ExportData from '@/lib/ExportData.vue'

const rowPerPage = ref<string>('10')
const currentPage = ref<number>(1)
const orderStore = useOrderStore()
const searchQuery = ref('')
let searchTimeout: ReturnType<typeof setTimeout>

const handleDelete = async (id: string) => {
  await orderStore.deleteOrder(id)
}

const fetchOrdersReq = async () => {
  try {
    await orderStore.fetchOrders({
      page: currentPage.value.toString(),
      pageSize: rowPerPage.value.toString(),
      search: searchQuery.value,
    })
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => [currentPage.value, rowPerPage.value],
  () => {
    fetchOrdersReq()
  },
  { immediate: true },
)

watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (currentPage.value !== 1) {
      currentPage.value = 1 // This triggers the watch above
    } else {
      fetchOrdersReq() // Call directly if already on page 1
    }
  }, 1000)
})

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'bg-hijau/10 text-hijau border-hijau/20'
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'CANCELLED':
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    default:
      return 'bg-slate-100 text-slate-500 border-slate-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return CheckCircle2
    case 'PENDING':
      return Clock
    case 'CANCELLED':
      return AlertCircle
    default:
      return MoreVertical
  }
}
</script>

<template>
  <div class="p-6 space-y-6 flex flex-col">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ShoppingCart class="h-8 w-8 text-hijau" />
          Order History
        </h1>
        <p class="text-slate-500 mt-1">Monitor and manage every transaction in real-time.</p>
      </div>
      <div class="flex items-center gap-3">
        <ExportData endpoint="orders" />
      </div>
    </div>

    <!-- Stats Row (Optional Premium Touch) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        class="bg-white/50 backdrop-blur-sm border-slate-200 shadow-sm transition-all hover:shadow-md"
      >
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-hijau/10 flex items-center justify-center">
            <ShoppingCart class="h-6 w-6 text-hijau" />
          </div>
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Orders</p>
            <h3 class="text-xl font-bold">{{ orderStore.orders?.pagination.total || 0 }}</h3>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-white/50 backdrop-blur-sm border-slate-200 shadow-sm">
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-hijau/10 flex items-center justify-center">
            <CreditCard class="h-6 w-6 text-hijau" />
          </div>
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Revenue</p>
            <h3 class="text-xl font-bold">Rp --</h3>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Table Section -->
    <Card
      class="flex-1 flex flex-col min-[1080px]:overflow-hidden shadow-xl border-slate-200 bg-white/50 backdrop-blur-sm"
    >
      <CardHeader class="px-6 py-4 border-b border-slate-100">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative w-full sm:w-96">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              v-model="searchQuery"
              placeholder="Search by Customer ID or Address..."
              class="pl-10 h-10 bg-white/50 border-slate-200"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-slate-500">Show</span>
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

      <CardContent class="p-0 flex-1 min-[1080px]:overflow-hidden relative">
        <div class="min-[1080px]:h-full overflow-x-auto min-[1080px]:overflow-auto scrollbar-thin">
          <Table>
            <TableHeader class="header-premium sticky top-0 z-10 bg-white backdrop-blur-md">
              <TableRow class="hover:bg-transparent border-b">
                <TableHead
                  class="pl-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Order Info</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Source</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Address</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Amount</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500 text-center"
                  >Status</TableHead
                >
                <TableHead
                  class="pr-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500 text-right"
                  >Actions</TableHead
                >
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="order in orderStore.orders?.data"
                :key="order.id"
                class="group border-b border-slate-100/50 hover:bg-slate-50/50 transition-all duration-200"
              >
                <TableCell class="pl-6 py-4">
                  <div class="flex flex-col gap-0.5">
                    <span class="font-bold text-foreground truncate max-w-[120px]"
                      >#{{ order.id.slice(-8) }}</span
                    >
                    <div class="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar class="h-3 w-3" />
                      {{ order.order_date }}
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <Badge
                    variant="outline"
                    class="bg-hijau/5 text-hijau border-hijau/20 rounded-full font-bold px-3"
                  >
                    {{ order.order_source }}
                  </Badge>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-2 max-w-[200px] text-slate-500">
                    <MapPin class="h-3.5 w-3.5 shrink-0 text-hijau/60" />
                    <span class="truncate text-xs tracking-tight" :title="order.delivery_address">
                      {{ order.delivery_address || 'Take-away' }}
                    </span>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <span class="font-black text-foreground"
                    >Rp {{ order.total.toLocaleString() }}</span
                  >
                </TableCell>

                <TableCell class="px-6 py-4 text-center">
                  <Badge
                    :class="cn('rounded-full font-bold px-3 gap-1.5', getStatusColor(order.status))"
                  >
                    <component :is="getStatusIcon(order.status)" class="h-3 w-3" />
                    {{ order.status }}
                  </Badge>
                </TableCell>

                <TableCell class="pr-6 py-4 text-right">
                  <div
                    class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-9 w-9 rounded-full hover:bg-hijau/10 hover:text-hijau transition-colors"
                    >
                      <Eye class="h-4 w-4" />
                    </Button>

                    <Dialog>
                      <DialogTrigger as-child>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="border-none shadow-2xl rounded-3xl">
                        <DialogHeader>
                          <DialogTitle class="text-2xl font-bold flex items-center gap-2">
                            <AlertCircle class="h-6 w-6 text-destructive" />
                            Delete Order
                          </DialogTitle>
                          <DialogDescription class="pt-4 text-base">
                            Are you sure you want to remove order
                            <span class="font-black">#{{ order.id.slice(-8) }}</span
                            >? This action cannot be undone and will void the transaction record.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="gap-3 sm:gap-0 mt-6">
                          <DialogClose as-child>
                            <Button variant="ghost" class="rounded-xl flex-1 h-12">Cancel</Button>
                          </DialogClose>
                          <Button
                            class="bg-destructive hover:bg-destructive/90 text-white rounded-xl flex-1 h-12 font-bold"
                            @click="handleDelete(order.id)"
                          >
                            Confirm Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Empty State -->
              <TableRow v-if="!orderStore.orders?.data.length">
                <TableCell colspan="6" class="h-[400px] text-center">
                  <div class="flex flex-col items-center justify-center gap-4">
                    <div
                      class="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center"
                    >
                      <ShoppingCart class="h-10 w-10 text-slate-300" />
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-xl font-bold">No orders found</h3>
                      <p class="text-slate-500 text-sm">
                        Create a new order to see them appearing here.
                      </p>
                    </div>
                    <Button class="bg-hijau hover:bg-hijautua mt-2 px-8 rounded-xl shadow-lg"
                      >New Order</Button
                    >
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <!-- Footer with Pagination -->
      <div
        class="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/10"
      >
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Showing {{ orderStore.orders?.data.length }} of
          {{ orderStore.orders?.pagination.total }} results
        </p>

        <Pagination
          v-if="orderStore.orders?.pagination.total"
          :items-per-page="Number(rowPerPage)"
          :total="orderStore.orders?.pagination.total"
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
