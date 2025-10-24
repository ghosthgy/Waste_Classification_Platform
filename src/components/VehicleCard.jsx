// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress } from '@/components/ui';
// @ts-ignore;
import { MapPin, Fuel, Route, Eye, Clock } from 'lucide-react';

export function VehicleCard({
  vehicle,
  onViewDetails
}) {
  const getStatusBadge = status => {
    const badgeMap = {
      'collecting': 'bg-emerald-100 text-emerald-800',
      'enroute': 'bg-blue-100 text-blue-800',
      'idle': 'bg-slate-100 text-slate-800',
      'maintenance': 'bg-red-100 text-red-800',
      'offline': 'bg-gray-100 text-gray-800'
    };
    return badgeMap[status] || 'bg-slate-100 text-slate-800';
  };
  const getStatusText = status => {
    const textMap = {
      'collecting': '收运中',
      'enroute': '前往中',
      'idle': '空闲',
      'maintenance': '维修中',
      'offline': '离线'
    };
    return textMap[status] || '未知';
  };
  return <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{vehicle.plate}</CardTitle>
            <p className="text-sm text-slate-600">{vehicle.driver} · {vehicle.type}</p>
          </div>
          <Badge className={getStatusBadge(vehicle.status)}>
            {getStatusText(vehicle.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>收运进度</span>
              <span>{vehicle.progress}%</span>
            </div>
            <Progress value={vehicle.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-600">当前位置</p>
              <p className="font-semibold flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {vehicle.currentLocation}
              </p>
            </div>
            <div>
              <p className="text-slate-600">路线</p>
              <p className="font-semibold">{vehicle.route}</p>
            </div>
            <div>
              <p className="text-slate-600">燃油</p>
              <p className="font-semibold flex items-center">
                <Fuel className="w-3 h-3 mr-1" />
                {vehicle.fuel}%
              </p>
            </div>
            <div>
              <p className="text-slate-600">速度</p>
              <p className="font-semibold">{vehicle.speed}km/h</p>
            </div>
          </div>

          <div className="flex items-center text-xs text-slate-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>更新于 {vehicle.lastUpdate}</span>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              查看详情
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Route className="w-4 h-4 mr-1" />
              轨迹回放
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
}