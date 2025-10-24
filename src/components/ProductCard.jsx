// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { Gift } from 'lucide-react';

export function ProductCard({
  product,
  onExchange
}) {
  return <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge variant="outline" className="text-xs">{product.category}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-600 font-bold">{product.points} 积分</p>
            <p className="text-sm text-slate-500">库存: {product.stock}</p>
          </div>
          <Button size="sm" onClick={() => onExchange(product)}>
            <Gift className="w-4 h-4 mr-1" />
            兑换
          </Button>
        </div>
      </CardContent>
    </Card>;
}