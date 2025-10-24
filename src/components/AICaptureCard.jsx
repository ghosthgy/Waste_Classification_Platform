// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { Play, Clock } from 'lucide-react';

export function AICaptureCard({
  capture
}) {
  return <Card>
      <CardContent className="p-4">
        <img src={capture.image} alt="AI抓拍" className="w-full h-40 object-cover rounded-lg mb-3" />
        <h4 className="font-semibold">{capture.pointName}</h4>
        <div className="flex justify-between items-center mt-2">
          <Badge variant={capture.type === '正确投放' ? 'default' : 'destructive'}>
            {capture.type}
          </Badge>
          <span className="text-sm text-slate-600">置信度: {capture.confidence}%</span>
        </div>
        <div className="flex items-center text-sm text-slate-500 mt-2">
          <Clock className="w-4 h-4 mr-1" />
          <span>{capture.time}</span>
        </div>
        <Button size="sm" className="w-full mt-3">
          <Play className="w-4 h-4 mr-1" />
          查看视频
        </Button>
      </CardContent>
    </Card>;
}