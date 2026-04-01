export type ProductCategory = {
  signature: { name: string; sellingProduct: string }[]
  coffee: { name: string; sellingProduct: string }[]
  noncoffee: { name: string; sellingProduct: string }[]
}

export interface Product {
  id: string
  product_name: string
  image: string
  category: string
  description: string
  price: number
  stock: number
}

export type ProductSummaryProps = Product & {
  order_details: {
    id: string
    orderid: string
    productid: string
    qty: number
    total_price: number
    unit_price: number
  }[]
}

export type TotalDashboardSummary = {
  totalCustomer: number
  totalRevenue: number
  totalOrder: number
  totalOrderOffline: number
  totalOrderOnline: number
}

export type TotalOrderSummaryProps = {
  productid: string
  product_name: string
  product_image: string
  total_qty: number
  total_sales: number
  total_orders: number
}
