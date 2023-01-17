import { Accessor, createEffect, createSignal } from 'solid-js'

export default function useLatestWhen<T>(obj: T, when: Accessor<boolean> = () => true) {
  const [ref, setRef] = createSignal<T | null>(when() ? obj : null)

  createEffect(() => {
    if (when()) {
      setRef(prev => obj)
    }
  })

  return ref
}
