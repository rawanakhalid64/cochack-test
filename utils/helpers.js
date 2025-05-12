export function formatDateInterval(startDate, endDate) {
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return `${formatDate(startDate)}-${formatDate(endDate)}`;
}

export function calculateMonthsBetween(startDate, endDate, roundUp) {
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  // Calculate full months between dates
  let months = (endYear - startYear) * 12 + (endMonth - startMonth);

  // Check if we have partial month remaining
  if (roundUp) {
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    // If end day is later in month than start day, count as extra month
    if (endDay >= startDay || endDate > new Date(endYear, endMonth + 1, 0)) {
      months += 1;
    }
  }

  return months;
}
