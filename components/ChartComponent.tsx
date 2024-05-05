"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartComponentOptions {
    chartName: string;
    chartValue: number;
    primarySeries: {
        tooltipText: string,
        data: { [key: string]: Number }
    };
    secondarySeries?: {
        tooltipText: string,
        data: { [key: string]: Number }
    };
}

export default function ChartComponent({ params }: { params: ChartComponentOptions }) {
    const { resolvedTheme } = useTheme();

    const isDarkTheme = resolvedTheme === "dark";
    const lightLineColors = ["#008ffb", "#00e396"];
    const darkLineColors = ["#0a3791", "#0a7041"];

    // Retrieve line values.
    const primaryLineValues: any[] = [];
    Object.values(params.primarySeries.data).forEach(element => {
        primaryLineValues.push(element);
    });

    const option: ApexOptions = {
        chart: {
            id: "pulls-7d",
            type: "area",
            height: "100%",
            width: "100%",
            toolbar: {
                show: false
            },
            background: isDarkTheme ? "#020817" : "#fff"
        },
        colors: isDarkTheme ? darkLineColors : lightLineColors,
        tooltip: {
            enabled: true,
            x: {
                show: false
            },
            theme: "dark"
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: isDarkTheme ? "#0a3791" : "008ffb",
                gradientToColors: [isDarkTheme ? "#0a3791" : "008ffb"]
            }
        },
        dataLabels: {
            enabled: false,
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
                    return val.toFixed(0)
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
        <div className="w-full">
            <div>
                <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-slate-200 pb-2">{params.chartValue}</h5>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">{params.chartName}</p>
            </div>
            <ApexCharts type="area" options={option} series={series} />
        </div>
    )
};
