import React, {useEffect, useState} from 'react'
import Metolib from '@fmidev/metolib'
import './App.css'
import {Map, Marker, TileLayer, Popup } from "react-leaflet"
import styled from "styled-components"
import Locinfo from './Sidebar'
import {Avg, DailySum, DailyAvg, DataZipper} from './components/DataHandler'
import {goldIcon, greenIcon} from './images/markers'


const MapContainer = styled(Map)`
    width: 100vw;
    height: 100vh;
    position:absolute;
    top:0px;
`;


const App = () => {
  const [observationLocations, setObservationLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(function fetchObservationLocations() {
    const connection = new Metolib.WfsConnection();
    if (connection.connect('http://opendata.fmi.fi/wfs', 'fmi::observations::weather::cities::multipointcoverage')) {
      connection.getData({
        begin: Date.now() - 60e3 * 60 * 24 * 6,
        end: Date.now()- 60e3 * 60,
        requestParameter: "t,snowdepth,r_1h",
        timestep: 60 * 60 * 1000,
        bbox: "20.6455928891, 59.846373196, 31.5160921567, 70.1641930203",
        callback: (data, errors) => {
          if (errors.length > 0) {
            errors.forEach(err => {
              console.error('FMI API error: ' + err.errorText);
            });
            return;
          }
          setObservationLocations(data.locations
            .map(loc => {
              const [lat, lon] = loc.info.position.map(parseFloat)
              const meanTemps = Avg(loc.data.t.timeValuePairs.map(time => time.value))
              const dailyTemps = DailyAvg(loc.data.t.timeValuePairs)
              const dailyRain = DailySum(loc.data.r_1h.timeValuePairs)
              const dailyWeather = DataZipper(dailyTemps, dailyRain)
              return {...loc,meanTemps, dailyWeather, position: {lat, lon}}
            })
          );
          connection.disconnect();
        }
      });
    }
  }, []);

  const markers = observationLocations.map(loc => <Marker position={[loc.position.lat, loc.position.lon]} key={loc.info.id} icon = {goldIcon} riseOnHover = {true}
                                                    onClick={() => setSelectedLocation(loc.info.id)}>
                                                    <Popup minWidth = {350}>
                                                      <Locinfo selectedLocationId={selectedLocation} observationLocations={observationLocations}/>
                                                    </Popup>
                                                  </Marker>)
  const position = [65, 26];

  const map = (
    <MapContainer center={position} zoom={6}>
      <TileLayer
        url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains='abcd'
        maxZoom={19}/>
      {markers}
    </MapContainer>
  );
  return (
    <div>
      {map}
    </div>
  );
}

export default App;