import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js'

export default function useRect(
  element: Accessor<Element | null | undefined>,
  enabled: boolean,
): Accessor<DOMRect> {
  const [rectRef, setRectRef] = createSignal({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  } as DOMRect)

  const measure = () => {
    if (element()) {
      element() && setRectRef(element()!.getBoundingClientRect())
    }
  }

  createEffect(() => {
    if (!rectRef) {
      measure()
    }
  })

  createEffect(() => {
    if (!element || !enabled) {
      return
    }

    const cb = () => {
      measure()
    }

    document.addEventListener('scroll', cb, true)

    return () => {
      document.removeEventListener('scroll', cb, true)
    }
  }, [element, enabled, measure])

  createEffect(() => {
    if (!element || !enabled) {
      return
    }

    measure()

    const observer = new ResizeObserver(() => {
      measure()
    })

    observer.observe(element() as Element)

    onCleanup(() => {
      observer.unobserve(element() as Element)
    })
  }, [element, enabled, measure])

  return rectRef
}
