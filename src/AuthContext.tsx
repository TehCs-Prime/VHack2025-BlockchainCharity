import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  AuthError
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  FirestoreError
} from 'firebase/firestore';

// Firestore user document structure
interface UserData {
  uid: string;
  email: string;
  role: 'user' | 'charity' | 'admin';
  username?: string;
  profilePicture?: string;
  createdAt: string;
  organizationName?: string;
  missionStatement?: string;
  registrationNumber?: string;
  documentUrl?: string;
  verified?: boolean;
}

// Context type definition
interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    role: 'user' | 'charity',
    additionalData?: Partial<UserData>
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserData>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Create the context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Centralized error handling
  const handleAuthError = (error: unknown) => {
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof Error) {
      const firebaseError = error as AuthError | FirestoreError;
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'permission-denied':
          errorMessage = 'Operation not allowed';
          break;
        default:
          errorMessage = firebaseError.message;
      }
    }

    setError(errorMessage);
    throw new Error(errorMessage);
  };

  // Fetch and observe auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        setCurrentUser(user);
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData({ uid: user.uid, ...docSnap.data() } as UserData);
          } else {
            console.warn('User document not found for uid:', user.uid);
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        handleAuthError(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async (
    email: string,
    password: string,
    role: 'user' | 'charity',
    additionalData: Partial<UserData> = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userData: UserData = {
        uid: user.uid,
        email,
        role,
        createdAt: new Date().toISOString(),
        ...additionalData
      };
      await setDoc(doc(db, 'users', user.uid), userData);
      setUserData(userData);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserData>) => {
    try {
      setLoading(true);
      setError(null);
      if (!currentUser) throw new Error('Not authenticated');
      await updateDoc(doc(db, 'users', currentUser.uid), updates);
      setUserData((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        login,
        signup,
        logout,
        updateProfile,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
