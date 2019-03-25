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
  // Pagination,
  // PaginationItem,
  // PaginationLink,
  Row,
  Table,
  Tooltip
} from 'reactstrap';

import axios from 'axios';
import Pusher from 'pusher-js';
import moment from 'moment';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';

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
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);

    this.state = {
      division: '',
      WOs: [],
      currentWOs: [],
      // currentWOs: [],
      query: 0,
      currentPage: null,
      totalPages: null,
      pageLimit: 5
      // totalPages: 0
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
      currentWOs: newList,
      totalPages: Math.ceil(newList.length / this.state.pageLimit)
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
      currentWOs: newList,
      totalPages: Math.ceil(newList.length / this.state.pageLimit)
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
    await this.getPusher();
  };

  onPageChanged = data => {
    const { WOs } = this.state;
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;
    const currentWOs = WOs.slice(offset, offset + pageLimit);

    this.setState({ currentPage, currentWOs, totalPages });
  };

  getPusher = async () => {
    await channel.bind('add-wo', data => {
      let WOs = this.state.WOs;
      let newWOs = [data].concat(WOs);
      this.setState({
        WOs: newWOs,
        currentWOs: newWOs,
        totalPages: Math.ceil(this.state.WOs.length / this.state.pageLimit)
      });
    });

    await channel.bind('done-wo', data => {
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
          currentWOs: WOs,
          totalPages: Math.ceil(WOs.length / this.state.pageLimit)
        };
      });
    });

    await channel.bind('delete-wo', data => {
      this.setState(state => {
        const WOs = state.WOs.filter(item => item._id !== data._id);

        return {
          WOs,
          currentWOs: WOs,
          totalPages: Math.ceil(WOs.length / this.state.pageLimit)
        };
      });
    });

    await channel.bind('approve-wo', data => {
      if (data.approved_by_manager) {
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
            currentWOs: WOs,
            totalPages: Math.ceil(WOs.length / this.state.pageLimit)
          };
        });
      }
    });

    await channel.bind('reject-wo', data => {
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
          currentWOs: WOs,
          totalPages: Math.ceil(WOs.length / this.state.pageLimit)
        };
      });
    });
  };

  getWO = async () => {
    await axios
      .get(`/api/working-order`)
      .then(res => {
        this.setState({
          WOs: res.data,
          currentWOs: res.data,
          totalPages: Math.ceil(res.data.length / this.state.pageLimit)
        });
      })
      .catch(err => console.log(err.response.data));
  };

  onChange = async e => {
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
    const { WOs, currentWOs } = this.state;
    const totalWOs = WOs.length;

    console.log(this.state);

    if (totalWOs === 0) return null;

    return (
      /*--------------------------------------------------------------------------------*/
      /* Menampilkan semua WO untuk semua USER                                          */
      /*--------------------------------------------------------------------------------*/

      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div>
              <CardTitle>All Workorders</CardTitle>
              <CardSubtitle>HAR</CardSubtitle>
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
              <div className='dlbatas-kanan'>
                <InputGroup>
                  <InputGroupAddon addonType='append'>
                    <Input
                      type='text'
                      className='input'
                      onChange={this.handleChangeSearch}
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
          <Table className='wrap v-middle' responsive>
            <thead>
              <tr className='border-0'>
                <th className='border-0'>Status</th>
                <th className='border-0'>Details</th>
                <th className='border-0'>Deadline</th>
                <th className='border-0'>PIC</th>
                <th className='border-0'>Type</th>
                <th className='border-0'>Description</th>
                <th className='border-0'>Priority</th>
                <th className='border-0'>Program</th>
                <th className='border-0'>Code</th>
              </tr>
            </thead>
            <tbody>
              {currentWOs.map((data, id) => {
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
                          (data.approved_by_spv && data.approved_by_manager) ||
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
                    <td>{data.type.name}</td>
                    <td>
                      {data.title.length < 36
                        ? data.title
                        : data.title.slice(0, 36) + '...'}
                    </td>
                    <td>{data.priority.name}</td>
                    <td>{data.program}</td>
                    <td>{data._id.slice(0, 9).toUpperCase() + '...'}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Row>
            <Col xs='12' md='12'>
              <CardBody className='border-top'>
                <div className='d-flex flex-row py-4 align-items-center'>
                  <Pagination
                    totalRecords={currentWOs.length}
                    pageLimit={this.state.pageLimit}
                    pageNeighbours={1}
                    onPageChanged={this.onPageChanged}
                  />
                </div>
              </CardBody>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default Projects;
