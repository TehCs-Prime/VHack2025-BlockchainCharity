import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  AuthError,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  FirestoreError
} from 'firebase/firestore';

// UserData interface includes an optional verified property,
// which applies only to charity accounts.
export interface UserData {
  uid: string;
  email: string;
  role: 'user' | 'charity' | 'admin';
  username?: string;
  profilePicture?: string;
  createdAt: string;
  organizationName?: string;
  orgType?: string;
  registeredCountry?: string;
  businessId?: string;
  website?: string;
  description?: string;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  missionStatement?: string;
  registrationNumber?: string;
  documentUrl?: string;
  verified?: boolean; // Exists only for charity accounts.
}

// Definition for the authentication context.
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
  signInWithGoogle: (role?: 'user' | 'charity') => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Centralized error handler to capture and log auth or Firestore errors.
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

  // Listen to authentication state changes.
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
      } catch (err) {
        handleAuthError(err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Login using email and password.
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  // Signup for new users.
  // For charity accounts, we add the verified field with false value.
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

      // Only charity accounts get the verified field.
      const charityData = role === 'charity' ? { verified: false } : {};
      const newUserData: UserData = {
        uid: user.uid,
        email,
        role,
        createdAt: new Date().toISOString(),
        ...charityData,
        ...additionalData
      };

      await setDoc(doc(db, 'users', user.uid), newUserData);
      setUserData(newUserData);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  // Logout the current user.
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
      setUserData(null);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  // Update the user profile.
  const updateProfile = async (updates: Partial<UserData>) => {
    try {
      setLoading(true);
      setError(null);
      if (!currentUser) throw new Error('Not authenticated');
      await updateDoc(doc(db, 'users', currentUser.uid), updates);
      setUserData((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  // Sign in using Google.
  const signInWithGoogle = async (role: 'user' | 'charity' = 'user') => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists.
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const newUserData: UserData = {
          uid: user.uid,
          email: user.email || '',
          role,
          username: user.displayName || '',
          profilePicture: user.photoURL || '',
          createdAt: new Date().toISOString(),
          ...(role === 'charity' ? { verified: false } : {})
        };
        await setDoc(doc(db, 'users', user.uid), newUserData);
        setUserData(newUserData);
      }
    } catch (err) {
      handleAuthError(err);
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
        signInWithGoogle,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
