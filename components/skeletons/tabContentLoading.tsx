import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'

const TabContentLoading = () => {
  return (
    <Card>
    <CardHeader>
      <CardTitle>
        <Skeleton className="h-8 w-1/3" />
      </CardTitle>
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default TabContentLoading
