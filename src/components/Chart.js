import React from 'react';
import styled from 'styled-components';
import Loader from 'components/Loader';
import { Chart as GChart } from "react-google-charts";
import { getFormatFromGranularity, toGoogleChartsDateFormat } from 'utils/FormatUtils';

const Wrapper = styled.div`
    height: 400px;
    display: flex;
    align-items: center;
    margin: 20px 0;
`;

const NoData = styled.div`

`;

function typeToChartFormat (type) {
    switch (type) {
        case 'number': return 'short';
        default: return type;
    }
}

function buildChartData (activeStats, data) {
    if (data.length === 0) return null;

    // Merge packed stats together
    const packedData = data.map(sd => sd.packedData);
    const merged = [];
    for (let i = 0; i < packedData[0].length; i++) {
        merged.push([
            packedData[0][i].timestamp.toDate(),
            ...packedData.map(d => d[i].value)
        ]);
    }

    return [
        ["Date", ...activeStats.map(s => s.name)],
        ...merged
    ];
}

function Chart ({ query, activeStats, data }) {
    const axisTypes = Array.from(new Set(activeStats.map(s => s.type)));
    const vAxes = axisTypes.map(type => ({ format:typeToChartFormat(type) }));
    const series = activeStats.map(s => ({ targetAxisIndex: axisTypes.indexOf(s.type) }));

    const options = {
        legend: "none",
        backgroundColor: "none",
        chartArea: {
            left: 80,
            top: 40,
            right: 80,
            bottom: 40
        },
        hAxis: {
            textStyle: {
                color: "#7c8a98"
            },
            gridlines: {
                color: "none"
            },
            format: toGoogleChartsDateFormat(getFormatFromGranularity(query.granularity))
        },
        series,
        vAxes,
        vAxis: {
            textStyle: {
                color: "#7c8a98"
            },
            gridlines: {
                color: "#303d4d"
            },
            minorGridlines: {
                color: "#303d4d"
            },
            format: 'percent'
        },
        axisTitlesPosition: "none",
        colors: activeStats.map(s => s.color)
    };
    console.log(options);

    const chartData = data != null ? buildChartData(activeStats, data) : null;
    console.log(chartData);

    return (
        <Wrapper>
            <Loader loading={data == null}>
                { (data != null && data.length > 0) ? <GChart
                    chartType="LineChart"
                    data={chartData}
                    width="100%"
                    height="400px"
                    options={options}
                /> : <NoData>No Data</NoData> }
            </Loader>
        </Wrapper>
    );
}

export default Chart;