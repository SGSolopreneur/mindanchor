import React from 'react';
import { motion } from 'framer-motion';

const moods = [
  { value: 'great', emoji: '😊', label: 'Great', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { value: 'good', emoji: '🙂', label: 'Good', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { value: 'okay', emoji: '😐', label: 'Okay', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { value: 'low', emoji: '😔', label: 'Low', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { value: 'struggling', emoji: '😢', label: 'Struggling', color: 'bg-red-100 hover:bg-red-200 border-red-300' }
];

export default function MoodSelector({ selectedMood, onSelectMood }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {moods.map((mood, index) => (
        <motion.button
          key={mood.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelectMood(mood.value)}
          className={`${mood.color} border-2 rounded-2xl p-4 transition-all ${
            selectedMood === mood.value ? 'ring-4 ring-purple-300 scale-105' : ''
          }`}
        >
          <div className="text-4xl mb-2">{mood.emoji}</div>
          <div className="text-sm font-medium text-gray-700">{mood.label}</div>
        </motion.button>
      ))}
    </div>
  );
}