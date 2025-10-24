// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { TrendingUp, Trophy, Target, Users } from 'lucide-react';

// @ts-ignore;
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
export function AnalyticsSection({
  userData,
  pointsHistory,
  communityRanking
}) {
  const categoryData = [{
    name: '可回收物',
    value: 35,
    color: '#10b981'
  }, {
    name: '厨余垃圾',
    value: 40,
    color: '#f59e0b'
  }, {
    name: '有害垃圾',
    value: 10,
    color: '#ef4444'
  }, {
    name: '其他垃圾',
    value: 15,
    color: '#6b7280'
  }];
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">本月积分</p>
                <p className="text-2xl font-bold text-emerald-600">+{userData?.points || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">社区排名</p>
                <p className="text-2xl font-bold text-blue-600">#{communityRanking.findIndex(r => r.name === userData?.name) + 1 || '-'}</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">准确率</p>
                <p className="text-2xl font-bold text-purple-600">92%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>积分趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={pointsHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="points" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>投放分类</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{
                backgroundColor: item.color
              }} />
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}