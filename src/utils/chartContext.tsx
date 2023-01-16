import { createContext, JSXElement, useContext } from 'solid-js'
import { ChartContextValue } from '../types'

const chartContext = createContext<any>(null!)

export function ChartContextProvider<TDatum>({
  value,
  children,
}: {
  value: () => ChartContextValue<TDatum>
  children: JSXElement
}) {
  return <chartContext.Provider value={value} children={children} />
}

export default function useChartContext<TDatum>() {
  return useContext(chartContext)() as ChartContextValue<TDatum>
}
