import { Chains } from '@wharfkit/common';
import { AccountKit } from '@wharfkit/account';
import config from './config.json';

async function checkAccount(name, chain, thresholdBalance, thresholdRAM) {
  const accountKit = new AccountKit(Chains[chain]);
  const account = await accountKit.load(name);
  let alertMessages = [];

  if (account.data) {
    if (account.data.core_liquid_balance?.value < thresholdBalance) {
      alertMessages.push(`LOW BALANCE: ${account.data.core_liquid_balance?.value}`);
    }
    if (account.data.ram_quota - account.data.ram_usage < thresholdRAM) {
      alertMessages.push(`LOW RAM: ${(account.data.ram_quota - account.data.ram_usage)} KB left`);
    }
  }

  if (alertMessages.length > 0) {
    await sendSlackMessage(`Alert for ${name} on ${chain}: ${alertMessages.join(', ')}`);
  }
}

async function sendSlackMessage(message) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: message }),
  });
}

function checkAccounts() {
  for (const account of config.accounts) {
    checkAccount(account)
  }
}

addEventListener('scheduled', event => {
  checkAccounts()
})
