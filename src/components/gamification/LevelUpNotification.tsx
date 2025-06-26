
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';

interface LevelUpNotificationProps {
  level: {
    level: number;
    title: string;
    icon: string;
    description: string;
  };
  show: boolean;
  onComplete: () => void;
}

export const LevelUpNotification = ({ level, show, onComplete }: LevelUpNotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, rotateY: -90 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 text-white p-8 rounded-2xl shadow-2xl border border-purple-500/30 max-w-md mx-4"
          >
            <div className="text-center">
              {/* Sparkles animation */}
              <div className="relative mb-6">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="absolute"
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: `${10 + (i % 2) * 20}%`
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                ))}
                
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-6xl mx-auto w-fit"
                >
                  {level.icon}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  LEVEL UP!
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <span className="text-xl font-semibold">Level {level.level}</span>
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                  {level.title}
                </h3>
                <p className="text-gray-300 text-lg">
                  {level.description}
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={onComplete}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-[#00C851] to-[#00a844] text-white font-semibold rounded-lg hover:from-[#00a844] to-[#008833] transition-all duration-200 transform hover:scale-105"
              >
                Continue Creating
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
