<template>
  <div class="mx-10 mt-5">
    <div class="flex justify-between">
      <div class="text-2xl font-semibold">User Management</div>
      <Button size="sm">
        <router-link to="/user/create"> Create User </router-link>
      </Button>
    </div>
    <Card class="mt-10">
      <CardHeader>
        <CardTitle>User List</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow class="flex items-center">
              <TableHead class="w-36">Name</TableHead>
              <TableHead class="w-56">Email</TableHead>
              <TableHead class="w-36">Role</TableHead>
              <TableHead class="w-36 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow class="flex">
              <TableCell class="w-36">Haikal</TableCell>
              <TableCell class="w-56">admin@gmail.com</TableCell>
              <TableCell class="w-36">Admin</TableCell>
              <TableCell
                ><div class="flex gap-3">
                  <RouterLink to="/user/edit">
                    <img src="/src/components/icons/edit-icon.svg" alt="Edit Icon" />
                  </RouterLink>
                  <img src="/src/components/icons/delete-icon.svg" alt="Delete Icon" /></div
              ></TableCell>
            </TableRow>
            <TableRow class="flex">
              <TableCell class="w-36">Haikal</TableCell>
              <TableCell class="w-56">admin@gmail.com</TableCell>
              <TableCell class="w-36">Admin</TableCell>
              <TableCell
                ><div class="flex gap-3">
                  <img src="/src/components/icons/edit-icon.svg" alt="Edit Icon" />
                  <img src="/src/components/icons/delete-icon.svg" alt="Delete Icon" /></div
              ></TableCell>
            </TableRow>
            <TableRow class="flex">
              <TableCell class="w-36">Haikal</TableCell>
              <TableCell class="w-56">admin@gmail.com</TableCell>
              <TableCell class="w-36">Admin</TableCell>
              <TableCell>
                <div class="flex gap-3">
                  <img src="/src/components/icons/edit-icon.svg" alt="Edit Icon" />
                  <img src="/src/components/icons/delete-icon.svg" alt="Delete Icon" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter class="py-2">Rows per page 5</TableFooter>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/ButtonComponent'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/CardComponent'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/TableComponent'
</script>
