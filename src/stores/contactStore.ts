// src/stores/contactStore.ts
import { create } from 'zustand';

interface Contact {
  id: string; // Usually wa_id (e.g. 521234567890)
  name: string;
  profilePic?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

interface ContactStore {
  contacts: Record<string, Contact>;
  setContacts: (contacts: Contact[]) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
  clearContacts: () => void;
}

export const useContactStore = create<ContactStore>()((set) => ({
  contacts: {},

  setContacts: (contacts) =>
    set({
      contacts: Object.fromEntries(contacts.map((c) => [c.id, c])),
    }),

  updateContact: (id, data) =>
    set((state) => ({
      contacts: {
        ...state.contacts,
        [id]: { ...state.contacts[id], ...data },
      },
    })),

  clearContacts: () => set({ contacts: {} }),
}));
