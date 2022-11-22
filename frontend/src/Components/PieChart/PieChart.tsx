import { ArcElement, Chart, ChartOptions, Legend, PieController, Tooltip } from 'chart.js';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { ColorMode } from '../ColorModeProvider/ColorModeProvider';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import { getPieChartVoteData } from './getPieChartVoteData';

Chart.register(PieController, ArcElement, Legend, Tooltip);

export const PieChart = connectToWebSocket(({ socket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<'pie'> | null>(null);
  const { isDark } = useContext(ColorMode);
  const { labels, datasets } = getPieChartVoteData(socket.state.votes);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.config.data.datasets = datasets;
      chartRef.current.config.data.labels = labels;
      chartRef.current.config.options = getChartOptions();
      chartRef.current.update();
    }
  }, [datasets, labels, isDark]);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: 'pie',
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
    <canvas ref={canvasRef} role="img" height={300} width={300}>
      Your browser does not support the canvas element.
    </canvas>
  );
});

const getChartOptions = (): ChartOptions<'pie'> => ({
  layout: {
    padding: 16,
  },
  plugins: {
    legend: {
      labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') },
    },
  },
});
