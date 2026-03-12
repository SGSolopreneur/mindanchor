import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, X, Phone, Heart } from 'lucide-react';

const crisisResources = [
  {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 crisis support',
    type: 'call'
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Text support anytime',
    type: 'text'
  },
  {
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: 'Mental health & substance abuse',
    type: 'call'
  }
];

export default function SOSButton({ onStartBreathing }) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setShowPanel(true)}
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl h-16 px-6"
        >
          <AlertCircle className="w-6 h-6 mr-2" />
          Need Help Now?
        </Button>
      </motion.div>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Heart className="w-6 h-6 text-red-500" />
                      You're Not Alone
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPanel(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-gray-700">
                    If you're in crisis, please reach out for professional help. Here are resources available 24/7:
                  </p>

                  <div className="space-y-3">
                    {crisisResources.map((resource, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                            <p className="text-lg font-bold text-purple-700 my-1">{resource.number}</p>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-3">
                      Or try a quick grounding exercise:
                    </p>
                    <Button
                      onClick={() => {
                        setShowPanel(false);
                        onStartBreathing?.();
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Start Breathing Exercise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}