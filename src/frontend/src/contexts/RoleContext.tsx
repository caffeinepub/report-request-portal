import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Role = 'Requester' | 'Admin';

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    const stored = sessionStorage.getItem('userRole');
    return (stored === 'Admin' || stored === 'Requester') ? stored : 'Requester';
  });

  useEffect(() => {
    sessionStorage.setItem('userRole', role);
  }, [role]);

  const toggleRole = () => {
    setRole((prev) => (prev === 'Requester' ? 'Admin' : 'Requester'));
  };

  return (
    <RoleContext.Provider value={{ role, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}
