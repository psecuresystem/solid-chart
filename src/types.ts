import { ScaleBand, ScaleLinear, ScaleTime } from 'd3-scale'
import { CurveFactory, stackOffsetNone } from 'd3-shape'
import * as CSS from 'csstype'
import * as TSTB from 'ts-toolbelt'
import { Component, createSignal, Setter } from 'solid-js'

import { TooltipRendererProps } from './components/TooltipRenderer'

export type ChartOptions<TDatum> = {
  data: UserSerie<TDatum>[]
  primaryAxis: AxisOptions<TDatum>
  secondaryAxes: AxisOptions<TDatum>[]
  padding?:
    | number
    | {
        left?: number
        right?: number
        top?: number
        bottom?: number
      }
  getSeriesStyle?: (series: Series<TDatum>, status: SeriesFocusStatus) => SeriesStyles
  getDatumStyle?: (datum: Datum<TDatum>, status: DatumFocusStatus) => DatumStyles
  getSeriesOrder?: (series: Series<TDatum>[]) => Series<TDatum>[]
  interactionMode?: InteractionMode
  showVoronoi?: boolean
  showDebugAxes?: boolean
  memoizeSeries?: boolean
  defaultColors?: string[]
  initialWidth?: number
  initialHeight?: number
  brush?: {
    style?: CSS.Properties
    onSelect?: (selection: { pointer: Pointer; start: unknown; end: unknown }) => void
  }
  onFocusDatum?: (datum: Datum<TDatum> | null) => void
  onClickDatum?: (datum: Datum<TDatum> | null, event: MouseEvent) => void
  dark?: boolean
  renderSVG?: () => Component
  primaryCursor?: boolean | CursorOptions
  secondaryCursor?: boolean | CursorOptions
  tooltip?: boolean | TooltipOptions<TDatum>
  useIntersectionObserver?: boolean
  intersectionObserverRootMargin?:
    | `${number}px`
    | `${number}px ${number}px`
    | `${number}px ${number}px ${number}px ${number}px`
}

export type RequiredChartOptions<TDatum> = TSTB.Object.Required<
  ChartOptions<TDatum>,
  | 'getSeriesOrder'
  | 'interactionMode'
  | 'tooltipMode'
  | 'showVoronoi'
  | 'defaultColors'
  | 'initialWidth'
  | 'initialHeight'
  | 'useIntersectionObserver'
  | 'intersectionObserverThreshold'
  | 'primaryCursor'
  | 'secondaryCursor'
  | 'padding'
>

export type ResolvedChartOptions<TDatum> = Omit<RequiredChartOptions<TDatum>, 'tooltip'> & {
  tooltip: ResolvedTooltipOptions<TDatum>
}

export type ChartContextValue<TDatum> = {
  getOptions: () => ResolvedChartOptions<TDatum>
  gridDimensions: GridDimensions
  primaryAxis: Axis<TDatum>
  secondaryAxes: Axis<TDatum>[]
  series: Series<TDatum>[]
  orderedSeries: Series<TDatum>[]
  datumsByInteractionGroup: Map<any, Datum<TDatum>[]>
  datumsByTooltipGroup: Map<any, Datum<TDatum>[]>
  width: number
  height: number
  // svgRef: RefObject<SVGSVGElement>
  getSeriesStatusStyle: (series: Series<TDatum>, focusedDatum: Datum<TDatum> | null) => SeriesStyles
  getDatumStatusStyle: (datum: Datum<TDatum>, focusedDatum: Datum<TDatum> | null) => DatumStyles
  axisDimensionsState: [AxisDimensions, Setter<AxisDimension>]
  focusedDatumState: [Datum<TDatum> | null, Setter<Datum<TDatum> | null>]
  isInteractingState: [boolean, Setter<boolean>]
}

export type TooltipOptions<TDatum> = {
  align?: AlignMode
  alignPriority?: AlignPosition[]
  padding?: number
  arrowPadding?: number
  groupingMode?: TooltipGroupingMode
  show?: boolean
  // anchor?: AnchorMode
  // arrowPosition?: AlignPosition
  render?: (props: TooltipRendererProps<TDatum>) => Component
  // formatSecondary?: (d: unknown) => string | number
  // formatTertiary?: (d: unknown) => string | number
  invert?: boolean
}

export type ResolvedTooltipOptions<TDatum> = TSTB.Object.Required<
  TooltipOptions<TDatum>,
  'align' | 'alignPriority' | 'padding' | 'arrowPadding' | 'anchor' | 'render'
>

