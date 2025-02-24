"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarWidget({ events, refresh }) {
  console.log("Raw timetable events:", events);

  // Map timetable entries to FullCalendar events.
  const calendarEvents = events.map((entry) => {
    // Log the raw fullDateTime value for debugging.
    console.log("Processing entry fullDateTime:", entry.fullDateTime);
    const start = new Date(entry.fullDateTime);
    console.log("Parsed start date:", start);

    // If the start date is invalid, log a warning.
    if (isNaN(start.getTime())) {
      console.warn("Invalid date for entry:", entry);
    }

    // Assuming a 1-hour duration for each event.
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return {
      title: `${entry.course} (${entry.lecturer})`,
      start: start,
      end: end,
      extendedProps: { room: entry.room },
    };
  });

  console.log("Formatted calendar events:", calendarEvents);

  return (
    <FullCalendar
      key={refresh} // Forces re-render when refresh changes
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      // Force the calendar to focus on today's date for debugging.
      initialDate={new Date()}
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
