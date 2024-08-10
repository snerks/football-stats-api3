import * as Chart from "chart.js";
import { BarController, BarElement, LinearScale, TimeScale, Tooltip, CategoryScale, LineController, PointElement, LineElement } from "chart.js";
import { ReactChart } from "chartjs-react";
import * as React from "react";
// import internal from "stream";
import { Event } from "../models/football-scores-match-list";

ReactChart.register(
  BarController,
  LinearScale,
  BarElement,
  TimeScale,
  Tooltip,
  CategoryScale,
  LineController,
  PointElement,
  LineElement);

interface PointsLineChartProps {
  minimumYear: number;
  maximumYear: number;

  pointsPerYear: PointsPerYear;

  eventsPerYear?: EventsPerYear;
}

type ShowYears = {
  [year: number]: boolean;
}

export type PointsPerYear = {
  [year: number]: number[];
}

export type EventsPerYear = {
  [year: number]: Event[];
}

interface PointsLineChartState {
  showTrendLines: boolean;

  showAllDataPoints: boolean;

  showYears: ShowYears;
}

const defaultState: PointsLineChartState = {
  showTrendLines: false,
  showAllDataPoints: true,

  showYears: {
    // 2016: false,
    // 2017: false,
    2018: false,
    2019: false,
    2020: false,
    2021: false,
    2022: false,
    2023: true,
    2024: true
  }
}

class PointsLineChart extends React.Component<
  PointsLineChartProps,
  PointsLineChartState
