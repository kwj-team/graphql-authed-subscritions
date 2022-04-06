setup: setup-backend setup-frontend

setup-backend:
	cd graphql-server && yarn
setup-frontend:
	cd graphql-client && yarn

start-backend: setup-backend
	npm run --prefix graphql-server start

start-ws-frontend: setup-frontend
	npm run --prefix graphql-client codegen && REACT_APP_SUBS=ws npm run --prefix graphql-client start

start-sse-frontend: setup-frontend
	npm run --prefix graphql-client start