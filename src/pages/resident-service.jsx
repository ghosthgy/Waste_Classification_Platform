// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress, useToast, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
// @ts-ignore;
import { Gift, AlertCircle, Calendar, RefreshCw, Download, Settings, Users, Star } from 'lucide-react';

// @ts-ignore;
import { ResidentProfile } from '@/components/ResidentProfile';
import { ProductCard } from '@/components/ProductCard';
import { AppointmentCard } from '@/components/AppointmentCard';
import { ReportCard } from '@/components/ReportCard';
import { QuizSection } from '@/components/QuizSection';
import { ScanSection } from '@/components/ScanSection';
import { AnalyticsSection } from '@/components/AnalyticsSection';
export default function ResidentServicePage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('scan');
  const [selectedQuiz, setSelectedQuiz] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [communityRanking, setCommunityRanking] = useState([]);

  // 获取用户数据
  const fetchUserData = async () => {
    try {
      setLoading(true);

      // 获取当前用户信息
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'resident_account',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          pageSize: 1
        }
      });
      if (result.records && result.records.length > 0) {
        const user = result.records[0];
        setUserData({
          name: user.nickname || '匿名用户',
          avatar: user.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
          points: user.total_points || 0,
          level: user.member_level || '普通会员',
          totalDisposals: user.total_disposals || 0,
          streakDays: user.streak_days || 0
        });

        // 设置兑换商品数据
        setProducts([{
          id: 1,
          name: '环保购物袋',
          points: 200,
          image: 'https://images.unsplash.com/photo-1602532305019-3dbbd482dae9?w=150&h=150&fit=crop',
          stock: 50,
          category: '生活用品'
        }, {
          id: 2,
          name: '不锈钢保温杯',
          points: 500,
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150&h=150&fit=crop',
          stock: 30,
          category: '生活用品'
        }, {
          id: 3,
          name: '有机蔬菜券',
          points: 300,
          image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=150&h=150&fit=crop',
          stock: 100,
          category: '食品券'
        }, {
          id: 4,
          name: '电影票',
          points: 800,
          image: 'https://images.unsplash.com/photo-1489599808821-c86a2fb9b0fb?w=150&h=150&fit=crop',
          stock: 20,
          category: '娱乐'
        }, {
          id: 5,
          name: '健身卡',
          points: 1200,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
          stock: 15,
          category: '运动'
        }, {
          id: 6,
          name: '图书券',
          points: 150,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
          stock: 80,
          category: '文化'
        }]);

        // 设置预约记录
        setAppointments([{
          id: 1,
          type: '大件垃圾',
          date: '2024-01-15',
          time: '14:00-16:00',
          address: '幸福小区A栋501',
          items: ['旧沙发', '床垫', '衣柜'],
          status: 'confirmed'
        }, {
          id: 2,
          type: '有害垃圾',
          date: '2024-01-20',
          time: '09:00-11:00',
          address: '阳光花园B区3栋',
          items: ['废电池', '过期药品'],
          status: 'pending'
        }, {
          id: 3,
          type: '可回收物',
          date: '2024-01-18',
          time: '10:00-12:00',
          address: '绿地小区C栋',
          items: ['纸箱', '塑料瓶', '易拉罐'],
          status: 'completed'
        }]);

        // 设置举报记录
        setReports([{
          id: 1,
          type: '垃圾混投',
          location: '阳光花园B区',
          description: '发现有人将厨余垃圾和可回收物混投',
          image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=300&h=200&fit=crop',
          status: 'pending',
          time: '2小时前'
        }, {
          id: 2,
          type: '垃圾满溢',
          location: '幸福小区A栋',
          description: '垃圾桶已满，需要及时清运',
          image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=300&h=200&fit=crop',
          status: 'processing',
          time: '1天前'
        }, {
          id: 3,
          type: '设施损坏',
          location: '和谐家园D区',
          description: '垃圾桶盖子损坏，无法正常使用',
          image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=300&h=200&fit=crop',
          status: 'resolved',
          time: '3天前'
        }]);

        // 设置积分历史
        setPointsHistory(Array.from({
          length: 7
        }, (_, i) => ({
          date: `${i + 1}日`,
          points: Math.floor(Math.random() * 50 + 10)
        })));

        // 设置社区排名
        setCommunityRanking([{
          name: user.nickname || '我',
          points: user.total_points || 0,
          avatar: user.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        }, {
          name: '张小明',
          points: 2580,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        }, {
          name: '李小红',
          points: 2340,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
        }, {
          name: '王小华',
          points: 2100,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        }, {
          name: '赵小刚',
          points: 1950,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        }].sort((a, b) => b.points - a.points));
      }
    } catch (error) {
      console.error('数据加载失败:', error);
      // 使用模拟数据作为后备
      const mockUser = {
        name: '张小明',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
        points: 2580,
        level: '黄金会员',
        totalDisposals: 156,
        streakDays: 23
      };
      setUserData(mockUser);
      const mockProducts = [{
        id: 1,
        name: '环保购物袋',
        points: 200,
        image: 'https://images.unsplash.com/photo-1602532305019-3dbbd482dae9?w=150&h=150&fit=crop',
        stock: 50,
        category: '生活用品'
      }];
      setProducts(mockProducts);
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
    fetchUserData();
  }, []);
  const handleScan = () => {
    toast({
      title: '扫码成功',
      description: '正在打开投放页面...'
    });
  };
  const handleQuizAnswer = answer => {
    if (answer === 1) {
      toast({
        title: '回答正确！',
        description: '获得10积分奖励',
        variant: 'default'
      });
    } else {
      toast({
        title: '回答错误',
        description: '正确答案是B：厨余垃圾',
        variant: 'destructive'
      });
    }
  };
  const handleExchange = product => {
    if (userData.points >= product.points) {
      toast({
        title: '兑换成功',
        description: `${product.name}已添加到您的账户`,
        variant: 'default'
      });
    } else {
      toast({
        title: '积分不足',
        description: `需要${product.points}积分，当前只有${userData.points}积分`,
        variant: 'destructive'
      });
    }
  };
  const handleRefresh = () => {
    fetchUserData();
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
        <p className="text-slate-600">加载用户数据中...</p>
      </div>
    </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">居民服务</h1>
              <p className="text-slate-600">垃圾分类，从我做起</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {userData && <ResidentProfile userData={userData} />}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="scan">
              扫码投放
            </TabsTrigger>
            <TabsTrigger value="mall">
              积分商城
            </TabsTrigger>
            <TabsTrigger value="appointment">
              预约服务
            </TabsTrigger>
            <TabsTrigger value="report">
              曝光举报
            </TabsTrigger>
            <TabsTrigger value="analytics">
              数据分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-4">
            <ScanSection onScan={handleScan} />
            <QuizSection selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz} quizAnswer={quizAnswer} setQuizAnswer={setQuizAnswer} showQuizResult={showQuizResult} setShowQuizResult={setShowQuizResult} onAnswer={handleQuizAnswer} />
          </TabsContent>

          <TabsContent value="mall" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">积分商城</h3>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分类</SelectItem>
                    <SelectItem value="生活用品">生活用品</SelectItem>
                    <SelectItem value="食品券">食品券</SelectItem>
                    <SelectItem value="娱乐">娱乐</SelectItem>
                    <SelectItem value="运动">运动</SelectItem>
                    <SelectItem value="文化">文化</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="points">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="排序" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="points">积分排序</SelectItem>
                    <SelectItem value="stock">库存排序</SelectItem>
                    <SelectItem value="popular">热门推荐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => <ProductCard key={product.id} product={product} onExchange={handleExchange} />)}
            </div>
          </TabsContent>

          <TabsContent value="appointment" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">我的预约</h3>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                新建预约
              </Button>
            </div>
            <div className="space-y-4">
              {appointments.map(appointment => <AppointmentCard key={appointment.id} appointment={appointment} />)}
            </div>
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">我的举报</h3>
              <Button>
                <AlertCircle className="w-4 h-4 mr-2" />
                新建举报
              </Button>
            </div>
            <div className="space-y-4">
              {reports.map(report => <ReportCard key={report.id} report={report} />)}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsSection userData={userData} pointsHistory={pointsHistory} communityRanking={communityRanking} />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}