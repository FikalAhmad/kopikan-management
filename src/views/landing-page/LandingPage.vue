<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { axiosJWT } from '../../lib/axios'
import BarChart from './components/BarChart.vue'
import MultipleUserIcon from '../../assets/icons/multiple-user.svg?component'
import CartIcon from '../../assets/icons/cart.svg?component'
import MoneyIcon from '../../assets/icons/money.svg?component'
import {
  type TotalDashboardSummary,
  type TotalOrderSummaryProps,
  type ProductCategory,
  type ProductSummaryProps,
} from '@/types/global.types'
import type { ChartDataset } from 'chart.js'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AnalyticIcon, PackageIcon } from '@/lib/icons'

const filterReport = ref<{ period: string; category: string }>({
  period: '1y',
  category: 'signature',
})
const productDataSales = ref<ProductSummaryProps[]>()
const dataDashboardReport = ref<TotalDashboardSummary>()
const dataProductReport = ref<{ getProductReport: ProductCategory }>({
  getProductReport: {
    coffee: [],
    noncoffee: [],
    signature: [],
  },
})
const totalOrderSum = ref<TotalOrderSummaryProps[]>()

const chartData = ref({
  labels: [] as string[],
  datasets: [] as ChartDataset<'bar', (number | [number, number] | null)[]>[],
})

const chartOption = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

watch(
  () => [filterReport.value.period, filterReport.value.category],
  async () => {
    try {
      const productRes = await axiosJWT.post('/api/products/filter', {
        period: filterReport.value.period,
      })

      // update data hasil request
      dataProductReport.value.getProductReport = productRes.data.data[0]

      // ambil berdasarkan kategori aktif
      const category = filterReport.value.category
      const report = dataProductReport.value.getProductReport

      let labels: string[] = []
      let data: number[] = []
      let backgroundColor = ''
      let label = ''

      if (category === 'coffee') {
        labels = report.coffee.map((item) => item.name)
        data = report.coffee.map((item) => Number(item.sellingProduct))
        backgroundColor = '#44911f'
        label = 'Coffee'
      } else if (category === 'noncoffee') {
        labels = report.noncoffee.map((item) => item.name)
        data = report.noncoffee.map((item) => Number(item.sellingProduct))
        backgroundColor = '#367619'
        label = 'Non Coffee'
      } else if (category === 'signature') {
        labels = report.signature.map((item) => item.name)
        data = report.signature.map((item) => Number(item.sellingProduct))
        backgroundColor = '#275412'
        label = 'Signature'
      }

      chartData.value = {
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor,
          },
        ],
      }
    } catch (err) {
      console.error('Error loading product report:', err)
    }
  },
  { immediate: true },
)

onMounted(async () => {
  const [dashboardSummary, productTopRes, orderSumRes] = await Promise.all([
    axiosJWT.get('/api/dashboard/total-summary'),
    axiosJWT.get('/api/products'),
    axiosJWT.get('/api/dashboard/order-summary'),
  ])

  dataDashboardReport.value = dashboardSummary.data.data
  productDataSales.value = productTopRes.data.data
  totalOrderSum.value = orderSumRes.data.data
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-6 gap-5 bg-gray-200 p-5">
    <div class="bg-white h-32 rounded-lg flex flex-col justify-center md:col-span-2 px-10 gap-3">
      <div class="text-sm">Total Sales</div>
      <div class="flex justify-between items-center gap-10">
        <div class="text-4xl font-bold">
          {{ dataDashboardReport?.totalOrder }}
        </div>
        <div class="p-3 bg-gray-200 rounded-lg">
          <CartIcon />
        </div>
      </div>
    </div>
    <div class="bg-white h-32 rounded-lg flex flex-col justify-center md:col-span-2 px-10 gap-3">
      <div class="text-sm">Total Customer</div>
      <div class="flex justify-between items-center gap-10">
        <div class="text-4xl font-bold">
          {{ dataDashboardReport?.totalCustomer }}
        </div>
        <div class="p-3 bg-gray-200 rounded-lg">
          <MultipleUserIcon />
        </div>
      </div>
    </div>
    <div class="bg-white h-32 rounded-lg flex flex-col justify-center md:col-span-2 px-10 gap-3">
      <div class="text-sm">Total Revenue</div>
      <div class="flex justify-between items-center gap-10">
        <div class="text-4xl font-bold">
          {{ dataDashboardReport?.totalRevenue }}
        </div>
        <div class="p-3 bg-gray-200 rounded-lg">
          <MoneyIcon />
        </div>
      </div>
    </div>

    <div class="md:col-span-3 bg-white rounded-lg p-5">
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-3 justify-between mb-5 items-center">
          <div class="flex gap-2 items-center">
            <AnalyticIcon />
            <div class="font-bold">Total Sales Overview</div>
          </div>
          <div class="flex gap-3 flex-row-reverse">
            <Select v-model:modelValue="filterReport.category" class="border-2 px-2 text-xs">
              <SelectTrigger class="w-32">
                <SelectValue placeholder="Signature" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="signature" class="text-xs py-2 px-3 rounded-md"
                    >Signature</SelectItem
                  >
                  <SelectItem value="coffee" class="text-xs py-2 px-3 rounded-md"
                    >Coffee</SelectItem
                  >
                  <SelectItem value="noncoffee" class="text-xs py-2 px-3 rounded-md"
                    >Non Coffee</SelectItem
                  >
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select v-model:modelValue="filterReport.period" class="text-xs">
              <SelectTrigger class="w-32">
                <SelectValue placeholder="Signature" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="7d" class="text-xs py-2 px-3 rounded-md">Last Week</SelectItem>
                  <SelectItem value="1m" class="text-xs py-2 px-3 rounded-md"
                    >Last Month</SelectItem
                  >
                  <SelectItem value="1y" class="text-xs py-2 px-3 rounded-md">Last Year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <BarChart :chartData="chartData" :chartOptions="chartOption" />
      </div>
    </div>

    <div class="md:col-span-3 bg-white rounded-lg p-5">
      <div>
        <div class="flex gap-3 items-center">
          <PackageIcon />
          <div class="font-bold">Top Selling Product</div>
        </div>
        <div class="max-h-[50vh] overflow-y-auto">
          <Table class="w-full table-fixed">
            <TableHeader class="sticky top-0 z-20 bg-white border-b-2 border-gray-300 shadow-sm">
              <TableRow>
                <TableHead class="py-2 pl-2 text-left">Product</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in totalOrderSum" :key="item.productid">
                <TableCell class="w-52">{{ item.product_name }}</TableCell>
                <TableCell class="w-52 text-center">{{ item.total_qty }}</TableCell>
                <TableCell class="w-52 text-center">{{ item.total_sales }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
