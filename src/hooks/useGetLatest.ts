import { createSignal } from 'solid-js'

export default function useGetLatest<T>(obj: T) {
  const [ref] = createSignal(obj)

  return ref
}
