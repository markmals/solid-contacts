import { createAsync, query, RouteDefinition, useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { getContact } from "~/lib/contacts";

const fetchContact = query(async (contactId: string) => {
    "use server";

    const contact = await getContact(contactId);

    if (!contact) {
        throw new Response(null, { status: 404, statusText: "Not Found" });
    }

    return contact;
}, "contact");

export const route = {
    preload: ({ params }) => fetchContact(params.contactId),
} satisfies RouteDefinition;

export default function Component() {
    const params = useParams();
    const contact = createAsync(() => fetchContact(params.contactId));

    return (
        <div id="contact">
            <div>
                <img
                    alt={`${contact()?.first} ${contact()?.last} avatar`}
                    src={contact()?.avatar}
                />
            </div>

            <div>
                <h1>
                    <Show when={contact()?.first || contact()?.last} fallback={<i>No Name</i>}>
                        {contact()!.first} {contact()!.last}
                    </Show>
                    <Favorite contact={contact()} />
                </h1>

                <Show when={contact()?.bsky}>
                    {handle => (
                        <p>
                            <a href={`https://bsky.app/profile/${handle()}`}>@{handle()}</a>
                        </p>
                    )}
                </Show>

                <Show when={contact()?.notes}>{notes => <p>{notes()}</p>}</Show>

                <div>
                    <form action="edit">
                        <button type="submit">Edit</button>
                    </form>

                    <form
                        action="destroy"
                        method="post"
                        onSubmit={event => {
                            const response = confirm(
                                "Please confirm you want to delete this record.",
                            );
                            if (!response) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Favorite(props: { contact?: { favorite?: boolean } }) {
    const favorite = () => props.contact?.favorite;

    return (
        <form method="post">
            <button
                aria-label={favorite() ? "Remove from favorites" : "Add to favorites"}
                name="favorite"
                value={favorite() ? "false" : "true"}
            >
                <Show when={favorite()} fallback={"☆"}>
                    ★
                </Show>
            </button>
        </form>
    );
}
