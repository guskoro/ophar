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
      completeWO: {
        datasets: [
          {
            backgroundColor: ['#5e72e4', '#001e6f'],
            data: [0, 100]
          }
        ],
        labels: ['Complete', 'Incomplete']
      },
      approvedWO: {
        datasets: [
          {
            backgroundColor: ['#5e72e4', '#001e6f'],
            data: [0, 100]
          }
        ],

        labels: ['Approved', 'Pending']
      }
    };
  }

  async componentDidMount() {
    await this.getCompleteWO();
    await this.getApprovedWO();
    await this.getPusher();
  }

  async getPusher() {
    const completeDatasets = this.state.completeWO.datasets.slice(0);
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
          completeWO: Object.assign({}, this.state.completeWO, {
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
        this.setState({
          complete: [...this.state.complete, data]
        });
        newComplete[0] = this.state.complete.length;
        completeDatasets[0].data = newComplete;
        this.setState({
          completeWO: Object.assign({}, this.state.completeWO, {
            datasets: completeDatasets
          })
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
            completeWO: Object.assign({}, this.state.completeWO, {
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
            completeWO: Object.assign({}, this.state.completeWO, {
              datasets: completeDatasets
            }),
            approvedWO: Object.assign({}, this.state.approvedWO, {
              datasets: approvedDatasets
            })
          };
        });
      }
    });
  }

  async getCompleteWO() {
    const completeDatasets = this.state.completeWO.datasets.slice(0);
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
      completeWO: Object.assign({}, this.state.completeWO, {
        datasets: completeDatasets
      })
    });
  }

  async getApprovedWO() {
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
      .get('/api/working-order?approved_by_manager=false&approved_by_spv=false')
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
  }

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
                    data={this.state.completeWO}
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
