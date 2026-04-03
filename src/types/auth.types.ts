export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role_id: string
  role_name: string
  exp: number
}
