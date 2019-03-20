import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  Row
} from 'reactstrap';

import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import Pusher from 'pusher-js';
import { NavLink } from 'react-router-dom';

Pusher.logToConsole = true;

const pusher = new Pusher('12f41be129ba1c0d7a3c', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('ophar-app');

class SalesSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      complete: [],
      incomplete: [],
      approved: [],
      pending: [],
      completedWO: {
        datasets: [
          {
            backgroundColor: ['#f81a1a', '#6f0000'],
            data: [0, 100]
          }
        ],
        labels: ['Complete', 'Incomplete']
      },
      approvedWO: {
        datasets: [
          {
            backgroundColor: ['#f81a1a', '#6f0000'],
            data: [0, 100]
          }
        ],

        labels: ['Approved', 'Pending']
      }
    };
  }

  componentDidMount = async () => {
    await this.getCompletedWO();
    await this.getApprovedWO();
    await this.getPusher();
  };

  getPusher = async () => {
    const completeDatasets = this.state.completedWO.datasets.slice(0);
    const approvedDatasets = this.state.approvedWO.datasets.slice(0);
    const newComplete = completeDatasets[0].data.slice(0);
    const newApproved = approvedDatasets[0].data.slice(0);

    await channel.bind('add-wo', data => {
      if (data) {
        this.setState({
          incomplete: [...this.state.incomplete, data],
          pending: [...this.state.pending, data]
        });
        newComplete[1] = this.state.incomplete.length;
        newApproved[1] = this.state.pending.length;
        completeDatasets[0].data = newComplete;
        approvedDatasets[0].data = newApproved;
        this.setState({
          completedWO: Object.assign({}, this.state.completedWO, {
            datasets: completeDatasets
          }),
          approvedWO: Object.assign({}, this.state.approvedWO, {
            datasets: approvedDatasets
          })
        });
      }
    });

    await channel.bind('done-wo', data => {
      if (data) {
        this.setState(state => {
          const incomplete = state.incomplete.filter(
            item => item._id !== data._id
          );
          const complete = [...state.complete, data];
          newComplete[1] = incomplete.length;
          newComplete[0] = complete.length;
          completeDatasets[0].data = newComplete;

          return {
            complete,
            incomplete,
            completedWO: Object.assign({}, state.completedWO, {
              datasets: completeDatasets
            })
          };
        });
      }
    });

    await channel.bind('approve-wo', data => {
      if (data.approved_by_manager) {
        this.setState(state => {
          const pending = state.pending.filter(item => item._id !== data._id);
          const approved = [...state.approved, data];
          newApproved[1] = pending.length;
          newApproved[0] = approved.length;
          approvedDatasets[0].data = newApproved;

          return {
            pending,
            approved,
            approvedWO: Object.assign({}, state.approvedWO, {
              datasets: approvedDatasets
            })
          };
        });
      }
    });

    await channel.bind('delete-wo', data => {
      if (data.done) {
        this.setState(state => {
          const complete = state.complete.filter(item => item._id !== data._id);

          newComplete[0] = complete.length;
          completeDatasets[0].data = newComplete;
          return {
            completedWO: Object.assign({}, this.state.completedWO, {
              datasets: completeDatasets
            })
          };
        });
      }
      if (data.approved_by_manager && data.approved_by_spv) {
        this.setState(state => {
          const approved = state.approved.filter(item => item._id !== data._id);

          newApproved[0] = approved.length;
          approvedDatasets[0].data = newApproved;
          return {
            approvedWO: Object.assign({}, this.state.approvedWO, {
              datasets: approvedDatasets
            })
          };
        });
      }
      if (!(data.approved_by_manager && data.approved_by_spv) || !data.done) {
        this.setState(state => {
          const incomplete = state.incomplete.filter(
            item => item._id !== data._id
          );
          const pending = state.pending.filter(item => item._id !== data._id);

          newComplete[1] = incomplete.length;
          newApproved[1] = pending.length;
          completeDatasets[0].data = newComplete;
          approvedDatasets[0].data = newApproved;
          return {
            completedWO: Object.assign({}, this.state.completedWO, {
              datasets: completeDatasets
            }),
            approvedWO: Object.assign({}, this.state.approvedWO, {
              datasets: approvedDatasets
            })
          };
        });
      }
    });
  };

  getCompletedWO = async () => {
    const completeDatasets = this.state.completedWO.datasets.slice(0);
    const newComplete = completeDatasets[0].data.slice(0);

    await axios
      .get('/api/working-order?done=true')
      .then(WOs => {
        this.state.complete = WOs.data;
        newComplete[0] = this.state.complete.length;
      })
      .catch(err => console.log(err));

    await axios
      .get('/api/working-order?done=false')
      .then(WOs => {
        this.state.incomplete = WOs.data;
        newComplete[1] = this.state.incomplete.length;
      })
      .catch(err => console.log(err));

    completeDatasets[0].data = newComplete;

    this.setState({
      completedWO: Object.assign({}, this.state.completedWO, {
        datasets: completeDatasets
      })
    });
  };

  getApprovedWO = async () => {
    const approvedDatasets = this.state.approvedWO.datasets.slice(0);
    const newApproved = approvedDatasets[0].data.slice(0);

    await axios
      .get('/api/working-order?approved_by_manager=true&approved_by_spv=true')
      .then(WOs => {
        this.state.approved = WOs.data;
        newApproved[0] = this.state.approved.length;
      })
      .catch(err => console.log(err));

    await axios
      .get('/api/working-order?approved_by_manager=false')
      .then(WOs => {
        this.state.pending = WOs.data;
        newApproved[1] = this.state.pending.length;
      })
      .catch(err => console.log(err));

    approvedDatasets[0].data = newApproved;

    this.setState({
      approvedWO: Object.assign({}, this.state.approvedWO, {
        datasets: approvedDatasets
      })
    });
  };

  render() {
    return (
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div>
              <CardTitle>Summary</CardTitle>
              <CardSubtitle>Working Orders</CardSubtitle>
            </div>
            {/* <div className='ml-auto d-flex no-block align-items-center'>
              <div className='dl'>
                <Input type='select' className='custom-select'>
                  <option value='0'>Weekly</option>
                  <option value='1'>Monthly</option>
                  <option value='2'>Yearly</option>
                </Input>
              </div>
            </div> */}
          </div>

          <Row>
            <Col lg='5'>
              <div className='campaign ct-charts'>
                <div
                  className='chart-wrapper'
                  style={{ width: '100%', margin: '0 auto', height: 250 }}>
                  <Doughnut
                    data={this.state.completedWO}
                    options={{
                      maintainAspectRatio: false,
                      legend: {
                        display: true,
                        labels: { fontFamily: 'Nunito Sans' }
                      }
                    }}
                  />
                </div>
              </div>
            </Col>
            <Col lg='2'>
              <div>
                <NavLink to='/allwo'>
                  <Button className='btn' outline color='danger'>
                    Show All
                  </Button>{' '}
                </NavLink>
              </div>
            </Col>
            <Col lg='5'>
              <div className='campaign ct-charts'>
                <div
                  className='chart-wrapper'
                  style={{ width: '100%', margin: '0 auto', height: 250 }}>
                  <Doughnut
                    data={this.state.approvedWO}
                    options={{
                      maintainAspectRatio: false,
                      legend: {
                        display: true,
                        labels: { fontFamily: 'Nunito Sans' }
                      }
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default SalesSummary;
