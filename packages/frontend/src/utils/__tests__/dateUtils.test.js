import {
  getCurrentLocalDate,
  getMillisecondsUntilNextLocalMidnight,
  isOverdue,
} from '../dateUtils';

describe('dateUtils', () => {
  describe('getCurrentLocalDate', () => {
    it('formats the supplied date using local calendar fields', () => {
      const date = new Date(2026, 0, 2, 23, 30);

      expect(getCurrentLocalDate(date)).toBe('2026-01-02');
    });
  });

  describe('getMillisecondsUntilNextLocalMidnight', () => {
    it('returns the delay to the next local calendar boundary', () => {
      const date = new Date(2026, 2, 8, 23, 59, 59, 250);
      const nextMidnight = new Date(2026, 2, 9);

      expect(getMillisecondsUntilNextLocalMidnight(date)).toBe(
        nextMidnight.getTime() - date.getTime()
      );
    });
  });

  describe('isOverdue', () => {
    it.each([
      ['past due', '2026-08-18', 0, '2026-08-19', true],
      ['due today', '2026-08-19', 0, '2026-08-19', false],
      ['future due', '2026-08-20', 0, '2026-08-19', false],
      ['without a due date', null, 0, '2026-08-19', false],
      ['completed', '2026-08-18', 1, '2026-08-19', false],
      ['completed boolean', '2026-08-18', true, '2026-08-19', false],
      ['valid leap day', '2024-02-29', 0, '2024-03-01', true],
      ['impossible leap day', '2025-02-29', 0, '2025-03-01', false],
      ['impossible date', '2026-04-31', 0, '2026-05-01', false],
      ['noncanonical date', '2026-8-18', 0, '2026-08-19', false],
      ['invalid current date', '2026-08-18', 0, 'not-a-date', false],
    ])('classifies %s correctly', (_, dueDate, completed, currentDate, expected) => {
      expect(isOverdue(dueDate, completed, currentDate)).toBe(expected);
    });
  });
});