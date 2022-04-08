import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server-express";
import express, { Request, Response } from "express";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { createHandler } from "graphql-sse";
import { IncomingMessage, createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import { CloseCode } from "graphql-ws";
import cookie from "cookie";

const PORT = 4000;
const pubsub = new PubSub();

// Schema definition
const typeDefs = gql`
  type Query {
    currentNumber: Int
  }

  type Subscription {
    numberIncremented: Int
  }
`;

// Resolver map
const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
  },
  Subscription: {
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
    },
  },
};

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();

function auth(req: IncomingMessage) {
  if (req && req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    return cookies.auth === "123";
  }
  return false;
}

function handleCookieRequest(req: Request, res: Response) {
  res.setHeader("Set-Cookie", [`auth=123; Path=/`]);
  res.send("OK");
}

app.post(
  "/requestCookie",
  cors({
    allowedHeaders: ["Cookie", "Origin", "Accept", "Content-Type"],
    exposedHeaders: ["Set-Cookie"],
    origin: true,
    credentials: true,
  }),
  handleCookieRequest
);

// Create the GraphQL over SSE handler
const handler = createHandler({
  schema, // from the previous step
  authenticate: (req, res) => {
    if (auth(req)) {
      return "";
    }

    res.writeHead(401, "Unauthorized").end();
    return;
  },
});

app.use(
  `/graphql/stream`,
  cors({
    allowedHeaders: "cookie",
    origin: true,
    credentials: true,
  }),
  handler
);
const httpServer = createServer(app);

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
const serverCleanup = useServer(
  {
    schema,
    onConnect: async (ctx) => {
      // do your auth check on every connect
      if (!(await auth(ctx.extra.request)))
        // returning false from the onConnect callback will close with `4403: Forbidden`;
        // therefore, being synonymous to ctx.extra.socket.close(4403, 'Forbidden');
        return false;
    },
    onSubscribe: async (ctx) => {
      // or maybe on every subscribe
      if (!(await auth(ctx.extra.request)))
        return ctx.extra.socket.close(CloseCode.Forbidden, "Forbidden");
    },
    onNext: async (ctx) => {
      // why not on every result emission? lol
      if (!(await auth(ctx.extra.request)))
        return ctx.extra.socket.close(CloseCode.Forbidden, "Forbidden");
    },
  },
  wsServer
);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
server.applyMiddleware({ app });

// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscription server-events endpoint ready at http://localhost:${PORT}${server.graphqlPath}/stream`
  );
});

// In the background, increment a number every second and notify subscribers when
// it changes.
let currentNumber = 0;
function incrementNumber() {
  currentNumber++;
  pubsub.publish("NUMBER_INCREMENTED", { numberIncremented: currentNumber });
  setTimeout(incrementNumber, 1000);
}
// Start incrementing
incrementNumber();
