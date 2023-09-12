import {useContext} from 'react'
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { chartNameContext, dataContext, totalContext } from './Map';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DataChart() {
    const stateData = useContext(dataContext);
    const chartName = useContext(chartNameContext);
    const totalCount = useContext(totalContext);

    const data = {
        labels: stateData && Object.keys(stateData),
        datasets: [
          {
            label: '# of Dogs',
            data: stateData && Object.values(stateData),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
    };

    return (
        <>
          <div style={{textAlign: 'center', fontWeight: 'bold', paddingTop: '1rem', fontSize: '1.5rem'}}>{chartName}</div>
          <p style={{textAlign: 'center'}}>Total: {totalCount}</p>
          <Pie data={data}
            style={{padding: '1rem'}}
          />
        </>
    );
}
