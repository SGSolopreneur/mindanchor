import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Activity, Sun, Users, Moon } from 'lucide-react';

const iconMap = {
  cbt: Sparkles,
  mindfulness: Heart,
  movement: Activity,
  lifestyle: Sun,
  social: Users,
  rest: Moon
};

export default function RecommendationCard({ recommendation, onStart, index = 0 }) {
  const Icon = iconMap[recommendation.category] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className="w-5 h-5 text-purple-600" />
                {recommendation.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {recommendation.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{recommendation.reason}</p>
            
            {recommendation.steps && (
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs font-medium text-purple-900 mb-2">How to do it:</p>
                <ol className="text-sm text-purple-800 space-y-1 ml-4 list-decimal">
                  {recommendation.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">
                ⏱️ {recommendation.duration || '5-10 min'}
              </span>
              <Button
                onClick={() => onStart?.(recommendation)}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Try This
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}