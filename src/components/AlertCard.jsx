// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { MapPin, Clock, AlertTriangle } from 'lucide-react';

export function AlertCard({
  alert
}) {
  const getStatusColor = level => {
    switch (level) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };
  const getStatusText = level => {
    switch (level) {
      case 'critical':
        return '紧急';
      case 'warning':
        return '警告';
      default:
        return '提醒';
    }
  };
  return <Card className="border-l-4 border-l-amber-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{alert.vehicle} - {alert.type}</h4>
            <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
            <div className="flex items-center text-sm text-slate-500 mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{alert.location}</span>
              <span className="mx-2">·</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{alert.time}</span>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(alert.level)}>
            {getStatusText(alert.level)}
          </Badge>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">查看详情</Button>
          <Button size="sm">立即处理</Button>
        </div>
      </CardContent>
    </Card>;
}