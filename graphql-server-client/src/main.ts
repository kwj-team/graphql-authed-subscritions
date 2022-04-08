import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { EventSource } from "launchdarkly-eventsource";
import { createClient } from "graphql-sse";
import { createServer } from "http";
import fetch from "node-fetch";

const PORT = 4001;

const app = express();
app.use(cors());
// echo response back
app.use(bodyParser.json());
app.post("/event", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

const httpServer = createServer(app);

// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
  console.log(`🚀 Webhook endpoint ready at http://localhost:${PORT}/event`);
});

function listenSSELD() {
  const sse = new EventSource(`http://localhost:4000/graphql/stream`, {
    headers: {
      Cookie: `auth=123`,
    },
    withCredentials: true,
    method: "POST",
    body: JSON.stringify({
      variables: {},
      extensions: {},
      operationName: "NumberIncremented",
      query: "subscription NumberIncremented {\n  numberIncremented\n}",
    }),
  });

  // This doesn't notify as graphql-sse doesnt follow sse spec.
  sse.onmessage = (event) => {
    console.log("sse", event.data);
    console.log("sse event", event);
  };

  sse.onerror = (event) => {
    console.error("sse error", event);
  };

  sse.onopen = (event) => {
    console.log("sse open", event);
  };
}

listenSSELD();

function listenSSEGraphqlSSE() {
  createClient({
    url: "http://localhost:4000/graphql/stream",
    headers: {
      Cookie: `auth=123`,
    },
    fetchFn: fetch,
  }).subscribe(
    {
      operationName: "NumberIncremented",
      query: "subscription NumberIncremented {  numberIncremented }",
    },
    {
      next: (data) => console.log(data),
      error: (error) => console.error(error),
      complete: () => console.log("closed connection"),
    }
  );
}

listenSSEGraphqlSSE();
