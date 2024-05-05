import { Suspense } from "react";
import { Container, Loader2 } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ChartComponent from "@/components/ChartComponent";

import { getPullData } from "@/actions/getPullData";
import { getHubData } from "@/actions/getHubData";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 0;

export default async function Home() {

  const hubData = await getHubData();
  const pullData = await getPullData();

  const pullsChartParams = {
    chartName: "Total pulls",
    chartValue: pullData[0],
    primarySeries: {
      tooltipText: "Accumulated",
      data: pullData[1]
    },
    secondarySeries: {
      tooltipText: "Unique",
      data: pullData[2]
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-screen-lg p-4 flex-row">

        <div className="flex flex-col sm:flex-row justify-center">

          <Card>
            <CardHeader>
              <CardTitle>{process.env.APP_NAME}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3">
                <div className="col-span-2">User:</div>
                <div>{hubData.user}</div>
                <div className="col-span-2">Pulls:</div>
                <div>{hubData.pullCount}</div>
                <div className="col-span-2">Stars:</div>
                <div>{hubData.starCount}</div>
                <div className="col-span-2">Last updated:</div>
                <div>{hubData.lastUpdated.toLocaleDateString()}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`https://hub.docker.com/repository/docker/${hubData.user}/${hubData.name}`}>
                <Button>
                  <Container width={16} height={16} className="mr-4" />
                  Go to Docker hub
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <div className="flex flex-row p-2 justify-center">
            <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin" />}>
              <ChartComponent params={pullsChartParams} />
            </Suspense>
          </div>

        </div>

      </div>
    </div>
  );


}
