/*
 *  Copyright 2021 Curity AB
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as express from 'express'
import {getATCookieName, getUserInfo, ValidateRequestOptions} from '../lib'
import {config} from '../config'
import validateExpressRequest from '../validateExpressRequest'
import {InvalidCookieException} from '../lib/exceptions'
import {asyncCatch} from '../supportability/exceptionMiddleware';

class UserInfoController {
    public router = express.Router()

    constructor() {
        this.router.get('/', asyncCatch(this.getUserInfo))
    }

    getUserInfo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        // Verify the web origin
        const options = new ValidateRequestOptions()
        options.requireCsrfHeader = false;
        validateExpressRequest(req, options)

        const atCookieName = getATCookieName(config.cookieNamePrefix)
        if (req.cookies && req.cookies[atCookieName]) {

            let accessToken = req.cookies[atCookieName]

            // TODO: remove after review
            // debug code to cause a 401 response from the Identity Server and test retry logic
            if (req.header('x-attempt') === '1') {
                accessToken = `xxx${accessToken}`
            }

            const userData = await getUserInfo(config, config.encKey, accessToken)
            res.status(200).json(userData)

        } else {
            const error = new InvalidCookieException()
            error.logInfo = 'No AT cookie was supplied in a call to get user info'
            throw error
        }
    }
}

export default UserInfoController
