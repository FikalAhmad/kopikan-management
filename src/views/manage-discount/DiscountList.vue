<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
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
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Ticket,
  Percent,
  Calendar,
  Zap,
  Tag,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { useDiscountStore } from '@/store/useDiscountStore'
import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const discountStore = useDiscountStore()
const rowPerPage = ref<string>('10')
const currentPage = ref<number>(1)
const searchQuery = ref('')

const handleDelete = async (id: string) => {
  await discountStore.deleteDiscount(id)
}

const goToNextPage = () => {
  const maxPage = Math.ceil(
    (discountStore.discounts?.pagination.total ?? 0) / Number(rowPerPage.value),
  )
  if (currentPage.value < maxPage) {
    currentPage.value++
  }
}

watch(
  () => [currentPage.value, rowPerPage.value],
  async () => {
    try {
      await discountStore.fetchDiscounts({
        page: currentPage.value.toString(),
        pageSize: rowPerPage.value,
      })
    } catch (error) {
      console.error(error)
    }
  },
  { immediate: true },
)

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="p-6 space-y-6 flex flex-col h-full overflow-hidden">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Ticket class="h-8 w-8 text-hijau" />
          Campaigns & Offers
        </h1>
        <p class="text-muted-foreground mt-1">Monitor your active promos and seasonal discounts.</p>
      </div>
      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          class="hidden md:flex gap-2 rounded-xl border-muted-foreground/20 backdrop-blur-sm"
        >
          <Filter class="h-4 w-4" />
          Filter
        </Button>
        <RouterLink to="/discount/create">
          <Button
            class="bg-hijau hover:bg-hijautua text-white rounded-xl shadow-lg shadow-hijau/20 gap-2 px-5"
          >
            <Plus class="h-4 w-4" />
            New Promo
          </Button>
        </RouterLink>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-hijau/10 flex items-center justify-center">
            <Zap class="h-6 w-6 text-hijau" />
          </div>
          <div>
            <p class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Active
            </p>
            <h3 class="text-xl font-black">
              {{ discountStore.discounts?.data.filter((item) => item.is_active).length }} Promos
            </h3>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-card/50 border-border/50 shadow-sm">
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Clock class="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Expires Soon
            </p>
            <h3 class="text-xl font-black">3 Days</h3>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Table Card -->
    <Card
      class="flex-1 flex flex-col overflow-hidden shadow-xl border-border/50 bg-card/10 backdrop-blur-sm"
    >
      <CardHeader class="px-6 py-4 border-b border-border/50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative w-full sm:w-96 group">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-hijau transition-colors"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search by promo code or description..."
              class="pl-10 h-10 bg-white/50 border-muted group-hover:border-hijau/20 transition-all rounded-xl shadow-none"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-muted-foreground uppercase">Show</span>
            <Select v-model="rowPerPage">
              <SelectTrigger class="h-10 w-20 bg-white/50 border-muted rounded-xl">
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
              class="sticky top-0 z-10 bg-card backdrop-blur-md border-b border-border/40"
            >
              <TableRow class="hover:bg-transparent">
                <TableHead
                  class="pl-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground"
                  >Promo Details</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground"
                  >Discount Info</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground"
                  >Eligibility</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground"
                  >Duration</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground text-center"
                  >Status</TableHead
                >
                <TableHead
                  class="pr-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground text-right"
                  >Actions</TableHead
                >
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="item in discountStore.discounts?.data"
                :key="item.id"
                class="group border-b border-border/40 hover:bg-muted/30 transition-all duration-200"
              >
                <TableCell class="pl-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 shrink-0 rounded-xl bg-hijau/10 flex items-center justify-center"
                    >
                      <Tag class="h-5 w-5 text-hijau" />
                    </div>
                    <div class="flex flex-col">
                      <span class="font-bold text-foreground uppercase tracking-wider">{{
                        item.code
                      }}</span>
                      <span
                        class="text-[10px] italic text-muted-foreground truncate max-w-[150px]"
                        >{{ item.description }}</span
                      >
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-black text-foreground">
                      {{
                        item.type === 'PERCENTAGE'
                          ? `${item.value}%`
                          : `Rp ${item.value.toLocaleString()}`
                      }}
                    </span>
                    <span class="text-[10px] uppercase font-bold text-muted-foreground/60">{{
                      item.type.replace('_', ' ')
                    }}</span>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-1.5 text-xs">
                      <span class="text-muted-foreground font-medium">Min:</span>
                      <span class="font-bold text-primary"
                        >Rp {{ (item.min_purchase || 0).toLocaleString() }}</span
                      >
                    </div>
                    <div class="flex flex-wrap gap-1">
                      <Badge
                        v-for="day in (item.valid_days || []).slice(0, 2)"
                        :key="day"
                        variant="secondary"
                        class="text-[9px] px-1.5 py-0 rounded-md"
                      >
                        {{ day.slice(0, 3) }}
                      </Badge>
                      <span
                        v-if="item.valid_days && item.valid_days.length > 2"
                        class="text-[9px] text-muted-foreground"
                        >+{{ item.valid_days.length - 2 }}</span
                      >
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                    <div class="flex items-center gap-2">
                      <span class="w-8 shrink-0">From</span>
                      <span class="font-bold text-foreground">{{
                        formatDate(item.start_date)
                      }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-8 shrink-0">To</span>
                      <span class="font-bold text-foreground">{{ formatDate(item.end_date) }}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 text-center">
                  <Badge
                    :class="
                      cn(
                        'rounded-full font-bold px-3 py-1 gap-1.5',
                        item.is_active ? 'bg-hijau/10 text-hijau' : 'bg-rose-500/10 text-rose-500',
                      )
                    "
                  >
                    <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
                    {{ item.is_active ? 'Active' : 'Disabled' }}
                  </Badge>
                </TableCell>

                <TableCell class="pr-6 py-4 text-right">
                  <div
                    class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <RouterLink :to="`/discount/edit/${item.id}`">
                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-9 w-9 rounded-full hover:bg-hijau/10 hover:text-hijau"
                      >
                        <Edit3 class="h-4 w-4" />
                      </Button>
                    </RouterLink>

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
                            Archive Promo
                          </DialogTitle>
                          <DialogDescription class="pt-4 text-base">
                            Are you sure you want to stop the
                            <span class="font-black">{{ item.code }}</span> promo? Customers will no
                            longer be able to use it.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="gap-3 mt-6">
                          <DialogClose as-child>
                            <Button variant="ghost" class="rounded-xl flex-1 h-12">Cancel</Button>
                          </DialogClose>
                          <Button
                            class="bg-destructive hover:bg-destructive/90 text-white rounded-xl flex-1 h-12 font-bold"
                            @click="handleDelete(item.id)"
                          >
                            Confirm Archive
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Empty State -->
              <TableRow v-if="!discountStore.discounts?.data.length">
                <TableCell colspan="6" class="h-[400px] text-center">
                  <div
                    class="flex flex-col items-center justify-center gap-4 text-muted-foreground/40"
                  >
                    <div
                      class="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center"
                    >
                      <Ticket class="h-10 w-10" />
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-xl font-bold text-foreground">No promos configured</h3>
                      <p class="text-sm">
                        Create your first campaign to boost your sales engagement.
                      </p>
                    </div>
                    <RouterLink to="/discount/create">
                      <Button
                        class="bg-hijau hover:bg-hijautua mt-2 px-8 rounded-xl shadow-lg shadow-hijau/20"
                        >Launch Promo</Button
                      >
                    </RouterLink>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <!-- List Footer -->
      <div
        class="px-6 py-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/5"
      >
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Showing {{ discountStore.discounts?.data.length }} of
          {{ discountStore.discounts?.pagination.total }} results
        </p>

        <Pagination
          v-if="discountStore.discounts?.pagination.total"
          :items-per-page="Number(rowPerPage)"
          :total="discountStore.discounts?.pagination.total"
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

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply rounded-full;
}
</style>
