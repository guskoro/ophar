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

import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Pusher from 'pusher-js';

Pusher.logToConsole = true;

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
        this.cmProgressUp();
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
        this.pmProgressUp();
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
        this.assetsProgressUp();
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
        this.controlsProgressUp();
      }
    });

    await channel.bind('done-wo', data => {
      if (data.division === 'Corrective Maintenance') {
        let newData = JSON.parse(JSON.stringify(this.state.cmData));
        newData.done = this.state.cmData.done + 1;
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
        this.cmProgressUp();
      }
      if (data.division === 'Preventive Maintenance') {
        let newData = JSON.parse(JSON.stringify(this.state.pmData));
        newData.done = this.state.pmData.done + 1;
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
        this.pmProgressUp();
      }
      if (data.division === 'Assets') {
        let newData = JSON.parse(JSON.stringify(this.state.assetsData));
        newData.done = this.state.assetsData.done + 1;
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
        this.assetsProgressUp();
      }
      if (data.division === 'Patrols and Controls') {
        let newData = JSON.parse(JSON.stringify(this.state.controlsData));
        newData.done = this.state.controlsData.done + 1;
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
        this.controlsProgressUp();
      }
    });

    await channel.bind('delete-wo', data => {
      if (data.division === 'Corrective Maintenance') {
        let newData = JSON.parse(JSON.stringify(this.state.cmData));
        if (data.done) {
          newData.done = this.state.cmData.done - 1;
        }
        newData.all = this.state.cmData.all - 1;
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
        this.cmProgressUp();
      }
      if (data.division === 'Preventive Maintenance') {
        let newData = JSON.parse(JSON.stringify(this.state.pmData));
        if (data.done) {
          newData.done = this.state.pmData.done - 1;
        }
        newData.all = this.state.pmData.all - 1;
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
        this.pmProgressUp();
      }
      if (data.division === 'Assets') {
        let newData = JSON.parse(JSON.stringify(this.state.assetsData));
        if (data.done) {
          newData.done = this.state.assetsData.done - 1;
        }
        newData.all = this.state.assetsData.all - 1;
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
        this.assetsProgressUp();
      }
      if (data.division === 'Patrols and Controls') {
        let newData = JSON.parse(JSON.stringify(this.state.controlsData));
        if (data.done) {
          newData.done = this.state.controlsData.done - 1;
        }
        newData.all = this.state.controlsData.all - 1;
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
        this.controlsProgressUp();
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
      .get('/api/working-order?division=assets&done=true')
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
    let percent = 0;
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
    let percent = 0;
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
    let percent = 0;
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
    let percent = 0;
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
    // Data Line Chart
    const data = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      datasets: [
        {
          label: 'MTTR Target',
          fill: true,
          lineTension: 0,
          backgroundColor: 'rgba(255, 247, 0,0.4)',
          borderColor: 'rgba(255, 247, 0,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(255, 247, 0,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57]
        },
        {
          label: 'MTTR SCADA SBU SEMARANG',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(0,30,111,1)',
          borderColor: 'rgba(0,30,111,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(0,30,111,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [25, 79, 50, 101, 76, 75, 80, 55, 60, 80, 90, 100]
        }
      ]
    };
    const data2 = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      datasets: [
        {
          label: 'MTTR Target',
          fill: true,
          lineTension: 0,
          backgroundColor: 'rgba(255, 247, 0,0.4)',
          borderColor: 'rgba(255, 247, 0,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(255, 247, 0,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [240, 240, 240, 240, 240, 240, 240, 240, 240, 240, 240, 240]
        },
        {
          label: 'MTTR SCADA SBU SEMARANG',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(0,30,111,1)',
          borderColor: 'rgba(0,30,111,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(0,30,111,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [250, 200, 300, 300, 270, 200, 250, 330, 240, 250, 300, 200]
        }
      ]
    };

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
        <Card>
          <CardBody>
            <div>
              <CardTitle>MTTR Scada Progress</CardTitle>
            </div>
            <div style={{ height: '15em' }}>
              <Line ref='chart' data={data} height='40em' />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div>
              <CardTitle>MTTR Non Scada Progress</CardTitle>
            </div>
            <div style={{ height: '15em' }}>
              <Line ref='chart' data={data2} height='40em' />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default DivisionProgress;
