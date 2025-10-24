// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, Button } from '@/components/ui';
// @ts-ignore;
import { QrCode, Camera } from 'lucide-react';

export function ScanSection({
  onScan
}) {
  return <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <div className="w-48 h-48 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <QrCode className="w-24 h-24 text-slate-400" />
          </div>
          <Button size="lg" onClick={onScan} className="w-full max-w-xs">
            <Camera className="w-5 h-5 mr-2" />
            开始扫码
          </Button>
          <p className="text-sm text-slate-600 mt-2">对准投放点二维码进行扫描</p>
        </div>
      </CardContent>
    </Card>;
}