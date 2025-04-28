import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hospital' | 'family';
  hospitalId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@mediguard.com',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Hospital Staff',
    email: 'hospital@mediguard.com',
    password: 'hospital123',
    role: 'hospital' as const,
    hospitalId: 'h1',
  },
  {
    id: '3',
    name: 'Family Member',
    email: 'family@mediguard.com',
    password: 'family123',
    role: 'family' as const,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call with delay
    setLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          // Remove password field before storing user
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};