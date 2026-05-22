import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService, UserData } from '../services/userService';

interface AuthContextType {
  user: User | null;
  userProfile: UserData | null;
  loading: boolean;
  profileLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserData>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes and load user profile
  useEffect(() => {
    let isMounted = true;
    let profileLoadTimeout: NodeJS.Timeout[] = [];
    let isLoadingProfile = false;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;

      setUser(currentUser);

      if (currentUser) {
        // Prevent multiple simultaneous profile loads
        if (isLoadingProfile) {
          return;
        }
        isLoadingProfile = true;
        setProfileLoading(true);

        // Load profile asynchronously with retry logic
        const loadProfile = async () => {
          let retries = 0;
          const maxRetries = 3;

          while (retries < maxRetries) {
            // Check if component is still mounted
            if (!isMounted) {
              isLoadingProfile = false;
              return;
            }

            try {
              const profile = await userService.getUserProfile(currentUser.uid);
              if (isMounted) {
                setUserProfile(profile);
              }
              break; // Success, exit retry loop
            } catch (err) {
              // Ignore AbortError and network errors - these are expected during cleanup/navigation
              const isAbortOrNetwork = err instanceof Error && (
                err.name === 'AbortError' ||
                err.message?.includes('signal is aborted') ||
                err.message?.includes('Abort') ||
                err.message?.includes('aborted without reason') ||
                err.message?.includes('Failed to fetch') ||
                err.message?.includes('Network') ||
                err.message?.includes('offline')
              );

              if (isAbortOrNetwork) {
                console.debug('Profile load aborted or network error (expected during navigation)');
                if (isMounted) {
                  setProfileLoading(false);
                  isLoadingProfile = false;
                }
                break;
              }

              retries++;
              if (retries < maxRetries && isMounted) {
                // Wait before retrying
                await new Promise(resolve => {
                  const timeout = setTimeout(resolve, 1000 * retries);
                  profileLoadTimeout.push(timeout);
                });
              } else if (retries >= maxRetries) {
                console.warn('Failed to load user profile after retries:', err);
                // App continues without profile data - it's not critical
                if (isMounted) {
                  setUserProfile(null);
                  setProfileLoading(false);
                  isLoadingProfile = false;
                }
              }
            }
          }

          if (isMounted) {
            setProfileLoading(false);
            isLoadingProfile = false;
          }
        };

        loadProfile();
      } else {
        setUserProfile(null);
        isLoadingProfile = false;
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      isLoadingProfile = false;
      // Clear any pending timeouts
      profileLoadTimeout.forEach(timeout => clearTimeout(timeout));
      unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, firstName: string = '', lastName: string = '') => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update Firebase Auth profile
      if (firstName || lastName) {
        try {
          await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`.trim(),
          });
        } catch (err) {
          console.warn('Failed to update Firebase profile:', err);
        }
      }

      // Save user profile to Firestore (with retry logic)
      let profileCreated = false;
      let lastError: any = null;

      for (let i = 0; i < 3; i++) {
        try {
          const profile = await userService.createUserProfile(
            userCredential.user.uid,
            email,
            firstName,
            lastName
          );
          setUserProfile(profile as UserData);
          profileCreated = true;
          break;
        } catch (err) {
          lastError = err;
          if (i < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      }

      if (!profileCreated) {
        console.warn('Failed to save profile to Firestore, but user account was created:', lastError);
        // User can still proceed - profile will be created when Firestore is available
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const googleProvider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, googleProvider);

      // Check if user profile exists, if not create it (with retry logic)
      // Run in background - don't block user from signing in
      Promise.resolve().then(async () => {
        let profileExists = false;
        let lastError: any = null;

        for (let i = 0; i < 3; i++) {
          try {
            const existingProfile = await userService.getUserProfile(userCredential.user.uid);
            if (!existingProfile) {
              const [firstName, lastName] = (userCredential.user.displayName || '').split(' ');
              await userService.createUserProfile(
                userCredential.user.uid,
                userCredential.user.email || '',
                firstName || '',
                lastName || ''
              );
            }
            profileExists = true;
            break;
          } catch (err) {
            // Ignore AbortError and network errors - these are expected
            const isAbortOrNetwork = err instanceof Error && (
              err.name === 'AbortError' ||
              err.message?.includes('signal is aborted') ||
              err.message?.includes('Abort') ||
              err.message?.includes('aborted without reason') ||
              err.message?.includes('Failed to fetch') ||
              err.message?.includes('Network') ||
              err.message?.includes('offline')
            );

            if (isAbortOrNetwork) {
              console.debug('Profile check aborted during sign-in');
              break;
            }

            lastError = err;
            if (i < 2) {
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
          }
        }

        if (!profileExists && lastError && !(lastError instanceof Error && lastError.name === 'AbortError')) {
          console.warn('Failed to create/check profile in Firestore, but user is signed in:', lastError);
          // User can still proceed - profile will sync when Firestore is available
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const updateUserProfile = async (updates: Partial<UserData>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      setError(null);
      await userService.updateUserProfile(user.uid, updates);

      // Reload profile data
      const updatedProfile = await userService.getUserProfile(user.uid);
      setUserProfile(updatedProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    profileLoading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
