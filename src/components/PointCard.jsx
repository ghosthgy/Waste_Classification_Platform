// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui';
// @ts-ignore;
import { MapPin, Camera, Eye, Clock } from 'lucide-react';

export function PointCard({
  point,
  onViewDetails
}) {
  const getStatusBadge = status => {
    switch (status) {
      case 'normal':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'fault':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };
  const getStatusText = status => {
    const statusMap = {
      'normal': '正常',
      'warning': '预警',
      'critical': '紧急',
      'fault': '故障'
    };
    return statusMap[status] || '未知';
  };
  const getCapacityColor = capacity => {
    if (capacity >= 90) return 'text-red-500';
    if (capacity >= 70) return 'text-amber-500';
    return 'text-emerald-500';
  };
  const formatTime = dateString => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}小时前`;
    return `${Math.floor(diffMins / 1440)}天前`;
  };
  return <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{point.name}</CardTitle>
            <p className="text-sm text-slate-600 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {point.address}
            </p>
          </div>
          <Badge className={getStatusBadge(point.status)}>
            {getStatusText(point.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>容量使用率</span>
              <span className={getCapacityColor(point.capacity)}>{point.capacity || 0}%</span>
            </div>
            <Progress value={point.capacity || 0} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600">类型</p>
              <p className="font-semibold">{point.type}</p>
            </div>
            <div>
              <p className="text-slate-600">总重量</p>
              <p className="font-semibold">{point.totalWeight || 0}kg</p>
            </div>
            <div>
              <p className="text-slate-600">AI抓拍</p>
              <p className="font-semibold">{point.aiCaptures || 0}次</p>
            </div>
            <div>
              <p className="text-slate-600">最后清运</p>
              <p className="font-semibold">{formatTime(point.lastCollection)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {point.hasCamera && <Button size="sm" variant="outline" className="flex-1">
                <Camera className="w-4 h-4 mr-1" />
                查看监控
              </Button>}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  详情
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{point.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&h=300&fit=crop" alt={point.name} className="w-full h-48 object-cover rounded-lg" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">地址</p>
                      <p className="text-slate-600">{point.address}</p>
                    </div>
                    <div>
                      <p className="font-semibold">坐标</p>
                      <p className="text-slate-600">
                        {point.location?.lat?.toFixed(4)}, {point.location?.lng?.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">负责人</p>
                      <p className="text-slate-600">{point.manager || '未设置'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">联系电话</p>
                      <p className="text-slate-600">{point.phone || '未设置'}</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>;
}