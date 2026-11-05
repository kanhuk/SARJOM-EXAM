/**
 * SARJOM Recruitment Lifecycle Engine
 *
 * This engine decides where a verified recruitment belongs
 * on the SARJOM public platform.
 *
 * =========================================================
 * SARJOM PUBLIC PRODUCT RULES
 * =========================================================
 *
 * 1. Active Applications
 *    Only applications that users can currently apply for.
 *
 * 2. Closing Soon
 *    Applications closing within 7 days.
 *
 * 3. Upcoming Jobs
 *    Verified recruitment whose application has not started.
 *
 * 4. Admit Card
 *    ONLY when an official admit card has actually been
 *    released and verified.
 *
 *    Expected / pending admit card MUST NOT appear here.
 *
 * 5. Exam Date
 *    An officially announced exam date is an update.
 *    It is NOT an active application.
 *
 * 6. Results
 *    Only when official result evidence exists.
 *
 * 7. Answer Keys
 *    Only when official answer-key evidence exists.
 *
 * 8. Archive
 *    Closed applications without a currently actionable
 *    public update.
 *
 * 9. Review
 *    Records requiring reconciliation/admin review.
 *
 * =========================================================
 */

export type RecruitmentSurface =
  | 'latest-notifications'
  | 'active-applications'
  | 'closing-soon'
  | 'admit-card'
  | 'exam-date'
  | 'results'
  | 'answer-keys'
  | 'upcoming-jobs'
  | 'archive'
  | 'review';

export type RecruitmentLifecycle =
  | 'open'
  | 'closing-soon'
  | 'closed-awaiting-admit-card'
  | 'admit-card-released'
  | 'exam-scheduled'
  | 'exam-completed'
  | 'result-released'
  | 'answer-key-released'
  | 'closed'
  | 'upcoming'
  | 'review-required'
  | 'unknown';

export interface RecruitmentLifecycleInput {
  id: string;
  title: string;
  organization?: string;
  vacancies?: number;

  applicationStartDate?: string | null;
  applicationDeadline?: string | null;
  examDate?: string | null;

  /**
   * Actual official admit-card release evidence.
   */
  admitCardAvailable?: boolean;
  admitCardUrl?: string | null;

  /**
   * Internal expected/pending state.
   *
   * IMPORTANT:
   *
   * This NEVER routes a job to the public Admit Card tab.
   */
  admitCardExpected?: boolean;

  /**
   * Actual official result evidence.
   */
  resultAvailable?: boolean;

  /**
   * Actual official answer-key evidence.
   */
  answerKeyAvailable?: boolean;

  /**
   * Administrative/reconciliation review.
   */
  reviewRequired?: boolean;

  state?: string | null;
  district?: string | null;
}

export interface RecruitmentLifecycleResult {
  lifecycle: RecruitmentLifecycle;

  primarySurface: RecruitmentSurface;

  notificationSurfaces: RecruitmentSurface[];

  applicationOpen: boolean;

  closingSoon: boolean;

  applicationEnded: boolean;

  admitCardAvailable: boolean;

  admitCardPending: boolean;

  examDateKnown: boolean;

  examDatePassed: boolean;

  daysUntilDeadline: number | null;

  daysUntilExam: number | null;

  showOnMainJobs: boolean;

  showInClosingSoon: boolean;

  showInAdmitCard: boolean;

  showExamNotification: boolean;

  showInLatestNotifications: boolean;

  reason: string;
}

/**
 * Parse a date safely.
 */
function parseDate(
  value?: string | null,
): Date | null {
  if (!value) {
    return null;
  }

  const trimmed =
    value.trim();

  if (!trimmed) {
    return null;
  }

  const normalized =
    /^\d{4}-\d{2}-\d{2}$/.test(
      trimmed,
    )
      ? `${trimmed}T00:00:00.000Z`
      : trimmed;

  const date =
    new Date(normalized);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
  }

  return date;
}

/**
 * Convert a Date to UTC calendar-day precision.
 */
function dateOnly(
  value: Date,
): Date {
  return new Date(
    Date.UTC(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate(),
    ),
  );
}

