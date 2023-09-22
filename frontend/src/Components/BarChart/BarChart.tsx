import { ChartistBarChart } from 'preact-chartist';
import { useDeepCompareMemoize } from '../../helpers/helpers';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import './BarChart.css';
import './chartist.css';
import classes from './BarChart.module.css';
import { getChartVoteData } from './getChartVoteData';

export const BarChart = connectToWebSocket(({ socket }) => {
  const { data, high } = useDeepCompareMemoize(getChartVoteData(socket.state));

  return (
    <>
      <ChartistBarChart
        data={data}
        options={{
          low: 0,
          high,
          axisY: { onlyInteger: true },
          chartPadding: 16,
        }}
        className={classes.chart}
      />
    </>
  );
});
