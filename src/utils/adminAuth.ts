/**
 * Check if the current user is logged in as an admin
 * Admin status is determined by the presence of a valid admin token in localStorage
 */
export const isUserAdmin = (): boolean => {
  try {
    const adminToken = localStorage.getItem('adminToken');
    return !!adminToken; // Returns true if token exists, false otherwise
  } catch (error) {
    return false;
  }
};

/**
 * Get the admin token from localStorage
 */
export const getAdminToken = (): string | null => {
  try {
    return localStorage.getItem('adminToken');
  } catch (error) {
    return null;
  }
};

/**
 * Clear the admin token from localStorage
 */
export const clearAdminToken = (): void => {
  try {
    localStorage.removeItem('adminToken');
  } catch (error) {
    console.error('Error clearing admin token:', error);
  }
};
