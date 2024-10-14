import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ReceiptsBarChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await fetch('https://scheme-purchase-backend.vercel.app/api/receipt/getgraph');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipts();
    }, []);

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    const generateColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
            colors.push(color);
        }
        return colors;
    };

    const chartData = {
        labels: data.map(item => item.SchemeName),
        datasets: [
            {
                label: 'Total Amount',
                data: data.map(item => item.totalAmount),
                backgroundColor: generateColors(data.length),
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.formattedValue || 0;
                        return `${label}: ${value}`;
                    }
                }
            }
        }
    };

    return (
        <div>
            <h2 className='text-center text-[18px] font-semibold'>Today Scheme Collections</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default ReceiptsBarChart;
