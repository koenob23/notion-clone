'use client';

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Fragment, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

export function AnalyticsProvider({ children }: Props) {
  return (
    <Fragment>
      {children}
      <Analytics />
      <SpeedInsights />
    </Fragment>
  )
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).va) {
    ;(window as any).va.track(name, properties)
  }
} 