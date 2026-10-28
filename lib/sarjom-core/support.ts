import crypto from 'node:crypto';
import { sarjomRepository } from './repository.js';
import type { ContactTicket } from './types.js';

function ticketId(): string {
  return `SARJOM-${new Date().getUTCFullYear()}-${crypto.randomInt(100000, 999999)}`;
}

export async function createContactTicket(input: Omit<ContactTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<ContactTicket> {
  const now = new Date().toISOString();
  const ticket: ContactTicket = {
    ...input,
    id: ticketId(),
    createdAt: now,
    updatedAt: now,
    status: 'new',
  };
  return sarjomRepository.saveTicket(ticket);
}
