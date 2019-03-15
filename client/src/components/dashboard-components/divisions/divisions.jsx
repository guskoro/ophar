import React, { Component } from 'react';
import {
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Row,
  Col
} from 'reactstrap';

import Countup from 'react-countup';
import axios from 'axios';
import Pusher from 'pusher-js';
import { NavLink } from 'react-router-dom';

const pusher = new Pusher('12f41be129ba1c0d7a3c', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('ophar-app');

class Divisions extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      cmWOs: [],
      pmWOs: [],
      assetsWOs: [],
      controlsWOs: [],
      picCM: 'PIC',
      picPM: 'PIC',
      picAssets: 'PIC',
      picControls: 'PIC'
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    await this.getCMTotalWO();
    await this.getPMTotalWO();
    await this.getAssetsTotalWO();
    await this.getControlsTotalWO();
    await this.getPusher();
  }

  async getPusher() {
    await channel.bind('add-wo', data => {
      if (data.division === 'Corrective Maintenance') {
        this.setState({
          cmWOs: [...this.state.cmWOs, data]
        });
      }
      if (data.division === 'Preventive Maintenance') {
        this.setState({
          pmWOs: [...this.state.pmWOs, data]
        });
      }
      if (data.division === 'Assets') {
        this.setState({
          assetsWOs: [...this.state.assetsWOs, data]
        });
      }
      if (data.division === 'Patrols and Controls') {
        this.setState({
          controlsWOs: [...this.state.controlsWOs, data]
        });
      }
    });
  }

  getCMTotalWO() {
    axios
      .get('/api/working-order?division=corrective+maintenance')
      .then(cmWOs => {
        this.setState({
          cmWOs: cmWOs.data,
          picCM: cmWOs.data[0].pic.name
        });
      })
      .catch(err => console.log(err));
  }

  getPMTotalWO() {
    axios
      .get('/api/working-order?division=preventive+maintenance')
      .then(pmWOs => {
        this.setState({
          pmWOs: pmWOs.data,
          picPM: pmWOs.data[0].pic.name
        });
      })
      .catch(err => console.log(err));
  }

  getAssetsTotalWO() {
    axios
      .get('/api/working-order?division=assets')
      .then(assetsWOs => {
        this.setState({
          assetsWOs: assetsWOs.data,
          picAssets: assetsWOs.data[0].pic.name
        });
      })
      .catch(err => console.log(err));
  }

  getControlsTotalWO() {
    axios
      .get('/api/working-order?division=patrols+and+controls')
      .then(controlsWOs => {
        this.setState({
          controlsWOs: controlsWOs.data,
          picControls: controlsWOs.data[0].pic.name
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs='12' md='3'>
            <Card>
              {/* <CardImg top width="100%" src={img1} /> */}
              <CardBody>
                <CardTitle>Corrective Maintenance</CardTitle>
                <CardSubtitle>{this.state.picCM}</CardSubtitle>
                <h1 className='display-3'>
                  <Countup end={this.state.cmWOs.length} duration={1} />
                </h1>
                <CardText>Total Work Orders</CardText>
                <NavLink to='/cm'>
                  <Button color='danger'>Let me in</Button>
                </NavLink>
              </CardBody>
            </Card>
          </Col>
          <Col xs='12' md='3'>
            <Card>
              {/* <CardImg top width="100%" src={img2} /> */}
              <CardBody>
                <CardTitle>Preventive Maintenance</CardTitle>
                <CardSubtitle>{this.state.picPM}</CardSubtitle>
                <h1 className='display-3'>
                  <Countup end={this.state.pmWOs.length} duration={1} />
                </h1>
                <CardText>Total Work Orders</CardText>
                <NavLink to='/pm'>
                  <Button color='danger'>Let me in</Button>
                </NavLink>
              </CardBody>
            </Card>
          </Col>
          <Col xs='12' md='3'>
            <Card>
              {/* <CardImg top width="100%" src={img3} /> */}
              <CardBody>
                <CardTitle>Assets</CardTitle>
                <CardSubtitle>{this.state.picAssets}</CardSubtitle>
                <h1 className='display-3'>
                  <Countup end={this.state.assetsWOs.length} duration={1} />
                </h1>
                <CardText>Total Work Orders</CardText>
                <NavLink to='/asset'>
                  <Button color='danger'>Let me in</Button>
                </NavLink>
              </CardBody>
            </Card>
          </Col>
          <Col xs='12' md='3'>
            <Card>
              {/* <CardImg top width="100%" src={img4} /> */}
              <CardBody>
                <CardTitle>Patrols and Controls</CardTitle>
                <CardSubtitle>{this.state.picControls}</CardSubtitle>
                <h1 className='display-3'>
                  <Countup end={this.state.controlsWOs.length} duration={1} />
                </h1>
                <CardText>Total Work Orders</CardText>
                <NavLink to='/p3ak'>
                  <Button color='danger'>Let me in</Button>
                </NavLink>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Divisions;
