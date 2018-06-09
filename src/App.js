import React from 'react';
import ParkingLotMap from './components/ParkingLotMap';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getLocationSuccess } from './actions/ui';
import Header from './components/Header';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const MapContainer = styled.div`
  height: calc(100vh - 100px);
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
    isMarkerShown: true,
  };

  componentDidMount() {
    this.getLocation();
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  };

  getLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords: { longitude, latitude } }) => {
        this.props.getLocationSuccess({ lng: longitude, lat: latitude });
      });
    } else {
      alert("Your brower doesn't support geolocation");
    }
  };

  render() {
    const { location } = this.props;
    return (
      <div>
        <Header title="Parking lot finder">
          <ButtonContainer>
            <Button className="btn" onClick={this.getLocation}>
              Find nearby
            </Button>
            <Button className="btn">Add parking lot</Button>
          </ButtonContainer>
        </Header>
        <Tabs>
          <TabList>
            <Tab>Map</Tab>
            <Tab>List</Tab>
          </TabList>
          <TabPanel>
            <MapContainer>
              <ParkingLotMap
                isMarkerShown={this.state.isMarkerShown}
                onMarkerClick={this.handleMarkerClick}
                center={location}
              />
            </MapContainer>
          </TabPanel>
          <TabPanel>
            <h2>Any content 2</h2>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default connect(state => ({ location: state.ui.location }), {
  getLocationSuccess,
})(App);
