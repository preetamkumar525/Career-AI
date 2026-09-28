import React, { createContext, useContext, useState, useEffect } from 'react';

const ParentViewContext = createContext();

export function ParentViewProvider({ children }) {
  const [isParentView, setIsParentView] = useState(() => {
    return localStorage.getItem('careerpath_parent_view') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('careerpath_parent_view', isParentView.toString());
  }, [isParentView]);

  const toggleParentView = () => {
    setIsParentView(prev => !prev);
  };

  return (
    <ParentViewContext.Provider value={{ isParentView, setIsParentView, toggleParentView }}>
      {children}
    </ParentViewContext.Provider>
  );
}

export function useParentView() {
  return useContext(ParentViewContext);
}
