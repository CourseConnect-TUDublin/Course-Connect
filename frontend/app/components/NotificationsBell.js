// frontend/app/components/NotificationsBell.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  getNotifications,
  markNotificationRead,
} from "../lib/notifications";

export default function NotificationsBell({ userId }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifs, setNotifs] = useState([]);

  // Load and poll notifications
  const fetchNotifs = async () => {
    try {
      const data = await getNotifications(userId);
      setNotifs(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleItemClick = async (n) => {
    if (!n.read) {
      try {
        await markNotificationRead(n._id);
        setNotifs((prev) =>
          prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
        );
      } catch (err) {
        console.error("Failed to mark read:", err);
      }
    }
    handleClose();
    router.push(`/session/${n.sessionId}`);
  };

  return (
    <>
      <IconButton onClick={handleOpen} size="large">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: 200 } }}
      >
        {notifs.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        ) : (
          notifs.map((n) => (
            <MenuItem
              key={n._id}
              onClick={() => handleItemClick(n)}
              selected={!n.read}
            >
              <Typography variant="body2">
                {n.type === "sessionConfirmed"
                  ? "Your session request was confirmed!"
                  : "New notification"}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
