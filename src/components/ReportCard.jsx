// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
// @ts-ignore;
import { AlertCircle, MapPin, Clock } from 'lucide-react';

export function ReportCard({
  report
}) {
  const getStatusBadge = status => {
    const badgeMap = {
      'pending': 'bg-amber-100 text-amber-800',
      'processing': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-emerald-100 text-emerald-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return badgeMap[status] || 'bg-slate-100 text-slate-800';
  };
  const getStatusText = status => {
    const textMap = {
      'pending': '待处理',
      'processing': '处理中',
      'resolved': '已解决',
      'rejected': '已拒绝'
    };
    return textMap[status] || '未知';
  };
  return <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{report.type}</CardTitle>
            <Badge className={getStatusBadge(report.status)}>{getStatusText(report.status)}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-slate-500" />
            <span>{report.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-slate-500" />
            <span>{report.time}</span>
          </div>
          <p className="text-slate-600">{report.description}</p>
          {report.image && <img src={report.image} alt="举报图片" className="w-full h-32 object-cover rounded-lg mt-2" />}
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">查看详情</Button>
          <Button size="sm" variant="outline">撤销举报</Button>
        </div>
      </CardContent>
    </Card>;
}