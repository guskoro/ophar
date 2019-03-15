import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Progress,
  Tooltip
} from 'reactstrap';
import axios from 'axios';
import Pusher from 'pusher-js';

const pusher = new Pusher('12f41be129ba1c0d7a3c', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('ophar-app');

class DivisionProgress extends Component {
  constructor(props) {
    super(props);

    this.cmToggle = this.cmToggle.bind(this);
    this.pmToggle = this.pmToggle.bind(this);
    this.assetsToggle = this.assetsToggle.bind(this);
    this.controlsToggle = this.controlsToggle.bind(this);

    this.state = {
      cmData: {
        done: 0,
        all: 0,
        value: 0,
        max: 0,
        tooltip: false
      },
      pmData: {
        done: 0,
        all: 0,
        value: 0,
        max: 0,
        tooltip: false
      },
      assetsData: {
        done: 0,
        all: 0,
        value: 0,
        max: 0,
        tooltip: false
      },
      controlsData: {
        done: 0,
        all: 0,
        value: 0,
        max: 0,
        tooltip: false
      }
    };
  }

  async componentDidMount() {
    await this.getCMProgress();
    await this.getPMProgress();
    await this.getAssetsProgress();
    await this.getControlsProgress();
    await this.cmProgressUp();
    await this.pmProgressUp();
    await this.assetsProgressUp();
    await this.controlsProgressUp();
    await this.getPusher();
  }

  async getPusher() {
    await channel.bind('add-wo', data => {
      if (data.division === 'Corrective Maintenance') {
        let newData = JSON.parse(JSON.stringify(this.state.cmData));
        newData.all = this.state.cmData.all + 1;
        this.setState({
          cmData: newData
        });
        let done = this.state.cmData.done;
        let all = this.state.cmData.all;

        if (done !== 0) {
          newData.max = (done / all) * 100;
          this.setState({
            cmData: newData
          });
        }
      }
      if (data.division === 'Preventive Maintenance') {
        let newData = JSON.parse(JSON.stringify(this.state.pmData));
        newData.all = this.state.pmData.all + 1;
        this.setState({
          pmData: newData
        });
        let done = this.state.pmData.done;
        let all = this.state.pmData.all;

        if (done !== 0) {
          newData.max = (done / all) * 100;
          this.setState({
            pmData: newData
          });
        }
      }
      if (data.division === 'Assets') {
        let newData = JSON.parse(JSON.stringify(this.state.assetsData));
        newData.all = this.state.assetsData.all + 1;
        this.setState({
          assetsData: newData
        });
        let done = this.state.assetsData.done;
        let all = this.state.assetsData.all;

        if (done !== 0) {
          newData.max = (done / all) * 100;
          this.setState({
            assetsData: newData
          });
        }
      }
      if (data.division === 'Patrols and Controls') {
        let newData = JSON.parse(JSON.stringify(this.state.controlsData));
        newData.all = this.state.controlsData.all + 1;
        this.setState({
          controlsData: newData
        });
        let done = this.state.controlsData.done;
        let all = this.state.controlsData.all;

        if (done !== 0) {
          newData.max = (done / all) * 100;
          this.setState({
            controlsData: newData
          });
        }
      }
    });
  }

  async getCMProgress() {
    let newData = JSON.parse(JSON.stringify(this.state.cmData));

    await axios
      .get('/api/working-order?division=corrective+maintenance')
      .then(cmWOs => {
        newData.all = cmWOs.data.length;
        this.setState({
          cmData: newData
        });
      })
      .catch(err => console.log(err));

    await axios
      .get('/api/working-order?division=corrective+maintenance&done=true')
      .then(cmWOs => {
        newData.done = cmWOs.data.length;
        this.setState({
          cmData: newData
        });
      })
      .catch(err => console.log(err));

    let done = this.state.cmData.done;
    let all = this.state.cmData.all;

    if (done !== 0) {
      newData.max = (done / all) * 100;
      this.setState({
        cmData: newData
      });
    }
  }

  async getPMProgress() {
    let newData = JSON.parse(JSON.stringify(this.state.pmData));

    await axios
      .get('/api/working-order?division=preventive+maintenance')
      .then(pmWOs => {
        newData.all = pmWOs.data.length;
        this.setState({
          pmData: newData
        });
      })
      .catch(err => console.log(err));

    await axios
      .get('/api/working-order?division=preventive+maintenance&done=true')
      .then(pmWOs => {
        newData.done = pmWOs.data.length;
        this.setState({
          pmData: newData
        });
      })
      .catch(err => console.log(err));

    let done = this.state.pmData.done;
    let all = this.state.pmData.all;

    if (done !== 0) {
      newData.max = (done / all) * 100;
      this.setState({
        pmData: newData
      });
    }
  }

  async getAssetsProgress() {
    let newData = JSON.parse(JSON.stringify(this.state.assetsData));

    await axios
      .get('/api/working-order?division=assets')
      .then(assetsWOs => {
        newData.all = assetsWOs.data.length;
        this.setState({
          assetsData: newData
        });
      })
      .catch(err => console.log(err));

    await axios
      .get('/api/working-order?division=patrols+and+controls&done=true')
      .then(assetsWOs => {
        newData.done = assetsWOs.data.length;
        this.setState({
          assetsData: newData
        });
      })
      .catch(err => console.log(err));

    let done = this.state.assetsData.done;
    let all = this.state.assetsData.all;

    if (done !== 0) {
      newData.max = (done / all) * 100;
      this.setState({
        assetsData: newData
      });
    }
  }

  async getControlsProgress() {
    let newData = JSON.parse(JSON.stringify(this.state.controlsData));

    await axios
      .get('/api/working-order?division=patrols+and+controls')
      .then(controlsWOs => {
        newData.all = controlsWOs.data.length;
        this.setState({
          controlsData: newData
        });
      })
      .catch(err => console.log(err));

    await axios
      .get('/api/working-order?division=patrols+and+controls&done=true')
      .then(controlsWOs => {
        newData.done = controlsWOs.data.length;
        this.setState({
          controlsData: newData
        });
      })
      .catch(err => console.log(err));

    let done = this.state.controlsData.done;
    let all = this.state.controlsData.all;

    if (done !== 0) {
      newData.max = (done / all) * 100;
      this.setState({
        controlsData: newData
      });
    }
  }

  cmProgressUp() {
    let percent = this.state.cmData.value;
    let max = this.state.cmData.max;
    for (; percent < max; percent++) {
      let newData = JSON.parse(JSON.stringify(this.state.cmData));
      newData.value = percent;
      this.setState({
        cmData: newData
      });
    }
  }

  pmProgressUp() {
    let percent = this.state.pmData.value;
    let max = this.state.pmData.max;
    for (; percent < max; percent++) {
      let newData = JSON.parse(JSON.stringify(this.state.pmData));
      newData.value = percent;
      this.setState({
        pmData: newData
      });
    }
  }

  assetsProgressUp() {
    let percent = this.state.assetsData.value;
    let max = this.state.assetsData.max;
    for (; percent < max; percent++) {
      let newData = JSON.parse(JSON.stringify(this.state.assetsData));
      newData.value = percent;
      this.setState({
        assetsData: newData
      });
    }
  }

  controlsProgressUp() {
    let percent = this.state.controlsData.value;
    let max = this.state.controlsData.max;
    for (; percent < max; percent++) {
      let newData = JSON.parse(JSON.stringify(this.state.controlsData));
      newData.value = percent;
      this.setState({
        controlsData: newData
      });
    }
  }

  cmToggle() {
    let newData = JSON.parse(JSON.stringify(this.state.cmData));
    newData.tooltip = !this.state.cmData.tooltip;
    this.setState({
      cmData: newData
    });
  }

  pmToggle() {
    let newData = JSON.parse(JSON.stringify(this.state.pmData));
    newData.tooltip = !this.state.pmData.tooltip;
    this.setState({
      pmData: newData
    });
  }

  assetsToggle() {
    let newData = JSON.parse(JSON.stringify(this.state.assetsData));
    newData.tooltip = !this.state.assetsData.tooltip;
    this.setState({
      assetsData: newData
    });
  }

  controlsToggle() {
    let newData = JSON.parse(JSON.stringify(this.state.controlsData));
    newData.tooltip = !this.state.controlsData.tooltip;
    this.setState({
      controlsData: newData
    });
  }

  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <div className='d-flex align-items-center'>
              <div>
                <CardTitle>Division Progress</CardTitle>
              </div>
            </div>
            <div className='progress-area'>
              <Row>
                <Col xs='3' md='3'>
                  <CardText>Corrective Maintenance</CardText>
                </Col>
                <Col xs='9' md='9'>
                  <Progress
                    id='cmProgress'
                    animated
                    color='danger'
                    value={this.state.cmData.value}
                  />
                  <Tooltip
                    placement='top'
                    isOpen={this.state.cmData.tooltip}
                    autohide={false}
                    target='cmProgress'
                    toggle={this.cmToggle}>
                    {this.state.cmData.done}/{this.state.cmData.all}
                  </Tooltip>
                </Col>
              </Row>
              <Row>
                <Col xs='3' md='3'>
                  <CardText>Preventive Maintenance</CardText>
                </Col>
                <Col xs='9' md='9'>
                  <Progress
                    id='pmProgress'
                    animated
                    color='danger'
                    value={this.state.pmData.value}
                  />
                  <Tooltip
                    placement='top'
                    isOpen={this.state.pmData.tooltip}
                    autohide={false}
                    target='pmProgress'
                    toggle={this.pmToggle}>
                    {this.state.pmData.done}/{this.state.pmData.all}
                  </Tooltip>
                </Col>
              </Row>
              <Row>
                <Col xs='3' md='3'>
                  <CardText>Assets</CardText>
                </Col>
                <Col xs='9' md='9'>
                  <Progress
                    id='assetsProgress'
                    animated
                    color='danger'
                    value={this.state.assetsData.value}
                  />
                  <Tooltip
                    placement='top'
                    isOpen={this.state.assetsData.tooltip}
                    autohide={false}
                    target='assetsProgress'
                    toggle={this.assetsToggle}>
                    {this.state.assetsData.done}/{this.state.assetsData.all}
                  </Tooltip>
                </Col>
              </Row>
              <Row>
                <Col xs='3' md='3'>
                  <CardText>Patrols and Controls</CardText>
                </Col>
                <Col xs='9' md='9'>
                  <Progress
                    id='controlsProgress'
                    animated
                    color='danger'
                    value={this.state.controlsData.value}
                  />
                  <Tooltip
                    placement='top'
                    isOpen={this.state.controlsData.tooltip}
                    autohide={false}
                    target='controlsProgress'
                    toggle={this.controlsToggle}>
                    {this.state.controlsData.done}/{this.state.controlsData.all}
                  </Tooltip>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default DivisionProgress;
