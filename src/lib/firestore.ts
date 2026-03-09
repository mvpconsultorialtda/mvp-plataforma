import {
  collection,
  doc,
  getDoc as fsGetDoc,
  getDocs,
  addDoc,
  updateDoc as fsUpdateDoc,
  deleteDoc as fsDeleteDoc,
  query,
  where,
  orderBy,
  limit as fsLimit,
  type WhereFilterOp,
  type OrderByDirection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ───────────────────────────────────────────────

export interface QueryFilter {
  field: string;
  op: WhereFilterOp;
  value: unknown;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  sort?: { field: string; direction?: OrderByDirection };
  limit?: number;
}

// ─── Read ────────────────────────────────────────────────

export async function getDocById<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const snap = await fsGetDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function queryDocs<T>(
  collectionName: string,
  options: QueryOptions = {}
): Promise<T[]> {
  const constraints = [];

  if (options.filters) {
    for (const f of options.filters) {
      constraints.push(where(f.field, f.op, f.value));
    }
  }

  if (options.sort) {
    constraints.push(orderBy(options.sort.field, options.sort.direction || "asc"));
  }

  if (options.limit) {
    constraints.push(fsLimit(options.limit));
  }

  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

// ─── Write ───────────────────────────────────────────────

export async function createDoc<T extends Record<string, unknown>>(
  collectionName: string,
  data: T
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDoc(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  await fsUpdateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  await fsDeleteDoc(doc(db, collectionName, id));
}

// ─── Helpers ─────────────────────────────────────────────

export function toDate(value: Timestamp | string | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  return new Date(value);
}

export function daysRemaining(endDate: Timestamp | string | undefined): number {
  const date = toDate(endDate);
  if (!date) return 0;
  const diff = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
