#! /usr/bin/env nix-shell
#! nix-shell -i bash -p nodejs_18 gettext

export PORT=8082
export TRUSTED_WEB_ORIGIN="http://www.example.com"
export ISSUER="https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_wmCNNCByv"
export AUTHORIZE_ENDPOINT="https://bnt-test.auth.ap-southeast-2.amazoncognito.com/oauth2/authorize"
export TOKEN_ENDPOINT="https://bnt-test.auth.ap-southeast-2.amazoncognito.com/oauth2/token"
export USERINFO_ENDPOINT="https://bnt-test.auth.ap-southeast-2.amazoncognito.com/oauth2/userInfo"
export LOGOUT_ENDPOINT="https://bnt-test.auth.ap-southeast-2.amazoncognito.com/logout"
export CLIENT_ID="4pjg54s9u61e3eb6emeong1jsk"
export CLIENT_SECRET=""
export REDIRECT_URI="http://localhost:8081/login"
export POST_LOGOUT_REDIRECT_URI="http://www.example.com/"
export SCOPE=" "
export COOKIE_DOMAIN="api.example.com"
export COOKIE_NAME_PREFIX="example"
export COOKIE_ENCRYPTION_KEY="fda91643fce9af565bdc34cd965b48da75d1f5bd8846bf0910dd6d7b10f06dfe"
export CORS_ENABLED="true"

npm run start
