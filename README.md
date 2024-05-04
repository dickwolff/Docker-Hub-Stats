# Docker Pull Stats

[![Github-sponsors](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA)](https://github.com/sponsors/dickwolff) &nbsp;
[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/dickw0lff)

A simple webapp that pulls statistics from Docker Hub every night.

## Tech stack

- [Next.js](https://nextjs.org/) for the webapp/api
- [Vercel](https://vercel.com/) for hosting the app and the PostgreSQL database

## How to deploy

### One click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdickwolff%2FDocker-Pull-Stats&env=CRON_SECRET,DOCKER_ENDPOINT,APP_NAME&project-name=docker-pull-stats)

### Manual deployment

1. Fork this repository.
2. Go to Vercel and click on 'Add new project' and import the repository from Git
3. Enter the ENV variables listed in the table below
4. After creating your project, go to 'Storage' and click 'Create Database' (use Postgres). 

### Variables
| Variable | Description | Required (y/n) |
| -------- | ----------- | -------------- |
| APP_NAME | Your app name | Yes            |
| DOCKER_ENDPOINT | Docker Hub API endpoint, eg. `https://hub.docker.com/v2/repositories/dickwolff/export-to-ghostfolio` | Yes |
| CRON_SECRET | Enter a secret of your own, used to safely run the CRON job | Yes |
| TELEGRAM_BOT_TOKEN | Telegram Bot token, if you want nighly updates in Telegram | No |
| TELEGRAM_BOT_CHAT_ID | Telegram chat id, if you want nighly updates in Telegram | No |
