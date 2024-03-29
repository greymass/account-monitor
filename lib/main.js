/**
 * account-monitor v1.0.0
 * undefined
 *
 * @license
 * Copyright (c) 2021 Greymass Inc. All Rights Reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 *  1. Redistribution of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 * 
 *  2. Redistribution in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 * 
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *     may be used to endorse or promote products derived from this software without
 *     specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * YOU ACKNOWLEDGE THAT THIS SOFTWARE IS NOT DESIGNED, LICENSED OR INTENDED FOR USE
 * IN THE DESIGN, CONSTRUCTION, OPERATION OR MAINTENANCE OF ANY MILITARY FACILITY.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var common = require('@wharfkit/common');
var account = require('@wharfkit/account');
var antelope = require('@wharfkit/antelope');

var accounts = [
	{
		name: "gm",
		chain: "EOS",
		thresholdBalance: 100000,
		thresholdRAM: 12000000
	}
];
var config = {
	accounts: accounts
};

var configJSON = /*#__PURE__*/Object.freeze({
  __proto__: null,
  accounts: accounts,
  'default': config
});

// Function to check a single account.
function checkAccount({ name, chain, thresholdBalance, thresholdRAM }) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        console.log({ name, chain, thresholdBalance, thresholdRAM });
        const chainDefinition = common.Chains[chain];
        console.log({ chainDefinition });
        const accountKit = new account.AccountKit(chainDefinition, { client: new antelope.APIClient({ fetch: fetch.bind(globalThis), url: chainDefinition.url }) });
        console.log({ accountKit });
        const account$1 = yield accountKit.load(name);
        console.log({ account: account$1 });
        let alertMessages = [];
        if (!account$1.data) {
            alertMessages.push(`No account data found for ${name} on ${chain}`);
        }
        const balance = account$1.data.core_liquid_balance;
        if (!balance) {
            alertMessages.push(`Balance data not available`);
        }
        else if (balance.value < thresholdBalance) {
            alertMessages.push(`LOW BALANCE: ${balance}`);
        }
        const ram_quota = account$1.data.ram_quota;
        const ram_usage = account$1.data.ram_usage;
        const ram_available = Number(ram_quota) - Number(ram_usage);
        console.log({ ram_quota, ram_usage, ram_available });
        if (!ram_quota || !ram_usage) {
            alertMessages.push(`RAM data not available`);
        }
        else if (ram_available < thresholdRAM) {
            alertMessages.push(`LOW RAM: ${ram_available} KB left`);
        }
        if (alertMessages.length > 0) {
            yield sendSlackMessage(`Alert for ${name} on ${chain}: ${alertMessages.join(', ')}`);
        }
    });
}
// Function to send a Slack message.
// This function assumes `fetch` is available globally, e.g., via a polyfill or in an environment like Deno.
// You might need to import it or use an alternative HTTP client if you're in a Node.js environment.
function sendSlackMessage(message) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        console.log({ fetch, message, url: SLACK_WEBHOOK_URL });
        const resp = yield fetch.bind(globalThis)(String(SLACK_WEBHOOK_URL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: message }),
        });
        console.log({ resp });
    });
}
// Function to iterate over all accounts in the config and check them.
function checkAccounts() {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        const config = configJSON;
        if (!config.accounts) {
            throw new Error('No accounts found in config');
        }
        try {
            for (const account of config.accounts) {
                yield checkAccount(account);
            }
        }
        catch (error) {
            console.error(error.message);
        }
    });
}

exports.checkAccounts = checkAccounts;
//# sourceMappingURL=main.js.map
