import { openKv } from "@deno/kv";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export interface Contact {
    id: string;
    first: string;
    last: string;
    avatar: string;
    mastodon: string;
    notes: string;
    favorite?: boolean;
    createdAt: Date;
}

const kv = await openKv(":memory:");
const CONTACTS = "contacts";

export async function getContacts(query?: string) {
    await fakeNetwork(`getContacts:${query}`);

    const contactsIterator = kv.list<Contact>({ prefix: [CONTACTS] });
    const contacts: Contact[] = [];

    for await (const entry of contactsIterator) {
        contacts.push(entry.value);
    }

    let filteredContacts = contacts;
    if (query) {
        filteredContacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }

    return filteredContacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
    await fakeNetwork();

    const id = crypto.randomUUID();
    const newContact: Contact = {
        id,
        first: "",
        last: "",
        avatar: "",
        mastodon: "",
        notes: "",
        createdAt: new Date(),
    };

    await kv.set([CONTACTS, id], newContact);

    return newContact;
}

export async function getContact(id?: number) {
    if (!id) return null;

    await fakeNetwork(`contact:${id}`);

    const result = await kv.get<Contact>([CONTACTS, id]);
    return result.value;
}

export async function updateContact(id: number, updates: Partial<Contact>) {
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

export async function deleteContact(id: number) {
    await kv.delete([CONTACTS, id]);
    return true;
}

// fake a cache so we don't slow down stuff we've already seen
const fakeCache = new Map<string, boolean>();

async function fakeNetwork(key?: string) {
    if (!key || !fakeCache.get(key)) {
        if (key) fakeCache.set(key, true);
        return await new Promise(res => setTimeout(res, Math.random() * 1000));
    }
}
