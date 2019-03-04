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
import Buttons from '../../../views/ui-components/button';
import { NavLink } from 'react-router-dom';

class SalesSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      complete: 0,
      incomplete: 0,
      approved: 0,
      pending: 0,
      completeWO: {
        datasets: [
          {
            backgroundColor: ['rgba(144,200,249,.7)', 'rgba(66,134,244,.7)'],
            data: [0, 20]
          }
        ],
        labels: ['Complete', 'Incomplete']
      },
      approvedWO: {
        datasets: [
          {
            backgroundColor: ['rgba(118,172,219,.7)', 'rgba(0,55,104,.7)'],
            data: [20, 10]
          }
        ],

        labels: ['Approved', 'Pending']
      }
    };
  }

  async componentDidMount() {
    await this.getCompleteWO();
    await this.getApprovedWO();
  }

  async getCompleteWO() {
    const completeDatasets = this.state.completeWO.datasets.slice(0);
    const newComplete = completeDatasets[0].data.slice(0);

    await axios
      .get('/api/working-order?done=true')
      .then(WOs => {
        newComplete[0] = WOs.data.length;
      })
      .catch(err => console.log(err));

    await axios
      .get('/api/working-order?done=false')
      .then(WOs => {
        newComplete[1] = WOs.data.length;
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
        newApproved[0] = WOs.data.length;
      })
      .catch(err => console.log(err));

    await axios
      .get('/api/working-order?approved_by_manager=false&approved_by_spv=false')
      .then(WOs => {
        newApproved[1] = WOs.data.length;
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
