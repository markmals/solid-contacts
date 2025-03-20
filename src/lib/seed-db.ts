import type { Kv } from "@deno/kv";

const contacts = [
    {
        id: "1",
        first: "Birk",
        last: "Skyum",
        avatar: "https://avatars.githubusercontent.com/u/74932975?v=4",
        bsky: "bskyum.bsky.social",
    },
    {
        id: "2",
        first: "Atila",
        last: "Fassina",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:yrgtfq7lxswl2h4yb73njdsu/bafkreiboxpnwvqx4ejuukd7dnnn4tnejy5ib5l75zwrfw3c5yp7l3guk54@jpeg",
        bsky: "atila.io",
    },
    {
        id: "3",
        first: "Ryan",
        last: "Carniato",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:akeq2bvwjlqdailcohvehb6w/bafkreif5r2vcneqyizaaagbhxf5bum4vn2mqqho4ji7owippuofyilkzdi@jpeg",
        bsky: "ryansolid.bsky.social",
    },
    {
        id: "4",
        first: "Alexis",
        last: "Munsayac",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:q52zko3hvzl7omgm67ilekfz/bafkreicjv6lmsdzep3caa7dypgas5g3fmt6yre4oy3pi7yhuxrngm5s7iq@jpeg",
        bsky: "lxsmnsyc.bsky.social",
    },
    {
        id: "5",
        first: "Milo",
        last: "Mighdoll",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:xoiapti32rf36vvvrfvndplh/bafkreidh7q35puyco5ehftl7jbmhk3lrhfcwanj5dti35jdqndgfk2jcuu@jpeg",
        bsky: "milomg.bsky.social",
    },
    {
        id: "9",
        first: "Ryan",
        last: "Turnquist",
        avatar: "https://avatars.githubusercontent.com/u/11449439?v=4",
        bsky: "rturnq.dev",
    },
    {
        id: "7",
        first: "Sarah",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:zwokxtg457dl33xo77yzuojj/bafkreiebcfom44c6wxbrd6uwej2ybqwjnw5dqi7w2aidyigr27yiplxhgm@jpeg",
        bsky: "ladybluenotes.dev",
    },
];

export async function seed(kv: Kv, namespace: string) {
    for (const contact of contacts) {
        const key = [namespace, contact.id];
        const existing = await kv.get(key);

        if (!existing.value) {
            await kv.set(key, contact);
        }
    }
}
