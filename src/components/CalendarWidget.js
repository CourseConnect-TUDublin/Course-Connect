// src/components/CalendarWidget.js
"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarWidget({ events, refresh }) {
  // Convert each timetable event to the FullCalendar event format.
  const calendarEvents = events.map((entry) => {
    const start = new Date(entry.fullDateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Assuming 1-hour duration
    return {
      title: `${entry.course} (${entry.lecturer})`,
      start: start,
      end: end,
      extendedProps: { room: entry.room },
    };
  });

  return (
    <FullCalendar
      key={refresh} // Force re-render when refresh changes
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      }}
      events={calendarEvents}
      slotMinTime="08:00:00"
      slotMaxTime="19:00:00"
      height="auto"
    />
  );
}
