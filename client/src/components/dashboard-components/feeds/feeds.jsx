import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import axios from 'axios';

class Feeds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: 0,
      all: 0,
      overdue: 0,
      done: 0
    };
  }

  async componentDidMount() {
    await this.getRequests();
    await this.getAll();
    await this.getOverdue();
    await this.getDone();
  }

  async getRequests() {
    await axios
      .get('/api/working-order?approved_by_manager=false&approved_by_spv=false')
      .then(WOs => {
        this.setState({
          requests: WOs.data.length
        });
      })
      .catch(err => console.log(err));
  }

  async getAll() {
    await axios
      .get('/api/working-order')
      .then(WOs => {
        this.setState({
          all: WOs.data.length
        });
      })
      .catch(err => console.log(err));
  }

  async getOverdue() {
    await axios
      .get('/api/working-order?overdue=true')
      .then(WOs => {
        this.setState({
          overdue: WOs.data.length
        });
      })
      .catch(err => console.log(err));
  }

  async getDone() {
    await axios
      .get('/api/working-order?done=true')
      .then(WOs => {
        this.setState({
          done: WOs.data.length
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Card>
        <CardBody>
          <CardTitle>Overview this month</CardTitle>
          <div className='feed-widget'>
            <ul className='list-style-none feed-body m-0 pb-3'>
              <li className='feed-item'>
                <div className='feed-icon bg-info'>
                  <i className='far fa-envelope' />
                </div>{' '}
                Hi, you have {this.state.requests} Work Order requests.
              </li>
              <li className='feed-item'>
                <div className='feed-icon bg-info'>
                  <i className='ti-server' />
                </div>{' '}
                Wow, there are {this.state.all} Work Orders.
              </li>
              <li className='feed-item'>
                <div className='feed-icon bg-info'>
                  <i className='far fa-thumbs-down' />
                </div>{' '}
                Ohh, {this.state.overdue} Work Orders overdue.
              </li>
              <li className='feed-item'>
                <div className='feed-icon bg-info'>
                  <i className='far fa-thumbs-up' />
                </div>{' '}
                Good job, {this.state.done} Work Orders complete.
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default Feeds;
