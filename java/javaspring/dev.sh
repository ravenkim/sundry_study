CONTAINER_ID=$(docker ps --filter name=tipa_frontend -q)
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID
docker rmi tipa_frontend_react_dev
docker-compose -f docker-compose-dev.yml up -d --build
