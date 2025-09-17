/**
 * Formats a date into "17 Sep 2025, 6:08:48 PM" style
 * @param dateInput Date | string | number
 * @returns formatted string
 */

export function formatDate(dateInput: Date | string | number): string {
  if (!dateInput) return "";

  const date = new Date(dateInput);

  //? Use Intl.DateTimeFormat for consistent formatting
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short", //? "short" (e.g., "Sep"), "long" (e.g., "September"), "numeric" (e.g., "9")
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, //? 12-hour format with AM/PM
    // timeZoneName: "long",
  }).format(date);
}

/**
   * Date Options:

        weekday: Specifies how the weekday should be displayed.

        "narrow": M, T, W, T, F, S, S

        "short": "Mon", "Tue", "Wed", etc.

        "long": "Monday", "Tuesday", "Wednesday", etc.

        year: Specifies how the year should be displayed.

        "numeric": Full year (e.g., 2023).

        "2-digit": Last two digits (e.g., 23 for 2023).

        month: Specifies how the month should be displayed.

        "numeric": 1 to 12

        "2-digit": 01 to 12

        "short": Abbreviated month (e.g., "Sep" for September).

        "long": Full month name (e.g., "September").

        day: Specifies how the day should be displayed.

        "numeric": Day of the month (e.g., 5).

        "2-digit": Day of the month as two digits (e.g., 05).
        */

/**

        Time Options:

        hour: Specifies how the hour should be displayed.

        "numeric": Hour without leading zeros.

        "2-digit": Hour with two digits (e.g., "09").

        minute: Specifies how the minute should be displayed.

        "numeric": Minute without leading zeros.

        "2-digit": Minute with two digits.

        second: Specifies how the second should be displayed.

        "numeric": Second without leading zeros.

        "2-digit": Second with two digits.

        timeZoneName: Specifies the time zone name.

        "short": Abbreviated time zone name (e.g., "GMT", "UTC", "PST").

        "long": Full time zone name (e.g., "Greenwich Mean Time", "Pacific Standard Time").
        */

/**

        Options for Localized Formatting:

        calendar: Defines the calendar system.

        "gregory": Gregorian calendar (default).

        "buddhist", "japanese", etc.

        hourCycle: Specifies which hour cycle to use.

        "h11": 11-hour clock (used in some regions).

        "h12": 12-hour clock (AM/PM).

        "h23": 24-hour clock.

        "h24": 24-hour clock (used in many countries).
   */
