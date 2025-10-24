// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
// @ts-ignore;
import { Calendar, MapPin, Clock } from 'lucide-react';

export function AppointmentCard({
  appointment
}) {
  const getStatusBadge = status => {
    const badgeMap = {
      'confirmed': 'bg-emerald-100 text-emerald-800',
      'pending': 'bg-amber-100 text-amber-800',
      'completed': 'bg-slate-100 text-slate-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return badgeMap[status] || 'bg-slate-100 text-slate-800';
  };
  const getStatusText = status => {
    const textMap = {
      'confirmed': '已确认',
      'pending': '待确认',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return textMap[status] || '未知';
  };
  return <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{appointment.type}</CardTitle>
            <Badge className={getStatusBadge(appointment.status)}>{getStatusText(appointment.status)}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-slate-500" />
            <span>{appointment.date} {appointment.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-slate-500" />
            <span>{appointment.address}</span>
          </div>
          <div>
            <p className="text-slate-600">物品: {appointment.items.join(', ')}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">修改</Button>
          <Button size="sm" variant="outline">取消</Button>
        </div>
      </CardContent>
    </Card>;
}