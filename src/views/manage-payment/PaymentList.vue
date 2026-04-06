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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CreditCard,
  Search,
  Filter,
  Trash2,
  Eye,
  Wallet,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Banknote,
  Receipt,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const paymentStore = usePaymentStore()
const rowPerPage = ref<string>('10')
const currentPage = ref<number>(1)
const searchQuery = ref('')

const handleDelete = async (id: string) => {
  await paymentStore.deletePayment(id)
}

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

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PAID':
    case 'SUCCESS':
      return 'bg-hijau/10 text-hijau border-hijau/20'
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'FAILED':
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    default:
      return 'bg-slate-100 text-slate-500 border-slate-200'
  }
}

const getMethodIcon = (method: string) => {
  switch (method.toUpperCase()) {
    case 'CASH':
      return Wallet
    case 'TRANSFER':
      return CreditCard
    case 'QRIS':
      return Receipt
    default:
      return Banknote
  }
}
</script>

<template>
  <div class="p-6 space-y-6 flex flex-col h-full overflow-hidden">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Banknote class="h-8 w-8 text-hijau" />
          Payments History
        </h1>
        <p class="text-slate-500 mt-1">
          Review settlements, payouts, and customer transactions.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          class="hidden md:flex gap-2 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm"
        >
          <Download class="h-4 w-4 text-hijau" />
          Export Report
        </Button>
        <Button
          class="bg-hijau hover:bg-hijautua text-white rounded-xl shadow-lg shadow-hijau/20 gap-2 px-5"
        >
          <CreditCard class="h-4 w-4" />
          Verify Payment
        </Button>
      </div>
    </div>

    <!-- Quick Stats Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card class="bg-white/50 backdrop-blur-sm border-slate-200 shadow-sm">
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-hijau/10 flex items-center justify-center">
            <DollarSign class="h-6 w-6 text-hijau" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Amount
            </p>
            <h3 class="text-xl font-black">Rp --</h3>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-white/50 border-slate-200 shadow-sm">
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-hijau/10 flex items-center justify-center">
            <TrendingUp class="h-6 w-6 text-hijau" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Success Rate
            </p>
            <h3 class="text-xl font-black">98.5%</h3>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-white/50 border-slate-200 shadow-sm">
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Clock class="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Payouts
            </p>
            <h3 class="text-xl font-black">12</h3>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Payment Table -->
    <Card
      class="flex-1 flex flex-col overflow-hidden shadow-xl border-slate-200 bg-white/10 backdrop-blur-sm"
    >
      <CardHeader class="px-6 py-4 border-b border-slate-100">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative w-full sm:w-96 group">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-hijau transition-colors"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search by Payment ID or Order #..."
              class="pl-10 h-10 bg-white/50 border-slate-200 group-hover:border-hijau/20 transition-all rounded-xl shadow-none"
            />
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-semibold text-slate-500 uppercase">Rows:</span>
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

      <CardContent class="p-0 flex-1 overflow-hidden relative">
        <div class="h-full overflow-auto scrollbar-thin">
          <Table>
            <TableHeader
              class="sticky top-0 z-10 bg-white backdrop-blur-md border-b border-slate-100"
            >
              <TableRow class="hover:bg-transparent">
                <TableHead
                  class="pl-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Order ID</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Gateway / Method</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >DateTime</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Total Amount</TableHead
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
                v-for="payment in paymentStore.payments?.data"
                :key="payment.id"
                class="group border-b border-slate-100/50 hover:bg-slate-50/50 transition-all duration-200"
              >
                <TableCell class="pl-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center"
                    >
                      <Receipt class="h-5 w-5 text-slate-300" />
                    </div>
                    <span class="font-bold text-foreground">#{{ payment.order_id.slice(-8) }}</span>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <component
                      :is="getMethodIcon(payment.payment_method)"
                      class="h-4 w-4 text-hijau"
                    />
                    <span class="font-semibold text-xs uppercase tracking-tight text-foreground">{{
                      payment.payment_method
                    }}</span>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Calendar class="h-3.5 w-3.5 text-slate-300" />
                    {{ payment.payment_date }}
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <span class="font-black text-foreground"
                    >Rp {{ payment.amount.toLocaleString() }}</span
                  >
                </TableCell>

                <TableCell class="px-6 py-4 text-center">
                  <Badge
                    :class="
                      cn(
                        'rounded-full font-bold px-3 py-1 gap-1.5 border uppercase',
                        getStatusColor(payment.status),
                      )
                    "
                  >
                    <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
                    {{ payment.status }}
                  </Badge>
                </TableCell>

                <TableCell class="pr-6 py-4 text-right">
                  <div
                    class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-9 w-9 rounded-full hover:bg-hijau/10 hover:text-hijau"
                    >
                      <Eye class="h-4 w-4" />
                    </Button>

                    <Dialog>
                      <DialogTrigger as-child>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="border-none shadow-2xl rounded-3xl">
                        <DialogHeader>
                          <DialogTitle class="text-2xl font-bold flex items-center gap-2">
                            <AlertCircle class="h-6 w-6 text-destructive" />
                            Void Transaction
                          </DialogTitle>
                          <DialogDescription class="pt-4 text-base">
                            Warning: Reversing this payment record for order
                            <span class="font-black">#{{ payment.order_id.slice(-8) }}</span> can
                            cause financial inconsistency. Proceed only for manual overrides.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="gap-3 mt-6">
                          <DialogClose as-child>
                            <Button variant="ghost" class="rounded-xl flex-1 h-12"
                              >Keep Record</Button
                            >
                          </DialogClose>
                          <Button
                            class="bg-destructive hover:bg-destructive/90 text-white rounded-xl flex-1 h-12 font-bold"
                            @click="handleDelete(payment.id)"
                          >
                            Confirm Void
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Empty State -->
              <TableRow v-if="!paymentStore.payments?.data.length">
                <TableCell colspan="6" class="h-[400px] text-center">
                  <div class="flex flex-col items-center justify-center gap-4">
                    <div
                      class="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center"
                    >
                      <CreditCard class="h-10 w-10 text-slate-300" />
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-lg font-bold">No payments detected</h3>
                      <p class="text-slate-500 text-sm">
                        Wait for customer transactions or check synchronization.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <!-- List Footer -->
      <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/10">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Total {{ paymentStore.payments?.pagination.total }} Records found
        </p>

        <Pagination
          v-if="paymentStore.payments?.pagination.total"
          :items-per-page="Number(rowPerPage)"
          :total="paymentStore.payments?.pagination.total"
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
                  :class="item.value === currentPage ? 'bg-hijau text-white border-hijau shadow-lg shadow-hijau/20' : 'border-slate-200 text-slate-600 hover:bg-hijau/5 hover:text-hijau'"
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

<style scoped>
.header-premium {
  @apply shadow-[0_1px_0_0_rgba(0,0,0,0.05)];
}
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply rounded-full;
}
</style>
