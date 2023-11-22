CONTAINER_ID=$(docker ps --filter name=tipa_frontend -q)
docker stop $CONTAINER_ID && echo 'stop tipa_frontend_container'
docker rm $CONTAINER_ID && echo 'remove tipa_frontend_container'
docker rmi tipa_frontend_react && echo 'remove tipa_frontend image'
