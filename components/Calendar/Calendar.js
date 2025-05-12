import React from "react";

const daysOfWeek = ["Sat", "Sun", "Mon", "Tues", "Wed", "Thurs", "Fri"];

function Calendar() {
  return (
    <div className="rounded-2xl bg-[#FFE3E3] overflow-hidden border border-transparent border-red-900 min-h-[70vh] grid grid-cols-7">
      {daysOfWeek.map((day) => (
        <div className="bg-red-700">day</div>
      ))}
    </div>
  );
}

export default Calendar;
