export const combineToISO = (dateStr: string, timeStr: string, period: string) => {
  if (!dateStr || !timeStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const splitTime = timeStr.split(":").map(Number);
  let hours = splitTime[0];
  const minutes = splitTime[1];
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  const date = new Date(year, month - 1, day, hours, minutes);
  return date.toISOString();
};

export const getTodayDate = () => new Date().toISOString().split("T")[0];