export type SeriesStyles = CSS.Properties & {
  area?: CSS.Properties
  line?: CSS.Properties
  circle?: CSS.Properties
  rectangle?: CSS.Properties
}

export type DatumStyles = CSS.Properties & {
  area?: CSS.Properties
  line?: CSS.Properties
  circle?: CSS.Properties
  rectangle?: CSS.Properties
}

export type Position = 'top' | 'right' | 'bottom' | 'left'

export type InteractionMode = 'closest' | 'primary'
export type TooltipGroupingMode = 'single' | 'primary' | 'secondary' | 'series'

export type AlignMode =
  | 'auto'
  | 'right'
  | 'topRight'
  | 'bottomRight'
  | 'left'
  | 'topLeft'
  | 'bottomLeft'
  | 'top'
  | 'bottom'
  | 'center'

export type AlignPosition =
  | 'right'
  | 'topRight'
  | 'bottomRight'
  | 'left'
  | 'topLeft'
  | 'bottomLeft'
  | 'top'
  | 'bottom'

export type AxisType = 'ordinal' | 'time' | 'localTime' | 'linear' | 'log'

export type AnchorMode =
  | 'pointer'
  | 'closest'
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'gridTop'
  | 'gridBottom'
  | 'gridLeft'
  | 'gridRight'
  | 'gridCenter'

export type Side = 'left' | 'right' | 'top' | 'bottom'

type PointerBase = {
  x: number
  y: number
  svgHovered: boolean
}

export type PointerUnpressed = PointerBase & {
  dragging: false
}

export type PointerPressed = PointerBase & {
  dragging: true
  startX: number
  startY: number
}

export type Pointer = PointerUnpressed | PointerPressed

export type ChartOffset = {
  left: number
  top: number
  width: number
  height: number
}

export type AxisDimension = {
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  width: number
  height: number
}

export type AxisDimensions = {
  left: Record<string, AxisDimension>
  right: Record<string, AxisDimension>
  top: Record<string, AxisDimension>
  bottom: Record<string, AxisDimension>
}

export type AxisOptionsBase = {
  primaryAxisId?: string
  elementType?: 'line' | 'area' | 'bar' | 'bubble'
  showDatumElements?: boolean | 'onFocus'
  curve?: CurveFactory
  invert?: boolean
  position?: Position
  minTickPaddingForRotation?: number
  tickLabelRotationDeg?: number
  tickCount?: number
  shouldNice?: boolean
  innerBandPadding?: number
  outerBandPadding?: number
  innerSeriesBandPadding?: number
  outerSeriesBandPadding?: number
  minBandSize?: number
  maxBandSize?: number
  minDomainLength?: number
  showGrid?: boolean
  show?: boolean
  stacked?: boolean
  stackOffset?: typeof stackOffsetNone
  id?: string | number
  styles?: CSS.Properties & {
    line?: CSS.Properties
    tick?: CSS.Properties
  }
}

export type AxisTimeOptions<TDatum> = AxisOptionsBase & {
  scaleType?: 'time' | 'localTime'
  getValue: (datum: TDatum) => ChartValue<Date>
  min?: Date
  max?: Date
  hardMin?: Date
  hardMax?: Date
  padBandRange?: boolean
  formatters?: {
    scale?: (value: Date, formatters: AxisTimeOptions<TDatum>['formatters']) => string
    tooltip?: (value: Date, formatters: AxisTimeOptions<TDatum>['formatters']) => Component
    cursor?: (value: Date, formatters: AxisTimeOptions<TDatum>['formatters']) => Component
  }
}

export type AxisLinearOptions<TDatum> = AxisOptionsBase & {
  scaleType?: 'linear' | 'log'
  getValue: (datum: TDatum) => ChartValue<number>
  min?: number
  max?: number
  hardMin?: number
  hardMax?: number
  // base?: number
  formatters?: {
    scale?: (value: number, formatters: AxisLinearOptions<TDatum>['formatters']) => string
    tooltip?: (value: number, formatters: AxisLinearOptions<TDatum>['formatters']) => Component
    cursor?: (value: number, formatters: AxisLinearOptions<TDatum>['formatters']) => Component
  }
}

export type AxisBandOptions<TDatum> = AxisOptionsBase & {
  scaleType?: 'band'
  getValue: (datum: TDatum) => ChartValue<any>
  originalSinBandSize?: number
  formatters?: {
    scale?: (value: any, formatters: AxisBandOptions<TDatum>['formatters']) => string
    tooltip?: (value: Component, formatters: AxisBandOptions<TDatum>['formatters']) => string
    cursor?: (value: Component, formatters: AxisBandOptions<TDatum>['formatters']) => string
  }
}

