import ChartComponent from "@/components/ChartComponent";
import prismadb from "@/lib/prismadb";
import moment from "moment";

export default async function Home() {

  const pullData = await prismadb.pullData.findMany();

  const totalPullCount = pullData.length === 0 ? 0 : pullData[pullData.length - 1].pullsTotal;

  const pullsAccumulatedDict: { [key: string]: number } = {}
  pullData.forEach((element) => {
    const dictKey = moment(element.date).format("YYYY-MM-DD");
    pullsAccumulatedDict[dictKey] = element.pullsTotal;
  });
  const pullsAccumulated = summarizePullsByDay(pullsAccumulatedDict);

  
  const pullsUniqueDict: { [key: string]: number } = {}
  pullData.forEach((element) => {
    const dictKey = moment(element.date).format("YYYY-MM-DD");
    pullsUniqueDict[dictKey] = element.pullsToday;
  });
  const pullsUnique = summarizePullsByDay(pullsUniqueDict);


  const pullsChartParams = {
    chartName: "Total pulls",
    chartValue: totalPullCount,
    primarySeries: {
      tooltipText: "Until today",
      data: pullsAccumulated
    },
    secondarySeries: {
      tooltipText: "Unique",
      data: pullsUnique
    }
  };


  return (
    <div className="w-full flex justify-center">
      <div className="max-w-screen-lg p-4">
        <h1 className="text-2xl pb-4 overflow-hidden text-ellipsis">Analytics</h1>

        <div className="w-full flex flex-col sm:flex-row">
          <div className="w-full flex flex-row sm:max-w-lg p-2 justify-center">
            <ChartComponent params={pullsChartParams} />
          </div>
        </div>
      </div>
    </div>
  );

  function summarizePullsByDay(pullsByDate: any) {

    const pullsByDateGapsFilled = fillDataGaps(pullsByDate);

    // Do some data processing: count the pulls.   
    for (let key in pullsByDateGapsFilled) {
      const value = pullsByDateGapsFilled[key];
      pullsByDateGapsFilled[key] = parseFloat(value);
    }
    return pullsByDateGapsFilled;
  }


  function fillDataGaps(data: any) {

    // Generate 7 day categories, from 6 days ago until now.
    let categories: string[] = [];
    for (let day = 6; day >= 0; day--) {
      const date = moment().subtract(day, 'days');
      categories.push(date.format("YYYY-MM-DD"));
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
