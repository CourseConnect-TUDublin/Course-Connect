const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

/**
 * Fetch notifications for a specific user
 * @param {string} userId - The ID of the user to fetch notifications for
 * @returns {Promise<Array>} Array of notification objects
 */
export async function getNotifications(userId) {
  if (!userId) return [];
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/notifications?userId=${userId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

/**
 * Mark a notification as read
 * @param {string} notificationId - The ID of the notification to mark as read
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function markNotificationRead(notificationId) {
  if (!notificationId) return false;

  try {
    const response = await fetch(`${BACKEND_URL}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
} 