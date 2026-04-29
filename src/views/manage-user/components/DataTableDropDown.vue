<script setup lang="ts">
import { AlertCircle, MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/store/useUserStore'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'

defineProps<{
  id: string
  name: string
}>()

const userStore = useUserStore()

const deleteUser = async (id: string) => {
  await userStore.deleteUser(id)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        ><RouterLink :to="`/user/edit/${id}`">Edit User</RouterLink></DropdownMenuItem
      >
      <Dialog>
        <DialogTrigger as-child>
          <DropdownMenuItem @select.prevent>Delete User</DropdownMenuItem>
        </DialogTrigger>
        <DialogContent class="border-none shadow-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle class="text-2xl font-bold flex items-center gap-2">
              <AlertCircle class="h-6 w-6 text-destructive" />
              Revoke Access
            </DialogTitle>
            <DialogDescription class="pt-4 text-base">
              Warning: You are about to permanently delete
              <span class="font-black">{{ name }}</span
              >'s account. They will immediately lose access to the management platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter class="gap-3 mt-6">
            <DialogClose as-child>
              <Button variant="ghost" class="rounded-xl flex-1 h-12">Cancel</Button>
            </DialogClose>
            <Button
              class="bg-destructive hover:bg-destructive/90 text-white rounded-xl flex-1 h-12 font-bold"
              @click="deleteUser(id)"
            >
              Confirm Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
