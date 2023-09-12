import { MapProps, UsStates } from '@/type'
import { useEffect, useState, useRef, createContext } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { ExtendedFeatureCollection } from 'd3'
import { CircularProgress } from '@mui/material'
import { colorScale, usStates } from '../fixtures/helper'
import styles from './styles/map.module.css'
import DataChart from './DataChart'
import ChartDialog from './ChartDialog'


export const dataContext = createContext<Object | undefined>({});
export const chartNameContext = createContext("");
export const totalContext = createContext(0);

export default function Map({data, topology, filter} : MapProps) {

    const svgRef = useRef(null);
    const [loadingMap, setLoadingMap] = useState(false);
    const [openChart, setOpenChart] = useState(false);
    const [chartName, setChartName] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [dataForChart, setDataForChart] = useState<Object>();

    const topologyData : ExtendedFeatureCollection = topology && topojson.feature(topology, topology.objects.states);

    const data01 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
      ];

    useEffect(() => {
        setLoadingMap(true);
        if(topologyData && data) {
            setLoadingMap(false);

            // Set up Map
            const width = 975;
            const height = 610;

            const svg = d3.select(svgRef.current);

            svg.selectAll("*").remove();

            svg.attr("viewBox", [0, 0, width, height])
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto; ");

            const path = d3.geoPath();
            const g = svg.append("g")
                .on("mouseleave", () => {
                    const tooltip = d3.select("#stateTooltip");
                    tooltip.style("display", "none");
                });
            const states = g.append("g")
                .attr("fill", "gray")
                .attr("cursor", "pointer")
                .selectAll("path")
                .data(topologyData.features)
                .join("path")
                .attr("d", (d:any) => path(d))

            g.append("path")
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-linejoin", "round")
                .attr("d", path(topojson.mesh(topology, topology.objects.states, (a, b) => a !== b)));


            //Calculating max
            const sumArray : number[] = [];
            //Filter by year
            const filteredDataYear = data?.filter(entry => entry.Year === filter.year);


            //Filter by category and calculate sum
            filteredDataYear.forEach(obj => {
                const filteredKeys = Object.keys(obj).filter(key => key.includes(filter.type));
                const filteredObject : {[key: string] : any} = {};

                filteredKeys.forEach(key => {
                    const value = obj[key];
                    if(typeof value === 'string') {
                        filteredObject[key] = parseInt(value)
                    }
                    else{
                        filteredObject[key] = 0;
                    }
                })

                const sum = d3.sum(Object.values(filteredObject));
                sumArray.push(sum);
            });

            const maxValue = d3.max(sumArray);

            // Color states based on data
            states.attr("fill", (d) => {
                const stateName = d.properties?.name;

                // Filters data by state
                const sampleData : {[key: string]: any} = data?.filter(entry => entry.State === usStates[stateName]).filter(entry => entry.Year === filter.year)[0]
                if(usStates[stateName] === 'DC') return 'gray';

                // Filters state by filter
                const filteredKeys = Object.keys(sampleData).filter(key => key.includes(filter.type));
                const filteredObject : {[key: string]: any} = {};

                filteredKeys.forEach(key => {
                    filteredObject[key] = parseInt(sampleData[key]);
                })

                // Calculate sum by filter
                const sum = d3.sum(Object.values(filteredObject));

                if (maxValue)
                    return colorScale(sum, maxValue);
                return 'gray';
            });

            states.on('click', (event, d) => {
                // Filters data by state
                const stateName = d.properties?.name;
                const sampleData : {[key: string]: any} = data?.filter(entry => entry.State === usStates[stateName]).filter(entry => entry.Year === filter.year)[0]

                // Filters state by filter
                const filteredKeys = Object.keys(sampleData).filter(key => key.includes(filter.type));
                const filteredObject : {[key: string]: any} = {};

                filteredKeys.forEach(key => {
                    filteredObject[key] = parseInt(sampleData[key]);
                })

                // Calculate sum by filter
                const sum = d3.sum(Object.values(filteredObject));

                setOpenChart(true);
                setDataForChart(filteredObject)
                setChartName(stateName);
                setTotalCount(sum);
            })

            states.on("mouseover", (event, d) => {
                const stateName = d.properties?.name;
                const tooltip = d3.select("#stateTooltip");
                const tooltipWidth = (tooltip.node() as HTMLElement).offsetWidth;
                const tooltipHeight = (tooltip.node() as HTMLElement).offsetHeight;

                // Filters data by state
                const sampleData : {[key: string]: any} = data?.filter(entry => entry.State === usStates[stateName]).filter(entry => entry.Year === filter.year)[0]
                if(usStates[stateName] === 'DC') return 'gray';

                // Filters state by filter
                const filteredKeys = Object.keys(sampleData).filter(key => key.includes(filter.type));
                const filteredObject : {[key: string]: any} = {};

                filteredKeys.forEach(key => {
                    filteredObject[key] = parseInt(sampleData[key]);
                })

                // Calculate sum by filter
                const sum = d3.sum(Object.values(filteredObject));

                // Calculate initial tooltip position
                let top = event.clientY + 10;
                let left = event.clientX + 10;

                tooltip.style("top", top + "px")
                    .style("left", left + "px")
                    .style("display", "block");

                tooltip.html(
                    `<b>${stateName}</b>
                    <p>Total Number of ${filter.type}: ${sum}</p>`
                ); // Replace with your content
            })



        }
    }, [topology, topologyData, data, filter])

    return (
        <>
            {loadingMap && <CircularProgress />}
            <svg ref={svgRef}></svg>
            <dataContext.Provider value={dataForChart}>
                <chartNameContext.Provider value={chartName}>
                    <totalContext.Provider value={totalCount}>
                        <ChartDialog openDialog={openChart} setOpenDialog={setOpenChart}/>
                    </totalContext.Provider>
                </chartNameContext.Provider>
            </dataContext.Provider>
            <div className={styles.stateTooltip} id='stateTooltip'></div>
        </>
    )
}
