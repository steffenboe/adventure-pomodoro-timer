npm run build
cp -r build/* ../adventure-pomodoro/src/main/resources/static/
cd ../adventure-pomodoro
mvn verify -DskipTests