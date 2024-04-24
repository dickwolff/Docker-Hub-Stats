import prismadb from '@/lib/prismadb';
import moment from 'moment';
import "moment/locale/nl";
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
    const dockerResponse = await fetch("https://hub.docker.com/v2/repositories/dickwolff/export-to-ghostfolio", { cache: "no-cache" });
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
        pullsTotal: dockerData.pull_count
    }

    // Add entry to database.
    await prismadb.pullData.create({
        data: newData
    });

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });
    await bot.sendMessage(process
        .env.TELEGRAM_BOT_CHAT_ID!,
        `${moment().format("dddd D MMMM YYYY")}\n\nVandaag: ${newData.pullsToday}\nTotaal: ${newData.pullsTotal}\n\n[Ga naar statistieken](https://export-to-ghostfolio-stats.vercel.app)`,
        { parse_mode: 'MarkdownV2', disable_web_page_preview: true });

    // Return 200 with new pull data.
    return Response.json({ success: true, data: newData });
}