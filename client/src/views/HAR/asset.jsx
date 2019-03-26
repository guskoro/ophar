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

import axios from 'axios';
import swal from 'sweetalert';
import classnames from 'classnames';
import moment from 'moment';
import Pusher from 'pusher-js';
import { Link } from 'react-router-dom';

const pusher = new Pusher('12f41be129ba1c0d7a3c', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('ophar-app');

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.pageSize = 5;
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);

    this.state = {
      division: '',
      WOs: [],
      filtered: [],
      query: 0,
      currentPage: 0,
      pagesCount: 0
    };
  }

  // Search
  handleChangeSearch = e => {
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
      filtered: newList,
      pagesCount: Math.ceil(newList.length / this.pageSize)
    });
  };

  // Filter
  handleChangeFilter = e => {
    let currentList = [];
    let newList = [];
    if (e.target.value !== '') {
      currentList = this.state.WOs;
      newList = currentList.filter(item => {
        switch (e.target.value) {
          case 'pending-approval':
            return (
              (!item.approved_by_manager || !item.approved_by_spv) &&
              !item.rejected
            );
          case 'on-progress':
            return (
              item.approved_by_manager && item.approved_by_spv && !item.done
            );
          case 'rejected':
            return item.rejected;
          case 'done':
            return item.done;
          default:
            return item;
        }
      });
    } else {
      newList = this.state.WOs;
    }
    this.setState({
      filtered: newList,
      pagesCount: Math.ceil(newList.length / this.pageSize)
    });
  };

  // Pagination
  handleClick = (e, index) => {
    e.preventDefault();

    this.setState({
      currentPage: index
    });
  };

  componentDidMount = async () => {
    await this.getWO();
    await this.getCurrentUser();
    await this.getPusher();
  };

  getPusher = async () => {
    await channel.bind('add-wo', data => {
      if (data.division === 'Assets') {
        let WOs = this.state.WOs;
        let newWOs = [data].concat(WOs);
        this.setState({
          WOs: newWOs,
          filtered: newWOs,
          pagesCount: Math.ceil(this.state.WOs.length / this.pageSize)
        });
      }
    });

    await channel.bind('done-wo', data => {
      if (data.division === 'Assets') {
        this.setState(state => {
          const WOs = state.WOs.map(wo => {
            if (wo._id === data._id) {
              return data;
            } else {
              return wo;
            }
          });
          return {
            WOs,
            filtered: WOs,
            pagesCount: Math.ceil(WOs.length / this.pageSize)
          };
        });
      }
    });

    await channel.bind('approve-wo', data => {
      if (data.division === 'Assets' && data.approved_by_manager) {
        this.setState(state => {
          const WOs = state.WOs.map(wo => {
            if (wo._id === data._id) {
              return data;
            } else {
              return wo;
            }
          });
          return {
            WOs,
            filtered: WOs,
            pagesCount: Math.ceil(WOs.length / this.pageSize)
          };
        });
      }
    });

    await channel.bind('reject-wo', data => {
      if (data.division === 'Assets') {
        this.setState(state => {
          const WOs = state.WOs.map(wo => {
            if (wo._id === data._id) {
              return data;
            } else {
              return wo;
            }
          });
          return {
            WOs,
            filtered: WOs,
            pagesCount: Math.ceil(WOs.length / this.pageSize)
          };
        });
      }
    });

    await channel.bind('delete-wo', data => {
      if (data.division === 'Assets') {
        this.setState(state => {
          const WOs = state.WOs.filter(item => item._id !== data._id);

          return {
            WOs,
            filtered: WOs,
            pagesCount: Math.ceil(WOs.length / this.pageSize)
          };
        });
      }
    });
  };

  getCurrentUser = () => {
    axios
      .get('/api/user/current')
      .then(res => {
        this.setState({
          division: res.data.division
        });
      })
      .catch(err => console.log(err.response.data));
  };

  getWO = async () => {
    await axios
      .get(`/api/working-order?division=assets`)
      .then(res => {
        this.setState({
          WOs: res.data,
          filtered: res.data,
          pagesCount: Math.ceil(res.data.length / this.pageSize)
        });
      })
      .catch(err => console.log(err.response.data));
  };

  onDelete = async data => {
    await swal({
      title: 'Delete work order',
      text: 'Are you sure to delete this work order?',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(result => {
      if (result) {
        return axios
          .delete(`/api/working-order/${data._id}`)
          .then(res => {
            if (res.status === 200) {
              swal('Poof! Your work order has been deleted!', {
                icon: 'success'
              });
              this.getWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggle = targetName => {
    if (!this.state[targetName]) {
      this.setState({
        ...this.state,
        [targetName]: {
          tooltipOpen: true
        }
      });
    } else {
      this.setState({
        ...this.state,
        [targetName]: {
          tooltipOpen: !this.state[targetName].tooltipOpen
        }
      });
    }
  };

  isToolTipOpen = targetName => {
    return this.state[targetName] ? this.state[targetName].tooltipOpen : false;
  };

  render() {
    const { currentPage } = this.state;

    return (
      /*--------------------------------------------------------------------------------*/
      /* Used In Dashboard-4 [General]                                                  */
      /*--------------------------------------------------------------------------------*/
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div>
              <CardTitle>Workorders</CardTitle>
              <CardSubtitle>HAR | Assets</CardSubtitle>
            </div>
            <div className='ml-auto d-flex no-block align-items-center'>
              <div className='dl batas-kanan'>
                <Input
                  type='select'
                  name='filter'
                  className='custom-select'
                  onChange={this.handleChangeFilter}>
                  <option value=''>All</option>
                  <option value='pending-approval'>Pending Approval</option>
                  <option value='pending-approval-engineer'>
                    Pending Approval Engineer
                  </option>
                  <option value='on-progress'>On Progress</option>
                  <option value='rejected'>Rejected</option>
                  <option value='rejected-by-engineer'>
                    Rejected by Engineer
                  </option>
                  <option value='done'>Done</option>
                </Input>
              </div>
              {this.state.division === 'Assets' && (
                <div className='dl batas-kanan'>
                  <Link to='/uploadWO'>
                    <Button className='btn' color='success'>
                      <i className='mdi mdi-plus' />
                    </Button>{' '}
                  </Link>
                </div>
              )}
              <div className='dl'>
                <InputGroup>
                  <Input
                    type='text'
                    className='input'
                    onChange={this.handleChangeSearch}
                    placeholder='Search..'
                  />
                  <Input
                    type='select'
                    name='filter'
                    className='custom-select'
                    onChange={this.handleChangeFilterSearch}>
                    <option value='title'>Title</option>
                    <option value='type'>Type</option>
                    <option value='priority'>Priority</option>
                    <option value='program'>Program</option>
                  </Input>
                </InputGroup>
              </div>
            </div>
          </div>
          <Table className='no-wrap v-middle' responsive>
            <thead>
              <tr className='border-0'>
                <th className='border-0'>ID</th>
                <th className='border-0'>Status</th>
                <th className='border-0'>Details</th>
                {this.state.division === 'Assets' && (
                  <th className='border-0'>Action</th>
                )}
                <th className='border-0'>Type</th>
                <th className='border-0'>Title</th>
                <th className='border-0'>Priority</th>
                <th className='border-0'>Program</th>
                <th className='border-0'>Created At</th>
                <th className='border-0'>Deadline</th>
                <th className='border-0'>PIC</th>
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
                      <td>{data.wo_id}</td>
                      <td>
                        <i
                          className={classnames('fa fa-circle', {
                            'text-danger':
                              data.rejected ||
                              (data.approved_by_spv &&
                                data.approved_by_manager &&
                                !data.approved_by_engineer &&
                                data.rejected_by_engineer),
                            'text-warning':
                              !(
                                data.approved_by_spv ||
                                data.approved_by_manager ||
                                data.rejected
                              ) ||
                              (data.approved_by_spv &&
                                !data.approved_by_manager &&
                                !data.done &&
                                !data.rejected) ||
                              (data.done &&
                                !data.approved_by_engineer &&
                                !data.rejected_by_engineer),
                            'text-success':
                              data.approved_by_spv &&
                              data.approved_by_manager &&
                              !data.done &&
                              !data.approved_by_engineer &&
                              !data.rejected_by_engineer,
                            'text-biruicon':
                              data.done && data.approved_by_engineer
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
                            !data.approved_by_manager &&
                            !data.done &&
                            !data.rejected &&
                            'Approved by Supervisor'}
                          {data.approved_by_spv &&
                            data.approved_by_spv &&
                            data.approved_by_manager &&
                            !data.done &&
                            !data.approved_by_engineer &&
                            !data.rejected_by_engineer &&
                            'On Progress'}
                          {data.approved_by_spv &&
                            data.approved_by_manager &&
                            !data.approved_by_engineer &&
                            data.rejected_by_engineer &&
                            'Rejected by Engineer'}
                          {data.done &&
                            !data.approved_by_engineer &&
                            !data.rejected_by_engineer &&
                            'Pending Approval Engineer'}
                          {data.done && data.approved_by_engineer && 'Done'}
                        </Tooltip>
                      </td>
                      <td>
                        <Link to={{ pathname: `/detailWO/${data._id}` }}>
                          <Button className='btn' outline color='success'>
                            Show
                          </Button>
                        </Link>
                      </td>
                      {this.state.division === data.division && (
                        <td>
                          <Button
                            disabled={
                              data.approved_by_spv &&
                              data.approved_by_manager &&
                              !data.done &&
                              !data.rejected_by_engineer
                            }
                            onClick={this.onDelete.bind(this, data)}
                            className='profile-time-approved'
                            outline
                            color='danger'>
                            <i className='mdi mdi-delete' />
                          </Button>
                        </td>
                      )}
                      <td>{data.type.name}</td>
                      <td>
                        {data.title.length < 36
                          ? data.title
                          : data.title.slice(0, 36) + '...'}
                      </td>
                      <td>{data.priority.name}</td>
                      <td>{data.program}</td>
                      <td className='blue-grey-text  text-darken-4 font-medium'>
                        {moment(data.created_at).format('DD-MM-YYYY HH:mm')}
                      </td>
                      <td className='blue-grey-text  text-darken-4 font-medium'>
                        {moment(data.deadline).format('DD-MM-YYYY HH:mm')}
                      </td>
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
                            <span>{data.pic.division.name}</span>
                          </div>
                        </div>
                      </td>
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
