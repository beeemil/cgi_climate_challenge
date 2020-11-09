import React from 'react'
import GetSelectedLocatoinId from './locationGetter'
import { Bar, XAxis, YAxis, LabelList, ComposedChart, Line, Legend} from 'recharts';


const Graph = (dailyWeather) => {
    // console.log('dailyweather',dailyWeather.dailyWeather)
    const data = dailyWeather.dailyWeather
    const BarFormatter = (value) =>{
        return Math.round(value*10)/10
    }
    const margin = {top: 20, right: 0, bottom: 30, left: 0}
    return(
        <ComposedChart width = {300} height = {200} data = {data} margin = {margin}>
            <XAxis dataKey = "date"/>
            <YAxis yAxisId = "right" orientation = "right" label = {{value : 'Rain', angle: -90}}/>
            <YAxis yAxisId = "left" label = {{value : 'Temp', angle: -90}}/>
            <Bar name = "Cumulative rain (mm)" dataKey = "accrain" barSize = {20} fill = "#A3BCEC" yAxisId = "right">
                <LabelList dataKey = "accrain" position = "top" formatter = {BarFormatter}/>
            </Bar>
            <Legend verticalAlign = "bottom"/>
            <Line name = 'mean temp (&#176;C)' type = "monotone" dataKey = "avgtemp" yAxisId = "left" stroke = "#FF5F5F"/>
        </ComposedChart>
    )
}

const Locinfo = ({selectedLocationId, observationLocations}) => {
    const id = GetSelectedLocatoinId(selectedLocationId)
    const loc = observationLocations.find(loc => loc.info.id === id)
    return (
    <div id = "sidebar">
        <br/>
        <b>{loc && loc.info.name}</b><br/>
        <b>{loc && 'Mean temperature of the past week: '}</b>
        <b>{loc && Math.round(loc.meanTemps*10)/10 + '\u00b0 C'}</b>
        {loc && <Graph dailyWeather = {loc.dailyWeather}/>}
    </div>
    )
}

export default Locinfo