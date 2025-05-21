#!/bin/bash

echo "Uninstalling Socket.IO dependencies…"
npm uninstall socket.io socket.io-client

echo "Searching for chat-related files and components…"

# Remove known chat/studybuddy folders & files
rm -rf src/components/ChatRoom.js src/app/chatroom src/app/studybuddy src/pages/chat.js src/pages/api/socket.js src/app/api/socketio

echo "Searching for code references…"

# Find files referencing socket.io or studybuddy
grep -rilE "socket|studybuddy|chat" src/ > files_to_check.txt

echo "Files referencing socket, studybuddy, or chat listed in files_to_check.txt."
echo "You should manually review and clean up any remaining references in these files."

echo "All done! Now, commit your changes:"
echo "    git add ."
echo "    git commit -m \"Remove live chat and StudyBuddy (Socket.IO) system\""
echo "    git push origin main"

echo ""
echo "Don't forget to:"
echo "  - Remove StudyBuddy/chat navigation from menus or dashboards"
echo "  - Drop chat/message tables/collections from your database if needed"
echo "  - Redeploy your project"
