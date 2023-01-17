import { Accessor, createEffect, createMemo, createSignal, on, onCleanup } from 'solid-js'
import { Spring } from '../utils/spring'
import useGetLatest from './useGetLatest'

export function useSpring(
  value: Accessor<number>,
  config: [number, number, number],
  cb: (x: number) => void,
  immediate?: Accessor<boolean>,
  debug?: Accessor<boolean>,
) {
  const springRef = new Spring(value(), ...config)
  const getValue = useGetLatest(value())

  const [startRaf, stopRaf] = useRaf(() => {
    cb(springRef.x())
    return springRef.done()
  })

  // Immediate
  createEffect(
    on(
      () => [debug?.(), getValue(), immediate?.(), startRaf?.(), stopRaf?.(), value?.()],
      () => {
        if (immediate) {
          springRef.snap(getValue())
          startRaf?.()
          return
        }
        springRef.setEnd(value())
        startRaf?.()
      },
    ),
  )

  onCleanup(() => {
    stopRaf?.()
  })

  return springRef
}

export function useRaf(callback: () => any) {
  const [raf, setRaf] = createSignal<number | null>(null)
  const rafCallback = callback
  const tick = () => {
    if (rafCallback()) return
    setRaf(requestAnimationFrame(tick))
  }

  return [tick, () => raf() && cancelAnimationFrame(raf() as number)]
}