/**
 * Difference between two calendar dates.
 */
function daysBetween(
  from: Date,
  to: Date,
): number {
  const millisecondsPerDay =
    24 * 60 * 60 * 1000;

  return Math.round(
    (
      dateOnly(to).getTime() -
      dateOnly(from).getTime()
    ) /
      millisecondsPerDay,
  );
}

/**
 * =========================================================
 * MAIN CLASSIFIER
 * =========================================================
 */
export function classifyRecruitmentLifecycle(
  job: RecruitmentLifecycleInput,
  today: Date = new Date(),
): RecruitmentLifecycleResult {

  const currentDay =
    dateOnly(today);

  /*
   * =======================================================
   * 1. REVIEW REQUIRED
   * =======================================================
   */
  if (job.reviewRequired) {
    return {
      lifecycle:
        'review-required',

      primarySurface:
        'review',

      notificationSurfaces:
        [],

      applicationOpen:
        false,

      closingSoon:
        false,

      applicationEnded:
        false,

      admitCardAvailable:
        false,

      admitCardPending:
        false,

      examDateKnown:
        false,

      examDatePassed:
        false,

      daysUntilDeadline:
        null,

      daysUntilExam:
        null,

      showOnMainJobs:
        false,

      showInClosingSoon:
        false,

      showInAdmitCard:
        false,

      showExamNotification:
        false,

      showInLatestNotifications:
        false,

      reason:
        'Recruitment is blocked pending administrative review.',
    };
  }

  /*
   * =======================================================
   * 2. PARSE DATES
   * =======================================================
   */

  const startDate =
    parseDate(
      job.applicationStartDate,
    );

  const deadline =
    parseDate(
      job.applicationDeadline,
    );

  const examDate =
    parseDate(
      job.examDate,
    );

  const daysUntilDeadline =
    deadline
      ? daysBetween(
          currentDay,
          deadline,
        )
      : null;

  const daysUntilExam =
    examDate
      ? daysBetween(
          currentDay,
          examDate,
        )
      : null;

  const examDateKnown =
    Boolean(examDate);

  const examDatePassed =
    examDate !== null &&
    daysUntilExam !== null &&
    daysUntilExam < 0;

  /*
   * =======================================================
   * 3. ADMIT CARD STATE
   * =======================================================
   *
   * AVAILABLE:
   * Actual official release evidence exists.
   *
   * PENDING:
   * Admit card is expected, but there is no release
   * evidence.
   *
   * IMPORTANT:
   *
   * pending MUST NEVER become public admit-card.
   */

  const admitCardAvailable =
    Boolean(
      job.admitCardAvailable ||
      job.admitCardUrl,
    );

  const admitCardPending =
    !admitCardAvailable &&
    Boolean(
      job.admitCardExpected,
    );

  /*
   * =======================================================
   * 4. RESULT / ANSWER KEY
   * =======================================================
   */

  const resultAvailable =
    Boolean(
      job.resultAvailable,
    );

  const answerKeyAvailable =
    Boolean(
      job.answerKeyAvailable,
    );

  /*
   * =======================================================
   * 5. UPCOMING APPLICATION
   * =======================================================
   */

  if (
    startDate &&
    startDate > currentDay
  ) {
    return {
      lifecycle:
        'upcoming',

      primarySurface:
        'upcoming-jobs',

      notificationSurfaces:
        ['upcoming-jobs'],

      applicationOpen:
        false,

      closingSoon:
        false,

      applicationEnded:
        false,

      admitCardAvailable,

      admitCardPending:
        false,

      examDateKnown,

      examDatePassed,

      daysUntilDeadline,

      daysUntilExam,

      showOnMainJobs:
        false,

      showInClosingSoon:
        false,

      showInAdmitCard:
        false,

      showExamNotification:
        false,

      showInLatestNotifications:
        true,

      reason:
        'The verified application has not started yet.',
    };
  }

  /*
   * =======================================================
   * 6. ACTIVE APPLICATION
   * =======================================================
   */

  const applicationOpen =
    (
      !startDate ||
      startDate <= currentDay
    ) &&
    (
      !deadline ||
      deadline >= currentDay
    );

  if (applicationOpen) {

    const closingSoon =
      daysUntilDeadline !== null &&
      daysUntilDeadline >= 0 &&
      daysUntilDeadline <= 7;

    const notificationSurfaces:
      RecruitmentSurface[] =
      ['active-applications'];

    if (closingSoon) {
      notificationSurfaces.push(
        'closing-soon',
      );
    }

    if (examDateKnown) {
      notificationSurfaces.push(
        'exam-date',
      );
    }

    return {
      lifecycle:
        closingSoon
          ? 'closing-soon'
          : 'open',

      primarySurface:
        closingSoon
          ? 'closing-soon'
          : 'active-applications',

      notificationSurfaces,

      applicationOpen:
        true,

      closingSoon,

      applicationEnded:
        false,

      admitCardAvailable,

      /*
       * An active application does not expose a pending
       * admit card as a public Admit Card item.
       */
      admitCardPending:
        false,

      examDateKnown,

      examDatePassed,

      daysUntilDeadline,

      daysUntilExam,

      showOnMainJobs:
        true,

      showInClosingSoon:
        closingSoon,

      showInAdmitCard:
        false,

      showExamNotification:
        examDateKnown,

      showInLatestNotifications:
        true,

      reason:
        closingSoon
          ? 'Application is open and closes within 7 days.'
          : 'Application window is currently open.',
    };
  }

  /*
   * =======================================================
   * 7. APPLICATION ENDED
   * =======================================================
   */

  const applicationEnded =
    deadline !== null &&
    deadline < currentDay;

  if (applicationEnded) {

    /*
     * =====================================================
     * 7A. RESULT RELEASED
     * =====================================================
     */

    if (resultAvailable) {
      return {
        lifecycle:
          'result-released',

        primarySurface:
          'results',

        notificationSurfaces:
          ['results'],

        applicationOpen:
          false,

        closingSoon:
          false,

        applicationEnded:
          true,

        admitCardAvailable:
          false,

        admitCardPending:
          false,

        examDateKnown,

        examDatePassed,

        daysUntilDeadline,

        daysUntilExam,

        showOnMainJobs:
          false,

        showInClosingSoon:
          false,

        showInAdmitCard:
          false,

        showExamNotification:
          false,

        showInLatestNotifications:
          true,

        reason:
          'The application has closed and an official result is available.',
      };
    }

    /*
     * =====================================================
     * 7B. ANSWER KEY RELEASED
     * =====================================================
     */

    if (answerKeyAvailable) {
      return {
        lifecycle:
          'answer-key-released',

        primarySurface:
          'answer-keys',

        notificationSurfaces:
          ['answer-keys'],

        applicationOpen:
          false,

        closingSoon:
          false,

        applicationEnded:
          true,

        admitCardAvailable:
          false,

        admitCardPending:
          false,

        examDateKnown,

        examDatePassed,

        daysUntilDeadline,

        daysUntilExam,

        showOnMainJobs:
          false,

        showInClosingSoon:
          false,

        showInAdmitCard:
          false,

        showExamNotification:
          false,

        showInLatestNotifications:
          true,

        reason:
          'The application has closed and an official answer key is available.',
      };
    }

    /*
     * =====================================================
     * 7C. ACTUAL ADMIT CARD RELEASED
     * =====================================================
     *
     * THIS is the ONLY route into the public Admit Card
     * surface.
     */

    if (admitCardAvailable) {

      const surfaces:
        RecruitmentSurface[] =
        ['admit-card'];

      if (examDateKnown) {
        surfaces.push(
          'exam-date',
        );
      }

      return {
        lifecycle:
          'admit-card-released',

        primarySurface:
          'admit-card',

        notificationSurfaces:
          surfaces,

        applicationOpen:
          false,

        closingSoon:
          false,

        applicationEnded:
          true,

        admitCardAvailable:
          true,

        admitCardPending:
          false,

        examDateKnown,

        examDatePassed,

        daysUntilDeadline,

        daysUntilExam,

        showOnMainJobs:
          false,

        showInClosingSoon:
          false,

        showInAdmitCard:
          true,

        showExamNotification:
          examDateKnown,

        showInLatestNotifications:
          true,

        reason:
          'Application has closed and the official admit card has been released.',
      };
    }

    /*
     * =====================================================
     * 7D. EXAM DATE ANNOUNCED
     * =====================================================
     *
     * Exam date is a public notification.
     *
     * It is NOT an Admit Card.
     */

    if (examDateKnown) {

      return {
        lifecycle:
          'exam-scheduled',

        primarySurface:
          'exam-date',

        notificationSurfaces:
          ['exam-date'],

        applicationOpen:
          false,

        closingSoon:
          false,

        applicationEnded:
          true,

        admitCardAvailable:
          false,

        /*
         * Even if the system expects an admit card,
         * it is not public until actually released.
         */
        admitCardPending,

        examDateKnown:
          true,

        examDatePassed,

        daysUntilDeadline,

        daysUntilExam,

        showOnMainJobs:
          false,

        showInClosingSoon:
          false,

        showInAdmitCard:
          false,

        showExamNotification:
          true,

        showInLatestNotifications:
          true,

        reason:
          'Application has closed and an official exam date has been announced.',
      };
    }

    /*
     * =====================================================
     * 7E. ADMIT CARD EXPECTED BUT NOT RELEASED
     * =====================================================
     *
     * This remains ARCHIVED.
     *
     * It does NOT appear in:
     *
     * - Active Jobs
     * - Closing Soon
     * - Admit Card
     * - Exam Date
     *
     * until actual official evidence appears.
     */

    if (admitCardPending) {

      return {
        lifecycle:
          'closed-awaiting-admit-card',

        primarySurface:
          'archive',

        notificationSurfaces:
          [],

        applicationOpen:
          false,

        closingSoon:
          false,

        applicationEnded:
          true,

        admitCardAvailable:
          false,

        admitCardPending:
          true,

        examDateKnown:
          false,

        examDatePassed:
          false,

        daysUntilDeadline,

        daysUntilExam,

        showOnMainJobs:
          false,

        showInClosingSoon:
          false,

        showInAdmitCard:
          false,

        showExamNotification:
          false,

        showInLatestNotifications:
          false,

        reason:
          'Application has closed; the admit card is expected but has not been officially released.',
      };
    }

    /*
     * =====================================================
     * 7F. NORMAL CLOSED APPLICATION
     * =====================================================
     */

    return {
      lifecycle:
        'closed',

      primarySurface:
        'archive',

      notificationSurfaces:
        [],

      applicationOpen:
        false,

      closingSoon:
        false,

      applicationEnded:
        true,

      admitCardAvailable:
        false,

      admitCardPending:
        false,

      examDateKnown:
        false,

      examDatePassed:
        false,

      daysUntilDeadline,

      daysUntilExam,

      showOnMainJobs:
        false,

      showInClosingSoon:
        false,

      showInAdmitCard:
        false,

      showExamNotification:
        false,

      showInLatestNotifications:
        false,

      reason:
        'Application has closed and no current post-application update is available.',
    };
  }

  /*
   * =======================================================
   * 8. UNKNOWN / INCOMPLETE APPLICATION DATES
   * =======================================================
   */

  return {
    lifecycle:
      'unknown',

    primarySurface:
      'review',

    notificationSurfaces:
      examDateKnown
        ? ['exam-date']
        : [],

    applicationOpen:
      false,

    closingSoon:
      false,

    applicationEnded:
      false,

    admitCardAvailable,

    admitCardPending:
      false,

    examDateKnown,

    examDatePassed,

    daysUntilDeadline,

    daysUntilExam,

    showOnMainJobs:
      false,

    showInClosingSoon:
      false,

    showInAdmitCard:
      admitCardAvailable,

    showExamNotification:
      examDateKnown,

    showInLatestNotifications:
      examDateKnown,

    reason:
      'Application dates are unavailable; the record requires review before being treated as an active application.',
  };
}