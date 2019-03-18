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
import Pusher from 'pusher-js';
import classnames from 'classnames';
import moment from 'moment';
import Pager from 'react-pager';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';

const pusher = new Pusher('12f41be129ba1c0d7a3c', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('ophar-app');

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
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
      pagesCount: 0,
      total: 11,
      current: 7,
      visiblePage: 3
    };
  }

  // Search
  handleChangeSearch(e) {
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
  }

  // Filter
  handleChangeFilter(e) {
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
  }

  // Pagination
  handleClick(e, index) {
    e.preventDefault();

    this.setState({
      currentPage: index
    });
  }

  // Pager
  handlePageChanged(newPage) {
    this.setState({ current: newPage });
  }

  async componentDidMount() {
    await this.getWO();
    await this.getCurrentUser();
    await this.getPusher();
  }

  async getPusher() {
    await channel.bind('add-wo', data => {
      if (data.division === 'Corrective Maintenance') {
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
      if (data.division === 'Corrective Maintenance') {
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
      if (data.division === 'Corrective Maintenance') {
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
  }

  getCurrentUser() {
    axios
      .get('/api/user/current')
      .then(res => {
        this.setState({
          division: res.data.division
        });
      })
      .catch(err => console.log(err.response.data));
  }

  async getWO() {
    await axios
      .get(`/api/working-order?division=corrective+maintenance`)
      .then(res => {
        this.setState({
          WOs: res.data,
          filtered: res.data,
          pagesCount: Math.ceil(res.data.length / this.pageSize)
        });
      })
      .catch(err => console.log(err.response.data));
  }

  async onDelete(data) {
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
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

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

    console.log(this.state.WOs, this.state.filtered);

    return (
      /*--------------------------------------------------------------------------------*/
      /* Used In Dashboard-4 [General]                                                  */
      /*--------------------------------------------------------------------------------*/
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div>
              <CardTitle>Workorders</CardTitle>
              <CardSubtitle>HAR | Corrective Maintenance</CardSubtitle>
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
                  <option value='on-progress'>On Progress</option>
                  <option value='rejected'>Rejected</option>
                  <option value='done'>Done</option>
                </Input>
              </div>
              {this.state.division === 'Corrective Maintenance' && (
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
                  <InputGroupAddon addonType='append'>
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
                <th className='border-0'>Code</th>
                <th className='border-0'>PIC</th>
                <th className='border-0'>Type</th>
                <th className='border-0'>Description</th>
                <th className='border-0'>Priority</th>
                <th className='border-0'>Program</th>
                <th className='border-0'>Deadline</th>
                <th className='border-0'>Status</th>
                <th className='border-0'>Details</th>
                {this.state.division === 'Corrective Maintenance' && (
                  <th className='border-0'>Action</th>
                )}
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
                      <td>{data._id.slice(0, 9).toUpperCase() + '...'}</td>
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
                      <td>{data.type.name}</td>
                      <td>
                        {data.title.length < 36
                          ? data.title
                          : data.title.slice(0, 36) + '...'}
                      </td>
                      <td>{data.priority.name}</td>
                      <td>{data.program}</td>
                      <td className='blue-grey-text  text-darken-4 font-medium'>
                        {moment(data.deadline).format('DD-MM-YYYY HH:mm')}
                      </td>
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
                              !data.done
                            }
                            onClick={this.onDelete.bind(this, data)}
                            className='profile-time-approved'
                            outline
                            color='danger'>
                            <i className='mdi mdi-delete' />
                          </Button>
                        </td>
                      )}
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
          <Row>
            <Col xs='12' md='12'>
              <Pager
                total={this.state.total}
                current={this.state.current}
                visiblePages={this.state.visiblePage}
                titles={{ first: '<|', last: '>|' }}
                className='pagination-sm pull-right'
                onPageChanged={this.handlePageChanged}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default Projects;
