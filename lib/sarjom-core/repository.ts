import { redis } from '../redis.js';
import type { AdminChange, ContactTicket, SarjomGenericRecord, SarjomJob } from './types.js';

const memory = new Map<string, unknown>();

async function setValue<T>(key: string, value: T): Promise<void> {
  if (redis) {
    await redis.set(key, value);
    return;
  }

  memory.set(key, value);
}

async function getValue<T>(key: string): Promise<T | null> {
  if (redis) return (await redis.get<T>(key)) ?? null;
  return (memory.get(key) as T | undefined) ?? null;
}

async function deleteValue(key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
    return;
  }

  memory.delete(key);
}

async function addToIndex(key: string, id: string): Promise<void> {
  if (redis) {
    await redis.sadd(key, id);
    return;
  }

  const current = (memory.get(key) as string[] | undefined) ?? [];

  if (!current.includes(id)) {
    current.push(id);
  }

  memory.set(key, current);
}

async function removeFromIndex(key: string, id: string): Promise<void> {
  if (redis) {
    await redis.srem(key, id);
    return;
  }

  const current = (memory.get(key) as string[] | undefined) ?? [];

  memory.set(
    key,
    current.filter(item => item !== id),
  );
}

async function readIndex(key: string): Promise<string[]> {
  if (redis) {
    return await redis.smembers<string[]>(key);
  }

  return (memory.get(key) as string[] | undefined) ?? [];
}

const JOB_INDEX = 'sarjom:index:jobs';
const GENERIC_INDEX = 'sarjom:index:records';
const TICKET_INDEX = 'sarjom:index:tickets';
const CHANGE_INDEX = 'sarjom:index:changes';

/**
 * Canonical recruitment lifecycle indexes.
 *
 * Every published job belongs to exactly one lifecycle index.
 * These indexes are maintained automatically whenever a job is
 * created, updated, transitioned, or deleted.
 */
const LIFECYCLE_INDEX_PREFIX = 'sarjom:index:lifecycle:';

const LIFECYCLES = [
  'upcoming',
  'open',
  'closing-soon',
  'closed',
  'admit-card-pending',
  'admit-card-released',
  'exam-scheduled',
  'exam-completed',
  'answer-key-released',
  'result-released',
  'cancelled',
  'postponed',
  'unknown',
] as const;

function lifecycleIndex(lifecycle: string): string {
  return `${LIFECYCLE_INDEX_PREFIX}${lifecycle}`;
}

async function removeJobFromAllLifecycleIndexes(
  jobId: string,
): Promise<void> {
  await Promise.all(
    LIFECYCLES.map(lifecycle =>
      removeFromIndex(lifecycleIndex(lifecycle), jobId),
    ),
  );
}

async function syncJobLifecycleIndex(
  job: SarjomJob,
): Promise<void> {
  await removeJobFromAllLifecycleIndexes(job.id);

  const lifecycle = job.lifecycle;

  if (
    LIFECYCLES.includes(
      lifecycle as (typeof LIFECYCLES)[number],
    )
  ) {
    await addToIndex(lifecycleIndex(lifecycle), job.id);
  }
}

