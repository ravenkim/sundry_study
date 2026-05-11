DEPLOY_DIR=../imagefiles
docker rmi tipa_frontend_react:latest
docker build . -t tipa_frontend_react:latest
rm -rf $DEPLOY_DIR/tipa_frontend.tar
docker save -o $DEPLOY_DIR/tipa_frontend.tar tipa_frontend_react:latest