> {

  constructor(props = {
    minimumYear: 2019, // 2017,
    maximumYear: 2024, // 2022,
    pointsPerYear: {
      // 2016: [],
      // 2017: [],
      // 2018: [],
      2019: [],
      2020: [],
      2021: [],
      2022: [],
      2023: [],
      2024: []
    },
    eventsPerYear: {
      // 2016: [],
      // 2017: [],
      // 2018: [],
      2019: [],
      2020: [],
      2021: [],
      2022: [],
      2023: [],
      2024: []
    }
  }) {
    super(props);
    this.state = defaultState;
  }

  handleShowTrendLines = () => {
    this.setState(prevState => {
      const nextState = { ...prevState };
      nextState.showTrendLines = !prevState.showTrendLines;
      nextState.showYears = { ...prevState.showYears };

      console.warn("handleShowTrendLines");
      console.warn(JSON.stringify(nextState));

      return nextState;
    });
  };

  handleShowAllDataPoints = () => {
    this.setState(prevState => {
      const nextState = { ...prevState };
      nextState.showAllDataPoints = !prevState.showAllDataPoints;
      nextState.showYears = { ...prevState.showYears };

      console.warn("showAllDataPoints");
      console.warn(JSON.stringify(nextState));

      return nextState;
    });
  };

  handleShowYear = (year: number) => {
    this.setState(prevState => {
      const nextState = { ...prevState };
      nextState.showYears = { ...prevState.showYears };
      nextState.showYears[year] = !prevState.showYears[year];

      console.warn("handleShowYear : " + year);
      console.warn(JSON.stringify(nextState));

      return nextState;
    });
  };

  render() {
    const redRgba = "255, 0, 0";
    const redLineColour = `rgba(${redRgba}, 1)`;
    const redLegendFillColour = `rgba(${redRgba}, 0.4)`;

    // 128, 0, 128
    const purpleRgba = "85, 85, 85";
    const purpleLineColour = `rgba(${purpleRgba}, 1)`;
    const purpleLegendFillColour = `rgba(${purpleRgba}, 0.4)`;

    const slateBlueRgba = "0, 100, 0";
    const slateBlueLineColour = `rgba(${slateBlueRgba}, 1)`;
    const slateBlueLegendFillColour = `rgba(${slateBlueRgba}, 0.4)`;

    const greyRgba = "220, 220, 220";
    const greyLineColour = `rgba(${greyRgba}, 1)`;
    // const greyLegendFillColour = `rgba(${greyRgba}, 0.4)`;

    // 2016 - Alice Blue
    const aliceBlueRgba = "0, 0, 255";
    const aliceBlueLineColour = `rgba(${aliceBlueRgba}, 1)`;
    const aliceBlueLegendFillColour = `rgba(${aliceBlueRgba}, 0.4)`;

    const greenRgba = "75, 192, 192";
    const greenLineColour = `rgba(${greenRgba}, 1)`;
    const greenLegendFillColour = `rgba(${greenRgba}, 0.4)`;

    const orangeRgba = "255, 165, 0";
    const orangeLineColour = `rgba(${orangeRgba}, 1)`;
    const orangeLegendFillColour = `rgba(${orangeRgba}, 0.4)`;

    const defaultChartDataSet: Chart.ChartDataset = {
      // label: "2016-",
      fill: false,

      // LineChart
      // lineTension: 0.1,

      // backgroundColor: aliceBlueLegendFillColour,
      // borderColor: aliceBlueLineColour,

      borderCapStyle: "butt",
      borderDash: [3, 3],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",

      borderWidth: 3,

      // pointBorderColor: aliceBlueLineColour,

      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,

      // pointHoverBackgroundColor: aliceBlueLineColour,

      pointHoverBorderColor: greyLineColour,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      // data: pointsRunningTotalsPerYear[2016]
      data: []
    }

    const pointsRunningTotalsPerYear: PointsPerYear = {
      // 2016: [],
      // 2017: [],
      // 2018: [],
      2019: [],
      2020: [],
      2021: [],
      2022: [],
      2023: [],
      2024: []
    }

    const pointsPerYear: PointsPerYear = this.props.pointsPerYear;

    for (const year in pointsRunningTotalsPerYear) {
      if (Object.prototype.hasOwnProperty.call(pointsRunningTotalsPerYear, year)) {
        const yearElement = pointsRunningTotalsPerYear[year];

        if (pointsPerYear[year]) {
          for (let index = 0; index < pointsPerYear[year].length; index++) {
            const runningTotal = index === 0 ? 0 : yearElement[index - 1];

            const nextElement = runningTotal + pointsPerYear[year][index];

            yearElement.push(nextElement);
          }
        }
      }
    }

    const dataPointCount =
      this.state.showAllDataPoints ?
        Math.max(
          // pointsPerYear[2016]?.length || 0,
          // pointsPerYear[2017]?.length || 0,
          // pointsPerYear[2018]?.length || 0,
          pointsPerYear[2019]?.length || 0,
          pointsPerYear[2020]?.length || 0,
          pointsPerYear[2021]?.length || 0,
          pointsPerYear[2022]?.length || 0,
          pointsPerYear[2023]?.length || 0,
          pointsPerYear[2024]?.length || 0,
        ) :
        // Math.max((pointsPerYear[2022]?.length || 0) + 10, 12);
        Math.max((pointsPerYear[2024]?.length || 0) + 10, 12);

    const labels: string[] = [];

    for (let index = 0; index < dataPointCount; index++) {
      const gameNumber = index;

      const element =
        (gameNumber % 5 === 0 ||
          gameNumber === 1 ||
          gameNumber === 23 ||
          gameNumber === 46) &&
          gameNumber !== 45
          ? gameNumber.toString(10)
          : "";

      labels.push(element);
    }

    const chartData: Chart.ChartData = {
      labels: labels,

      datasets: []
    };

    const getPointAndEventsPerYear = (year: number, pointsPerYear: number[]) => {
      const pointsAndEventsPerYear = pointsPerYear.map((value, index) => {
        const resultAny: any = {
          x: index + 1,
          y: value,
        };

        resultAny.event = this.props.eventsPerYear ? this.props.eventsPerYear[year][index] : null;

        const result: Chart.Point = resultAny as Chart.Point;

        return result;
      });

      return pointsAndEventsPerYear;
    }

    // if (this.state.showYears[2017]) {
    //   if (chartData.datasets) {
    //     chartData.datasets.push({
    //       ...defaultChartDataSet,
    //       label: "2017-",
    //       backgroundColor: aliceBlueLegendFillColour,
    //       borderColor: aliceBlueLineColour,
    //       pointBorderColor: aliceBlueLineColour,
    //       pointHoverBackgroundColor: aliceBlueLineColour,
    //       data: getPointAndEventsPerYear(2017, pointsRunningTotalsPerYear[2017].slice(0, dataPointCount)),
    //     });
    //   }
    // }

    if (this.state.showYears[2019]) {
      if (chartData.datasets) {
        chartData.datasets.push({
          ...defaultChartDataSet,
          label: "2019-",
          backgroundColor: purpleLegendFillColour,
          borderColor: purpleLineColour,
          pointBorderColor: purpleLineColour,
          pointHoverBackgroundColor: purpleLineColour,
          data: getPointAndEventsPerYear(2019, pointsRunningTotalsPerYear[2019].slice(0, dataPointCount)),
        });
      }
    }

    if (this.state.showYears[2020]) {
      if (chartData.datasets) {
        chartData.datasets.push({
          ...defaultChartDataSet,
          label: "2020-",
          backgroundColor: slateBlueLegendFillColour,
          borderColor: slateBlueLineColour,
          pointBorderColor: slateBlueLineColour,
          pointHoverBackgroundColor: slateBlueLineColour,
          data: getPointAndEventsPerYear(2020, pointsRunningTotalsPerYear[2020].slice(0, dataPointCount)),
        });
      }
    }

    if (this.state.showYears[2021]) {
      if (chartData.datasets) {
        chartData.datasets.push({
          ...defaultChartDataSet,
          label: "2021-",
          backgroundColor: slateBlueLegendFillColour,
          borderColor: slateBlueLineColour,
          pointBorderColor: slateBlueLineColour,
          pointHoverBackgroundColor: slateBlueLineColour,
          borderDash: [],
          data: getPointAndEventsPerYear(2021, pointsRunningTotalsPerYear[2021].slice(0, dataPointCount)),
        });
      }
    }

    if (this.state.showYears[2022]) {
      if (chartData.datasets) {
        chartData.datasets.push({
          ...defaultChartDataSet,
          label: "2022-",
          backgroundColor: purpleLegendFillColour,
          borderColor: purpleLineColour,
          pointBorderColor: purpleLineColour,
          pointHoverBackgroundColor: purpleLineColour,
          borderDash: [],
          data: getPointAndEventsPerYear(2022, pointsRunningTotalsPerYear[2022].slice(0, dataPointCount)),
        });
      }
    }

    // if (this.state.showYears[2021]) {
    //   if (chartData.datasets) {
    //     chartData.datasets.push({
    //       ...defaultChartDataSet,
    //       label: "2021-",
    //       backgroundColor: redLegendFillColour,
    //       borderColor: redLineColour,
    //       pointBorderColor: redLineColour,
    //       pointHoverBackgroundColor: redLineColour,
    //       borderDash: [],
    //       // data: pointsRunningTotalsPerYear[2021].slice(0, dataPointCount),

    //       data: getPointAndEventsPerYear(2021, pointsRunningTotalsPerYear[2021].slice(0, dataPointCount)),

    //       borderWidth: 4
    //     });
    //   }
    // }

    // if (this.state.showYears[2022]) {
    //   if (chartData.datasets) {
    //     chartData.datasets.push({
    //       ...defaultChartDataSet,
    //       label: "2022-",
    //       backgroundColor: redLegendFillColour,
    //       borderColor: redLineColour,
    //       pointBorderColor: redLineColour,
    //       pointHoverBackgroundColor: redLineColour,
    //       borderDash: [],
    //       // data: pointsRunningTotalsPerYear[2021].slice(0, dataPointCount),

    //       data: getPointAndEventsPerYear(2022, pointsRunningTotalsPerYear[2022].slice(0, dataPointCount)),

    //       borderWidth: 4
    //     });
    //   }
    // }

    // if (this.state.showYears[2022]) {
    //   if (chartData.datasets) {
    //     chartData.datasets.push({
    //       ...defaultChartDataSet,
    //       label: "2022-",
    //       backgroundColor: aliceBlueLegendFillColour,
    //       borderColor: aliceBlueLineColour,
    //       pointBorderColor: aliceBlueLineColour,
    //       pointHoverBackgroundColor: aliceBlueLineColour,
    //       data: getPointAndEventsPerYear(2022, pointsRunningTotalsPerYear[2022].slice(0, dataPointCount)),
    //     });
    //   }
    // }

    if (this.state.showYears[2023]) {
      if (chartData.datasets) {
        chartData.datasets.push({
          ...defaultChartDataSet,
          label: "2023-",
          backgroundColor: aliceBlueLegendFillColour,
          borderColor: aliceBlueLineColour,
          pointBorderColor: aliceBlueLineColour,
          pointHoverBackgroundColor: aliceBlueLineColour,
          data: getPointAndEventsPerYear(2023, pointsRunningTotalsPerYear[2023].slice(0, dataPointCount)),
        });
      }
    }

    // if (this.state.showYears[2023]) {
    //   if (chartData.datasets) {
    //     chartData.datasets.push({
    //       ...defaultChartDataSet,
    //       label: "2023-",
    //       backgroundColor: redLegendFillColour,
    //       borderColor: redLineColour,
    //       pointBorderColor: redLineColour,
    //       pointHoverBackgroundColor: redLineColour,
    //       borderDash: [],

    //       data: getPointAndEventsPerYear(2023, pointsRunningTotalsPerYear[2023].slice(0, dataPointCount)),

    //       borderWidth: 4
    //     });
    //   }
    // }

    if (this.state.showYears[2024]) {
      if (chartData.datasets) {
        chartData.datasets.push({
          ...defaultChartDataSet,
          label: "2024-",
          backgroundColor: redLegendFillColour,
          borderColor: redLineColour,
          pointBorderColor: redLineColour,
          pointHoverBackgroundColor: redLineColour,
          borderDash: [],

          data: getPointAndEventsPerYear(2024, pointsRunningTotalsPerYear[2024].slice(0, dataPointCount)),

          borderWidth: 4
        });
      }
    }

    if (this.state.showTrendLines) {
      const playoffFormValues: number[] = [];

      for (let index = 0; index < dataPointCount; index++) {
        // const element = (index + 1) * 1.7;
        const element = index * 1.61;
        playoffFormValues.push(element);
      }

      const relegationFormValues: number[] = [];

      for (let index = 0; index < dataPointCount; index++) {
        const element = index * 1.0;
        relegationFormValues.push(element);
      }

      if (chartData.datasets) {
        chartData.datasets.push({
          ...defaultChartDataSet,
          label: "Playoffs",
          backgroundColor: greenLegendFillColour,
          borderColor: greenLineColour,
          pointBorderColor: greenLineColour,
          pointHoverBackgroundColor: greenLineColour,
          borderDash: [5, 15],
          data: playoffFormValues,
        });

        chartData.datasets.push({
          ...defaultChartDataSet,
          label: "Relegation",
          backgroundColor: orangeLegendFillColour,
          borderColor: orangeLineColour,
          pointBorderColor: orangeLineColour,
          pointHoverBackgroundColor: orangeLineColour,
          borderDash: [5, 15],
          data: relegationFormValues
        });
      }
    }

    const isObject = (objValue: any) => {
      return objValue && typeof objValue === 'object' && objValue.constructor === Object;
    }

    const chartOptions: Chart.ChartOptions = {
      // responsive: true,
      maintainAspectRatio: false,
      // scales: {
      //   x: {

      //   },
      //   yAxis: {
      //     type: "linear",
      //   }
      // }
      // ,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              var label = (context.dataset as any).label || '';
              // var label = context.label || '';

              if (context.dataIndex === 0) {
                return "";
              }

              if (isObject(context.raw)) {
                if (label) {
                  label += `: ${context.raw.y === 1 ? context.raw.y + " pt" : context.raw.y + " pts"}`;
                }

                if (label) {
                  // label += ` : ${JSON.stringify(context.raw.event, null, 2)}`;

                  const event = (context.raw.event as Event);
                  const progressStatus = event?.eventProgress?.status;
                  const showScoreStatuses = ["RESULT", "LIVE"];

                  if (showScoreStatuses.includes(progressStatus)) {
                    label += ` : ${event.homeTeam.name.full} ${event.homeTeam.scores.score} - ${event.awayTeam.scores.score} ${event.awayTeam.name.full}`;
                  }

                  if (event?.eventProgress?.status === "LIVE") {
                    label += ` : ${event.eventProgress.status} (${event.minutesElapsed}'${event.minutesIntoAddedTime ? " +" + event.minutesIntoAddedTime : ""})`;
                  }
                }
              } else {
                if (label) {
                  label += `: ${context.raw}`;
                }
              }

              // if (context.parsed.y !== null) {
              //     label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
              // }

              return label;
            }
          }
        }
        // tooltip: chartTooltipCallback
      }
    };

    return (
      <div style={{ position: "relative", height: "80vh" }}>
        <div
          className="custom-control custom-checkbox"
          style={{ margin: "10px 30px 5px 25px" }}
        >
          <label className="custom-control-label">Show: </label>{" "}
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
            onChange={() => this.handleShowTrendLines()}
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Trend Lines
          </label>

          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck2"
            onChange={() => this.handleShowAllDataPoints()}
            checked={this.state.showAllDataPoints}
          />
          <label className="custom-control-label" htmlFor="customCheck2">
            All Points
          </label>

          {/* <pre>
            {JSON.stringify(this.state, null, 2)}
          </pre> */}

          {/* {
            Object.keys(this.state.showYears).map(i =>
            (!isNaN(+i) &&
              <div key={+i} style={{ display: "inline" }}>
                <h3>{i} : {(this.state.showYears as any)[i]}</h3>
              </div>
            ))
          } */}

          {
            Object.keys(pointsRunningTotalsPerYear).map(i =>
            (!isNaN(+i) &&
              <div key={+i} style={{ display: "inline" }}>
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`show${i}Checkbox`}
                  onChange={() => this.handleShowYear(+i)}
                  style={{ marginLeft: "10px" }}
                  checked={(this.state.showYears as any)[i]} />
                <label className="custom-control-label" htmlFor={`show${i}Checkbox`}>
                  {i}-
                </label>
              </div>
            ))
          }
        </div>

        <ReactChart
          type="line"
          data={chartData}
          options={chartOptions}
        />

        {false &&
          <pre>{JSON.stringify(chartData, null, 2)}</pre>
        }
      </div>
    );
  }
}

export default PointsLineChart;
