export const combineToISO = (dateStr: string, timeStr: string, period: string) => {
  if (!dateStr || !timeStr) return "";
  
  // Extract year, month (0-indexed), and day from YYYY-MM-DD
  const [year, month, day] = dateStr.split("-").map(Number);
  let [hours, minutes] = timeStr.split(":").map(Number);
  
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const date = new Date(year, month - 1, day, hours, minutes);
  return date.toISOString();
};

export const getTodayDate = () => new Date().toISOString().split("T")[0];