import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { createLink } from "apollo-absinthe-upload-link";
import { setContext } from "apollo-link-context";
import * as serviceWorker from "./serviceWorker";

// GraphQL-specific
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks"
import { resolvers, typeDefs } from "./Resolvers";


// ApolloProvider wraps the React app and places the Apollo client
// on the React context so the client can be conveniently accessed
// from anywhere in the component tree.

const httpLink = createLink({
  uri: 'http://localhost:4000'
});

// If an authentication token exists in local storage, put
// the token in the "Authorization" request header.
// Returns an object to set the context of the GraphQL request.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  typeDefs,
  resolvers
});

client.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('auth-token')
  }
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