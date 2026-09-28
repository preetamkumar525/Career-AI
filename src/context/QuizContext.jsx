import React, { createContext, useContext, useState, useEffect } from 'react';
import careersData from '../data/careers.json';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [quizResult, setQuizResult] = useState(() => {
    try {
      const saved = localStorage.getItem('careerpath_quiz_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const saveQuizResult = (result) => {
    setQuizResult(result);
    localStorage.setItem('careerpath_quiz_result', JSON.stringify(result));
  };

  const clearQuizResult = () => {
    setQuizResult(null);
    localStorage.removeItem('careerpath_quiz_result');
  };

  /**
   * Helper scoring engine that takes selected answers map: { [questionId]: optionId }
   * and computes top 3 career matches with match scores and breakdown
   */
  const calculateResults = (answersMap, questions) => {
    const scores = {};
    careersData.forEach(c => { scores[c.id] = 0; });

    // Aggregate weights
    questions.forEach(q => {
      const selectedOptionId = answersMap[q.id];
      if (!selectedOptionId) return;
      const opt = q.options.find(o => o.id === selectedOptionId);
      if (opt && opt.weights) {
        Object.entries(opt.weights).forEach(([careerId, weight]) => {
          if (scores[careerId] !== undefined) {
            scores[careerId] += weight;
          }
        });
      }
    });

    // Find maximum score to normalize percentages nicely
    const maxScore = Math.max(...Object.values(scores), 1);

    const sorted = Object.entries(scores)
      .map(([careerId, score]) => {
        const career = careersData.find(c => c.id === careerId);
        // Calculate match percentage (between 62% and 98% for realistic feel)
        const normalized = Math.min(98, Math.max(60, Math.round((score / maxScore) * 96)));
        return {
          ...career,
          score,
          matchScore: normalized,
          reasons: [
            `Strong alignment with your interest in ${career?.category === 'govt' ? 'public sector stability & governance' : career?.category === 'vocational' ? 'hands-on technical building' : 'high-impact professional growth'}.`,
            `Matches your preferred preparation timeline and financial budget expectations.`,
            `Key skills like ${career?.skills_needed?.slice(0, 2).join(' & ')} align with your problem solving strengths.`
          ]
        };
      })
      .sort((a, b) => b.score - a.score);

    const topCareers = sorted.slice(0, 3);
    const resultObj = {
      completedAt: new Date().toISOString(),
      topCareers,
      allScores: scores,
      answers: answersMap
    };

    saveQuizResult(resultObj);
    return resultObj;
  };

  return (
    <QuizContext.Provider value={{ quizResult, saveQuizResult, clearQuizResult, calculateResults }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}
