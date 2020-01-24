import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        });
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new ApolloLink((operation, forward) => {
      // Retrieve the authorization token from local storage.
      const token = localStorage.getItem('auth_token');

      // Use the setContext method to set the HTTP headers.
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : ''
        }
      });

      // Call the next link in the middleware chain.
      return forward(operation);
    }),
    new HttpLink({
      uri: '//localhost:4000/'
    })
  ]),
  cache: new InMemoryCache()
});

export default client;
