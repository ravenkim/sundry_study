CONTAINER_ID=$(docker ps --filter name=tipa_frontend -q)
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID
docker rmi tipa_frontend_react
docker load -i tipa_frontend.tar
docker-compose -f docker-compose-image.yml up -d --build
