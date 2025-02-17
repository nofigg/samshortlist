import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { SpendingRecord } from '../types/api';

Chart.register(...registerables);

interface Props {
  records: SpendingRecord[];
}

export default function SpendingChart({ records }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Cleanup previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Prepare data
    const agencyData = records.reduce((acc, record) => {
      const agency = record.awarding_agency_name || 'Unknown Agency';
      acc[agency] = (acc[agency] || 0) + (record.total_obligation || 0);
      return acc;
    }, {} as Record<string, number>);

    const sortedData = Object.entries(agencyData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedData.map(([agency]) => agency),
        datasets: [
          {
            label: 'Total Obligations',
            data: sortedData.map(([, amount]) => amount),
            backgroundColor: 'rgba(79, 70, 229, 0.8)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Top 10 Agencies by Total Obligations',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `$${value.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return `$${(value as number).toLocaleString()}`;
              },
            },
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [records]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="h-[400px]">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