export type AxisOptions<TDatum> =
  | AxisTimeOptions<TDatum>
  | AxisLinearOptions<TDatum>
  | AxisBandOptions<TDatum>

export type AxisOptionsWithScaleType<TDatum> = TSTB.Object.Required<
  AxisOptions<TDatum>,
  'scaleType'
>

export type BuildAxisOptions<TDatum> = TSTB.Object.Required<
  AxisOptions<TDatum>,
  'position' | 'scaleType'
>

export type ResolvedAxisOptions<TAxisOptions> = TSTB.Object.Required<
  TAxisOptions & {},
  | 'scaleType'
  | 'position'
  | 'minTickPaddingForRotation'
  | 'tickLabelRotationDeg'
  | 'innerBandPadding'
  | 'outerBandPadding'
  | 'innerSeriesBandPadding'
  | 'outerSeriesBandPadding'
  | 'show'
  | 'stacked'
>

export type ChartValue<T> = T | null | undefined

export type AxisBase = {
  position: Position
  isVertical: boolean
  range: [number, number]
}

export type AxisTime<TDatum> = Omit<
  AxisBase & ResolvedAxisOptions<AxisTimeOptions<TDatum>>,
  'format'
> & {
  isPrimary?: boolean
  isInvalid: boolean
  axisFamily: 'time'
  scale: ScaleTime<number, number, never>
  outerScale: ScaleTime<number, number, never>
  primaryBandScale?: ScaleBand<number>
  seriesBandScale?: ScaleBand<number>
  formatters: {
    default: (value: Date) => string
    scale: (value: Date) => string
    tooltip: (value: Date) => Component
    cursor: (value: Date) => Component
  }
}

export type AxisLinear<TDatum> = Omit<
  AxisBase & ResolvedAxisOptions<AxisLinearOptions<TDatum>>,
  'format'
> & {
  isPrimary?: boolean
  isInvalid: boolean
  axisFamily: 'linear'
  scale: ScaleLinear<number, number, never>
  outerScale: ScaleLinear<number, number, never>
  primaryBandScale?: ScaleBand<number>
  seriesBandScale?: ScaleBand<number>
  formatters: {
    default: (value: ChartValue<any>) => string
    scale: (value: number) => string
    tooltip: (value: number) => Component
    cursor: (value: number) => Component
  }
}

export type AxisBand<TDatum> = Omit<
  AxisBase & ResolvedAxisOptions<AxisBandOptions<TDatum>>,
  'format'
> & {
  isPrimary?: boolean
  isInvalid: boolean
  axisFamily: 'band'
  scale: ScaleBand<any>
  outerScale: ScaleBand<any>
  primaryBandScale: ScaleBand<number>
  seriesBandScale: ScaleBand<number>
  formatters: {
    default: (value: any) => string
    scale: (value: any) => string
    tooltip: (value: Component) => string
    cursor: (value: Component) => string
  }
}

export type Axis<TDatum> = AxisTime<TDatum> | AxisLinear<TDatum> | AxisBand<TDatum>

export type UserSerie<TDatum> = {
  data: TDatum[]
  id?: string
  label?: string
  color?: string
  primaryAxisId?: string
  secondaryAxisId?: string
}

//

export type Series<TDatum> = {
  originalSeries: UserSerie<TDatum>
  index: number
  indexPerAxis: number
  id: string
  label: string
  secondaryAxisId?: string
  datums: Datum<TDatum>[]
  style?: CSS.Properties
}

export type Datum<TDatum> = {
  originalSeries: UserSerie<TDatum>
  seriesIndex: number
  seriesId: string
  seriesLabel: string
  index: number
  originalDatum: TDatum
  secondaryAxisId?: string
  seriesIndexPerAxis: number
  primaryValue?: any
  secondaryValue?: any
  stackData?: StackDatum<TDatum>
  interactiveGroup?: Datum<TDatum>[]
  tooltipGroup?: Datum<TDatum>[]
  style?: CSS.Properties
  element?: Element | null
}

export type StackDatum<TDatum> = {
  0: number
  1: number
  data: Datum<TDatum>
  length: number
}

//

export type Measurement = Side | 'width' | 'height'

export type GridDimensions = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

export type CursorOptions = {
  value?: unknown
  show?: boolean
  showLine?: boolean
  showLabel?: boolean
  onChange?: (value: any) => void
}

export type SeriesFocusStatus = 'none' | 'focused'

export type DatumFocusStatus = 'none' | 'focused' | 'groupFocused'
