import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wind, Brain, Heart } from 'lucide-react';
import BreathingExercise from '../components/wellness/BreathingExercise';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const exercises = [
  {
    id: 'box',
    type: 'breathing',
    name: 'Box Breathing',
    description: 'Calming technique used by Navy SEALs for stress relief',
    icon: Wind,
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'deep',
    type: 'breathing',
    name: 'Deep Breathing',
    description: 'Simple and effective for quick stress relief',
    icon: Wind,
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: 'calm',
    type: 'breathing',
    name: '4-7-8 Breathing',
    description: 'Promotes relaxation and better sleep',
    icon: Heart,
    color: 'from-pink-400 to-rose-400'
  }
];

export default function Exercises() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const queryClient = useQueryClient();

  const logActivityMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });

  const handleComplete = (exercise) => {
    logActivityMutation.mutate({
      activity_type: 'breathing',
      name: exercise.name,
      duration_minutes: 5,
      completed: true
    });
  };

  if (selectedExercise) {
    const exercise = exercises.find(e => e.id === selectedExercise);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedExercise(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exercises
          </Button>

          <Card className="shadow-2xl">
            <CardContent className="pt-8 pb-12">
              <BreathingExercise
                exerciseType={selectedExercise}
                onComplete={() => handleComplete(exercise)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Wellness Exercises
          </h1>
          <p className="text-gray-600">Guided techniques to calm your mind and body</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {exercises.map((exercise, index) => {
            const Icon = exercise.icon;
            return (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
                  <div className={`h-2 bg-gradient-to-r ${exercise.color}`} />
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${exercise.color} bg-opacity-20`}>
                        <Icon className="w-6 h-6 text-purple-700" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{exercise.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {exercise.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setSelectedExercise(exercise.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Brain className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Why breathing exercises work</h3>
                  <p className="text-sm text-purple-800 leading-relaxed">
                    Controlled breathing activates your parasympathetic nervous system, which helps your body relax. 
                    Regular practice can reduce anxiety, improve focus, and enhance overall emotional wellbeing. 
                    Just 5 minutes a day can make a meaningful difference.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}