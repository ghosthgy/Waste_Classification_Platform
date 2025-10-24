// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';
// @ts-ignore;
import { Truck, MapPin, Clock, AlertTriangle, Play, Route, Fuel, Eye, RefreshCw, Download, Settings, Navigation, Calendar, BarChart3 } from 'lucide-react';

// @ts-ignore;
import { VehicleCard } from '@/components/VehicleCard';
import { RouteCard } from '@/components/RouteCard';
import { AlertCard } from '@/components/AlertCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
export default function CollectionManagementPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 获取车辆数据
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'waste_collection_vehicle',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true
        }
      });
      const vehicleData = result.records?.map(vehicle => ({
        id: vehicle.vehicle_id,
        plate: vehicle.plate_number,
        driver: vehicle.driver_name,
        type: vehicle.vehicle_type,
        status: vehicle.status,
        currentLocation: vehicle.current_location?.address || '未知位置',
        progress: vehicle.collection_progress || 0,
        route: vehicle.route_plan?.route_name || '未分配',
        fuel: vehicle.fuel_level || 0,
        speed: vehicle.current_speed || 0,
        lastUpdate: new Date(vehicle.last_update_time).toLocaleString('zh-CN'),
        coordinates: vehicle.current_location?.coordinates || {
          lat: 0,
          lng: 0
        }
      })) || [];
      setVehicles(vehicleData);

      // 获取异常记录
      const alertsData = [];
      result.records?.forEach(vehicle => {
        if (vehicle.exception_records && Array.isArray(vehicle.exception_records)) {
          vehicle.exception_records.forEach(exception => {
            alertsData.push({
              id: exception.exception_id,
              vehicle: vehicle.plate_number,
              type: exception.type,
              level: exception.level,
              location: exception.location,
              time: new Date(exception.occurred_at).toLocaleString('zh-CN'),
              description: exception.description,
              status: exception.status
            });
          });
        }
      });
      setAlerts(alertsData.slice(0, 10));
    } catch (error) {
      console.error('数据加载失败:', error);
      // 使用模拟数据作为后备
      const mockVehicles = [{
        id: 1,
        plate: '沪A12345',
        driver: '张师傅',
        type: '厨余垃圾车',
        status: 'collecting',
        currentLocation: '阳光花园B区',
        progress: 65,
        route: '路线1',
        fuel: 78,
        speed: 25,
        lastUpdate: '2分钟前',
        coordinates: {
          lat: 31.2294,
          lng: 121.4747
        }
      }, {
        id: 2,
        plate: '沪B67890',
        driver: '李师傅',
        type: '可回收物车',
        status: 'enroute',
        currentLocation: '前往绿地小区',
        progress: 40,
        route: '路线2',
        fuel: 45,
        speed: 35,
        lastUpdate: '5分钟前',
        coordinates: {
          lat: 31.2284,
          lng: 121.4757
        }
      }];
      setVehicles(mockVehicles);
      const mockAlerts = [{
        id: 1,
        vehicle: '沪A12345',
        type: '滴漏报警',
        level: 'warning',
        location: '阳光大道与和平路交叉口',
        time: '15分钟前',
        description: '车辆底部发现液体滴漏，疑似厨余垃圾渗滤液'
      }];
      setAlerts(mockAlerts);
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
    fetchVehicles();
    if (autoRefresh) {
      const interval = setInterval(fetchVehicles, 30000); // 30秒刷新一次
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // 模拟路线数据
  const mockRoutes = [{
    id: 1,
    name: '东部片区路线',
    stops: ['幸福小区', '阳光花园', '绿地小区', '和谐家园'],
    totalDistance: 12.5,
    estimatedTime: '2小时30分',
    status: 'active',
    progress: 65
  }, {
    id: 2,
    name: '西部片区路线',
    stops: ['智慧社区', '科技园区', '创新中心', '创业大厦'],
    totalDistance: 15.8,
    estimatedTime: '3小时15分',
    status: 'active',
    progress: 40
  }, {
    id: 3,
    name: '南部片区路线',
    stops: ['滨江小区', '河畔花园', '水岸华庭', '江景公寓'],
    totalDistance: 18.2,
    estimatedTime: '3小时45分',
    status: 'pending',
    progress: 0
  }];

  // 模拟轨迹数据
  const mockTrajectory = Array.from({
    length: 6
  }, (_, i) => ({
    time: `${8 + i * 0.25}:00`,
    lat: 31.2304 - i * 0.001,
    lng: 121.4737 + i * 0.001,
    speed: Math.floor(Math.random() * 30 + 20)
  }));

  // 模拟效率数据
  const efficiencyData = Array.from({
    length: 7
  }, (_, i) => ({
    date: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
    efficiency: Math.floor(75 + Math.random() * 20),
    completed: Math.floor(8 + Math.random() * 4),
    delayed: Math.floor(Math.random() * 2)
  }));
  const handleRefresh = () => {
    fetchVehicles();
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
        <p className="text-slate-600">加载车辆数据中...</p>
      </div>
    </div>;
  }
  return <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">清运管理</h1>
              <p className="text-slate-600">车辆调度 · 路线规划 · 异常监控</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? '自动刷新' : '手动刷新'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
              <Button variant="outline" size="sm">
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
                <p className="text-2xl font-bold text-slate-900">{vehicles.length}</p>
                <p className="text-sm text-slate-600">运营车辆</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {vehicles.filter(v => v.status === 'collecting').length}
                </p>
                <p className="text-sm text-slate-600">收运中</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {mockRoutes.filter(r => r.status === 'active').length}
                </p>
                <p className="text-sm text-slate-600">活跃路线</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{alerts.length}</p>
                <p className="text-sm text-slate-600">异常报警</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vehicles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vehicles">车辆监控</TabsTrigger>
            <TabsTrigger value="routes">路线管理</TabsTrigger>
            <TabsTrigger value="alerts">异常报警</TabsTrigger>
            <TabsTrigger value="trajectory">轨迹回放</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
            </div>
          </TabsContent>

          <TabsContent value="routes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockRoutes.map(route => <RouteCard key={route.id} route={route} />)}
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="space-y-4">
              {alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
            </div>
          </TabsContent>

          <TabsContent value="trajectory">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  车辆轨迹回放
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">轨迹地图</h3>
                    <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-slate-400" />
                      <p className="text-slate-500 ml-2">轨迹地图展示区域</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">速度变化</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={mockTrajectory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="选择车辆" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => <SelectItem key={v.id} value={v.plate}>{v.plate}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsPlaying(!isPlaying)}>
                    <Play className="w-4 h-4 mr-2" />
                    {isPlaying ? '暂停' : '播放'}
                  </Button>
                  <Button variant="outline">导出轨迹</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    清运效率分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={efficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="efficiency" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="效率(%)" />
                      <Area type="monotone" dataKey="completed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="完成次数" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    本周统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">总清运次数</span>
                      <span className="text-2xl font-bold text-emerald-600">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">平均效率</span>
                      <span className="text-2xl font-bold text-blue-600">87.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">延迟次数</span>
                      <span className="text-2xl font-bold text-amber-600">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">总里程</span>
                      <span className="text-2xl font-bold text-purple-600">1,245km</span>
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