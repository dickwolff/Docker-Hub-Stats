"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartComponentOptions {
    chartName: string;
    chartValue: number;
    primarySeries: {
        tooltipText: string,
        data: { [key: string]: any[] }
    };
    secondarySeries?: {
        tooltipText: string,
        data: { [key: string]: any[] }
    };
}

const ChartComponent = ({ params }: { params: ChartComponentOptions }) => {

    // Retrieve line values.
    const primaryLineValues: any[] = [];
    Object.values(params.primarySeries.data).forEach(element => {
        primaryLineValues.push(element);
    });

    // Calculate total value (for top of chart).
    const totalValues = primaryLineValues.reduce((a, b) => a + b, 0);

    const option: ApexOptions = {
        chart: {
            id: "clicks-7d",
            type: "area",
            height: "100%",
            width: "100%",
            toolbar: {
                show: false
            }
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#1c64f2",
                gradientToColors: ["#1c64f2"]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 4
        },
        grid: {
            show: false,
            strokeDashArray: 4
        },
        xaxis: {
            categories: Object.keys(params.primarySeries.data),
            labels: {
                show: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            show: false,
            labels: {
                formatter(val, _) {
                    return val.toFixed(0);
                },
            }
        },
        legend: {
            show: false
        }
    };

    // Create primary series.
    const series = [{
        name: params.primarySeries.tooltipText,
        data: primaryLineValues
    }];

    // If a secondary series was given, also add that.
    if (params.secondarySeries) {

        const secondaryLineValues: any[] = [];
        Object.values(params.secondarySeries.data).forEach(element => {
            secondaryLineValues.push(element);
        });

        series.push({
            name: params.secondarySeries.tooltipText,
            data: secondaryLineValues
        });
    }

    return (
        <div className="max-w-sm w-full">
            <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin" />}>
                <div>
                    <h5 className="leading-none text-3xl font-bold text-gray-900 pb-2">{params.chartValue}</h5>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">{params.chartName}</p>
                </div>
                <ApexCharts type="area" options={option} series={series} />
            </Suspense>
        </div>
    )
};

export default ChartComponent;