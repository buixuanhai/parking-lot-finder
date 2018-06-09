import React from 'react';
import ParkingLotMap from './components/ParkingLotMap';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getLocationSuccess } from './actions/ui';

const AppTitle = styled.h3`
  color: blue;
  text-align: center;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;
const Button = styled.button`
  margin: 2px;
`;

class App extends React.Component {
  state = {
    isMarkerShown: false
  };

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  };

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  };

  getCurrentLocation = async () => {};

  showNearbyParkingLots = async () => {
    if (this.props.location) {
      console.log(this.props.position);
    } else {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { longitude, latitude } }) => {
            this.props.getLocationSuccess({ lng: longitude, lat: latitude });
          }
        );
      } else {
        alert("Your brower doesn't support geolocation");
      }
    }
  };

  render() {
    const { location } = this.props;
    return (
      <div>
        <AppTitle>Parking lot finder</AppTitle>
        <ButtonContainer>
          <Button className="btn" onClick={this.showNearbyParkingLots}>
            Find nearby
          </Button>
          <Button className="btn">Add parking lot</Button>
        </ButtonContainer>
        <ParkingLotMap
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          center={location}
        />
      </div>
    );
  }
}

export default connect(state => ({ location: state.ui.location }), {
  getLocationSuccess
})(App);
