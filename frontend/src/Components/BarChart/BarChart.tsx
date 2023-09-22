import { ChartistBarChart } from 'preact-chartist';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import chartStyles from './BarChart.css?inline';
import classes from './BarChart.module.css';
import { useDeepCompareMemoize } from '../../helpers/helpers';
import { getChartVoteData } from './getChartVoteData';

export const BarChart = connectToWebSocket(({ socket }) => {
  const { data, high } = useDeepCompareMemoize(getChartVoteData(socket.state));

  return (
    <>
      <style>{chartStyles}</style>
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
