import { Suspense } from "react";
import { Container, Loader2 } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ChartComponent from "@/components/ChartComponent";

import { getPullData } from "@/actions/getPullData";
import { getHubData } from "@/actions/getHubData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/togglemode";
import { Menu } from "@/components/menu";
// import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";


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
    <div className="w-full flex justify-center flex-col">

      <header className="flex w-full">
        <div className="container flex h-20 max-w-screen-xl items-center frow">
          <Link href="/" className="space-x-2 flex text-xl">
            {process.env.APP_NAME}
          </Link>
          <Menu />
        </div>
      </header>

      <div className="w-full p-4 flex-row">

        <div className="container flex flex-col sm:flex-row justify-center items-start max-w-screen-xl gap-2">

          <Card className="mb-4 w-full md:w-1/2 lg:w-1/3">
            <CardContent className="mt-6">
              <div className="grid grid-cols-4">
                <div className="col-span-2 md:col-span-3">User:</div>
                <div>{hubData.user}</div>
                <div className="col-span-2 md:col-span-3">Pulls:</div>
                <div>{hubData.pullCount}</div>
                <div className="col-span-2 md:col-span-3">Stars:</div>
                <div>{hubData.starCount}</div>
                <div className="col-span-2 md:col-span-3">Last updated:</div>
                <div>{hubData.lastUpdated.toLocaleDateString()}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`https://hub.docker.com/repository/docker/${hubData.user}/${hubData.name}`} target="_blank">
                <Button>
                  <Container width={16} height={16} className="mr-3" />
                  Go to Docker hub
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <div className="flex flex-row p-2 justify-center w-full md:w-1/2 lg:w-2/3 ">
            <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin" />}>
              <ChartComponent params={pullsChartParams} />
            </Suspense>
          </div>

        </div>

      </div>
    </div >
  );


}
