import moment from "moment";
import prismadb from "@/lib/prismadb";
import ChartComponent from "@/components/ChartComponent";

export const revalidate = 0;

export default async function Home() {

  const pullData = await prismadb.pullData.findMany({ orderBy: { date: 'asc' } });
  console.log(`Retrieved ${pullData.length} record(s)`);
  const totalPullCount = pullData.length === 0 ? 0 : pullData[pullData.length - 1].pullsTotal;
  const pullsAccumulated = getAccumulatedPulls();
  const pullsUnique = getUniquePulls();

  const pullsChartParams = {
    chartName: "Total pulls",
    chartValue: totalPullCount,
    primarySeries: {
      tooltipText: "Accumulated",
      data: pullsAccumulated
    },
    secondarySeries: {
      tooltipText: "Unique",
      data: pullsUnique
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-screen-lg p-4 flex-row">

        <div className="flex flex-col sm:flex-row justify-center">
          <div className="block w-full sm:max-w-sm mb-6 sm:mb-none p-6 border border-gray-200">
            <h1 className="text-2xl pb-4 overflow-hidden text-ellipsis">{process.env.APP_NAME}</h1>

            <div className="grid grid-cols-3 mt-4">
              <div className="col-span-2">Stars:</div>
              <div>1</div>
            </div>

          </div>

          <div className="flex flex-row p-2 justify-center">
            <ChartComponent params={pullsChartParams} />
          </div>
        </div>

      </div>
    </div>
  );

  function getAccumulatedPulls() {
    const pullsAccumulatedDict: { [key: string]: number; } = {};

    pullData.forEach((element) => {
      const dictKey = moment(element.date).format("YYYY-MM-DD");
      pullsAccumulatedDict[dictKey] = element.pullsTotal;
    });

    const pullsAccumulated = summarizeByDay(pullsAccumulatedDict);
    return pullsAccumulated;
  }

  function getUniquePulls() {
    const pullsUniqueDict: { [key: string]: number; } = {};

    pullData.forEach((element) => {
      const dictKey = moment(element.date).format("YYYY-MM-DD");
      pullsUniqueDict[dictKey] = element.pullsToday;
    });

    const pullsUnique = summarizeByDay(pullsUniqueDict);
    return pullsUnique;
  }

  function summarizeByDay(pullsByDate: { [key: string]: Number } = {}) {
    const pullsByDateGapsFilled = fillDataGaps(pullsByDate);

    for (let key in pullsByDateGapsFilled) {
      const value = pullsByDateGapsFilled[key];
      pullsByDateGapsFilled[key] = value;
    }

    return pullsByDateGapsFilled;
  }

  function fillDataGaps(data: { [key: string]: Number } = {}) {

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
}
