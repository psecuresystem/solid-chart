import { createEffect, createRenderEffect } from 'solid-js'

export default typeof window !== 'undefined' ? createRenderEffect : createEffect
