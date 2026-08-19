const CANONICAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function isCanonicalCalendarDate(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const match = CANONICAL_DATE_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const [, year, month, day] = match.map(Number);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

/**
 * Return a Date's browser-local calendar value in YYYY-MM-DD format.
 * @param {Date} date
 * @returns {string}
 */
export function getCurrentLocalDate(date = new Date()) {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Return the positive delay from a Date to the next local midnight.
 * @param {Date} date
 * @returns {number}
 */
export function getMillisecondsUntilNextLocalMidnight(date = new Date()) {
  const nextMidnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  return nextMidnight.getTime() - date.getTime();
}

/**
 * Determine whether a todo is incomplete and past its calendar due date.
 * @param {string|null} dueDate
 * @param {number|boolean} completed
 * @param {string} currentDate
 * @returns {boolean}
 */
export function isOverdue(dueDate, completed, currentDate) {
  if (completed === 1 || completed === true) {
    return false;
  }

  if (!isCanonicalCalendarDate(dueDate) || !isCanonicalCalendarDate(currentDate)) {
    return false;
  }

  return dueDate < currentDate;
}