export type ChecklistState = Record<string, boolean>;

export function loadChecklist(storage: Storage, key: string): ChecklistState {
  try {
    const raw = storage.getItem(key);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'),
    );
  } catch {
    return {};
  }
}

export function saveChecklist(storage: Storage, key: string, value: ChecklistState): void {
  storage.setItem(key, JSON.stringify(value));
}

