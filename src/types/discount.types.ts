export interface DiscountProps {
  id: string
  code: string
  description: string
  type: string
  value: number
  min_purchase?: number
  max_discount?: number
  valid_days?: string[]
  time_start?: string
  time_end?: string
  start_date: string
  end_date: string
  is_active: boolean
}
