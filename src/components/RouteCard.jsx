// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress } from '@/components/ui';
// @ts-ignore;
import { Route, Play } from 'lucide-react';

export function RouteCard({
  route
}) {
  return <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{route.name}</CardTitle>
            <p className="text-sm text-slate-600">{route.totalDistance}km · {route.estimatedTime}</p>
          </div>
          <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
            {route.status === 'active' ? '进行中' : '待开始'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>完成进度</span>
              <span>{route.progress}%</span>
            </div>
            <Progress value={route.progress} className="h-2" />
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">途经站点</p>
            <div className="flex flex-wrap gap-2">
              {route.stops.map((stop, index) => <Badge key={index} variant="outline" className="text-xs">
                  {stop}
                </Badge>)}
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Route className="w-4 h-4 mr-1" />
              查看路线
            </Button>
            <Button size="sm" className="flex-1">
              <Play className="w-4 h-4 mr-1" />
              开始收运
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
}