import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  Tooltip
} from 'reactstrap';

import classnames from 'classnames';
import swal from 'sweetalert';
import axios from 'axios';
import Pusher from 'pusher-js';
import moment from 'moment';
import { Link } from 'react-router-dom';

const pusher = new Pusher('12f41be129ba1c0d7a3c', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('ophar-app');

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.pageSize = 5;
    // this.onChange = this.onChange.bind(this);
    this.state = {
      WOs: [],
      filtered: [],
      currentUser: {},
      currentPage: 0,
      pagesCount: 0,
      modal: false,
      role: ''
    };
  }

  // Search
  handleChange = e => {
    let currentList = [];
    let newList = [];
    if (e.target.value !== '') {
      currentList = this.state.WOs;
      newList = currentList.filter(item => {
        const lc = item.title.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      newList = this.state.WOs;
    }
    this.setState({
      filtered: newList
    });
  };

  handleClick = (e, index) => {
    e.preventDefault();

    this.setState({
      currentPage: index
    });
  };

  componentDidMount = async () => {
    await this.getCurrentUser();
    await this.getWO();
    await this.getPusher();
  };

  getPusher = async () => {
    await channel.bind('add-wo', data => {
      let WOs = this.state.WOs;
      let newWOs = [data].concat(WOs);
      this.setState({
        WOs: newWOs,
        filtered: newWOs,
        pagesCount: Math.ceil(this.state.WOs.length / this.pageSize)
      });
    });

    await channel.bind('delete-wo', data => {
      this.setState(state => {
        const WOs = state.WOs.filter(item => item._id !== data._id);

        return {
          WOs,
          filtered: WOs,
          pagesCount: Math.ceil(WOs.length / this.pageSize)
        };
      });
    });
  };

  getCurrentUser = () => {
    axios
      .get('/api/user/current')
      .then(res => {
        this.setState({
          currentUser: res.data
        });
      })
      .catch(err => {
        if (err.response.status === 401) this.setState({ currentUser: {} });
      });
  };

  getWO = async () => {
    let division = '';
    let user = '';

    switch (this.state.currentUser.division) {
      case 'Corrective Maintenance':
        division = 'corrective+maintenance';
        break;
      case 'Preventive Maintenance':
        division = 'preventive+maintenance';
        break;
      case 'Assets':
        division = 'assets';
        break;
      case 'Patrols and Controls':
        division = 'patrols+and+controls';
        break;
      default:
        division = '';
        break;
    }

    await axios
      .get(
        `/api/working-order?division=${division}&user=${user}&done=false&approved_by_engineer=false&approved_by_manager=true`
      )
      .then(res => {
        this.setState({
          WOs: res.data,
          currentWOs: res.data,
          filtered: res.data,
          pagesCount: Math.ceil(res.data.length / this.pageSize)
        });
      })
      .catch(err => console.log(err.response.data));
  };

  onApprove = async data => {
    await swal({
      title: 'Approve work order',
      text: 'Are you sure to approve this work order?',
      icon: 'info',
      buttons: true
    }).then(result => {
      if (result) {
        return axios
          .post(`/api/working-order/approve/${data._id}`)
          .then(res => {
            if (res.status === 200) {
              swal('Yey! This work order is approved!', {
                icon: 'success'
              });
              this.getWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  };

  onReject = async data => {
    await swal({
      title: 'Reject work order',
      text: 'Are you sure to reject this work order?',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(result => {
      if (result) {
        return axios
          .post(`/api/working-order/reject/${data._id}`)
          .then(res => {
            if (res.status === 200) {
              swal('Ohh! This work order is rejected!', {
                icon: 'success'
              });
              this.getWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  };

  onDone = async data => {
    await swal({
      title: 'Done work order',
      text: 'Are you sure want to finish this work order?',
      icon: 'info',
      buttons: true
    }).then(result => {
      if (result) {
        return axios
          .post(`/api/working-order/approve/${data._id}`)
          .then(res => {
            if (res.status === 200) {
              swal('Yey! This work order is complete!', {
                icon: 'success'
              });
              this.getWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  };

  onAddNote = data => {
    swal({
      text: 'Add note for this work order',
      content: {
        element: 'input',
        attributes: {
          value: data.note
        }
      },
      button: 'Add Note'
    }).then(note => {
      const newWorkingOrder = {
        note: note
      };
      return axios
        .patch(`/api/working-order/${data._id}`, newWorkingOrder)
        .then(res => {
          if (res.status === 200) {
            this.getWO();
          }
        })
        .catch(err => console.log(err));
    });
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  isToolTipOpen = targetName => {
    return this.state[targetName] ? this.state[targetName].tooltipOpen : false;
  };

  render() {
    const { currentPage, currentUser, workorders } = this.state;

    console.log(this.state.workorders);

    return (
      /*--------------------------------------------------------------------------------*/
      /* Used In Dashboard-4 [General]                                                  */
      /*--------------------------------------------------------------------------------*/
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div>
              <CardTitle>On Progress Work Orders</CardTitle>
              <CardSubtitle>HAR</CardSubtitle>
            </div>
            <div className='ml-auto d-flex no-block align-items-center'>
              {(currentUser.role === 'manager' ||
                currentUser.role === 'supervisor') && (
                <div className='dl batas-kanan'>
                  <Input type='select' className='custom-select'>
                    <option value='0'>All</option>
                    <option value='1'>Corrective Maintenance</option>
                    <option value='2'>Preventive Maintenance</option>
                    <option value='3'>Assets</option>
                    <option value='4'>Patrols and Controls</option>
                  </Input>
                </div>
              )}
              <div className='dl'>
                <InputGroup>
                  <InputGroupAddon addonType='append'>
                    <Input
                      type='text'
                      className='input'
                      onChange={this.handleChange}
                      placeholder='Search..'
                    />
                    <Button color='biruicon'>
                      <i className='mdi mdi-magnify' />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
          <Table className='no-wrap v-middle' responsive>
            <thead>
              <tr className='border-0'>
                <th className='border-0'>Status</th>
                <th className='border-0'>Deadline</th>
                <th className='border-0'>Details</th>
                <th className='border-0'>PIC</th>
                <th className='border-0'>Type</th>
                <th className='border-0'>Description</th>
                <th className='border-0'>Priority</th>
                <th className='border-0'>Program</th>
                <th className='border-0'>Code</th>
                {/* <th className='border-0'>Note</th> */}
              </tr>
            </thead>
            <tbody>
              {this.state.filtered
                .slice(
                  currentPage * this.pageSize,
                  (currentPage + 1) * this.pageSize
                )
                .map((data, id) => {
                  return (
                    <tr key={id}>
                      <td>
                        <i
                          className={classnames('fa fa-circle', {
                            'text-danger': data.rejected,
                            'text-warning': !(
                              (data.approved_by_spv &&
                                data.approved_by_manager) ||
                              data.rejected
                            ),
                            'text-success':
                              data.approved_by_spv &&
                              data.approved_by_manager &&
                              !data.done,
                            'text-biruicon': data.done
                          })}
                          id={`indicator-${id}`}
                        />
                        <Tooltip
                          placement='top'
                          isOpen={this.isToolTipOpen(`indicator-${id}`)}
                          target={`indicator-${id}`}
                          toggle={() => this.toggle(`indicator-${id}`)}>
                          {data.rejected && 'Rejected'}
                          {!(
                            (data.approved_by_spv &&
                              data.approved_by_manager) ||
                            data.rejected
                          ) && 'Pending Approval'}
                          {data.approved_by_spv &&
                            data.approved_by_manager &&
                            !data.done &&
                            'On Progress'}
                          {data.done && 'Done'}
                        </Tooltip>
                      </td>
                      <td className='blue-grey-text  text-darken-4 font-medium'>
                        {moment(data.deadline).format('DD-MM-YYYY HH:mm')}
                      </td>
                      <td>
                        <Link to={{ pathname: `/detailWO/${data._id}` }}>
                          <Button className='btn' outline color='success'>
                            Show
                          </Button>
                        </Link>
                      </td>
                      {currentUser.role === 'engineer' && (
                        <td>
                          <Button
                            className='btn'
                            outline
                            color='biruicon'
                            onClick={this.onDone.bind(this, data)}>
                            <i className='mdi mdi-check' />
                          </Button>
                        </td>
                      )}
                      {currentUser.role === 'field support' && (
                        <td>
                          <Button
                            className='btn'
                            outline
                            color='biruicon'
                            onClick={this.onDone.bind(this, data)}>
                            <i className='mdi mdi-check' />
                          </Button>
                        </td>
                      )}
                      <td>
                        <div className='d-flex no-block align-items-center'>
                          <div className='mr-2'>
                            <img
                              src={`https:${data.pic.avatar}`}
                              alt='user'
                              className='rounded-circle'
                              width='45'
                            />
                          </div>
                          <div className=''>
                            <h5 className='mb-0 font-16 font-medium'>
                              {data.pic.name}
                            </h5>
                            <span>{data.division}</span>
                          </div>
                        </div>
                      </td>
                      <td>{data.type.name}</td>
                      <td>{data.title}</td>
                      <td>{data.priority.name}</td>
                      <td>{data.program}</td>
                      <td>{data._id.slice(0, 9).toUpperCase() + '...'}</td>
                      {/* <td>
                        <Button
                          onClick={this.onAddNote.bind(this, data)}
                          outline
                          color='secondary'
                          className='btn'>
                          Add Note
                        </Button>
                      </td> */}
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <Row>
            <Col xs='12' md='12'>
              <CardBody className='border-top'>
                <Pagination aria-label='Page navigation example'>
                  <PaginationItem disabled={currentPage <= 0}>
                    <PaginationLink
                      onClick={e => this.handleClick(e, currentPage - 1)}
                      previous
                      href='#'
                    />
                  </PaginationItem>
                  {[...Array(this.state.pagesCount)].map((page, i) => (
                    <PaginationItem active={i === currentPage} key={i}>
                      <PaginationLink
                        onClick={e => this.handleClick(e, i)}
                        href='#'>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem
                    disabled={currentPage >= this.state.pagesCount - 1}>
                    <PaginationLink
                      onClick={e => this.handleClick(e, currentPage + 1)}
                      next
                      href='#'
                    />
                  </PaginationItem>
                </Pagination>
              </CardBody>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default Projects;
