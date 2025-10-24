// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';
// @ts-ignore;
import { Download, Calendar, TrendingUp, Recycle, Leaf, AlertTriangle } from 'lucide-react';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const mockDailyData = [{
  date: '01-01',
  total: 1450,
  recyclable: 580,
  kitchen: 435,
  hazardous: 145,
  other: 290
}, {
  date: '01-02',
  total: 1380,
  recyclable: 552,
  kitchen: 414,
  hazardous: 138,
  other: 276
}, {
  date: '01-03',
  total: 1520,
  recyclable: 608,
  kitchen: 456,
  hazardous: 152,
  other: 304
}, {
  date: '01-04',
  total: 1390,
  recyclable: 556,
  kitchen: 417,
  hazardous: 139,
  other: 278
}, {
  date: '01-05',
  total: 1610,
  recyclable: 644,
  kitchen: 483,
  hazardous: 161,
  other: 322
}, {
  date: '01-06',
  total: 1480,
  recyclable: 592,
  kitchen: 444,
  hazardous: 148,
  other: 296
}, {
  date: '01-07',
  total: 1550,
  recyclable: 620,
  kitchen: 465,
  hazardous: 155,
  other: 310
}];
const mockWeeklyData = [{
  week: '第1周',
  total: 9800,
  accuracy: 85,
  carbonReduction: 1560
}, {
  week: '第2周',
  total: 10200,
  accuracy: 87,
  carbonReduction: 1632
}, {
  week: '第3周',
  total: 9500,
  accuracy: 89,
  carbonReduction: 1520
}, {
  week: '第4周',
  total: 10800,
  accuracy: 91,
  carbonReduction: 1728
}];
const mockCategoryData = [{
  name: '可回收物',
  value: 35,
  color: '#10b981'
}, {
  name: '厨余垃圾',
  value: 30,
  color: '#f59e0b'
}, {
  name: '有害垃圾',
  value: 10,
  color: '#ef4444'
}, {
  name: '其他垃圾',
  value: 25,
  color: '#6b7280'
}];
const mockCommunityData = [{
  name: '幸福小区',
  total: 2450,
  accuracy: 92
}, {
  name: '阳光花园',
  total: 2100,
  accuracy: 89
}, {
  name: '绿地小区',
  total: 1950,
  accuracy: 87
}, {
  name: '和谐家园',
  total: 2300,
  accuracy: 90
}, {
  name: '智慧社区',
  total: 1800,
  accuracy: 85
}];
const mockAlerts = [{
  date: '01-01',
  alerts: 3,
  type: '满溢'
}, {
  date: '01-02',
  alerts: 5,
  type: '混投'
}, {
  date: '01-03',
  alerts: 2,
  type: '满溢'
}, {
  date: '01-04',
  alerts: 4,
  type: '混投'
}, {
  date: '01-05',
  alerts: 1,
  type: '满溢'
}, {
  date: '01-06',
  alerts: 6,
  type: '混投'
}, {
  date: '01-07',
  alerts: 2,
  type: '满溢'
}];
export default function ReportsPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [timeRange, setTimeRange] = useState('daily');
  const [reportType, setReportType] = useState('overview');
  const handleExport = type => {
    toast({
      title: '导出成功',
      description: `${type}报表已导出到下载文件夹`
    });
  };
  const getStatusColor = accuracy => {
    if (accuracy >= 90) return 'text-emerald-600';
    if (accuracy >= 80) return 'text-amber-600';
    return 'text-red-600';
  };
  return <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">数据报表</h1>
            <p className="text-slate-600">多维度数据分析与可视化展示</p>
          </div>
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">日报</SelectItem>
                <SelectItem value="weekly">周报</SelectItem>
                <SelectItem value="monthly">月报</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleExport('PDF')}>
              <Download className="w-4 h-4 mr-2" />
              导出PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('Excel')}>
              <Download className="w-4 h-4 mr-2" />
              导出Excel
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">总处理量</p>
                  <p className="text-2xl font-bold text-slate-900">10,550kg</p>
                </div>
                <Recycle className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">平均准确率</p>
                  <p className="text-2xl font-bold text-emerald-600">88.5%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">碳减排量</p>
                  <p className="text-2xl font-bold text-emerald-600">1,680kg</p>
                </div>
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">异常事件</p>
                  <p className="text-2xl font-bold text-amber-600">23次</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="category">分类分析</TabsTrigger>
            <TabsTrigger value="community">社区对比</TabsTrigger>
            <TabsTrigger value="alerts">异常分析</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>垃圾量趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeRange === 'daily' ? mockDailyData : mockWeeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={timeRange === 'daily' ? 'date' : 'week'} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#3b82f6" name="总量(kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>分类准确率趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockWeeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" name="准确率(%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>碳减排量趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockWeeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="carbonReduction" fill="#10b981" name="碳减排量(kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>本周数据概览</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">总处理量</span>
                      <span className="font-semibold">10,550kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">日均处理量</span>
                      <span className="font-semibold">1,507kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">最高单日</span>
                      <span className="font-semibold">1,610kg (01-05)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">分类准确率</span>
                      <span className="font-semibold text-emerald-600">88.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">碳减排量</span>
                      <span className="font-semibold text-emerald-600">1,680kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="category">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>垃圾分类占比</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={mockCategoryData} cx="50%" cy="50%" labelLine={false} label={({
                      name,
                      percent
                    }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {mockCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>各类垃圾处理量</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockDailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="recyclable" stackId="a" fill="#10b981" name="可回收物" />
                      <Bar dataKey="kitchen" stackId="a" fill="#f59e0b" name="厨余垃圾" />
                      <Bar dataKey="hazardous" stackId="a" fill="#ef4444" name="有害垃圾" />
                      <Bar dataKey="other" stackId="a" fill="#6b7280" name="其他垃圾" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle>各社区处理量与准确率对比</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockCommunityData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3b82f6" name="处理量(kg)" />
                    <Bar dataKey="accuracy" fill="#10b981" name="准确率(%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>异常事件趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockAlerts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="alerts" stroke="#ef4444" name="异常次数" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>异常类型分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-red-800">满溢预警</span>
                      <span className="font-semibold text-red-800">12次</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-amber-800">垃圾混投</span>
                      <span className="font-semibold text-amber-800">8次</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-800">清运延误</span>
                      <span className="font-semibold text-blue-800">3次</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}