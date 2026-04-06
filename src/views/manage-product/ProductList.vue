<script setup lang="ts">
import { ref, watch } from 'vue'
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
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Package,
  Coffee,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Box,
  LayoutGrid,
  AlertCircle,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const rowPerPage = ref<string>('10')
const currentPage = ref<number>(1)
const productStore = useProductStore()
const searchQuery = ref('')

const handleDelete = async (id: string) => {
  await productStore.deleteProduct(id)
}

const goToNextPage = () => {
  const maxPage = Math.ceil(
    (productStore.products?.pagination.total ?? 0) / Number(rowPerPage.value),
  )
  if (currentPage.value < maxPage) {
    currentPage.value++
  }
}

const categoryColors: Record<string, string> = {
  Signature: 'bg-hijau/10 text-hijau border-hijau/20',
  Coffee: 'bg-amber-700/10 text-amber-700 border-amber-700/20',
  NonCoffee: 'bg-hijau/10 text-hijau border-hijau/20',
  Food: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
}

watch(
  () => [currentPage.value, rowPerPage.value],
  async () => {
    try {
      await productStore.fetchProduct({
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
  <div class="p-6 space-y-6 flex flex-col h-full overflow-hidden">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Package class="h-8 w-8 text-hijau" />
          Product Catalog
        </h1>
        <p class="text-slate-500 mt-1">Manage your menu items, pricing, and variants.</p>
      </div>
      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          class="hidden md:flex gap-2 rounded-xl border-muted-foreground/20 backdrop-blur-sm"
        >
          <Filter class="h-4 w-4" />
          Categories
        </Button>
        <RouterLink to="/product/create">
          <Button
            class="bg-hijau hover:bg-hijautua text-white rounded-xl shadow-lg shadow-hijau/20 gap-2 px-5"
          >
            <Plus class="h-4 w-4" />
            Add Product
          </Button>
        </RouterLink>
      </div>
    </div>

    <!-- Quick Stats Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        class="bg-white/50 backdrop-blur-sm border-slate-200 shadow-sm transition-all hover:shadow-md"
      >
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-hijau/10 flex items-center justify-center">
            <Box class="h-6 w-6 text-hijau" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Products
            </p>
            <h3 class="text-xl font-black">{{ productStore.products?.pagination.total || 0 }}</h3>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-white/50 border-slate-200 shadow-sm">
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <TrendingUp class="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Most Popular
            </p>
            <h3 class="text-xl font-black">Arabica Latte</h3>
          </div>
        </CardContent>
      </Card>
      <Card class="bg-white/50 border-slate-200 shadow-sm">
        <CardContent class="p-5 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-hijau/10 flex items-center justify-center">
            <LayoutGrid class="h-6 w-6 text-hijau" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Categories
            </p>
            <h3 class="text-xl font-black">4 Active</h3>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Table Card -->
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
              placeholder="Search products by name or category..."
              class="pl-10 h-10 bg-white/50 border-slate-200 group-hover:border-hijau/20 transition-all rounded-xl shadow-none focus-visible:ring-hijau/20"
            />
          </div>
          <div class="flex items-center gap-3">
            <span
              class="text-xs font-semibold text-slate-500 uppercase tracking-widest hidden sm:inline"
              >Rows:</span
            >
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
                  >Product</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Category</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Price</TableHead
                >
                <TableHead
                  class="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500"
                  >Description</TableHead
                >
                <TableHead
                  class="pr-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500 text-right"
                  >Action</TableHead
                >
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="item in productStore.products?.data"
                :key="item.id"
                class="group border-b border-slate-100/50 hover:bg-slate-50/50 transition-all duration-200"
              >
                <TableCell class="pl-6 py-4">
                  <div class="flex items-center gap-4">
                    <div
                      class="h-12 w-12 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform"
                    >
                      <img
                        :src="item.image"
                        :alt="item.product_name"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="flex flex-col">
                      <span class="font-bold text-foreground text-base">{{
                        item.product_name
                      }}</span>
                      <span
                        class="text-[10px] uppercase font-black tracking-widest text-slate-400"
                        >ID: {{ item.id.slice(-6) }}</span
                      >
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <Badge
                    :class="
                      cn(
                        'rounded-full font-bold px-3 py-1 border',
                        categoryColors[item.category] || 'bg-slate-100 text-slate-600 border-slate-200',
                      )
                    "
                  >
                    {{ item.category }}
                  </Badge>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <span class="font-black text-foreground"
                    >Rp {{ item.price.toLocaleString() }}</span
                  >
                </TableCell>

                <TableCell class="px-6 py-4">
                  <p
                    class="text-xs text-slate-500 max-w-[250px] italic leading-relaxed truncate"
                    :title="item.description"
                  >
                    {{ item.description }}
                  </p>
                </TableCell>

                <TableCell class="pr-6 py-4 text-right">
                  <div
                    class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
                  >
                    <RouterLink :to="`/product/edit/${item.id}`">
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
                            Remove Product
                          </DialogTitle>
                          <DialogDescription class="pt-4 text-base">
                            Are you sure you want to delete
                            <span class="font-black">{{ item.product_name }}</span
                            >? This will remove it from the menu and cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="gap-3 sm:gap-0 mt-6">
                          <DialogClose as-child>
                            <Button variant="ghost" class="rounded-xl flex-1 h-12">Cancel</Button>
                          </DialogClose>
                          <Button
                            class="bg-destructive hover:bg-destructive/90 text-white rounded-xl flex-1 h-12 font-bold"
                            @click="handleDelete(item.id)"
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
              <TableRow v-if="!productStore.products?.data.length">
                <TableCell colspan="5" class="h-[400px] text-center">
                  <div class="flex flex-col items-center justify-center gap-4">
                    <div
                      class="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center"
                    >
                      <Coffee class="h-10 w-10 text-slate-300" />
                    </div>
                    <div class="space-y-1">
                      <h3 class="text-xl font-bold">No products available</h3>
                      <p class="text-slate-500 text-sm">
                        Start building your menu by adding your first product.
                      </p>
                    </div>
                    <RouterLink to="/product/create">
                      <Button class="bg-hijau hover:bg-hijautua mt-2 px-8 rounded-xl shadow-lg"
                        >Create Product</Button
                      >
                    </RouterLink>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <!-- Footer Container -->
      <div
        class="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/10"
      >
        <p class="text-xs font-black text-slate-500 uppercase tracking-widest">
          Showing {{ productStore.products?.data.length }} products out of
          {{ productStore.products?.pagination.total }}
        </p>

        <Pagination
          v-if="productStore.products?.pagination.total"
          :items-per-page="Number(rowPerPage)"
          :total="productStore.products?.pagination.total"
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
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply rounded-full;
}
</style>
