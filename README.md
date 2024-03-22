# Antelope Account Monitor Worker

This Cloudflare Worker is designed to monitor account balances and RAM usage for specified accounts on Antelope blockchain networks (such as EOS). When certain thresholds are met, the worker sends an alert to a specified Slack channel.

## Features

- Monitors multiple blockchain accounts across different Antelope chains.
- Checks both liquid balance and RAM usage.
- Sends alerts to a Slack channel when thresholds are crossed.

## Setup

### Prerequisites

- Node.js and npm installed.
- Cloudflare account with access to Workers.
- Configured Slack Webhook URL.

### Installation

1. Clone the repository:
   ```
   git clone https://yourrepositoryurl.git
   cd your-repo-directory
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your `wrangler.toml` file with your Cloudflare account details and settings. Ensure your Slack Webhook URL is set correctly in the `[vars]` section.

4. Set up your `config.json` file according to your monitoring needs. Define the accounts, chains, and thresholds as required.

### Deployment

1. Log in to your Cloudflare account using Wrangler:
   ```
   wrangler login
   ```

2. Publish the worker:
   ```
   wrangler publish
   ```

The worker is now deployed and will run according to the schedule defined in `wrangler.toml`.

### Monitoring

The worker operates automatically according to the defined schedule. Alerts will be sent to the configured Slack channel whenever an account's balance or RAM usage crosses the set thresholds.

## Configuration

Refer to the `config.json` file for configuring the accounts, chains, and threshold values. The structure is as follows:

```json
{
  "accounts": [
    {
      "name": "account_name",
      "chain": "EOS",
      "thresholdBalance": 10,
      "thresholdRAM": 120
    }
  ],
}
```