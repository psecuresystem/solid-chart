import { Accessor, createEffect, createSignal } from 'solid-js'

export default function usePrevious<T>(val: Accessor<T>) {
  const [ref, setRef] = createSignal()

  createEffect(() => {
    setRef(val)
  })

  return ref
}
