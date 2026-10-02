import React, { createContext, useContext, useState, useEffect } from 'react';

const SkillProfileContext = createContext();

const STORAGE_KEY = 'careerpath_smart_skill_profile';

export function SkillProfileProvider({ children }) {
  const [skillProfile, setSkillProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [lastSavedTime, setLastSavedTime] = useState(null);

  useEffect(() => {
    if (skillProfile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skillProfile));
    }
  }, [skillProfile]);

  const saveSkillProfile = (profile) => {
    const enriched = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    setSkillProfile(enriched);
    setLastSavedTime(new Date().toLocaleTimeString());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
    return enriched;
  };

  const clearSkillProfile = () => {
    setSkillProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SkillProfileContext.Provider value={{
      skillProfile,
      saveSkillProfile,
      clearSkillProfile,
      hasSkillProfile: Boolean(skillProfile),
      lastSavedTime
    }}>
      {children}
    </SkillProfileContext.Provider>
  );
}

export function useSkillProfile() {
  const context = useContext(SkillProfileContext);
  if (!context) {
    throw new Error('useSkillProfile must be used within a SkillProfileProvider');
  }
  return context;
}
