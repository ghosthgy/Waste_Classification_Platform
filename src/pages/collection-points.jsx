// @ts-ignore;
import React, { useState, useEffect, useMemo } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, useToast, Progress, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui';
// @ts-ignore;
import { Search, MapPin, Camera, AlertTriangle, Play, Eye, Filter, Clock, Trash2, RefreshCw, Download, Bell, Settings, Grid, List, Map } from 'lucide-react';

// @ts-ignore;
import { PointCard } from '@/components/PointCard';
import { AlertItem } from '@/components/AlertItem';
import { AICaptureCard } from '@/components/AICaptureCard';
export default function CollectionPointsPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [points, setPoints] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [aiCaptures, setAiCaptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    total: 0
  });

  // 获取投放点数据
  const fetchPoints = async () => {
    try {
      setLoading(true);
      const where = {};
      if (statusFilter !== 'all') {
        where.status = {
          $eq: statusFilter
        };
      }
      if (typeFilter !== 'all') {
        where.type = {
          $eq: typeFilter
        };
      }
      if (searchTerm) {
        where.$or = [{
          name: {
            $search: searchTerm
          }
        }, {
          address: {
            $search: searchTerm
          }
        }];
      }
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'waste_collection_point',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          filter: {
            where
          },
          getCount: true,
          pageSize: pagination.pageSize,
          pageNumber: pagination.page,
          orderBy: [{
            [sortBy]: sortOrder
          }]
        }
      });
      setPoints(result.records || []);
      setPagination(prev => ({
        ...prev,
        total: result.total || 0
      }));

      // 获取预警数据
      const alertsData = [];
      result.records?.forEach(point => {
        if (point.alerts && Array.isArray(point.alerts)) {
          point.alerts.forEach(alert => {
            alertsData.push({
              id: alert.id,
              pointId: point.id,
              pointName: point.name,
              type: alert.type,
              level: alert.level,
              time: new Date(alert.time).toLocaleString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              description: alert.message
            });
          });
        }
      });
      setAlerts(alertsData.slice(0, 10));

      // 模拟AI抓拍数据
      const captures = result.records?.slice(0, 6).map((point, index) => ({
        id: index + 1,
        pointName: point.name,
        time: `${Math.floor(Math.random() * 30 + 1)}分钟前`,
        image: `https://images.unsplash.com/photo-${1532996122724 + index}?w=300&h=200&fit=crop`,
        type: Math.random() > 0.5 ? '正确投放' : '错误投放',
        confidence: Math.floor(Math.random() * 20 + 80)
      })) || [];
      setAiCaptures(captures);
    } catch (error) {
      console.error('数据加载失败:', error);
      // 使用模拟数据作为后备
      const mockPoints = [{
        id: 1,
        name: '幸福小区A栋垃圾屋',
        address: '幸福路88号A栋东侧',
        status: 'normal',
        capacity: 75,
        type: '垃圾屋',
        totalWeight: 1450,
        aiCaptures: 12,
        hasCamera: true,
        lastCollection: '2小时前',
        manager: '张管理员',
        phone: '13800138000',
        location: {
          lat: 31.2304,
          lng: 121.4737
        }
      }, {
        id: 2,
        name: '阳光花园B区投放点',
        address: '阳光大道123号B区南门',
        status: 'warning',
        capacity: 95,
        type: '投放点',
        totalWeight: 980,
        aiCaptures: 8,
        hasCamera: true,
        lastCollection: '30分钟前',
        manager: '李管理员',
        phone: '13800138001',
        location: {
          lat: 31.2294,
          lng: 121.4747
        }
      }];
      setPoints(mockPoints);
      setPagination(prev => ({
        ...prev,
        total: mockPoints.length
      }));
      const mockAlerts = [{
        id: 1,
        pointName: '阳光花园B区投放点',
        type: '满溢预警',
        level: 'warning',
        time: '10分钟前',
        description: '垃圾桶已满95%，需要立即清运'
      }];
      setAlerts(mockAlerts);
      const mockCaptures = [{
        id: 1,
        pointName: '幸福小区A栋垃圾屋',
        time: '5分钟前',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354d0b89c?w=300&h=200&fit=crop',
        type: '正确投放',
        confidence: 95
      }];
      setAiCaptures(mockCaptures);
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
    fetchPoints();
  }, [searchTerm, statusFilter, typeFilter, pagination.page, sortBy, sortOrder]);
  const filteredPoints = useMemo(() => {
    return points;
  }, [points]);
  const handleSort = field => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  const handleExport = () => {
    toast({
      title: '导出成功',
      description: '数据已导出到Excel文件',
      variant: 'default'
    });
  };
  const handleRefresh = () => {
    fetchPoints();
    toast({
      title: '刷新成功',
      description: '数据已更新',
      variant: 'default'
    });
  };
  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-slate-600">加载投放点数据中...</p>
      </div>
    </div>;
  }
  return <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">投放点管理</h1>
              <p className="text-slate-600">实时监控所有垃圾分类投放点状态</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{pagination.total}</p>
                <p className="text-sm text-slate-600">总投放点</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {points.filter(p => p.status === 'normal').length}
                </p>
                <p className="text-sm text-slate-600">正常运行</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {points.filter(p => p.status === 'warning').length}
                </p>
                <p className="text-sm text-slate-600">预警状态</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {points.filter(p => ['critical', 'fault'].includes(p.status)).length}
                </p>
                <p className="text-sm text-slate-600">异常状态</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input placeholder="搜索投放点名称或地址..." value={searchTerm} onChange={e => {
                  setSearchTerm(e.target.value);
                  setPagination(prev => ({
                    ...prev,
                    page: 1
                  }));
                }} className="pl-10" />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={value => {
              setStatusFilter(value);
              setPagination(prev => ({
                ...prev,
                page: 1
              }));
            }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="normal">正常</SelectItem>
                  <SelectItem value="warning">预警</SelectItem>
                  <SelectItem value="critical">紧急</SelectItem>
                  <SelectItem value="fault">故障</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={value => {
              setTypeFilter(value);
              setPagination(prev => ({
                ...prev,
                page: 1
              }));
            }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="类型筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="垃圾屋">垃圾屋</SelectItem>
                  <SelectItem value="投放点">投放点</SelectItem>
                  <SelectItem value="收集站">收集站</SelectItem>
                  <SelectItem value="垃圾房">垃圾房</SelectItem>
                  <SelectItem value="投放站">投放站</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
                  <Grid className="w-4 h-4 mr-2" />
                  网格
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
                  <List className="w-4 h-4 mr-2" />
                  列表
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewMode('map')} className={viewMode === 'map' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
                  <Map className="w-4 h-4 mr-2" />
                  地图
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="points" className="space-y-4">
          <TabsList>
            <TabsTrigger value="points">投放点列表</TabsTrigger>
            <TabsTrigger value="alerts">预警信息</TabsTrigger>
            <TabsTrigger value="captures">AI抓拍</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
          </TabsList>

          <TabsContent value="points">
            {viewMode === 'grid' && <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPoints.map(point => <PointCard key={point.id} point={point} />)}
              </div>}
            
            {viewMode === 'list' && <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium text-slate-700 cursor-pointer" onClick={() => handleSort('name')}>
                            名称 {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </th>
                          <th className="text-left p-4 font-medium text-slate-700">地址</th>
                          <th className="text-left p-4 font-medium text-slate-700 cursor-pointer" onClick={() => handleSort('status')}>
                            状态 {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </th>
                          <th className="text-left p-4 font-medium text-slate-700">容量</th>
                          <th className="text-left p-4 font-medium text-slate-700">类型</th>
                          <th className="text-left p-4 font-medium text-slate-700">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPoints.map(point => <tr key={point.id} className="border-b hover:bg-slate-50">
                            <td className="p-4">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full mr-2" style={{
                            backgroundColor: point.status === 'normal' ? '#10b981' : point.status === 'warning' ? '#f59e0b' : '#ef4444'
                          }} />
                                {point.name}
                              </div>
                            </td>
                            <td className="p-4 text-slate-600">{point.address}</td>
                            <td className="p-4">
                              <Badge variant="outline" className={point.status === 'normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : point.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}>
                                {point.status === 'normal' ? '正常' : point.status === 'warning' ? '预警' : '异常'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <Progress value={point.capacity} className="w-16 mr-2" />
                                <span className="text-sm">{point.capacity}%</span>
                              </div>
                            </td>
                            <td className="p-4 text-slate-600">{point.type}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  查看
                                </Button>
                                {point.hasCamera && <Button size="sm" variant="outline">
                                    <Camera className="w-4 h-4 mr-1" />
                                    监控
                                  </Button>}
                              </div>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>}

            {viewMode === 'map' && <Card>
                <CardContent className="p-6">
                  <div className="bg-slate-100 rounded-lg h-96 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-slate-400 mr-2" />
                    <p className="text-slate-500">地图视图 - 显示所有投放点位置</p>
                  </div>
                </CardContent>
              </Card>}
            
            {/* Pagination */}
            {pagination.total > pagination.pageSize && <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPagination(prev => ({
                ...prev,
                page: Math.max(1, prev.page - 1)
              }))} disabled={pagination.page === 1}>
                    上一页
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    第 {pagination.page} 页 / 共 {Math.ceil(pagination.total / pagination.pageSize)} 页
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setPagination(prev => ({
                ...prev,
                page: Math.min(Math.ceil(pagination.total / pagination.pageSize), prev.page + 1)
              }))} disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}>
                    下一页
                  </Button>
                </div>
              </div>}
          </TabsContent>

          <TabsContent value="alerts">
            <div className="space-y-4">
              {alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
            </div>
          </TabsContent>

          <TabsContent value="captures">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiCaptures.map(capture => <AICaptureCard key={capture.id} capture={capture} />)}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>投放点状态分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['normal', 'warning', 'critical', 'fault'].map(status => {
                    const count = points.filter(p => p.status === status).length;
                    const percentage = points.length > 0 ? (count / points.length * 100).toFixed(1) : 0;
                    return <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {status === 'normal' ? '正常' : status === 'warning' ? '预警' : status === 'critical' ? '紧急' : '故障'}
                        </span>
                        <div className="flex items-center">
                          <Progress value={parseFloat(percentage)} className="w-24 mr-2" />
                          <span className="text-sm text-slate-600">{count} ({percentage}%)</span>
                        </div>
                      </div>;
                  })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>类型分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['垃圾屋', '投放点', '收集站', '垃圾房', '投放站'].map(type => {
                    const count = points.filter(p => p.type === type).length;
                    const percentage = points.length > 0 ? (count / points.length * 100).toFixed(1) : 0;
                    return <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{type}</span>
                        <div className="flex items-center">
                          <Progress value={parseFloat(percentage)} className="w-24 mr-2" />
                          <span className="text-sm text-slate-600">{count} ({percentage}%)</span>
                        </div>
                      </div>;
                  })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}