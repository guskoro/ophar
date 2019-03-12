import React from 'react';

import {
  Button,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Tooltip
} from 'reactstrap';

import { Link } from 'react-router-dom';

import classnames from 'classnames';
import moment from 'moment';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

class HarWO extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.pageSize = 5;
    this.toggleModals = this.toggleModals.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);

    this.state = {
      division: '',
      WOs: [],
      filtered: [],
      query: 0,
      currentPage: 0,
      pagesCount: 0,
      activeTab: '1',
      modal: false
    };
  }

  // Search
  handleChange(e) {
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
  }

  // Modals
  toggleModals() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  // Tab
  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
    await this.getCurrentUser();
  }

  getCurrentUser() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const current = jwt_decode(token);
      this.setState({
        division: current.division
      });
    }
  }

  async getWO() {
    const query = [
      '',
      '&approved_by_spv=false&approved_by_manager=false',
      '&approved_by_spv=true&approved_by_manager=true',
      '&done=true'
    ];

    await axios
      .get(`/api/working-order?division=assets${query[this.state.query]}`)
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
    console.log(this.state.query);
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
      <Row>
        <Col sm='12'>
          <div className='d-flex align-items-center batas-atas'>
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
                  onChange={this.onChange}>
                  <option value={0}>All</option>
                  <option value={1}>Pending Approval</option>
                  <option value={2}>On Progress</option>
                  <option value={3}>Done</option>
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
                    onChange={this.handleChange}
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
                {this.state.division === 'Assets' && (
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
                      <td>{data.title}</td>
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
                              data.approved_by_spv &&
                              data.approved_by_manager &&
                              data.done
                            ),
                            'text-success':
                              data.approved_by_spv &&
                              data.approved_by_manager &&
                              !data.done,
                            'text-secondary': data.done
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
                            data.approved_by_spv &&
                            data.approved_by_manager &&
                            data.done
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
                      {this.state.division === 'Assets' && (
                        <td>
                          <Button
                            onClick={this.toggleModals}
                            className='profile-time-approved'
                            outline
                            color='danger'>
                            <i className='mdi mdi-delete' />
                          </Button>{' '}
                          <Modal
                            isOpen={this.state.modal}
                            toggle={this.toggleModals}
                            className={this.props.className}>
                            <ModalHeader toggle={this.toggleModals}>
                              Delete
                            </ModalHeader>
                            <ModalBody>
                              Are you sure want to delete this data?
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                color='primary'
                                onClick={this.onDelete.bind(this, data)}>
                                Yes
                              </Button>{' '}
                              <Button
                                color='secondary'
                                onClick={this.toggleModals}>
                                Cancel
                              </Button>
                            </ModalFooter>
                          </Modal>
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
        </Col>
      </Row>
    );
  }
}

export default HarWO;
