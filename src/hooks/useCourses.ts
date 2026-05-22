import { useState, useEffect } from 'react';
import { CourseData, fetchCoursesFromWordPress } from '../services/courseService';

export const useCourses = (apiUrl: string) => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`[useCourses] Fetching from: ${apiUrl}`);
        const data = await fetchCoursesFromWordPress(apiUrl);
        console.log(`[useCourses] Received ${data.length} courses`);
        console.log(`[useCourses] Courses data:`, data);

        setCourses(data);

        if (data.length === 0) {
          console.warn('[useCourses] No courses available');
          setError('No courses found');
        } else {
          // Reset error if we have courses
          setError(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load courses';
        console.error('[useCourses] Error loading courses:', errorMessage);
        setError(errorMessage);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [apiUrl]);

  return { courses, loading, error };
};
