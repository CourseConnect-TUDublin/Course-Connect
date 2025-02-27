"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarWidget({ events = [], refresh }) {
  console.log("Raw timetable events:", events);

  // Ensure events is always an array
  const validEvents = Array.isArray(events) ? events : [];

  // Map timetable entries to FullCalendar events.
  const calendarEvents = validEvents
    .map((entry) => {
      console.log("Processing entry fullDateTime:", entry.fullDateTime);
      const start = new Date(entry.fullDateTime);
      console.log("Parsed start date:", start);

      // If the start date is invalid, skip this entry.
      if (isNaN(start.getTime())) {
        console.warn("Invalid date for entry:", entry);
        return null;
      }

      // Assuming a default 1-hour duration for each event.
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        id: entry._id, // Optional: include an ID if available
        title: `${entry.course || "Untitled"} (${entry.lecturer || "Unknown"})`,
        start,
        end,
        extendedProps: { room: entry.room },
      };
    })
    .filter((event) => event !== null);

  console.log("Formatted calendar events:", calendarEvents);

  return (
    <FullCalendar
      key={refresh} // Forces re-render when refresh changes
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      initialDate={new Date()} // Focus on today's date for debugging
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
