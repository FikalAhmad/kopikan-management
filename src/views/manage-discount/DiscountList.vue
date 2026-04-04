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
import { DeleteIcon, EditIcon } from '@/lib/icons'
import { useDiscountStore } from '@/store/useDiscountStore'
import { ref, watch } from 'vue'

const discountStore = useDiscountStore()
const rowPerPage = ref<number>(10)
const currentPage = ref<number>(1)

const handleDelete = (id: string) => {
  discountStore.deleteDiscount(id)
}

const goToNextPage = () => {
  const maxPage = Math.ceil((discountStore.discounts?.pagination.total ?? 0) / rowPerPage.value)

  if (currentPage.value < maxPage) {
    currentPage.value++
  }
}

watch(
  () => [currentPage.value, rowPerPage.value],
  async () => {
    try {
      discountStore.fetchDiscounts({
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
            <CardTitle class="text-2xl font-bold">Discount Management</CardTitle>
            <CardDescription class="mt-1"
              >Manage and view your discounts in one place.</CardDescription
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
                  >Discount Code</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Description</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Type</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Value</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Min Purchase</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Max Discount</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Valid Days</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Time Start</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Time End</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Start Date</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >End Date</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >Status</TableHead
                >
                <TableHead
                  class="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap text-center"
                  >Action</TableHead
                >
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="item in discountStore.discounts?.data"
                :key="item.id"
                class="group border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <TableCell class="px-6 py-4 text-foreground font-medium">
                  {{ item.code }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.description }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.type }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.value }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.min_purchase ?? '-' }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.max_discount ?? '-' }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  <Badge v-for="vd in item.valid_days" :key="vd">
                    {{ vd }}
                  </Badge>
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.time_start ?? '-' }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.time_end ?? '-' }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ new Date(item.start_date).toISOString().split('T')[0] }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ new Date(item.end_date).toISOString().split('T')[0] }}
                </TableCell>
                <TableCell class="px-6 py-4 text-muted-foreground">
                  {{ item.is_active }}
                </TableCell>
                <TableCell class="px-6 py-4 text-right">
                  <div
                    class="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RouterLink :to="`/product/edit/${item.id}`" title="Edit Order">
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
            v-if="discountStore.discounts?.pagination.total ?? 0 > 0"
            v-slot="{ page }"
            :items-per-page="discountStore.discounts?.pagination.pageSize || 10"
            :total="discountStore.discounts?.pagination.total"
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
                <PaginationEllipsis
                  v-else-if="item.type === 'ellipsis'"
                  :key="item.type"
                  :index="index"
                />
              </template>

              <PaginationNext class="h-8" @click="goToNextPage" />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
