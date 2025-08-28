import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  ConfirmationResult
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, signInWithPhone, setupRecaptcha } from '../config/firebase';
import { User, UserRole } from '../types';
import { RecaptchaVerifier } from 'firebase/auth';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<FirebaseUser>;
  loginWithPhone: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (uid: string, data: Partial<User>) => Promise<void>;
  createUserProfile: (uid: string, userData: Partial<User>, role: UserRole) => Promise<void>;
  setupRecaptchaVerifier: (containerId: string) => RecaptchaVerifier;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as User);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, role: UserRole) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    const userData: User = {
      id: user.uid,
      email: email,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    // Create profile document based on role
    if (role === 'worker') {
      await setDoc(doc(db, 'workers', user.uid), {
        userId: user.uid,
        name: '',
        trade: '',
        experience: 0,
        location: '',
        certifications: [],
        rating: 0,
        totalRatings: 0,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      await setDoc(doc(db, 'employers', user.uid), {
        userId: user.uid,
        companyName: '',
        contactName: '',
        businessType: '',
        location: '',
        rating: 0,
        totalRatings: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Método para login con Google
  const loginWithGoogle = async (): Promise<FirebaseUser> => {
    const result = await signInWithGoogle();
    return result.user;
  };

  // Método para login con teléfono
  const loginWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    return await signInWithPhone(phoneNumber, appVerifier);
  };

  // Método para actualizar perfil de usuario
  const updateUserProfile = async (uid: string, data: Partial<User>) => {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  };

  // Método centralizado para crear perfil de usuario
  const createUserProfile = async (uid: string, userData: Partial<User>, role: UserRole) => {
    // Crear documento de usuario principal
    const userDoc: User = {
      id: uid,
      email: userData.email || '',
      phone: userData.phone || '',
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', uid), userDoc);

    // Crear perfil específico según el rol
    if (role === 'worker') {
      await setDoc(doc(db, 'workers', uid), {
        userId: uid,
        name: userData.displayName || '',
        phone: userData.phone || '',
        trade: '',
        experience: 0,
        location: 'Álvaro Obregón',
        certifications: [],
        rating: 0,
        totalRatings: 0,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      await setDoc(doc(db, 'employers', uid), {
        userId: uid,
        companyName: '',
        contactName: userData.displayName || '',
        phone: userData.phone || '',
        businessType: '',
        location: 'Álvaro Obregón',
        rating: 0,
        totalRatings: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  };

  // Método para configurar reCAPTCHA
  const setupRecaptchaVerifier = (containerId: string): RecaptchaVerifier => {
    return setupRecaptcha(containerId);
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    login,
    loginWithGoogle,
    loginWithPhone,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    createUserProfile,
    setupRecaptchaVerifier
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};