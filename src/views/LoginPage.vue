<template>
  <div>
    {{ loginData.email }}
  </div>
  <div>
    {{ loginData.password }}
  </div>
  <form class="flex flex-col">
    <div>
      <label>Email:</label>
      <input type="email" v-model="loginData.email" />
    </div>
    <div>
      <label>Password:</label>
      <input type="email" v-model="loginData.password" />
    </div>
    <button @click="handleSubmit">Count</button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const loginData = reactive<{ email: string; password: string }>({
  email: '',
  password: '',
})

const handleSubmit = async (): Promise<void> => {
  await fetch('https://user-pos.vercel.app/api/login', {
    method: 'POST',
    body: JSON.stringify({
      email: loginData.email,
      password: loginData.password,
    }),
    headers: {
      'Content-Type': 'Application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((userData) => {
      // Process the retrieved user data
      console.log('User Data:', userData)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
</script>

<style scoped></style>
