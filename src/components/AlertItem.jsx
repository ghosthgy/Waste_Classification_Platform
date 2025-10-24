// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { AlertTriangle, Clock } from 'lucide-react';

export function AlertItem({
  alert
}) {
  return <Card className="border-l-4 border-l-amber-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{alert.pointName}</h4>
            <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
            <div className="flex items-center text-sm text-slate-500 mt-2">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>{alert.type}</span>
              <span className="mx-2">·</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{alert.time}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {alert.level === 'warning' ? '警告' : '紧急'}
          </Badge>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">查看详情</Button>
          <Button size="sm">立即处理</Button>
        </div>
      </CardContent>
    </Card>;
}