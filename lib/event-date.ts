const franceTimeZone = "Europe/Paris";

function getTimeZoneOffset(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: franceTimeZone,
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  return (
    Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second,
    ) - date.getTime()
  );
}

export function createFranceEventDate(dateValue: string, timeValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);
  const franceWallTime = Date.UTC(year, month - 1, day, hour, minute);
  const firstOffset = getTimeZoneOffset(new Date(franceWallTime));
  const firstInstant = new Date(franceWallTime - firstOffset);
  const finalOffset = getTimeZoneOffset(firstInstant);
  const storedEventDate = new Date(franceWallTime - finalOffset).toISOString();

  console.info("[Lunaeria event_date]", {
    input: `${dateValue} ${timeValue}`,
    storedEventDate,
  });

  return storedEventDate;
}

export function getFranceEventDateInputValues(
  eventDate: string | null | undefined,
) {
  if (!eventDate) {
    return { date: "", time: "" };
  }

  const date = new Date(eventDate);

  if (Number.isNaN(date.getTime())) {
    return { date: "", time: "" };
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone: franceTimeZone,
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
}

export function formatFranceEventDate(
  eventDate: string | null,
  fallbackDate: string,
) {
  if (!eventDate) {
    return fallbackDate;
  }

  const date = new Date(eventDate);

  if (Number.isNaN(date.getTime())) {
    return fallbackDate;
  }

  const displayedEventDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone: franceTimeZone,
    year: "2-digit",
  })
    .format(date)
    .replace(" ", " à ")
    .replace(":", "h");

  console.info("[Lunaeria event_date]", {
    displayedEventDate,
    storedEventDate: eventDate,
  });

  return displayedEventDate;
}
