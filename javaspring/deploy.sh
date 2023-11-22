CONTAINER_ID=$(docker ps --filter name=tipa_frontend -q)
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID
docker rmi tipa_frontend_react
docker-compose up -d --build
