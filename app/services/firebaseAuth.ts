import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { AuthUser, LoginCredentials, AuthError } from '../types/auth';

export const firebaseAuthService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const result = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );

      await setDoc(doc(db, 'admins', result.user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });

      return mapFirebaseUserToAuthUser(result.user);
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code || 'AUTH_ERROR',
        message: getErrorMessage(error.code)
      };
      throw authError;
    }
  },

  async logout(): Promise<void> {
    await firebaseSignOut(auth);
  },

  async createAdmin(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(result.user, { displayName: name });

      await setDoc(doc(db, 'admins', result.user.uid), {
        email,
        name,
        role: 'admin',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      return mapFirebaseUserToAuthUser(result.user);
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code || 'CREATE_ADMIN_ERROR',
        message: getErrorMessage(error.code)
      };
      throw authError;
    }
  },

  onAuthChange(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const authUser = await mapFirebaseUserToAuthUser(firebaseUser);
          callback(authUser);
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
};

async function mapFirebaseUserToAuthUser(firebaseUser: User): Promise<AuthUser> {
  const adminDocRef = doc(db, 'admins', firebaseUser.uid);
  const adminDoc = await getDoc(adminDocRef);
  
  if (!adminDoc.exists()) {
    throw { code: 'USER_NOT_FOUND', message: 'Admin record not found' };
  }
  
  const adminData = adminDoc.data();
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: adminData?.name || firebaseUser.displayName || 'Admin',
    role: adminData?.role || 'admin',
    createdAt: adminData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
  };
}

function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address format',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'AUTH_ERROR': 'An error occurred. Please try again',
    'USER_NOT_FOUND': 'Admin record not found. Contact support'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again';
}

export default firebaseAuthService;