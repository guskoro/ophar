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

class Duration extends React.Component {
  constructor(props) {
    super(props);
    this.toggleTab = this.toggleTab.bind(this);
    this.pageSize = 5;

    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      WOs: [],
      query: 0,
      currentPage: 0,
      pagesCount: 0,
      activeTab: '1'
    };
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
              <CardTitle>Serpo Duration</CardTitle>
              <CardSubtitle>HAR | Performance</CardSubtitle>
            </div>
            <div className='ml-auto d-flex no-block align-items-center'>
              {this.state.division === 'Corrective Maintenance' && (
                <div className='dl batas-kanan'>
                  <Link to='/uploadWO'>
                    <Button className='btn' color='success'>
                      <i className='mdi mdi-upload' />
                    </Button>{' '}
                  </Link>
                </div>
              )}
              <div className='dl'>
                <InputGroup>
                  <Input placeholder='Search..' />
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
                <th className='border-0'>Region</th>
                <th className='border-0'>Serpo</th>
                <th className='border-0'>Total Duration</th>
                <th className='border-0'>Complete Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.WOs.slice(
                currentPage * this.pageSize,
                (currentPage + 1) * this.pageSize
              ).map((data, id) => {
                return (
                  <tr key={id}>
                    <td>{data._id.slice(0, 9).toUpperCase() + '...'}</td>
                    <td>{data.type.name}</td>
                    <td>{data.title}</td>
                    <td>{data.priority.name}</td>
                    <td className='blue-grey-text  text-darken-4 font-medium'>
                      {moment(data.deadline).format('DD-MM-YYYY HH:mm')}
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
        </Col>
      </Row>
    );
  }
}

export default Duration;
