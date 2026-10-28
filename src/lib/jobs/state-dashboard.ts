export interface StateDashboardJob {
  id: string;
  title?: string;
  organization?: string;
  organizationShortName?: string;
  category?: string;
  stateCode?: string;
  districts?: string[];
  lifecycle?: string;
  applicationOpen?: boolean;
  applicationEnded?: boolean;
  status?: string;
}

export interface DashboardGroup {
  key: string;
  name: string;
  count: number;
  jobs: StateDashboardJob[];
}

export interface DistrictGroup {
  key: string;
  name: string;
  count: number;
  jobs: StateDashboardJob[];
}

export interface StateDashboard {
  stateCode: string;
  totalJobs: number;
  activeJobs: number;
  organizations: DashboardGroup[];
  categories: DashboardGroup[];
  districts: DistrictGroup[];
  stateLevelJobs: StateDashboardJob[];
  districtLevelJobs: StateDashboardJob[];
}

function isActiveJob(job: StateDashboardJob): boolean {
  if (job.applicationEnded === true) return false;

  if (job.applicationOpen === true) return true;

  if (
    job.lifecycle === 'open' ||
    job.lifecycle === 'closing-soon'
  ) {
    return true;
  }

  if (
    job.status === 'open' ||
    job.status === 'closing-soon'
  ) {
    return true;
  }

  return false;
}

function cleanName(value: string | undefined): string {
  return value?.trim() || 'Other Opportunities';
}

function groupJobs(
  jobs: StateDashboardJob[],
  getName: (job: StateDashboardJob) => string,
): DashboardGroup[] {
  const groups = new Map<string, StateDashboardJob[]>();

  for (const job of jobs) {
    const name = cleanName(getName(job));
    const key = name.toLowerCase();

    const existing = groups.get(key);

    if (existing) {
      existing.push(job);
    } else {
      groups.set(key, [job]);
    }
  }

  return Array.from(groups.entries())
    .map(([key, jobs]) => ({
      key,
      name: cleanName(getName(jobs[0])),
      count: jobs.length,
      jobs,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.name.localeCompare(b.name);
    });
}

function groupDistricts(
  jobs: StateDashboardJob[],
): DistrictGroup[] {
  const groups = new Map<string, StateDashboardJob[]>();

  for (const job of jobs) {
    for (const district of job.districts ?? []) {
      const name = district.trim();

      if (!name) continue;

      const key = name.toLowerCase();

      const existing = groups.get(key);

      if (existing) {
        if (!existing.some((item) => item.id === job.id)) {
          existing.push(job);
        }
      } else {
        groups.set(key, [job]);
      }
    }
  }

  return Array.from(groups.entries())
    .map(([key, jobs]) => ({
      key,
      name: jobs[0].districts?.find(
        (district) => district.trim().toLowerCase() === key,
      )?.trim() || key,
      count: jobs.length,
      jobs,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.name.localeCompare(b.name);
    });
}

export function buildStateDashboard(
  jobs: StateDashboardJob[],
  stateCode: string,
): StateDashboard {
  const normalizedState = stateCode.trim().toUpperCase();

  const stateJobs =
    normalizedState === "ALL"
      ? jobs
      : jobs.filter(
          (job) =>
            job.stateCode?.toUpperCase() ===
            normalizedState,
        );

  const activeJobs = stateJobs.filter(isActiveJob);

  const districtLevelJobs = activeJobs.filter(
    (job) => (job.districts?.length ?? 0) > 0,
  );

  const stateLevelJobs = activeJobs.filter(
    (job) => (job.districts?.length ?? 0) === 0,
  );

  return {
    stateCode: normalizedState,

    totalJobs: stateJobs.length,

    activeJobs: activeJobs.length,

    organizations: groupJobs(
      activeJobs,
      (job) =>
        job.organizationShortName ||
        job.organization ||
        'Other Organizations',
    ),

    categories: groupJobs(
      activeJobs,
      (job) => job.category || 'other',
    ),

    districts: groupDistricts(districtLevelJobs),

    stateLevelJobs,

    districtLevelJobs,
  };
}


