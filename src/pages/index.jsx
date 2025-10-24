// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Tabs, TabsContent, TabsList, TabsTrigger, useToast, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { TrendingUp, AlertTriangle, Recycle, Users, Clock, MapPin, Camera, Truck, FileText, Award, BarChart3, Activity, Zap, Target, Filter, RefreshCw } from 'lucide-react';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
export default function DashboardPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [timeRange, setTimeRange] = useState('today');
  const [refreshKey, setRefreshKey] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    totalDisposal: 0,
    accuracy: 0,
    alerts: 0,
    activeResidents: 0,
    realTimeData: [],
    categoryAccuracy: [],
    carbonRanking: [],
    recentActivities: [],
    weeklyTrend: [],
    monthlyStats: [],
    efficiencyMetrics: []
  });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 获取实时数据
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 获取投放点数据
      const pointsResult = await $w.cloud.callDataSource({
        dataSourceName: 'waste_collection_point',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true
        }
      });

      // 获取居民账户数据
      const residentsResult = await $w.cloud.callDataSource({
        dataSourceName: 'resident_account',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          orderBy: [{
            total_points: 'desc'
          }],
          pageSize: 5
        }
      });

      // 计算统计数据
      const points = pointsResult.records || [];
      const residents = residentsResult.records || [];

      // 计算今日投放量
      const totalDisposal = points.reduce((sum, point) => sum + (point.weight || 0), 0);

      // 计算分类准确率
      const totalCapacity = points.reduce((sum, point) => sum + (point.capacity || 0), 0);
      const avgCapacity = points.length > 0 ? totalCapacity / points.length : 0;
      const accuracy = Math.max(0, 100 - avgCapacity * 0.5);

      // 计算预警数量
      const alerts = points.filter(point => point.status === 'warning' || point.status === 'critical').length;

      // 生成实时数据图表
      const realTimeData = Array.from({
        length: 7
      }, (_, i) => ({
        time: `${i * 4}:00`,
        value: Math.floor(totalDisposal * (0.5 + Math.random() * 0.5))
      }));

      // 生成周趋势数据
      const weeklyTrend = Array.from({
        length: 7
      }, (_, i) => ({
        day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
        disposal: Math.floor(800 + Math.random() * 400),
        accuracy: Math.floor(85 + Math.random() * 10),
        residents: Math.floor(200 + Math.random() * 100)
      }));

      // 生成月度统计数据
      const monthlyStats = Array.from({
        length: 30
      }, (_, i) => ({
        date: `${i + 1}日`,
        totalWeight: Math.floor(1000 + Math.random() * 500),
        accuracy: Math.floor(80 + Math.random() * 15),
        alerts: Math.floor(Math.random() * 5)
      }));

      // 生成效率指标
      const efficiencyMetrics = [{
        name: '投放准确率',
        value: accuracy,
        target: 95,
        icon: Target,
        color: '#10b981'
      }, {
        name: '清运及时率',
        value: 88,
        target: 90,
        icon: Truck,
        color: '#3b82f6'
      }, {
        name: '居民参与率',
        value: 76,
        target: 80,
        icon: Users,
        color: '#8b5cf6'
      }, {
        name: '系统运行率',
        value: 99.2,
        target: 99,
        icon: Activity,
        color: '#f59e0b'
      }];

      // 分类准确率
      const categoryAccuracy = [{
        name: '可回收物',
        value: Math.floor(accuracy + Math.random() * 10),
        color: '#10b981'
      }, {
        name: '厨余垃圾',
        value: Math.floor(accuracy - 5 + Math.random() * 10),
        color: '#f59e0b'
      }, {
        name: '有害垃圾',
        value: Math.floor(accuracy + 5 + Math.random() * 5),
        color: '#ef4444'
      }, {
        name: '其他垃圾',
        value: Math.floor(accuracy - 10 + Math.random() * 10),
        color: '#6b7280'
      }];

      // 碳积分排行
      const carbonRanking = residents.slice(0, 5).map((resident, index) => ({
        rank: index + 1,
        name: resident.nickname || '匿名用户',
        points: resident.total_points || 0,
        avatar: resident.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      }));

      // 最近活动
      const recentActivities = residents.slice(0, 4).map((resident, index) => ({
        id: index + 1,
        user: resident.nickname || '匿名用户',
        action: '投放可回收物',
        points: `+${Math.floor(Math.random() * 10 + 1)}`,
        time: `${Math.floor(Math.random() * 60 + 1)}分钟前`,
        location: points[Math.floor(Math.random() * points.length)]?.name || '未知投放点'
      }));
      setDashboardData({
        totalDisposal,
        accuracy: Math.floor(accuracy),
        alerts,
        activeResidents: residents.length,
        realTimeData,
        categoryAccuracy,
        carbonRanking,
        recentActivities,
        weeklyTrend,
        monthlyStats,
        efficiencyMetrics
      });
    } catch (error) {
      console.error('数据加载失败:', error);
      // 使用模拟数据作为后备
      const mockData = {
        totalDisposal: 1450,
        accuracy: 90,
        alerts: 8,
        activeResidents: 3247,
        realTimeData: Array.from({
          length: 7
        }, (_, i) => ({
          time: `${i * 4}:00`,
          value: Math.floor(100 + Math.random() * 300)
        })),
        weeklyTrend: Array.from({
          length: 7
        }, (_, i) => ({
          day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
          disposal: Math.floor(800 + Math.random() * 400),
          accuracy: Math.floor(85 + Math.random() * 10),
          residents: Math.floor(200 + Math.random() * 100)
        })),
        monthlyStats: Array.from({
          length: 30
        }, (_, i) => ({
          date: `${i + 1}日`,
          totalWeight: Math.floor(1000 + Math.random() * 500),
          accuracy: Math.floor(80 + Math.random() * 15),
          alerts: Math.floor(Math.random() * 5)
        })),
        efficiencyMetrics: [{
          name: '投放准确率',
          value: 90,
          target: 95,
          icon: Target,
          color: '#10b981'
        }, {
          name: '清运及时率',
          value: 88,
          target: 90,
          icon: Truck,
          color: '#3b82f6'
        }, {
          name: '居民参与率',
          value: 76,
          target: 80,
          icon: Users,
          color: '#8b5cf6'
        }, {
          name: '系统运行率',
          value: 99.2,
          target: 99,
          icon: Activity,
          color: '#f59e0b'
        }],
        categoryAccuracy: [{
          name: '可回收物',
          value: 92,
          color: '#10b981'
        }, {
          name: '厨余垃圾',
          value: 88,
          color: '#f59e0b'
        }, {
          name: '有害垃圾',
          value: 95,
          color: '#ef4444'
        }, {
          name: '其他垃圾',
          value: 85,
          color: '#6b7280'
        }],
        carbonRanking: [{
          rank: 1,
          name: '张小明',
          points: 2580,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        }, {
          rank: 2,
          name: '李小红',
          points: 2340,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
        }, {
          rank: 3,
          name: '王小华',
          points: 2100,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        }],
        recentActivities: [{
          id: 1,
          user: '张小明',
          action: '投放可回收物',
          points: '+5',
          time: '2分钟前',
          location: '幸福小区A栋'
        }, {
          id: 2,
          user: '李小红',
          action: '投放厨余垃圾',
          points: '+3',
          time: '5分钟前',
          location: '阳光花园B区'
        }]
      };
      setDashboardData(mockData);
      toast({
        title: '使用模拟数据',
        description: '数据源暂时不可用，已加载模拟数据',
        variant: 'default'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
    if (autoRefresh) {
      const interval = setInterval(() => {
        setRefreshKey(prev => prev + 1);
      }, 30000); // 30秒刷新一次
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);
  useEffect(() => {
    if (refreshKey > 0) {
      fetchDashboardData();
    }
  }, [refreshKey]);
  const handleNavigate = pageId => {
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: '刷新成功',
      description: '数据已更新',
      variant: 'default'
    });
  };
  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
        <p className="text-slate-400">加载数据中...</p>
      </div>
    </div>;
  }
  return <div className="min-h-screen bg-slate-900 text-white p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">生活垃圾分类数字化监管平台</h1>
                <p className="text-slate-400">实时监控 · 智能分析 · 全民参与</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="时间范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">今日</SelectItem>
                      <SelectItem value="week">本周</SelectItem>
                      <SelectItem value="month">本月</SelectItem>
                      <SelectItem value="year">本年</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setAutoRefresh(!autoRefresh)}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                    {autoRefresh ? '自动刷新' : '手动刷新'}
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    刷新
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => handleNavigate('collection-points')}>
                    <MapPin className="w-4 h-4 mr-2" />
                    投放点管理
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => handleNavigate('collection-management')}>
                    <Truck className="w-4 h-4 mr-2" />
                    清运管理
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => handleNavigate('resident-service')}>
                    <Users className="w-4 h-4 mr-2" />
                    居民服务
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => handleNavigate('reports')}>
                    <FileText className="w-4 h-4 mr-2" />
                    数据报表
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">今日投放量</p>
                      <p className="text-3xl font-bold text-emerald-400">{dashboardData.totalDisposal.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 mt-1">kg</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                      <Recycle className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400">+12.5%</span>
                    <span className="text-slate-400 ml-1">较昨日</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">分类准确率</p>
                      <p className="text-3xl font-bold text-blue-400">{dashboardData.accuracy}%</p>
                      <p className="text-xs text-slate-500 mt-1">↑ 2.3%</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Award className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <Progress value={dashboardData.accuracy} className="mt-4" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">预警数量</p>
                      <p className="text-3xl font-bold text-amber-400">{dashboardData.alerts}</p>
                      <p className="text-xs text-slate-500 mt-1">待处理</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="text-amber-400 border-amber-400">
                      满溢预警: {dashboardData.alerts}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">活跃居民</p>
                      <p className="text-3xl font-bold text-purple-400">{dashboardData.activeResidents.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 mt-1">人</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-purple-400 mr-1" />
                    <span className="text-purple-400">+8.7%</span>
                    <span className="text-slate-400 ml-1">本周</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Efficiency Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {dashboardData.efficiencyMetrics.map((metric, index) => <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <metric.icon className="w-5 h-5 mr-2" style={{
                  color: metric.color
                }} />
                        <span className="text-sm font-medium text-slate-300">{metric.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">目标: {metric.target}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold" style={{
                color: metric.color
              }}>{metric.value}%</span>
                      <div className="flex items-center">
                        {metric.value >= metric.target ? <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" /> : <AlertTriangle className="w-4 h-4 text-amber-400 mr-1" />}
                        <span className={`text-xs ${metric.value >= metric.target ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {metric.value >= metric.target ? '达标' : `${metric.target - metric.value}% 差距`}
                        </span>
                      </div>
                    </div>
                    <Progress value={metric.value} className="mt-2" />
                  </CardContent>
                </Card>)}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-slate-800 border-slate-700">
                <TabsTrigger value="overview" className="text-slate-300 hover:text-white">总览</TabsTrigger>
                <TabsTrigger value="trends" className="text-slate-300 hover:text-white">趋势分析</TabsTrigger>
                <TabsTrigger value="details" className="text-slate-300 hover:text-white">详细数据</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Real-time Disposal Chart */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Activity className="w-5 h-5 mr-2" />
                          实时投放量趋势
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={dashboardData.realTimeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} />
                            <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Category Accuracy */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          分类准确率分析
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie data={dashboardData.categoryAccuracy} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {dashboardData.categoryAccuracy.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <Tooltip contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="space-y-3">
                            {dashboardData.categoryAccuracy.map((item, index) => <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full mr-2" style={{
                            backgroundColor: item.color
                          }} />
                                  <span className="text-sm text-slate-300">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-white">{item.value}%</span>
                              </div>)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Carbon Ranking */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Award className="w-5 h-5 mr-2" />
                          碳积分排行榜
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dashboardData.carbonRanking.map((user, index) => <div key={user.rank} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-slate-400 text-white' : index === 2 ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                  {user.rank}
                                </div>
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                                <span className="text-sm text-slate-300">{user.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-emerald-400">{user.points}</span>
                            </div>)}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Clock className="w-5 h-5 mr-2" />
                          实时投放动态
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {dashboardData.recentActivities.map(activity => <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                              <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Recycle className="w-4 h-4 text-emerald-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-white">
                                  <span className="font-semibold">{activity.user}</span>
                                  <span className="text-slate-400"> {activity.action}</span>
                                </p>
                                <div className="flex items-center text-xs text-slate-500 mt-1">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{activity.time}</span>
                                  <span className="mx-2">·</span>
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span>{activity.location}</span>
                                </div>
                              </div>
                              <span className="text-sm font-semibold text-emerald-400">{activity.points}</span>
                            </div>)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Trend */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        本周趋势
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dashboardData.weeklyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="day" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} />
                          <Line type="monotone" dataKey="disposal" stroke="#10b981" strokeWidth={2} name="投放量(kg)" />
                          <Line type="monotone" dataKey="residents" stroke="#3b82f6" strokeWidth={2} name="参与人数" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Monthly Stats */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        月度统计
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardData.monthlyStats.slice(0, 15)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} />
                          <Bar dataKey="totalWeight" fill="#10b981" name="总重量(kg)" />
                          <Bar dataKey="alerts" fill="#ef4444" name="预警数量" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Filter className="w-5 h-5 mr-2" />
                      详细数据
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left p-2 text-slate-300">日期</th>
                            <th className="text-left p-2 text-slate-300">投放量(kg)</th>
                            <th className="text-left p-2 text-slate-300">准确率</th>
                            <th className="text-left p-2 text-slate-300">预警数</th>
                            <th className="text-left p-2 text-slate-300">状态</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.monthlyStats.slice(0, 10).map((stat, index) => <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                              <td className="p-2 text-slate-300">{stat.date}</td>
                              <td className="p-2 text-slate-300">{stat.totalWeight}</td>
                              <td className="p-2 text-slate-300">{stat.accuracy}%</td>
                              <td className="p-2 text-slate-300">{stat.alerts}</td>
                              <td className="p-2">
                                <Badge variant={stat.alerts > 3 ? 'destructive' : 'default'} className={stat.alerts > 3 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}>
                                  {stat.alerts > 3 ? '需关注' : '正常'}
                                </Badge>
                              </td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>;
}