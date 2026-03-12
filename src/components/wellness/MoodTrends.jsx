import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const moodToValue = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  struggling: 1
};

const moodColors = {
  5: '#10b981',
  4: '#3b82f6',
  3: '#f59e0b',
  2: '#f97316',
  1: '#ef4444'
};

export default function MoodTrends({ entries }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  const data = last7Days.map(date => {
    const dayEntries = entries.filter(e => 
      format(new Date(e.created_date), 'yyyy-MM-dd') === date
    );
    
    const avgMood = dayEntries.length > 0
      ? dayEntries.reduce((sum, e) => sum + moodToValue[e.mood], 0) / dayEntries.length
      : null;

    return {
      date: format(new Date(date), 'EEE'),
      mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
      fullDate: date
    };
  });

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Week at a Glance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            Start logging your mood to see trends over time
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Week at a Glance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              domain={[1, 5]} 
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => {
                const labels = ['Struggling', 'Low', 'Okay', 'Good', 'Great'];
                return labels[Math.round(value) - 1];
              }}
            />
            <Area 
              type="monotone" 
              dataKey="mood" 
              stroke="#a78bfa" 
              strokeWidth={2}
              fill="url(#moodGradient)"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}