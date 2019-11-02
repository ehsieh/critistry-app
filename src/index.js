import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import * as serviceWorker from "./serviceWorker";

// GraphQL-specific
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks"


// ApolloProvider wraps the React app and places the Apollo client
// on the React context so the client can be conveniently accessed
// from anywhere in the component tree.

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>    
    <App />  
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();