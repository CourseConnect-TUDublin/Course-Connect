// src/services/notfications.js

const API_URL = "/api/notifications";

/**
 * Fetch all notifications for a given user.
 * @param {string} userId
 * @returns {Promise<Array>} list of notifications
 */
export async function getNotifications(userId) {
  const res = await fetch(`${API_URL}?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error fetching notifications: ${text}`);
  }
  return res.json();
}

/**
 * Create a new notification.
 * @param {{ userId: string, sessionId: string, type: string }} params
 * @returns {Promise<Object>} the created notification
 */
export async function createNotification({ userId, sessionId, type }) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, sessionId, type }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creating notification: ${text}`);
  }
  return res.json();
}

/**
 * Mark a notification as read.
 * @param {string} id  Notification _id
 * @returns {Promise<Object>} result object
 */
export async function markNotificationRead(id) {
  const res = await fetch(API_URL, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, read: true }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error marking notification read: ${text}`);
  }
  return res.json();
}
