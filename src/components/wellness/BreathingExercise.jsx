import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

const exercises = {
  box: {
    name: 'Box Breathing',
    description: 'Calming technique used by Navy SEALs',
    steps: [
      { phase: 'Breathe In', duration: 4, instruction: 'Inhale slowly through your nose' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath gently' },
      { phase: 'Breathe Out', duration: 4, instruction: 'Exhale slowly through your mouth' },
      { phase: 'Hold', duration: 4, instruction: 'Hold before the next breath' }
    ]
  },
  deep: {
    name: 'Deep Breathing',
    description: 'Simple and effective for quick stress relief',
    steps: [
      { phase: 'Breathe In', duration: 4, instruction: 'Breathe in deeply through your nose' },
      { phase: 'Hold', duration: 2, instruction: 'Hold briefly' },
      { phase: 'Breathe Out', duration: 6, instruction: 'Exhale slowly and completely' }
    ]
  },
  calm: {
    name: '4-7-8 Breathing',
    description: 'Promotes relaxation and sleep',
    steps: [
      { phase: 'Breathe In', duration: 4, instruction: 'Inhale quietly through your nose' },
      { phase: 'Hold', duration: 7, instruction: 'Hold your breath' },
      { phase: 'Breathe Out', duration: 8, instruction: 'Exhale completely through your mouth' }
    ]
  }
};

export default function BreathingExercise({ exerciseType = 'box', onComplete }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const exercise = exercises[exerciseType];
  const totalCycles = 5;

  useEffect(() => {
    if (!isActive) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const nextStep = (currentStep + 1) % exercise.steps.length;
      if (nextStep === 0) {
        const nextCycle = cycleCount + 1;
        if (nextCycle >= totalCycles) {
          setIsActive(false);
          onComplete?.();
          return;
        }
        setCycleCount(nextCycle);
      }
      setCurrentStep(nextStep);
      setCountdown(exercise.steps[nextStep].duration);
    }
  }, [isActive, countdown, currentStep, cycleCount, exercise.steps, onComplete]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    setCountdown(exercise.steps[0].duration);
    setCycleCount(0);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStep(0);
    setCountdown(0);
    setCycleCount(0);
  };

  const progress = ((cycleCount * exercise.steps.length + currentStep) / (totalCycles * exercise.steps.length)) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{exercise.name}</h3>
        <p className="text-sm text-gray-600">{exercise.description}</p>
      </div>

      <div className="relative w-64 h-64 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: exercise.steps[currentStep]?.duration || 4,
                ease: "easeInOut",
                repeat: 0
              }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center shadow-2xl"
            >
              <div className="text-center text-white">
                <div className="text-5xl font-bold mb-2">{countdown || (isActive ? '0' : '•')}</div>
                <div className="text-lg font-medium">{exercise.steps[currentStep]?.phase}</div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">
          Cycle {cycleCount + 1} of {totalCycles}
        </div>
      </div>

      <p className="text-center text-gray-700 mb-6 min-h-[3rem] max-w-md">
        {exercise.steps[currentStep]?.instruction}
      </p>

      <div className="flex gap-3">
        {!isActive ? (
          <Button onClick={handleStart} size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Play className="w-5 h-5 mr-2" />
            Start Exercise
          </Button>
        ) : (
          <>
            <Button onClick={() => setIsActive(false)} size="lg" variant="outline">
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
            <Button onClick={handleReset} size="lg" variant="outline">
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
}