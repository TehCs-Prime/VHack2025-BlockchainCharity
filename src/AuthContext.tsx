import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  username: string
  email: string
  signupDate: string
}

interface AuthContextType {
  user: User | null
  login: (userData: Omit<User, 'signupDate'>) => void
  logout: () => void
  updateUser: (updatedData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  const login = (userData: Omit<User, 'signupDate'>) => {
    setUser({ 
      ...userData, 
      signupDate: new Date().toISOString() 
    })
  }
  
  const logout = () => setUser(null)
  
  const updateUser = (updatedData: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...updatedData } : null))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
