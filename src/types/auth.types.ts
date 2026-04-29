export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role_id: string
  role_name: string
  exp: number
}
export interface User {
  id: string
  name: string
  email: string
  phone: string
  role_id: string
  role: {
    role_name: string
  }
}

export interface UserResponse {
  success: boolean
  data: User[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
