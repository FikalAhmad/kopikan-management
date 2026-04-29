<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState, ColumnFiltersState } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import { valueUpdater } from '@/components/ui/table/utils'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total: number
  pageIndex: number
  pageSize: number
  searchQuery?: string
}>()

const emit = defineEmits<{
  (e: 'update:pageIndex', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:searchQuery', value: string): void
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  get rowCount() {
    return props.total
  },
  getCoreRowModel: getCoreRowModel(),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  manualPagination: true,
  state: {
    get pagination() {
      return {
        pageIndex: props.pageIndex - 1,
        pageSize: props.pageSize,
      }
    },
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
  },
  onPaginationChange: (updaterOrValue) => {
    const nextState =
      typeof updaterOrValue === 'function'
        ? updaterOrValue({ pageIndex: props.pageIndex - 1, pageSize: props.pageSize })
        : updaterOrValue

    emit('update:pageIndex', nextState.pageIndex + 1)
    emit('update:pageSize', nextState.pageSize)
  },
})
</script>

<template>
  <div class="border rounded-md">
    <div class="flex items-center justify-between py-4 px-4 gap-10">
      <Input
        class="w-full"
        placeholder="Search users..."
        :model-value="searchQuery"
        @update:model-value="emit('update:searchQuery', $event as string)"
      />

      <div class="flex items-center gap-3">
        <span
          class="text-xs font-semibold text-slate-500 uppercase tracking-widest hidden sm:inline"
          >Rows:</span
        >
        <Select
          :value="table.getState().pagination.pageSize.toString()"
          @update:value="table.setPageSize"
        >
          <SelectTrigger class="h-10 w-20 bg-white/50 border-slate-200 rounded-xl">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10" @click="table.setPageSize(10)">10</SelectItem>
            <SelectItem value="20" @click="table.setPageSize(20)">20</SelectItem>
            <SelectItem value="50" @click="table.setPageSize(50)">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>

    <div class="flex items-center justify-between py-4 px-4">
      <div class="text-sm text-muted-foreground">
        Showing {{ (pageIndex - 1) * pageSize + 1 }} to
        {{ Math.min(pageIndex * pageSize, total) }} of {{ total }} results
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pageIndex <= 1"
          @click="emit('update:pageIndex', pageIndex - 1)"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="pageIndex >= Math.ceil(total / pageSize)"
          @click="emit('update:pageIndex', pageIndex + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
