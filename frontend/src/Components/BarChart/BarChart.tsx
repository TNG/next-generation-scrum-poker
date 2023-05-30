import {
  Chart,
  ChartOptions,
  Legend,
  BarController,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { useDeepCompareMemoize } from '../../helpers/helpers';
import { ColorMode } from '../ColorModeProvider/ColorModeProvider';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import { getChartVoteData } from './getChartVoteData';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Legend, Tooltip);

export const BarChart = connectToWebSocket(({ socket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<'bar'> | null>(null);
  const { isDark } = useContext(ColorMode);
  const { labels, datasets } = useDeepCompareMemoize(getChartVoteData(socket.state));

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.config.data.datasets = datasets;
      chartRef.current.config.data.labels = labels;
      chartRef.current.config.options = getChartOptions();
      chartRef.current.update('none');
    }
  }, [datasets, labels, isDark]);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: getChartOptions(),
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  if (!datasets.length) {
    return null;
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        role="img"
        style="position: relative; height: 300px; width: 900px; max-width:95vw"
      >
        Your browser does not support the canvas element.
      </canvas>
    </div>
  );
});

const getChartOptions = (): ChartOptions<'bar'> => ({
  layout: {
    padding: 32,
  },
  scales: {
    x: {
      grid: { color: getComputedStyle(document.body).getPropertyValue('--text-tertiary') },
      ticks: {
        color: getComputedStyle(document.body).getPropertyValue('--text-primary'),
      },
    },
    y: {
      min: 0,
      ticks: {
        stepSize: 1,
        color: getComputedStyle(document.body).getPropertyValue('--text-primary'),
      },
      grid: { color: getComputedStyle(document.body).getPropertyValue('--text-tertiary') },
      title: {
        display: true,
        text: 'Votes',
        color: getComputedStyle(document.body).getPropertyValue('--text-primary'),
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') },
    },
  },
});
