export type NotificationFreshnessStatus =
  | 'upcoming'
  | 'open'
  | 'expired'
  | 'unknown';

export interface NotificationFreshnessInput {
  applicationStartDate?: string | null;
  applicationLastDate?: string | null;
  examDate?: string | null;
}

export interface NotificationFreshnessResult {
  status: NotificationFreshnessStatus;

  isCurrent: boolean;
  applicationOpen: boolean;

  applicationStartDate: string | null;
  applicationLastDate: string | null;
  examDate: string | null;

  daysUntilStart: number | null;
  daysRemaining: number | null;

  reason: string;
}

function parseDate(
  value?: string | null,
): Date | null {
  if (!value) {
    return null;
  }

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value.trim(),
    );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function startOfToday(): Date {
  const now = new Date();

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  );
}

function differenceInDays(
  from: Date,
  to: Date,
): number {
  const millisecondsPerDay =
    24 * 60 * 60 * 1000;

  return Math.round(
    (to.getTime() - from.getTime()) /
      millisecondsPerDay,
  );
}

export function evaluateNotificationFreshness(
  input: NotificationFreshnessInput,
): NotificationFreshnessResult {

  const today =
    startOfToday();

  const startDate =
    parseDate(
      input.applicationStartDate,
    );

  const lastDate =
    parseDate(
      input.applicationLastDate,
    );

  const examDate =
    parseDate(
      input.examDate,
    );

  const applicationStartDate =
    startDate
      ? input.applicationStartDate!.trim()
      : null;

  const applicationLastDate =
    lastDate
      ? input.applicationLastDate!.trim()
      : null;

  const normalizedExamDate =
    examDate
      ? input.examDate!.trim()
      : null;

  /*
   * No application dates available.
   */
  if (!startDate && !lastDate) {
    return {
      status: 'unknown',
      isCurrent: false,
      applicationOpen: false,

      applicationStartDate,
      applicationLastDate,
      examDate: normalizedExamDate,

      daysUntilStart: null,
      daysRemaining: null,

      reason:
        'Application start and last dates are not available.',
    };
  }

  /*
   * Invalid/incomplete date combination.
   */
  if (
    startDate &&
    lastDate &&
    startDate.getTime() >
      lastDate.getTime()
  ) {
    return {
      status: 'unknown',
      isCurrent: false,
      applicationOpen: false,

      applicationStartDate,
      applicationLastDate,
      examDate: normalizedExamDate,

      daysUntilStart: null,
      daysRemaining: null,

      reason:
        'Application start date is later than the application last date.',
    };
  }

  /*
   * Start date exists but application
   * has not opened yet.
   */
  if (
    startDate &&
    today.getTime() <
      startDate.getTime()
  ) {
    return {
      status: 'upcoming',
      isCurrent: true,
      applicationOpen: false,

      applicationStartDate,
      applicationLastDate,
      examDate: normalizedExamDate,

      daysUntilStart:
        differenceInDays(
          today,
          startDate,
        ),

      daysRemaining:
        lastDate
          ? differenceInDays(
              today,
              lastDate,
            )
          : null,

      reason:
        'Application has not started yet.',
    };
  }

  /*
   * Application is currently open.
   *
   * We treat the last date as inclusive.
   */
  if (
    lastDate &&
    today.getTime() <=
      lastDate.getTime()
  ) {
    return {
      status: 'open',
      isCurrent: true,
      applicationOpen: true,

      applicationStartDate,
      applicationLastDate,
      examDate: normalizedExamDate,

      daysUntilStart:
        startDate
          ? differenceInDays(
              today,
              startDate,
            )
          : null,

      daysRemaining:
        differenceInDays(
          today,
          lastDate,
        ),

      reason:
        'Application window is currently open.',
    };
  }

  /*
   * Application deadline has passed.
   */
  return {
    status: 'expired',
    isCurrent: false,
    applicationOpen: false,

    applicationStartDate,
    applicationLastDate,
    examDate: normalizedExamDate,

    daysUntilStart:
      startDate
        ? differenceInDays(
            today,
            startDate,
          )
        : null,

    daysRemaining:
      lastDate
        ? differenceInDays(
            today,
            lastDate,
          )
        : null,

    reason:
      'Application deadline has passed.',
  };
}