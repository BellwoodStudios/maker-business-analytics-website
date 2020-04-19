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

function Chart ({ query, data }) {
    const options = {
        legend: "none",
        backgroundColor: "none",
        chartArea: {
            left: 80,
            top: 40,
            right: 40,
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
            format: query.type === "Global" ? "decimal" : 'percent'
        },
        axisTitlesPosition: "none",
        colors: query.stats.map(s => s.color)
    };

    return (
        <Wrapper>
            <Loader loading={data == null || data.length === 0}>
                { (data != null && data.length > 0) ? <GChart
                    chartType="LineChart"
                    data={[["Date", query.type === "Global" ? "Vaults Created" : "Stability Fee"], ...data[0].packedData.map(s => [s.timestamp.toDate(), s.value])]}
                    width="100%"
                    height="400px"
                    options={options}
                /> : null }
            </Loader>
        </Wrapper>
    );
}

export default Chart;