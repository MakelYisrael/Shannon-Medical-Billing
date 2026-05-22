import { db } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  WriteBatch,
  writeBatch,
} from 'firebase/firestore';

// Helper function to check if error is expected (abort, network, offline)
// These errors are common during component unmount, navigation, or network transitions
const isAbortOrNetworkError = (err: unknown): boolean => {
  if (!(err instanceof Error)) return false;
  return (
    err.name === 'AbortError' ||
    err.message?.includes('signal is aborted') ||
    err.message?.includes('Abort') ||
    err.message?.includes('aborted without reason') ||
    err.message?.includes('Failed to fetch') ||
    err.message?.includes('Network') ||
    err.message?.includes('offline') ||
    err.message?.includes('The network connection was lost') ||
    err.constructor?.name === 'AbortError'
  );
};

export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserPreferences {
  emailNotifications: boolean;
  courseNotifications: boolean;
  theme: 'light' | 'dark';
}

export interface CourseProgress {
  courseId: string;
  enrollmentDate: Timestamp;
  lastAccessedAt?: Timestamp;
  lessonsCompleted: number;
  totalLessons: number;
  quizScores: Record<string, number>;
  completionPercentage: number;
}

export interface UserData extends UserProfile {
  preferences?: UserPreferences;
  courseProgress?: CourseProgress[];
}

export const userService = {
  // Create a new user profile
  async createUserProfile(
    uid: string,
    email: string,
    firstName: string = '',
    lastName: string = ''
  ): Promise<UserProfile> {
    const now = Timestamp.now();
    const userProfile: UserProfile = {
      uid,
      email,
      firstName,
      lastName,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'users', uid), userProfile);
      return userProfile;
    } catch (err) {
      if (!isAbortOrNetworkError(err)) {
        console.error('Error creating user profile:', err);
      }
      throw err;
    }
  },

  // Get user profile
  async getUserProfile(uid: string): Promise<UserData | null> {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        return docSnap.data() as UserData;
      }
      return null;
    } catch (err) {
      if (!isAbortOrNetworkError(err)) {
        console.warn('Error fetching user profile:', err);
      }
      // Return null instead of throwing - profile is optional
      return null;
    }
  },

  // Update user profile
  async updateUserProfile(
    uid: string,
    updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>
  ): Promise<void> {
    try {
      // Use setDoc with merge to create or update the document
      await setDoc(
        doc(db, 'users', uid),
        {
          ...updates,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (err) {
      if (!isAbortOrNetworkError(err)) {
        console.error('Error updating user profile:', err);
      }
      throw err;
    }
  },

  // Save user preferences
  async saveUserPreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const currentUser = await getDoc(userRef);

      if (currentUser.exists()) {
        await updateDoc(userRef, {
          preferences: {
            ...(currentUser.data() as UserData).preferences,
            ...preferences,
          },
          updatedAt: Timestamp.now(),
        });
      }
    } catch (err) {
      if (!isAbortOrNetworkError(err)) {
        console.error('Error saving user preferences:', err);
      }
      throw err;
    }
  },

  // Get user preferences
  async getUserPreferences(uid: string): Promise<UserPreferences> {
    const userProfile = await this.getUserProfile(uid);
    return (
      userProfile?.preferences || {
        emailNotifications: true,
        courseNotifications: true,
        theme: 'light',
      }
    );
  },

  // Update course progress
  async updateCourseProgress(
    uid: string,
    courseId: string,
    progress: Partial<CourseProgress>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const currentUser = await getDoc(userRef);

      if (currentUser.exists()) {
        const userData = currentUser.data() as UserData;
        const courseProgress = userData.courseProgress || [];

        const existingIndex = courseProgress.findIndex((c) => c.courseId === courseId);

        if (existingIndex >= 0) {
          courseProgress[existingIndex] = {
            ...courseProgress[existingIndex],
            ...progress,
            lastAccessedAt: Timestamp.now(),
          };
        } else {
          courseProgress.push({
            courseId,
            enrollmentDate: Timestamp.now(),
            lastAccessedAt: Timestamp.now(),
            lessonsCompleted: 0,
            totalLessons: 0,
            quizScores: {},
            completionPercentage: 0,
            ...progress,
          });
        }

        await setDoc(
          userRef,
          {
            courseProgress,
            updatedAt: Timestamp.now(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      if (!isAbortOrNetworkError(err)) {
        console.error('Error updating course progress:', err);
      }
      throw err;
    }
  },

  // Get course progress
  async getCourseProgress(uid: string, courseId: string): Promise<CourseProgress | null> {
    const userProfile = await this.getUserProfile(uid);
    if (userProfile?.courseProgress) {
      return userProfile.courseProgress.find((c) => c.courseId === courseId) || null;
    }
    return null;
  },

  // Get all course progress
  async getAllCourseProgress(uid: string): Promise<CourseProgress[]> {
    const userProfile = await this.getUserProfile(uid);
    return userProfile?.courseProgress || [];
  },

  // Save quiz score
  async saveQuizScore(uid: string, courseId: string, quizId: string, score: number): Promise<void> {
    const progress = await this.getCourseProgress(uid, courseId);
    const quizScores = progress?.quizScores || {};
    quizScores[quizId] = score;

    await this.updateCourseProgress(uid, courseId, {
      quizScores,
    });
  },

  // Update lesson completion
  async updateLessonCompletion(
    uid: string,
    courseId: string,
    lessonsCompleted: number,
    totalLessons: number
  ): Promise<void> {
    const completionPercentage = Math.round((lessonsCompleted / totalLessons) * 100);

    await this.updateCourseProgress(uid, courseId, {
      lessonsCompleted,
      totalLessons,
      completionPercentage,
    });
  },

  // Batch update user data (for multiple operations)
  async batchUpdateUserData(
    uid: string,
    updates: {
      profile?: Partial<UserProfile>;
      preferences?: Partial<UserPreferences>;
      courseProgress?: Partial<CourseProgress>;
      courseId?: string;
    }
  ): Promise<void> {
    try {
      const batch: WriteBatch = writeBatch(db);
      const userRef = doc(db, 'users', uid);

      batch.set(
        userRef,
        {
          ...(updates.profile && updates.profile),
          ...(updates.preferences && { preferences: updates.preferences }),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );

      if (updates.courseProgress && updates.courseId) {
        await this.updateCourseProgress(uid, updates.courseId, updates.courseProgress);
      }

      await batch.commit();
    } catch (err) {
      if (!isAbortOrNetworkError(err)) {
        console.error('Error batch updating user data:', err);
      }
      throw err;
    }
  },

  // Update profile image URL
  async updateProfileImage(uid: string, imageUrl: string): Promise<void> {
    try {
      // Use setDoc with merge to create or update the document
      await setDoc(
        doc(db, 'users', uid),
        {
          profileImageUrl: imageUrl,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (err) {
      if (!isAbortOrNetworkError(err)) {
        console.error('Error updating profile image:', err);
      }
      throw err;
    }
  },

  // Delete user account (keep data for analytics)
  async deleteUserAccount(uid: string): Promise<void> {
    try {
      // Use setDoc with merge to create or update the document
      await setDoc(
        doc(db, 'users', uid),
        {
          deletedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (err) {
      if (!isAbortOrNetworkError(err)) {
        console.error('Error deleting user account:', err);
      }
      throw err;
    }
  },
};
