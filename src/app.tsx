import { MetaProvider, Title } from "@solidjs/meta";
import { A, createAsync, query, Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createEffect, ErrorBoundary, For, ParentProps, Show, Suspense } from "solid-js";
import { getContacts } from "~/lib/contacts";

const fetchContacts = query(async (q?: string) => {
    "use server";
    return await getContacts(q ?? null);
}, "contacts");

function Root(props: ParentProps) {
    const location = useLocation();
    const q = () => location.query.q as string | undefined;
    const contacts = createAsync(() => fetchContacts(q()));

    createEffect(() => console.log(contacts()));

    return (
        <>
            <Title>SolidStart Contacts</Title>

            <div id="sidebar">
                <h1>SolidStart Contacts</h1>
                <div>
                    <form id="search-form" role="search">
                        <input
                            aria-label="Search contacts"
                            id="q"
                            name="q"
                            placeholder="Search"
                            type="search"
                            value={q() ?? ""}
                        />
                        <div aria-hidden hidden={true} id="search-spinner" />
                    </form>
                    <form method="post">
                        <button type="submit">New</button>
                    </form>
                </div>
                <nav>
                    <Show
                        when={contacts()}
                        fallback={
                            <p>
                                <i>No contacts</i>
                            </p>
                        }
                    >
                        {c => (
                            <For each={c()}>
                                {contact => (
                                    // FIXME: Why is this causing a hydration mismatch?
                                    <li>
                                        {/* TODO: `pending` class */}
                                        <A href={`contacts/${contact.id}`} activeClass="active">
                                            <Show
                                                when={contact.first || contact.last}
                                                fallback={<i>No Name</i>}
                                            >
                                                {contact.first} {contact.last}
                                            </Show>

                                            <Show when={contact.favorite}>
                                                <span>★</span>
                                            </Show>
                                        </A>
                                    </li>
                                )}
                            </For>
                        )}
                    </Show>
                </nav>
            </div>
            <div id="detail">
                <Suspense>{props.children}</Suspense>
            </div>
        </>
    );
}

// export function Error(props: { error: unknown }) {
//     let message = "Oops!";
//     let details = "An unexpected error occurred.";
//     let stack: string | undefined;

// TODO: How do I do this in SolidStart?
//     if (isRouteErrorResponse(error)) {
//         message = error.status === 404 ? "404" : "Error";
//         details =
//             error.status === 404
//                 ? "The requested page could not be found."
//                 : error.statusText || details;
//     } else if (import.meta.env.DEV && error && error instanceof Error) {
//         details = error.message;
//         stack = error.stack;
//     }

//     return (
//         <main id="error-page">
//             <h1>{message()}</h1>
//             <p>{details()}</p>
//             {stack() && (
//                 <pre>
//                     <code>{stack()}</code>
//                 </pre>
//             )}
//         </main>
//     );
// }

export default function App() {
    return (
        <Router
            root={props => (
                <MetaProvider>
                    {/* <ErrorBoundary fallback={e => <Error error={e} />}> */}
                    <Root>{props.children}</Root>
                    {/* </ErrorBoundary> */}
                </MetaProvider>
            )}
        >
            <FileRoutes />
        </Router>
    );
}
