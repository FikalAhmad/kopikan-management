import { ref, watch, onUnmounted, type Ref } from 'vue'

/**
 * A custom hook to debounce a value in Vue 3.
 * 
 * @param value The Ref to debounce.
 * @param delay The delay in milliseconds (default: 500ms).
 * @returns A Ref containing the debounced value.
 */
export function useDebounce<T>(value: Ref<T>, delay: number = 500): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout> | null = null

  const clear = () => {
    if (timeout) clearTimeout(timeout)
  }

  watch(value, (newValue) => {
    clear()
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  onUnmounted(clear)

  return debouncedValue
}
