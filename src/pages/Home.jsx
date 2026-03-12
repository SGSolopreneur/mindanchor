import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, TrendingUp, X } from 'lucide-react';
import MoodSelector from '../components/wellness/MoodSelector';
import RecommendationCard from '../components/wellness/RecommendationCard';
import MoodTrends from '../components/wellness/MoodTrends';
import SOSButton from '../components/wellness/SOSButton';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const getRecommendations = (mood, energyLevel, stressLevel) => {
  const recommendations = [];

  if (mood === 'struggling' || mood === 'low') {
    recommendations.push({
      category: 'cbt',
      title: 'Thought Reframing',
      description: 'Challenge negative thoughts with evidence',
      reason: 'Your mood suggests you might be experiencing difficult thoughts. This CBT technique can help.',
      duration: '5 min',
      steps: [
        'Identify the negative thought',
        'Ask: Is this thought 100% true?',
        'Find evidence that contradicts it',
        'Replace with a balanced thought'
      ]
    });
  }

  if (stressLevel === 'high') {
    recommendations.push({
      category: 'mindfulness',
      title: '5-4-3-2-1 Grounding',
      description: 'Calm your nervous system instantly',
      reason: 'High stress levels can be reduced with this grounding technique.',
      duration: '3 min',
      steps: [
        'Name 5 things you can see',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste'
      ]
    });
  }

  if (energyLevel === 'low') {
    recommendations.push({
      category: 'movement',
      title: 'Gentle Stretching',
      description: 'Boost energy without exhaustion',
      reason: 'Low energy can improve with gentle movement.',
      duration: '10 min',
      steps: [
        'Stand and reach arms overhead',
        'Gentle neck rolls',
        'Shoulder circles',
        'Touch your toes (or knees)',
        'Take a short walk if possible'
      ]
    });
  }

  recommendations.push({
    category: 'lifestyle',
    title: 'Hydration Check',
    description: 'Simple but powerful mood booster',
    reason: 'Dehydration affects mood and energy. A quick win!',
    duration: '1 min',
    steps: [
      'Drink a full glass of water',
      'Notice how you feel after',
      'Set a reminder to drink water regularly'
    ]
  });

  recommendations.push({
    category: 'social',
    title: 'Reach Out',
    description: 'Connect with someone you trust',
    reason: 'Social connection is one of the strongest predictors of wellbeing.',
    duration: '5-15 min',
    steps: [
      'Think of someone who makes you feel good',
      'Send a text or make a call',
      'Share something positive or ask how they are',
      'Schedule a time to meet if possible'
    ]
  });

  return recommendations.slice(0, 3);
};

export default function Home() {
  const [showCheckIn, setShowCheckIn] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);
  const [energyLevel, setEnergyLevel] = useState('moderate');
  const [stressLevel, setStressLevel] = useState('moderate');
  const [note, setNote] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [user, setUser] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: todayEntries = [] } = useQuery({
    queryKey: ['todayMoodEntries'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const entries = await base44.entities.MoodEntry.list();
      return entries.filter(e => 
        e.created_date.startsWith(today)
      );
    },
    enabled: !!user
  });

  const { data: allEntries = [] } = useQuery({
    queryKey: ['moodEntries'],
    queryFn: () => base44.entities.MoodEntry.list('-created_date', 30),
    enabled: !!user
  });

  const createMoodMutation = useMutation({
    mutationFn: (data) => base44.entities.MoodEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayMoodEntries'] });
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      setShowRecommendations(true);
      setShowCheckIn(false);
    }
  });

  const handleSubmitMood = () => {
    createMoodMutation.mutate({
      mood: selectedMood,
      energy_level: energyLevel,
      stress_level: stressLevel,
      note: note.trim() || undefined
    });
  };

  const recommendations = selectedMood 
    ? getRecommendations(selectedMood, energyLevel, stressLevel)
    : [];

  const hasCheckedInToday = todayEntries.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Calm Mind
          </h1>
          <p className="text-gray-600">Your mental wellness companion</p>
        </motion.div>

        {hasCheckedInToday && !showCheckIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">You've checked in today!</p>
                      <p className="text-sm text-green-700">Great job taking care of yourself</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCheckIn(true)}
                    className="border-green-300"
                  >
                    Check In Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {showCheckIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">How are you feeling?</CardTitle>
                    {hasCheckedInToday && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowCheckIn(false)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Your mood right now
                    </label>
                    <MoodSelector 
                      selectedMood={selectedMood}
                      onSelectMood={setSelectedMood}
                    />
                  </div>

                  {selectedMood && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Energy level
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['low', 'moderate', 'high'].map(level => (
                            <Button
                              key={level}
                              variant={energyLevel === level ? 'default' : 'outline'}
                              onClick={() => setEnergyLevel(level)}
                              className={energyLevel === level ? 'bg-purple-600' : ''}
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Stress level
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['low', 'moderate', 'high'].map(level => (
                            <Button
                              key={level}
                              variant={stressLevel === level ? 'default' : 'outline'}
                              onClick={() => setStressLevel(level)}
                              className={stressLevel === level ? 'bg-purple-600' : ''}
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Anything on your mind? (optional)
                        </label>
                        <Textarea
                          placeholder="Share what you're thinking or feeling..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="resize-none"
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={handleSubmitMood}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={createMoodMutation.isPending}
                      >
                        {createMoodMutation.isPending ? 'Saving...' : 'Continue'}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {showRecommendations && recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Here's what might help
                </h2>
                <p className="text-gray-600">
                  Based on how you're feeling, we recommend these activities
                </p>
              </div>

              <div className="grid gap-4">
                {recommendations.map((rec, i) => (
                  <RecommendationCard
                    key={i}
                    recommendation={rec}
                    index={i}
                    onStart={(rec) => {
                      if (rec.category === 'mindfulness' || rec.category === 'cbt') {
                        window.location.href = createPageUrl('Exercises');
                      }
                    }}
                  />
                ))}
              </div>

              <div className="text-center">
                <Link to={createPageUrl('Exercises')}>
                  <Button variant="outline" size="lg">
                    View All Exercises
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {allEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <MoodTrends entries={allEntries} />
          </motion.div>
        )}

        <SOSButton onStartBreathing={() => window.location.href = createPageUrl('Exercises')} />
      </div>
    </div>
  );
}