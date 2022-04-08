# Graphql Subscriptions with Authorization

## Assumptions

- I was to make a POCs of different approaches to handling a 'server' driven communication, rather than typical poll driven.

## Backstory

Our API of choice is GraphQL for the server/browser interactions.
In our application we have had sometimes to query for data couple of times as the interactions that user made required a async processing on server side. Whenever the result of such processing was required to progress through the UI we would keep requerying for the same data in interval until we got the response that data was already processed.
This occured on couple of different scenarios as our interface had multiple such async processing operations in between our client-server.

We knew that we need something different, rather than requerying for the same data, we should have something that notifies us whenever the process actually finishes.
The GraphQL in its spec has `subscriptions` which are exactly for this use case.

The thing we have had to consider though is that the interactions with our services needed to be authorized before performed. Currently authorization was based on a AUTH cookie. 
GraphQL queries are using typical http request so it was quite straightforward to authenticate the requests whenever the query was executed. 

With subscriptions we wanted to test our options and see the limitations of available approaches.

For GraphQL subscriptions you can use either `websockets` or `server side events`(`SSE`).

Server side events is standard defining a request that returns `stream` of data, the connections is kept open and allows server to sent data to the client.
You may think of it as a 'uni-directional' stream of data - subscribtions are one way so that's ok. 

SSE supports http/2 spec. It's reusing existing connection when making requests. 

## Using websockets

To authorize using websockets I reviewed:
https://websockets.readthedocs.io/en/latest/topics/authentication.html#sending-credentials

Our current system authorized with COOKIES so that approach seemed like the best one for us. But for the sake of 

~~If your server and client support http/2 you may think of it as a kind of bi-directional connection where interactions the other way are using standard http requests, but reusing same (already open) connection. The only caveat of that approach is that you need to track the requests/connection yourself~~

## Running the POCs
- `make start-backend`
- and in different window either `make start-sse-frontend` or `make start-ws-frontend`

## Summary

Both websocket and sse are authorized with the usage of cookie header.
The client set's up the cookie starting with request to the service which sets up the cookie.

## Known approaches of server->client communication

- SSE (Server Side Events)
- Websockets
- Long-polling
- Polling
