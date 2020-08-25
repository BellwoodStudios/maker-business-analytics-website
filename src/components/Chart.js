import React from 'react';
import styled from 'styled-components';
import Loader from 'components/Loader';
import { Chart as GChart } from "react-google-charts";
import { getFormatFromGranularity, toGoogleChartsDateFormat } from 'utils/FormatUtils';
import { StatFormats } from 'api/model';
import { useWindowWidth } from '@react-hook/window-size';
import { toDataArray } from 'utils';

const Wrapper = styled.div`
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
`;

const NoData = styled.div`

`;

const Error = styled.div`
    color: #F44336;
`;

function toChartFormat (format) {
    switch (format) {
        case StatFormats.NUMBER: return 'short';
        case StatFormats.PERCENT: return 'percent';
        case StatFormats.DOLLARS: return 'short';
        case StatFormats.DAI: return 'short';
        default: return format;
    }
}

function Chart ({ query, activeStats, data, error }) {
    // Trim off any stats that have no data
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            if (!data[i].packedData.some(d => d.value != null)) {
                // Axe this data
                activeStats = activeStats.filter((s, idx) => idx !== i);
                data = data.filter((d, idx) => idx !== i);
                i--;
            }
        }
    }

    // Want to refresh the chart both when the window width changes or the width of the content changes
    // The content change is important for when the vault sub-menu appears
    // It's a bit hacky, but it works
    const content = document.querySelector("#content");
    const windowWidth = useWindowWidth() + (content != null ? content.clientWidth : 0);

    const axisGroups = Array.from(new Set(activeStats.map(s => ({ format:s.format, group:s.group }))));
    const vAxes = axisGroups.map((g, i) => ({ format:toChartFormat(g.format), textPosition: i >= 2 ? 'none' : 'out' }));
    const series = activeStats.map(s => ({ targetAxisIndex: axisGroups.findIndex(g => g.group === s.group) }));

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
                color: "transparent"
            },
            minorGridlines: {
                color: "transparent"
            },
            format: 'percent'
        },
        axisTitlesPosition: "none",
        colors: activeStats.map(s => s.color)
    };

    const chartData = data != null ? toDataArray(activeStats, data) : null;

    return (
        <Wrapper>
            <Loader loading={data == null && error == null}>
                { (data != null && data.length > 0) ? <GChart
                    // Force a redraw on window resize to fix a sizing issue
                    key={windowWidth}
                    chartType="LineChart"
                    data={chartData}
                    width="100%"
                    height="400px"
                    options={options}
                /> : (error != null ? <Error>{error.toString()}</Error> : <NoData>No Data</NoData>) }
            </Loader>
        </Wrapper>
    );
}

export default Chart;