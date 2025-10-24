// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@/components/ui';
// @ts-ignore;
import { Star, Award, TrendingUp } from 'lucide-react';

export function ResidentProfile({
  userData
}) {
  if (!userData) return null;
  const getLevelColor = level => {
    const colorMap = {
      '普通会员': 'bg-slate-100 text-slate-800',
      '银卡会员': 'bg-slate-200 text-slate-900',
      '金卡会员': 'bg-amber-100 text-amber-800',
      '钻石会员': 'bg-purple-100 text-purple-800'
    };
    return colorMap[level] || 'bg-slate-100 text-slate-800';
  };
  return <Card className="bg-gradient-to-r from-emerald-50 to-blue-50">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <img src={userData.avatar} alt={userData.name} className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-900">{userData.name}</h3>
              <Badge className={getLevelColor(userData.level)}>{userData.level}</Badge>
            </div>
            <p className="text-emerald-600 font-semibold text-lg">{userData.points} 积分</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{userData.totalDisposals}</p>
            <p className="text-sm text-slate-600">总投放次数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{userData.streakDays}</p>
            <p className="text-sm text-slate-600">连续天数</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>升级进度</span>
            <span>{Math.min(userData.points % 1000, 1000)}/1000</span>
          </div>
          <Progress value={userData.points % 1000 / 10} className="h-2" />
        </div>
      </CardContent>
    </Card>;
}