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
import '../../assets/scss/all/Pagination.css';

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

  async componentDidMount() {
    await this.getWO();
    await this.getPusher();
  }

  onPageChanged = data => {
    const { WOs } = this.state;
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;
    const currentWOs = WOs.slice(offset, offset + pageLimit);

    this.setState({ currentPage, currentWOs, totalPages });
  };

  async getPusher() {
    await channel.bind('add-wo', data => {
      let WOs = this.state.WOs;
      let newWOs = [data].concat(WOs);
      this.setState({
        WOs: newWOs,
        filtered: newWOs,
        pagesCount: Math.ceil(this.state.WOs.length / this.pageSize)
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
          filtered: WOs,
          pagesCount: Math.ceil(WOs.length / this.pageSize)
        };
      });
    });
  }

  async getWO() {
    await axios
      .get(`/api/working-order`)
      .then(res => {
        this.setState({
          WOs: res.data,
          filtered: res.data,
          pagesCount: Math.ceil(res.data.length / this.pageSize)
        });
      })
      .catch(err => console.log(err.response.data));
  }

  async onChange(e) {
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
                <th className='border-0'>Code</th>
                <th className='border-0'>PIC</th>
                <th className='border-0'>Type</th>
                <th className='border-0'>Description</th>
                <th className='border-0'>Priority</th>
                <th className='border-0'>Program</th>
                <th className='border-0'>Deadline</th>
                <th className='border-0'>Status</th>
                <th className='border-0'>Details</th>
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
                    totalRecords={this.state.WOs.length}
                    pageLimit={18}
                    pageNeighbours={1}
                    onPageChanged={this.onPageChanged}
                  />
                </div>
                {/* <Pagination aria-label='Page navigation example'>
                  <PaginationItem disabled={currentPage <= 0}>
                    <PaginationLink
                      onClick={e => this.handleClick(e, currentPage - 1)}
                      previous
                      href='#'
                    />
                  </PaginationItem>
                  {[...Array(this.state.pagesCount)].map((page, i) => (
                    <PaginationItem
                      active={i === currentPage}
                      key={i}
                      pageSize='5'>
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
                </Pagination> */}
              </CardBody>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default Projects;
