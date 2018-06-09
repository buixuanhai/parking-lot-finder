import React from 'react';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';

const ParkingLotMap = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={10}
    center={props.center || { lat: 10.470702, lng: 106.7588609 }}
  >
    {props.isMarkerShown && (
      <Marker position={props.center} onClick={props.onMarkerClick} />
    )}
  </GoogleMap>
));
ParkingLotMap.displayName = 'ParkingLotMap';
export default ParkingLotMap;
