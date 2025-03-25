# echo "Starting application: nestjs-app"

# APP_DIR="/home/ec2-user/build"
# APP_NAME="nestjs-app"

# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# # 빌드
# cd $APP_DIR
# npm install
# npm run build

# # pm2 사용하여 애플리케이션 시작
# npm install -g pm2
# pm2 start dist/main.js --name $APP_NAME
# pm2 status

#!/bin/bash

echo "Starting application: nestjs-app"

APP_DIR="/home/ec2-user/build"
APP_NAME="nestjs-app"

cd $APP_DIR

# pm2 경로 보장
export PATH=$PATH:/usr/local/bin

# pm2 설치 (필요시만)
if ! command -v pm2 &> /dev/null
then
  npm install -g pm2
fi

# 기존 프로세스 제거 (중복 실행 방지)
pm2 delete $APP_NAME || true

# 앱 실행
pm2 start dist/main.js --name $APP_NAME
pm2 save

# CodeDeploy 성공 판정
exit 0

