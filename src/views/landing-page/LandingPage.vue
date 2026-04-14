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
import type { ChartDataset, ChartOptions } from 'chart.js'
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

const chartOption: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Cleaner look without legend when single category
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 8,
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 12 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f1f5f9',
      },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
      },
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

      dataProductReport.value.getProductReport = productRes.data.data[0]

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
            borderRadius: 6,
            hoverBackgroundColor: '#36cd1d',
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
  <div class="min-h-full flex flex-col gap-6 md:p-4 bg-slate-50/30">
    <!-- Header Section -->
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
      <p class="text-slate-500 text-sm font-medium">
        Monitoring your business performance at a glance.
      </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
      <div
        class="group relative bg-white md:col-span-2 overflow-hidden rounded-2xl border border-slate-100 p-6 shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-hijau/10 transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-400"
              >Total Sales</span
            >
            <div class="text-4xl font-extrabold text-slate-800 leading-none">
              {{ dataDashboardReport?.totalOrder || 0 }}
            </div>
            <div
              class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-hijau/10 text-hijautua text-[10px] font-bold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-hijautua animate-pulse"></span>
              Live Tracking
            </div>
          </div>
          <div
            class="p-4 bg-slate-50 rounded-xl group-hover:bg-hijau/20 group-hover:scale-110 transition-all duration-300"
          >
            <CartIcon class="w-6 h-6 text-slate-600 group-hover:text-hijautua transition-colors" />
          </div>
        </div>
        <div class="absolute -bottom-2 -left-2 w-24 h-24 bg-hijau/5 rounded-full blur-2xl"></div>
      </div>

      <div
        class="group relative bg-white md:col-span-2 overflow-hidden rounded-2xl border border-slate-100 p-6 shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-400"
              >Total Customer</span
            >
            <div class="text-4xl font-extrabold text-slate-800 leading-none">
              {{ dataDashboardReport?.totalCustomer || 0 }}
            </div>
            <div
              class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Active Users
            </div>
          </div>
          <div
            class="p-4 bg-slate-50 rounded-xl group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300"
          >
            <MultipleUserIcon
              class="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors"
            />
          </div>
        </div>
        <div class="absolute -bottom-2 -left-2 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
      </div>

      <div
        class="group relative bg-white md:col-span-2 overflow-hidden rounded-2xl border border-slate-100 p-6 shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-amber-500/10 transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-400"
              >Total Revenue</span
            >
            <div class="text-4xl font-extrabold text-slate-800 leading-none">
              <span class="text-2xl font-bold opacity-40">Rp</span>
              {{ dataDashboardReport?.totalRevenue || 0 }}
            </div>
            <div
              class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              Earnings
            </div>
          </div>
          <div
            class="p-4 bg-slate-50 rounded-xl group-hover:bg-amber-100 group-hover:scale-110 transition-all duration-300"
          >
            <MoneyIcon
              class="w-6 h-6 text-slate-600 group-hover:text-amber-600 transition-colors"
            />
          </div>
        </div>
        <div
          class="absolute -bottom-2 -left-2 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"
        ></div>
      </div>
    </div>

    <!-- Main Content Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
      <!-- Sales Overview Chart -->
      <div
        class="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3 text-slate-800">
            <div class="p-2 bg-hijau/10 rounded-lg">
              <AnalyticIcon class="w-5 h-5 text-hijautua" />
            </div>
            <h2 class="font-bold text-lg">Sales Overview</h2>
          </div>

          <div class="flex gap-2">
            <Select v-model:modelValue="filterReport.category">
              <SelectTrigger class="h-8 w-32 text-xs border-slate-100 bg-slate-50/50 font-medium">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="signature" class="text-xs">Signature</SelectItem>
                <SelectItem value="coffee" class="text-xs">Coffee</SelectItem>
                <SelectItem value="noncoffee" class="text-xs">Non Coffee</SelectItem>
              </SelectContent>
            </Select>

            <Select v-model:modelValue="filterReport.period">
              <SelectTrigger class="h-8 w-32 text-xs border-slate-100 bg-slate-50/50 font-medium">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d" class="text-xs">Last Week</SelectItem>
                <SelectItem value="1m" class="text-xs">Last Month</SelectItem>
                <SelectItem value="1y" class="text-xs">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="flex-1 w-full min-h-[300px]">
          <BarChart :chartData="chartData" :chartOptions="chartOption" />
        </div>
      </div>

      <!-- Top Selling Products Table -->
      <div
        class="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 overflow-hidden"
      >
        <div class="flex items-center gap-3 text-slate-800 mb-8">
          <div class="p-2 bg-blue-50 rounded-lg">
            <PackageIcon class="w-5 h-5 text-blue-600" />
          </div>
          <h2 class="font-bold text-lg">Top Selling Products</h2>
        </div>

        <div class="flex-1 overflow-auto rounded-xl border border-slate-50">
          <Table>
            <TableHeader class="sticky top-0 bg-slate-50/80 backdrop-blur-md">
              <TableRow class="hover:bg-transparent border-slate-100">
                <TableHead
                  class="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest"
                  >Product</TableHead
                >
                <TableHead
                  class="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center"
                  >Units Sold</TableHead
                >
                <TableHead
                  class="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right"
                  >Revenue</TableHead
                >
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="item in totalOrderSum"
                :key="item.productid"
                class="group hover:bg-slate-50/50 border-slate-50 transition-colors"
              >
                <TableCell class="py-4 px-4">
                  <div
                    class="font-semibold text-slate-700 group-hover:text-hijautua transition-colors"
                  >
                    {{ item.product_name }}
                  </div>
                </TableCell>
                <TableCell class="py-4 px-4 text-center">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold leading-none"
                  >
                    {{ item.total_qty }}
                  </span>
                </TableCell>
                <TableCell class="py-4 px-4 text-right">
                  <div class="font-bold text-slate-700">Rp {{ item.total_sales }}</div>
                </TableCell>
              </TableRow>
              <!-- Empty state fallback -->
              <TableRow v-if="!totalOrderSum?.length">
                <TableCell colspan="3" class="p-8 text-center text-slate-400 font-medium">
                  No data available for the selected period
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Soft transitions for chart container */
.flex-1 {
  transition: height 0.3s ease;
}

/* Custom scrollbar for table container */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
