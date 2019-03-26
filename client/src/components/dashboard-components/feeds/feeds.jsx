import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import axios from 'axios';
import Pusher from 'pusher-js';
import { Link } from 'react-router-dom';

const pusher = new Pusher('12f41be129ba1c0d7a3c', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('ophar-app');

class Feeds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: {},
      requests: [],
      all: [],
      overdue: [],
      done: []
    };
  }

  async componentDidMount() {
    await this.getRequests();
    await this.getAll();
    await this.getOverdue();
    await this.getDone();
    await this.getPusher();
  }

  async getPusher() {
    await channel.bind('add-wo', data => {
      this.setState({
        requests: [...this.state.requests, data],
        all: [...this.state.all, data]
      });
    });

    await channel.bind('done-wo', data => {
      this.setState({
        done: [...this.state.done, data]
      });
    });

    await channel.bind('delete-wo', data => {
      if (!data.approved_by_manager && !data.approved_by_spv) {
        this.setState(state => {
          const requests = state.requests.filter(item => item._id !== data._id);

          return {
            requests
          };
        });
      }
      if (data.overdue) {
        this.setState(state => {
          const overdue = state.overdue.filter(item => item._id !== data._id);

          return {
            overdue
          };
        });
      }
      if (data.done) {
        this.setState(state => {
          const done = state.done.filter(item => item._id !== data._id);

          return {
            done
          };
        });
      }
      this.setState(state => {
        const all = state.all.filter(item => item._id !== data._id);

        return {
          all
        };
      });
    });
  }

  async getRequests() {
    await axios
      .get('/api/working-order?approved_by_manager=false&approved_by_spv=false')
      .then(WOs => {
        this.setState({
          requests: WOs.data
        });
      })
      .catch(err => console.log(err));
  }

  async getAll() {
    await axios
      .get('/api/working-order')
      .then(WOs => {
        this.setState({
          all: WOs.data
        });
      })
      .catch(err => console.log(err));
  }

  async getOverdue() {
    await axios
      .get('/api/working-order?overdue=true')
      .then(WOs => {
        this.setState({
          overdue: WOs.data
        });
      })
      .catch(err => console.log(err));
  }

  async getDone() {
    await axios
      .get('/api/working-order?done=true')
      .then(WOs => {
        this.setState({
          done: WOs.data
        });
      })
      .catch(err => console.log(err));
  }

  getCurrentUser = () => {
    axios
      .get('/api/user/current')
      .then(res => {
        this.setState({
          role: res.data.role,
          currentUser: res.data
        });
      })
      .catch(err => {
        if (err.response.status === 401) this.setState({ currentUser: {} });
      });
  };

  render() {
    const { currentUser } = this.state;

    return (
      <Card>
        <CardBody>
          <CardTitle>Overview</CardTitle>
          <div className='feed-widget'>
            <ul className='list-style-none feed-body m-0 pb-3'>
              {(currentUser.role === 'manager' ||
                currentUser.role === 'supervisor') && (
                <Link to='/newWO'>
                  <li className='feed-item'>
                    <div className='feed-icon bg-konengpeteng'>
                      <i className='far fa-envelope' />
                    </div>{' '}
                    Hi, you have {this.state.requests.length} Work Order
                    requests.
                  </li>
                </Link>
              )}
              {currentUser.role === 'field support' && (
                <Link to='/newWO'>
                  <li className='feed-item'>
                    <div className='feed-icon bg-konengpeteng'>
                      <i className='far fa-envelope' />
                    </div>{' '}
                    Hi, there are {this.state.requests.length} Work Order for
                    you.
                  </li>
                </Link>
              )}
              <li className='feed-item'>
                <div className='feed-icon bg-biruicon'>
                  <i className='ti-server' />
                </div>{' '}
                Wow, there are {this.state.all.length} Work Orders.
              </li>
              <li className='feed-item'>
                <div className='feed-icon bg-konengpeteng'>
                  <i className='far fa-thumbs-down' />
                </div>{' '}
                Ohh, {this.state.overdue.length} Work Orders overdue.
              </li>
              <li className='feed-item'>
                <div className='feed-icon bg-biruicon'>
                  <i className='far fa-thumbs-up' />
                </div>{' '}
                Good job, {this.state.done.length} Work Orders complete.
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default Feeds;
