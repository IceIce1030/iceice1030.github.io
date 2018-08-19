import React from "react"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
} from "react-google-maps"
import MapMark from './MapMark';


const MyMaps = withScriptjs(withGoogleMap( ({zoom, marks, defaultCenter}) =>
  <GoogleMap
    defaultZoom={zoom}
    defaultCenter={{ lat: defaultCenter.lat, lng: defaultCenter.lng }}
  >
    {
      marks.map( mark =>{
        return (
          <MapMark key={mark.key} mark={mark}/>
        )
      })
    }
  </GoogleMap>
))

export default MyMaps
