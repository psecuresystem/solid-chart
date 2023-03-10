import { createEffect, createSignal } from 'solid-js'

export default function usePortalElement() {
  const [portalEl, setPortalEl] = createSignal()

  createEffect(() => {
    if (!portalEl()) {
      let element = document.getElementById('react-charts-portal') as HTMLDivElement

      if (!element) {
        element = document.createElement('div')

        element.setAttribute('id', 'react-charts-portal')

        Object.assign(element.style, {
          pointerEvents: 'none',
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          'z-index': 99999999999,
        })

        document.body.append(element)
      }

      setPortalEl(element)
    }
  })

  return portalEl
}
