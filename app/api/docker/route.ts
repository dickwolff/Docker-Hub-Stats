import moment from 'moment';
import prismadb from '@/lib/prismadb';
import type { NextRequest } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    // Get the stats from Docker hub.
    const dockerResponse = await fetch(process.env.DOCKER_ENDPOINT!, { cache: "no-cache" });
    const dockerData = await dockerResponse.json();

    // Get the last entry for known pull data (so yesterday).
    const lastEntries = await prismadb.pullData.findMany({
        orderBy: {
            date: 'desc',
        },
        take: 1
    });

    // Get the pull count (or 0 if none present).
    var lastTotalPullCount = lastEntries.length === 0 ? 0 : lastEntries[0].pullsTotal;

    // Add todays pull count.
    const newData = {
        pullsToday: dockerData.pull_count - lastTotalPullCount,
        pullsTotal: dockerData.pull_count,
        date: moment().subtract(1, "day").toDate()
    }

    // Add entry to database.
    await prismadb.pullData.create({
        data: newData
    });

    // Get Telegram bot config. If given, also send the update to Telegram.
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_BOT_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
        const bot = new TelegramBot(telegramBotToken, { polling: false });
        await bot.sendMessage(
            telegramChatId,
            `${moment(newData.date).format("dddd D MMMM YYYY")}\n\Today: ${newData.pullsToday}\nTotal: ${newData.pullsTotal}\n\n[Go to stats](https://export-to-ghostfolio-stats.vercel.app)`,
            { parse_mode: 'MarkdownV2', disable_web_page_preview: true });
    }

    // Return 200 with new pull data.
    return Response.json({ success: true, data: newData });
}
