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
import { Chains } from '@wharfkit/common';
import { AccountKit } from '@wharfkit/account';
import { APIClient } from '@wharfkit/antelope';

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
async function checkAccount({ name, chain, thresholdBalance, thresholdRAM }) {
    console.log({ name, chain, thresholdBalance, thresholdRAM });
    const chainDefinition = Chains[chain];
    console.log({ chainDefinition });
    const accountKit = new AccountKit(chainDefinition, { client: new APIClient({ fetch: fetch.bind(globalThis), url: chainDefinition.url }) });
    console.log({ accountKit });
    const account = await accountKit.load(name);
    console.log({ account });
    let alertMessages = [];
    if (!account.data) {
        alertMessages.push(`No account data found for ${name} on ${chain}`);
    }
    const balance = account.data.core_liquid_balance;
    if (!balance) {
        alertMessages.push(`Balance data not available`);
    }
    else if (balance.value < thresholdBalance) {
        alertMessages.push(`LOW BALANCE: ${balance}`);
    }
    const ram_quota = account.data.ram_quota;
    const ram_usage = account.data.ram_usage;
    const ram_available = Number(ram_quota) - Number(ram_usage);
    console.log({ ram_quota, ram_usage, ram_available });
    if (!ram_quota || !ram_usage) {
        alertMessages.push(`RAM data not available`);
    }
    else if (ram_available < thresholdRAM) {
        alertMessages.push(`LOW RAM: ${ram_available} KB left`);
    }
    if (alertMessages.length > 0) {
        await sendSlackMessage(`Alert for ${name} on ${chain}: ${alertMessages.join(', ')}`);
    }
}
// Function to send a Slack message.
// This function assumes `fetch` is available globally, e.g., via a polyfill or in an environment like Deno.
// You might need to import it or use an alternative HTTP client if you're in a Node.js environment.
async function sendSlackMessage(message) {
    console.log({ fetch, message, url: SLACK_WEBHOOK_URL });
    const resp = await fetch.bind(globalThis)(String(SLACK_WEBHOOK_URL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
    });
    console.log({ resp });
}
// Function to iterate over all accounts in the config and check them.
async function checkAccounts() {
    const config = configJSON;
    if (!config.accounts) {
        throw new Error('No accounts found in config');
    }
    try {
        for (const account of config.accounts) {
            await checkAccount(account);
        }
    }
    catch (error) {
        console.error(error.message);
    }
}

export { checkAccounts };
//# sourceMappingURL=main.m.js.map
