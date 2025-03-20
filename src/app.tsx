import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, ParentProps, Suspense } from "solid-js";

function Root(props: ParentProps) {
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
                        />
                        <div aria-hidden hidden={true} id="search-spinner" />
                    </form>
                    <form method="post">
                        <button type="submit">New</button>
                    </form>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href={`/contacts/1`}>Your Name</a>
                        </li>
                        <li>
                            <a href={`/contacts/2`}>Your Friend</a>
                        </li>
                    </ul>
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
