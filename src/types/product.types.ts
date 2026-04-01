export interface ProductProps {
  id: string
  image: string
  product_name: string
  price: number
  description: string
  category: string
  options: {
    id: string
    name: string
    values: {
      id: string
      label: string
      extra_price: number
    }[]
  }[]
}

export interface ProductInput {
  image: string
  product_name: string
  price: number
  description: string
  category: string
  options: {
    name: string
    values: {
      label: string
      extra_price: number
    }[]
  }[]
}
