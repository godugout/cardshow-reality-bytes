
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

interface XPNotificationProps {
  points: number;
  source: string;
  show: boolean;
  onComplete: () => void;
}

export const XPNotification = ({ points, source, show, onComplete }: XPNotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#00C851] to-[#00a844] text-white px-6 py-3 rounded-lg shadow-lg border border-[#00C851]/20"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Star className="w-6 h-6 text-yellow-300" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">+{points} XP</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-sm opacity-90 capitalize">
                {source.replace('_', ' ')}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
