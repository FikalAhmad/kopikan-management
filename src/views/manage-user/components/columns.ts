import type { User } from '@/types/auth.types'
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-vue-next'
import DataTableDropDown from './DataTableDropDown.vue'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'text-left font-medium' }, row.getValue('name') as string),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) =>
      h('div', { class: 'text-left font-medium' }, row.getValue('email') as string),
  },
  {
    accessorKey: 'role',
    header: () => h('div', { class: 'text-left' }, 'Role'),
    cell: ({ row }) => {
      const role = row.getValue('role') as { role_name: string }
      return h('div', { class: 'text-left font-medium' }, role.role_name)
    },
  },
  {
    accessorKey: 'phone',
    header: () => h('div', { class: 'text-left' }, 'Phone'),
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string
      return h('div', { class: 'text-left font-medium' }, phone)
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-left' }, 'Actions'),
    cell: ({ row }) => {
      const user = row.original
      return h(DataTableDropDown, {
        id: user.id,
        name: user.name,
      })
    },
  },
]
