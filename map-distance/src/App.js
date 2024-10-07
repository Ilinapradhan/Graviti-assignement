import React from 'react';
import './App.css';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { useRef, useState } from 'react'
import logo from './Components/logo.png';
import ori from './Components/o-icon.png';
import stp from './Components/s-icon.png';
import des from './Components/d-icon.png';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 28.679079,
  lng: 77.069710
};

function App() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // googleMapsApiKey: "AIzaSyAYBivEevsC3sXYWfY6n9803tvASqB0TUI",
    googleMapsApiKey: "AIzaSyDyEtBPcwNpKpsCRhCBThChpEbeuvZGyLI",
    libraries: ['places']
  })

  const [map, setMap] = React.useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [markerPosition, setMarkerPosition] = useState(null);

  const originRef = useRef()
  const destiantionRef = useRef()
  const stopRef = useRef()

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)

    // stop generator
    setMarkerPosition(stopRef.current.value);

  
  }


  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <>

    <nav id="header" className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <img src={logo} alt="gaviti" />
      </div>
    </nav>

    <div className='container-fluid' id='content'>
      <h5>Lets calculate <b>distance</b> from google maps . </h5>

    </div>

    <div id='main-container' className='container-fluid'>

      <div id='map-obj' className='container-fluid'>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >

          <Marker position={markerPosition} />

          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div id="in" className="container-fluid">
        <div id='input-obj'>
          <div >
            <div class='o-input'>
              <label><b>Origin</b></label>
              <Autocomplete>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1"><img src={ori} alt="O" /></span>
                  <input type='text' class="form-control" placeholder='Origin' ref={originRef} />
                </div>
              </Autocomplete>
            </div>
            <div class='s-input'>
              <label><b>stop</b></label>
              <Autocomplete>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1"><img src={stp} alt="(0)" /></span>
                  <input type='text' class="form-control" placeholder='Stop' ref={stopRef} />
                </div>
              </Autocomplete>
            </div>
            <div class='d-input'>
              <label><b>Destination</b></label>
              <Autocomplete>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1"><img src={des} alt="D" /></span>
                  <input type='text' class="form-control" placeholder='Destiantion' ref={destiantionRef} />
                </div>
              </Autocomplete>
            </div>
          </div>
          <div className='btn1'>
            <button className="btn btn-primary" type='submit' onClick={calculateRoute}>
              Calculate
            </button>
          </div>
        </div>
        <div className='container-fluid' id='dis-cont'>
          <h5><b>Distance</b></h5>
          <h3><b>{distance}</b></h3>
        </div>
        <div className='end-cont'>
          <p>The distance between two places via the seleted route is <b>{distance}</b> kms.</p>
        </div>
      </div>
    </div>
  </>
) : <></>
}

export default React.memo(App)
