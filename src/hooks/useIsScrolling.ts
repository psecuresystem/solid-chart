import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js'

export default function useIsScrolling(debounce: Accessor<number>) {
  const [isScrolling, setIsScrolling] = createSignal(false)

  createEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const cb = () => {
      setIsScrolling(true)

      clearTimeout(timeout)

      timeout = setTimeout(() => {
        setIsScrolling(false)
      }, debounce())
    }

    document.addEventListener('scroll', cb, true)

    onCleanup(() => {
      clearTimeout(timeout)
      document.removeEventListener('scroll', cb)
    })
  })

  return isScrolling
}
