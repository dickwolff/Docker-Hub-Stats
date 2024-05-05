import moment from "moment";
import prismadb from "@/lib/prismadb";
import { PullData } from "@prisma/client";

export async function getPullData(): Promise<[number, { [key: string]: number }, { [key: string]: number }]> {

    const pullData = await prismadb.pullData.findMany({ orderBy: { date: 'asc' } });

    const totalPullCount = pullData.length === 0 ? 0 : pullData[pullData.length - 1].pullsTotal;
    const pullsAccumulated = getAccumulatedPulls(pullData);
    const pullsUnique = getUniquePulls(pullData);

    return [totalPullCount, pullsAccumulated, pullsUnique]
}

function getAccumulatedPulls(pullData: PullData[]) {
    const pullsAccumulatedDict: { [key: string]: number; } = {};

    pullData.forEach((element) => {
        const dictKey = moment(element.date).format("YYYY-MM-DD");
        pullsAccumulatedDict[dictKey] = element.pullsTotal;
    });

    const pullsAccumulated = summarizeByDay(pullsAccumulatedDict);
    return pullsAccumulated;
}

function getUniquePulls(pullData: PullData[]) {
    const pullsUniqueDict: { [key: string]: number; } = {};

    pullData.forEach((element) => {
        const dictKey = moment(element.date).format("YYYY-MM-DD");
        pullsUniqueDict[dictKey] = element.pullsToday;
    });

    const pullsUnique = summarizeByDay(pullsUniqueDict);
    return pullsUnique;
}

function summarizeByDay(pullsByDate: { [key: string]: number } = {}) {
    const pullsByDateGapsFilled = fillDataGaps(pullsByDate);

    for (let key in pullsByDateGapsFilled) {
        const value = pullsByDateGapsFilled[key];
        pullsByDateGapsFilled[key] = value;
    }

    return pullsByDateGapsFilled;
}

function fillDataGaps(data: { [key: string]: number } = {}) {

    // Get the keys as categories.
    let categories = Object.keys(data) || [];

    // Generate up to 7 days as categories, if there isn't 7 days of data.
    for (let day = 6; day >= 0; day--) {
        const date = moment().subtract(day, 'days').format("YYYY-MM-DD");
        if (!categories.includes(date)) {
            categories.push(date);
        }
    }
    categories = categories.sort();

    // Fill gaps for dates without values.
    Object.values(categories).forEach(date => {
        if (!(date in data)) {
            data[date] = 0;
        }
    });

    // Sort by date asc.
    data = Object.keys(data).sort().reduce(
        (obj: any, key) => {
            obj[key] = data[key];
            return obj;
        },
        {});

    return data;
}
