start-ws-backend: 
	npm run --prefix graphql-ws-server start

start-ws-frontend:
	REACT_APP_SUBS=ws npm run --prefix graphql-ws-client start

start-sse-frontend:
	npm run --prefix graphql-ws-client start