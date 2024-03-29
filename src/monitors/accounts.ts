import { Chains,  } from '@wharfkit/common';
import { AccountKit } from '@wharfkit/account';
import { APIClient } from '@wharfkit/antelope';

interface Config {
    accounts: AccountConfig[];
}

interface AccountConfig {
    name: string;
    chain: keyof typeof Chains;
    thresholdBalance: number;
    thresholdRAM: number;
}

// Importing config with an assert type of 'json'.
import * as configJSON from '../../config.json';

// Function to check a single account.
async function checkAccount({ name, chain, thresholdBalance, thresholdRAM }: AccountConfig): Promise<void> {
    console.log({ name, chain, thresholdBalance, thresholdRAM })
    
    const chainDefinition = Chains[chain];

    console.log({chainDefinition})
    
    const accountKit = new AccountKit(chainDefinition, { client: new APIClient({ fetch: fetch.bind(globalThis), url: chainDefinition.url }) });
    console.log({ accountKit })
    const account = await accountKit.load(name);

    console.log({ account })

    let alertMessages: string[] = [];

    if (!account.data) {
        alertMessages.push(`No account data found for ${name} on ${chain}`)
    }
   
    const balance = account.data.core_liquid_balance

    if (!balance) {
        alertMessages.push(`Balance data not available`);
    } else if (balance.value < thresholdBalance) {
        alertMessages.push(`LOW BALANCE: ${balance}`);
    }

    const ram_quota = account.data.ram_quota
    const ram_usage = account.data.ram_usage
    const ram_available = Number(ram_quota) - Number(ram_usage)

    console.log({ ram_quota, ram_usage, ram_available })

    if (!ram_quota || !ram_usage) {
        alertMessages.push(`RAM data not available`);
    } else if (ram_available < thresholdRAM) {
        alertMessages.push(`LOW RAM: ${ram_available} KB left`);
    }
    
    if (alertMessages.length > 0) {
        await sendSlackMessage(`Alert for ${name} on ${chain}: ${alertMessages.join(', ')}`);
    }
}

// Function to send a Slack message.
// This function assumes `fetch` is available globally, e.g., via a polyfill or in an environment like Deno.
// You might need to import it or use an alternative HTTP client if you're in a Node.js environment.
async function sendSlackMessage(message: string): Promise<void> {
    console.log({ fetch, message, url: SLACK_WEBHOOK_URL })
    const resp = await fetch.bind(globalThis)(String(SLACK_WEBHOOK_URL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
    });
    console.log({ resp })
}

// Function to iterate over all accounts in the config and check them.
export async function checkAccounts(): Promise<void> {
    const config: Config = configJSON as Config;
    if (!config.accounts) {
        throw new Error('No accounts found in config');
    }

    try {
        for (const account of (config as Config).accounts) {
            await checkAccount(account);
        }
    } catch (error) {
        console.error((error as Error).message);
    }
}
