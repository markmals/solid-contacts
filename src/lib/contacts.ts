import { openKv } from "@deno/kv";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import { seed } from "./seed-db";

export interface Contact {
    id: string;
    first: string;
    last: string;
    avatar: string;
    bsky: string;
    notes: string;
    favorite?: boolean;
    createdAt: Date;
}

const kv = await openKv(":memory:");
const CONTACTS = "contacts";

await seed(kv, CONTACTS);

export async function getContacts(query: string | null) {
    await fakeNetwork(`getContacts:${query}`);

    let contacts: Contact[] = [];

    for await (const entry of kv.list<Contact>({ prefix: [CONTACTS] })) {
        contacts.push(entry.value);
    }

    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }

    return contacts.toSorted(sortBy("last", "createdAt"));
}

export async function createContact() {
    await fakeNetwork();

    const id = crypto.randomUUID();
    const newContact: Contact = {
        id,
        first: "",
        last: "",
        avatar: "",
        bsky: "",
        notes: "",
        createdAt: new Date(),
    };

    await kv.set([CONTACTS, id], newContact);

    return newContact;
}

export async function getContact(id?: string) {
    if (!id) return null;

    await fakeNetwork(`contact:${id}`);

    const result = await kv.get<Contact>([CONTACTS, id]);
    return result.value;
}

export async function updateContact(id: string, updates: Partial<Contact>) {
    await fakeNetwork();

    const result = await kv.get<Contact>([CONTACTS, id]);
    const contact = result.value;

    if (!contact) {
        throw new Error(`Contact with id ${id} not found`);
    }

    // Update contact
    const updatedContact = { ...contact, ...updates };
    await kv.set([CONTACTS, id], updatedContact);

    return updatedContact;
}

export async function deleteContact(id: string) {
    await kv.delete([CONTACTS, id]);
    return true;
}

// fake a cache so we don't slow down stuff we've already seen
const fakeCache = new Map<string, boolean>();

export async function fakeNetwork(key?: string) {
    if (!key || !fakeCache.get(key)) {
        if (key) fakeCache.set(key, true);
        // Fake network slowdown between 2-5 seconds
        return await new Promise(res => setTimeout(res, 2000 + Math.random() * 3_000));
    }
}
