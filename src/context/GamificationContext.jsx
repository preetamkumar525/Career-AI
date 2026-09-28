import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const GamificationContext = createContext();

const INITIAL_BADGES = [
  { id: 'quiz_master', name: 'Quiz Master', name_hi: 'क्विज़ मास्टर', icon: '🎯', desc: 'Completed the 12-question Career Quiz', unlocked: false },
  { id: 'roadmap_pioneer', name: 'Roadmap Pioneer', name_hi: 'रोडमैप पायनियर', icon: '🗺️', desc: 'Generated a personalized 6-month study roadmap', unlocked: false },
  { id: 'resume_ready', name: 'Resume Pro', name_hi: 'रिज्यूमे प्रो', icon: '📄', desc: 'Drafted your first professional career resume', unlocked: false },
  { id: 'gap_analyzer', name: 'Skill Strategist', name_hi: 'स्किल रणनीतिकार', icon: '📊', desc: 'Audited your skills against target industry requirements', unlocked: false },
  { id: 'task_streak', name: 'Consistency Champ', name_hi: 'निरंतरता चैंपियन', icon: '🔥', desc: 'Completed 3 daily study checklist milestones', unlocked: false }
];

export function GamificationProvider({ children }) {
  const [xp, setXp] = useState(() => {
    return parseInt(localStorage.getItem('careerpath_xp') || '50', 10);
  });

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('careerpath_streak') || '3', 10);
  });

  const [badges, setBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('careerpath_badges');
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('careerpath_completed_tasks');
      return saved ? JSON.parse(saved) : ['task-1'];
    } catch {
      return ['task-1'];
    }
  });

  useEffect(() => {
    localStorage.setItem('careerpath_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('careerpath_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('careerpath_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('careerpath_completed_tasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const fireCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const addXP = (amount, reason = '') => {
    setXp(prev => {
      const updated = prev + amount;
      return updated;
    });
    fireCelebration();
  };

  const unlockBadge = (badgeId) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId && !b.unlocked) {
        fireCelebration();
        return { ...b, unlocked: true };
      }
      return b;
    }));
  };

  const toggleTask = (taskId, xpReward = 25) => {
    setCompletedTasks(prev => {
      const exists = prev.includes(taskId);
      if (exists) {
        return prev.filter(id => id !== taskId);
      } else {
        addXP(xpReward, 'Task Completed');
        const next = [...prev, taskId];
        if (next.length >= 3) {
          unlockBadge('task_streak');
        }
        return next;
      }
    });
  };

  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  return (
    <GamificationContext.Provider value={{
      xp,
      level,
      xpInCurrentLevel,
      streak,
      badges,
      completedTasks,
      addXP,
      unlockBadge,
      toggleTask,
      fireCelebration
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  return useContext(GamificationContext);
}
