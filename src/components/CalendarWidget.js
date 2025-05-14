"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SessionDetailsDialog from "./SessionDetailsDialog";

export default function CalendarWidget({ refreshKey }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [events, setEvents] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    if (status !== "authenticated" || !userId) {
      console.log("CalendarWidget: not authenticated yet");
      return;
    }

    console.log("CalendarWidget: fetching sessions for", userId);
    fetch(`/api/sessions?user=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(sessions => {
        console.log("CalendarWidget: raw sessions", sessions);
        const evs = sessions
          .map(s => {
            const start = new Date(s.startTime);
            const end   = new Date(s.endTime);
            if (isNaN(start) || isNaN(end)) {
              console.warn("CalendarWidget: skipping invalid session", s);
              return null;
            }
            return {
              id: `${s._id}`,
              title:
                s.tutor?.name === session.user.name
                  ? `With ${s.student.map(p => p.name).join(", ")}`
                  : `With ${s.tutor?.name}`,
              start,
              end,
              extendedProps: { sessionId: s._id }
            };
          })
          .filter(e => e !== null);
        console.log("CalendarWidget: mapped events", evs);
        setEvents(evs);
      })
      .catch(err => console.error("CalendarWidget error loading sessions:", err));
  }, [status, userId, refreshKey]);

  return (
    <>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate={new Date()}
        headerToolbar={{
          left:  "prev,next today",
          center:"title",
          right: "timeGridWeek,timeGridDay"
        }}
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="19:00:00"
        height="auto"
        eventClick={info => setSelectedSessionId(info.event.extendedProps.sessionId)}
      />
      <SessionDetailsDialog
        open={!!selectedSessionId}
        sessionId={selectedSessionId}
        onClose={() => setSelectedSessionId(null)}
      />
    </>
  );
}
