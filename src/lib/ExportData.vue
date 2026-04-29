<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
import { Download, Loader2, CalendarIcon, FileSpreadsheet, FileText } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import { downloadReport } from './exportUtils'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const props = defineProps<{
  endpoint: string
}>()

const startDate = ref<DateValue>()
const endDate = ref<DateValue>()
const isExporting = ref(false)
const exportError = ref<string | null>(null)

const handleExport = async (format: 'CSV' | 'Excel') => {
  try {
    isExporting.value = true
    exportError.value = null

    const options = {
      startDate: startDate.value?.toString(),
      endDate: endDate.value?.toString(),
      format: format.toLowerCase() as 'xlsx' | 'csv',
    }

    await downloadReport(props.endpoint, options)
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    console.error('Export failed:', error)
    exportError.value = axiosError.response?.data?.message || 'Export failed. Please try again.'
  } finally {
    isExporting.value = false
  }
}
</script>
<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button
        variant="outline"
        class="flex gap-2 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-slate-50 hover:border-hijau/30 transition-all font-bold text-slate-600 shadow-sm px-4 md:px-5 cursor-pointer"
      >
        <Download class="h-4 w-4 text-hijau" />
        <span>Export Data</span>
      </Button>
    </DialogTrigger>
    <DialogContent
      class="sm:max-w-lg p-0 overflow-hidden rounded-[32px] border-none shadow-2xl bg-white"
    >
      <!-- Premium Header -->
      <div class="relative bg-slate-50/50 p-8 border-b border-slate-100">
        <div class="flex items-center gap-5">
          <div class="space-y-1">
            <DialogTitle class="text-2xl font-black text-slate-800 tracking-tight"
              >Export Report</DialogTitle
            >
            <DialogDescription class="text-slate-500 font-medium text-sm">
              Configure your data export settings and download your report.
            </DialogDescription>
          </div>
        </div>
      </div>

      <div class="px-8 pb-8 space-y-8">
        <!-- Date Selection Section -->
        <div class="space-y-4">
          <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">
            Period Selection
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-600 pl-1">From Date</label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="
                      cn(
                        'w-full h-14 justify-start text-left font-semibold rounded-2xl border-slate-200 bg-slate-50/30 hover:bg-white hover:border-hijau/40 hover:shadow-md hover:shadow-hijau/5 transition-all group',
                        !startDate && 'text-slate-400',
                      )
                    "
                  >
                    <div
                      class="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center mr-3 group-hover:border-hijau/20 transition-colors"
                    >
                      <CalendarIcon class="h-4 w-4 text-hijau" />
                    </div>
                    {{
                      startDate
                        ? df.format(startDate.toDate(getLocalTimeZone()))
                        : 'Pick start date'
                    }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  class="w-auto p-0 rounded-2xl border-slate-100 shadow-2xl overflow-hidden"
                  align="start"
                >
                  <Calendar
                    v-model="startDate"
                    :initial-focus="true"
                    layout="month-and-year"
                    class="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-600 pl-1">To Date</label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="
                      cn(
                        'w-full h-14 justify-start text-left font-semibold rounded-2xl border-slate-200 bg-slate-50/30 hover:bg-white hover:border-hijau/40 hover:shadow-md hover:shadow-hijau/5 transition-all group',
                        !endDate && 'text-slate-400',
                      )
                    "
                  >
                    <div
                      class="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center mr-3 group-hover:border-hijau/20 transition-colors"
                    >
                      <CalendarIcon class="h-4 w-4 text-hijau" />
                    </div>
                    {{ endDate ? df.format(endDate.toDate(getLocalTimeZone())) : 'Pick end date' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  class="w-auto p-0 rounded-2xl border-slate-100 shadow-2xl overflow-hidden"
                  align="start"
                >
                  <Calendar
                    v-model="endDate"
                    :initial-focus="true"
                    layout="month-and-year"
                    class="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <!-- Format Selection & Actions -->
        <div class="space-y-4">
          <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">
            Available Formats
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              @click="handleExport('CSV')"
              :disabled="isExporting"
              class="flex items-center gap-4 p-5 rounded-[24px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100 transition-all text-left group disabled:opacity-50 disabled:pointer-events-none"
            >
              <div
                class="h-12 w-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <FileText class="h-6 w-6" />
              </div>
              <div class="flex-1">
                <p class="font-bold text-slate-800">CSV Document</p>
                <p class="text-xs font-medium text-slate-500">Fast, raw data format</p>
              </div>
              <Loader2 v-if="isExporting" class="h-4 w-4 animate-spin text-slate-300" />
            </button>

            <button
              @click="handleExport('Excel')"
              :disabled="isExporting"
              class="flex items-center gap-4 p-5 rounded-[24px] border border-hijau/5 bg-hijau/[0.03] hover:bg-hijau hover:border-hijau hover:shadow-xl hover:shadow-hijau/20 transition-all text-left group disabled:opacity-50 disabled:pointer-events-none"
            >
              <div
                class="h-12 w-12 rounded-xl bg-white text-hijau flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
              >
                <FileSpreadsheet class="h-6 w-6" />
              </div>
              <div class="flex-1">
                <p class="font-bold text-hijau group-hover:text-white transition-colors">
                  Excel Sheet
                </p>
                <p
                  class="text-xs font-medium text-hijau/60 group-hover:text-white/70 transition-colors"
                >
                  Formatted report
                </p>
              </div>
              <Loader2
                v-if="isExporting"
                class="h-4 w-4 animate-spin text-hijau group-hover:text-white"
              />
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="exportError"
          class="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100"
        >
          <div class="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          {{ exportError }}
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center"
      >
        <DialogClose as-child>
          <Button
            variant="ghost"
            class="text-slate-400 font-bold hover:text-slate-600 hover:bg-transparent cursor-pointer"
          >
            Go back to management
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
</template>