export const sarjomRepository = {
  async saveJob(job: SarjomJob): Promise<SarjomJob> {
    await setValue(`sarjom:job:${job.id}`, job);
    await addToIndex(JOB_INDEX, job.id);

    await syncJobLifecycleIndex(job);

    return job;
  },

  async getJob(id: string): Promise<SarjomJob | null> {
    return getValue<SarjomJob>(`sarjom:job:${id}`);
  },

  async deleteJob(id: string): Promise<void> {
    await deleteValue(`sarjom:job:${id}`);
    await removeFromIndex(JOB_INDEX, id);

    await removeJobFromAllLifecycleIndexes(id);
  },

  async listJobs(): Promise<SarjomJob[]> {
    const ids = await readIndex(JOB_INDEX);

    const jobs = await Promise.all(
      ids.map(id => this.getJob(id)),
    );

    return jobs.filter(
      (job): job is SarjomJob => Boolean(job),
    );
  },

  /**
   * Return jobs directly from a lifecycle index.
   *
   * The canonical job record is still loaded from sarjom:job:<id>,
   * so indexes never become the source of truth.
   */
  async listJobsByLifecycle(
    lifecycle: SarjomJob['lifecycle'],
  ): Promise<SarjomJob[]> {
    const ids = await readIndex(
      lifecycleIndex(lifecycle),
    );

    const jobs = await Promise.all(
      ids.map(id => this.getJob(id)),
    );

    return jobs.filter(
      (job): job is SarjomJob => Boolean(job),
    );
  },

  async getLifecycleIndexIds(
    lifecycle: SarjomJob['lifecycle'],
  ): Promise<string[]> {
    return readIndex(lifecycleIndex(lifecycle));
  },

  async rebuildLifecycleIndexes(): Promise<{
    checked: number;
    indexed: number;
    errors: string[];
  }> {
    const jobs = await this.listJobs();

    const errors: string[] = [];
    let indexed = 0;

    await Promise.all(
      LIFECYCLES.map(async lifecycle => {
        const ids = await readIndex(
          lifecycleIndex(lifecycle),
        );

        await Promise.all(
          ids.map(id =>
            removeFromIndex(
              lifecycleIndex(lifecycle),
              id,
            ),
          ),
        );
      }),
    );

    for (const job of jobs) {
      try {
        await syncJobLifecycleIndex(job);
        indexed++;
      } catch (error) {
        errors.push(
          `${job.id}: ${
            error instanceof Error
              ? error.message
              : 'Lifecycle index failure'
          }`,
        );
      }
    }

    return {
      checked: jobs.length,
      indexed,
      errors,
    };
  },

  async saveRecord(
    record: SarjomGenericRecord,
  ): Promise<SarjomGenericRecord> {
    await setValue(`sarjom:record:${record.id}`, record);
    await addToIndex(GENERIC_INDEX, record.id);

    return record;
  },

  async getRecord(
    id: string,
  ): Promise<SarjomGenericRecord | null> {
    return getValue<SarjomGenericRecord>(
      `sarjom:record:${id}`,
    );
  },

  async listRecords(): Promise<SarjomGenericRecord[]> {
    const ids = await readIndex(GENERIC_INDEX);

    const records = await Promise.all(
      ids.map(id => this.getRecord(id)),
    );

    return records.filter(
      (record): record is SarjomGenericRecord =>
        Boolean(record),
    );
  },

  async saveTicket(
    ticket: ContactTicket,
  ): Promise<ContactTicket> {
    await setValue(`sarjom:ticket:${ticket.id}`, ticket);
    await addToIndex(TICKET_INDEX, ticket.id);

    return ticket;
  },

  async getTicket(
    id: string,
  ): Promise<ContactTicket | null> {
    return getValue<ContactTicket>(
      `sarjom:ticket:${id}`,
    );
  },

  async listTickets(): Promise<ContactTicket[]> {
    const ids = await readIndex(TICKET_INDEX);

    const tickets = await Promise.all(
      ids.map(id => this.getTicket(id)),
    );

    return tickets.filter(
      (ticket): ticket is ContactTicket =>
        Boolean(ticket),
    );
  },

  async saveChange(
    change: AdminChange,
  ): Promise<AdminChange> {
    await setValue(`sarjom:change:${change.id}`, change);
    await addToIndex(CHANGE_INDEX, change.id);

    return change;
  },

  async listChanges(): Promise<AdminChange[]> {
    const ids = await readIndex(CHANGE_INDEX);

    const changes = await Promise.all(
      ids.map(id =>
        getValue<AdminChange>(
          `sarjom:change:${id}`,
        ),
      ),
    );

    return changes.filter(
      (change): change is AdminChange =>
        Boolean(change),
    );
  },
};

export const hasPersistentSarjomStore = Boolean(redis);
