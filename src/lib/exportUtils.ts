import { axiosJWT } from './axios'

type ExportFormat = 'xlsx' | 'csv'

interface ExportOptions {
  startDate?: string
  endDate?: string
  format?: ExportFormat
}

/**
 * Downloads a report file from the backend API.
 * Supports both Excel (.xlsx) and CSV (.csv) formats.
 * @param endpoint - The report endpoint (e.g., 'users', 'orders', 'payments')
 * @param options - Optional date range and file format
 */
export const downloadReport = async (endpoint: string, options: ExportOptions = {}) => {
  const { startDate, endDate, format = 'xlsx' } = options

  const params = new URLSearchParams()
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)
  params.append('format', format)

  const response = await axiosJWT.get(`/api/reports/${endpoint}?${params.toString()}`, {
    responseType: 'blob',
  })

  const extension = format === 'csv' ? 'csv' : 'xlsx'
  const contentDisposition = response.headers['content-disposition']
  let filename = `Laporan_${endpoint}_${new Date().toISOString().substring(0, 10)}.${extension}`

  // Try to extract filename from Content-Disposition header
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^";\n]+)"?/)
    if (match?.[1]) {
      filename = match[1]
    }
  }

  const blob = new Blob([response.data])
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
