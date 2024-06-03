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

import crypto from 'crypto'
import base64url from 'base64url';
import {CookieSerializeOptions, serialize} from 'cookie'
import {CookieDecryptionException, InvalidCookieException} from '../lib/exceptions/index.js'

const GCM_RANDOM_SIZE = 12;

function encryptCookie(encKeyHex: string, plaintext: string): string {

    const randomBytes = crypto.randomBytes(GCM_RANDOM_SIZE)
    const plainBytes = Buffer.from(plaintext, 'utf8')
    const message = Buffer.concat([randomBytes, plainBytes])

    const encKeyBytes = Buffer.from(encKeyHex, "hex")

    const hmac = crypto.createHmac('sha256', encKeyBytes)
    hmac.update(message)
    const hash = hmac.digest()

    const sepBytes = Buffer.from('.', 'utf8')
    const allBytes = Buffer.concat([hash, sepBytes, message])

    return base64url.encode(allBytes)
}

function decryptCookie(encKeyHex: string, encryptedbase64value: string): string {

    const allBytes = base64url.toBuffer(encryptedbase64value)

    const encKeyBytes = Buffer.from(encKeyHex, "hex")

    const sepIndex = allBytes.indexOf('.')
    const hash = allBytes.slice(0, sepIndex)
    const message = allBytes.slice(sepIndex+1)

    const hmac = crypto.createHmac('sha256', encKeyBytes)
    hmac.update(message);
    const hashExpected = hmac.digest();

    if (hash.equals(hashExpected)) {
        return message.slice(GCM_RANDOM_SIZE).toString()
    } else {
        throw new CookieDecryptionException(new Error("The received hash didn't match expected hash"))
    }
}

function getEncryptedCookie(options: CookieSerializeOptions, value: string, name: string, encKey: string): string {
    return serialize(name, encryptCookie(encKey, value), options)
}

export { getEncryptedCookie, decryptCookie, encryptCookie };
