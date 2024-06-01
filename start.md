1. nix-shell -p nodejs_18
2. ./start.sh
3. curl -XPOST "http://www.example.com:8082/oauth-agent/login/start" -H 'Origin: http://www.example.com' -v
  Grab Set-Cookie: example-login=AfFNiuVl5QBALS8LiCc_wkDMcx4ltXEHf4y1WH64zyKMoTf1ezmYCNojSvi8i_GHCRT2TzOTrVRDphEd6bM2oJoZUqpPddFZjhWQCYIu5lNaXVflQmUjKu8Vdh73xLl7YhwYhM5IwUVbcbIyUzi2XgURxywSXZSvNrILWMooAHcw1gu6JlB16uveyD8EqZSEgT7E_vXWIOmcw2Oh0PPy6vkzhw7RnBk8zJDO0XKnL3zPa_vUy63xTSKZ7g; Domain=api.example.com; Path=/; HttpOnly; SameSite=Strict
h4. Visit authorizationRequestUrl in browser
5. Grab code, state, and cookie, e.g.:
  - code: bb99abcc-ddba-447f-b661-0002491646fe
  - state: xLrA36na3v58G58FW3IDJ33DKl6FDmIQRwX7zwbCYxCeyJ9nNjgISdgJUUqOpkBU
  - cookie: example-login=AdOrLFn6-D24yZbc2XfXoRx5sRQpl_NwOCcNEZ3pJs_MDduuRyLwzQBdb197vqSrqDMPQvAsLr7i3zcZbhfG-2SYOdvA71p09ZFUOkdU0pxGRmOQmQLVuWDl7im34lZp7CbN7KpCuZYJXXzhpBBBo88ptUOPFTOPrLyX0G30lnR63bkb2tlrCgrPAXLT5Px7mAmrLRyhFI3OjqjfQcyRr7VZ7hEdYTy33xiTMsm4wXA_HUDk3NuMpRCKQg
6. curl -XPOST "http://www.example.com:8082/oauth-agent/login/end" -H 'Origin: http://www.example.com' -H 'content-type: application/json' -d "{ \"pageUrl\": \"http://www.example.com:8082/oauth-agent/login/end?code=$CODE&state=$STATE\" }" -H "Cookie: $COOKIE" -v
7. Grab csrf token and cookies from JSON response.
  - csrf: dYE4n57jPYozSrFnbVTsKWNDxQMERfyNO0MGw2ZuFoiTUtO2YIEfSPCy2Grj9SDC
  - cookie: "example-at=...; example-auth=...; example-id=...; example-csrf=...;"
8. curl -XGET "http://www.example.com:8082/oauth-agent/userInfo" -H 'Origin: http://www.example.com' -H "Cookie: $COOKIE"
9. curl -XGET "http://www.example.com:8082/oauth-agent/claims" -H 'Origin: http://www.example.com' -H "Cookie: $COOKIE"
10. curl -XPOST "http://www.example.com:8082/oauth-agent/refresh" -H 'Origin: http://www.example.com' -H "X-example-csrf: $CSRF" -H "Cookie: $COOKIE" -v
  - Update example-at and example-id tokens
11. curl -XPOST "http://www.example.com:8082/oauth-agent/login/end" -H 'Origin: http://www.example.com' -H 'content-type: application/json' -d "{ \"pageUrl\": \"http://www.example.com:8082/oauth-agent/login/end\" }" -H "Cookie: $COOKIE" -v -H "X-example-csrf: $CSRF"
