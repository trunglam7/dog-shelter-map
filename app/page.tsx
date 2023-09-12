"use client"

import Image from 'next/image'
import styles from './page.module.css'
import * as d3 from 'd3'
import { useEffect, useState } from 'react'
import Map from './components/Map'
import { Button, FormControlLabel, RadioGroup, Slider, ThemeProvider } from '@mui/material'
import { mainTheme } from './fixtures/theme'

export default function Home() {

  const [shelterData, setShelterData] = useState<d3.DSVRowArray<string>>();
  const [topology, setTopology] = useState();
  const [filter, setFilter] = useState({type: 'Intake', year: '2019'});

  const handleFilterChange = (filterType : String) => {
    const newFilter = {...filter};

    switch(filterType){
      case 'live-outcome':
        newFilter.type = 'Live Outcome';
        setFilter(newFilter);
        break;
      case 'other-outcome':
        newFilter.type = 'Other Outcome';
        setFilter(newFilter);
        break;
      default:
        newFilter.type = 'Intake';
        setFilter(newFilter);
        break;
    }
  }

  const handleYearChange = (event: Event, newValue : number | number[]) => {
    const newFilter = {...filter};

    newFilter.year = newValue.toString();
    setFilter(newFilter)
  }

  // Fetch CSV data
  useEffect(() => {
    const fetchData = async() => {
      const shelterData = await d3.csv('./dog-shelter-data.csv');
      return shelterData;
    }

    fetchData().then(data => setShelterData(data));
  }, [])

  // Fetch Topology
  useEffect(() => {
    const fetchTopology = async() => {
      const res = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json");
      const data = await res.json();

      return data;
    }

    fetchTopology().then(data => setTopology(data));
  }, [])

  return (
      <ThemeProvider theme={mainTheme}>
        <main className={styles.main}>
          <div className={styles.sliderContainer}>
            <Slider
                  aria-label="Year"
                  defaultValue={2019}
                  valueLabelDisplay="on"
                  step={1}
                  marks
                  min={2019}
                  max={2022}
                  onChange={handleYearChange}
            />
          </div>
          <div className={styles.mapContainer}>
            <div className={styles.filtersContainer}>
              <Button variant='contained' color={filter.type === 'Intake' ? 'secondary' : 'primary'} onClick={() => handleFilterChange('intake')}>Intakes</Button>
              <Button variant='contained' color={filter.type === 'Live Outcome' ? 'secondary' : 'primary'} onClick={() => handleFilterChange('live-outcome')}>Live Outcomes</Button>
              <Button variant='contained' color={filter.type === 'Other Outcome' ? 'secondary' : 'primary'} onClick={() => handleFilterChange('other-outcome')}>Other Outcomes</Button>
            </div>
            <Map data={shelterData} topology={topology} filter={filter}/>
          </div>
          <div className={styles.creditContainer}>
            <p>Data Source: <a href='https://www.shelteranimalscount.org' target='_blank'>https://www.shelteranimalscount.org</a></p>
          </div>
        </main>
      </ThemeProvider>
    
  )
}
