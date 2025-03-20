import { createAsync, query, RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";

const getContact = query(async () => {
    "use server";
    return {
        first: "Your",
        last: "Name",
        avatar: "https://placecats.com/200/200",
        twitter: "your_handle",
        notes: "Some notes",
        favorite: true,
    };
}, "contacts");

export const route = {
    preload: () => getContact(),
} satisfies RouteDefinition;

export default function Contact() {
    const contact = createAsync(() => getContact());

    return (
        <div id="contact">
            <div>
                <img
                    alt={`${contact()?.first} ${contact()?.last} avatar`}
                    src={contact()?.avatar}
                    //   key={contact.avatar}
                />
            </div>

            <div>
                <h1>
                    <Show when={contact()?.first || contact()?.last} fallback={<i>No Name</i>}>
                        {contact()!.first} {contact()!.last}
                    </Show>
                    <Favorite contact={contact()} />
                </h1>

                <Show when={contact()?.twitter}>
                    {handle => (
                        <p>
                            <a href={`https://twitter.com/${handle()}`}>{handle()}</a>
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
