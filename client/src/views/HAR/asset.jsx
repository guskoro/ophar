import React from 'react';

import img1 from '../../assets/images/users/1.jpg';

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

import { NavLink } from 'react-router-dom';

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.dataSet = [...Array(Math.ceil(20 + Math.random() * 20))].map(
      (a, i) => 'Record ' + (i + 1)
    );

    this.pageSize = 2;
    this.pagesCount = Math.ceil(this.dataSet.length / this.pageSize);

    this.toggle10 = this.toggle10.bind(this);
    this.toggle20 = this.toggle20.bind(this);
    this.toggle30 = this.toggle30.bind(this);
    this.toggle40 = this.toggle40.bind(this);
    this.state = {
      tooltipOpen10: false,
      tooltipOpen20: false,
      tooltipOpen30: false,
      tooltipOpen40: false,
      currentPage: 0
    };
  }

  // Pagination Test
  handleClick(e, index) {
    e.preventDefault();

    this.setState({
      currentPage: index
    });
  }

  toggle10() {
    this.setState({
      tooltipOpen10: !this.state.tooltipOpen10
    });
  }

  toggle20() {
    this.setState({
      tooltipOpen20: !this.state.tooltipOpen20
    });
  }

  toggle30() {
    this.setState({
      tooltipOpen30: !this.state.tooltipOpen30
    });
  }

  toggle40() {
    this.setState({
      tooltipOpen40: !this.state.tooltipOpen40
    });
  }

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
              <CardSubtitle>HAR | Asset</CardSubtitle>
            </div>
            <div className='ml-auto d-flex no-block align-items-center'>
              <div className='dl'>
                <Input type='select' className='custom-select'>
                  <option value='0'>Monthly</option>
                  <option value='1'>Daily</option>
                  <option value='2'>Weekly</option>
                  <option value='3'>Yearly</option>
                </Input>
              </div>
              <div className='dl'>
                <NavLink to='/uploadWO'>
                  <Button className='btn' color='success'>
                    <i className='mdi mdi-upload' />
                  </Button>{' '}
                </NavLink>
              </div>
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
                <th className='border-0'>PIC</th>
                <th className='border-0'>Type</th>
                <th className='border-0'>Description</th>
                <th className='border-0'>Priority</th>
                <th className='border-0'>Assigned User</th>
                <th className='border-0'>Target Date</th>
                <th className='border-0'>Status</th>
                <th className='border-0'>Details</th>
                <th className='border-0'>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.dataSet
                .slice(
                  currentPage * this.pageSize,
                  (currentPage + 1) * this.pageSize
                )
                .map((data, i) => (
                  <tr key={i}>
                    <td>{data}</td>
                    <td>
                      <div className='d-flex no-block align-items-center'>
                        <div className='mr-2'>
                          <img
                            src={img1}
                            alt='user'
                            className='rounded-circle'
                            width='45'
                          />
                        </div>
                        <div className=''>
                          <h5 className='mb-0 font-16 font-medium'>
                            Hanna Gover
                          </h5>
                          <span>hgover@gmail.com</span>
                        </div>
                      </div>
                    </td>
                    <td>FOC</td>
                    <td>Elite Admin</td>
                    <td>Highest</td>
                    <td>Guskoro, Puguh</td>
                    <td className='blue-grey-text  text-darken-4 font-medium'>
                      12-04-2019
                    </td>
                    <td>
                      <i className='fa fa-circle text-danger' id='tlp1' />
                      <Tooltip
                        placement='top'
                        isOpen={this.state.tooltipOpen10}
                        target='tlp1'
                        toggle={this.toggle10}>
                        Rejected
                      </Tooltip>
                    </td>
                    <td>
                      <NavLink to='/detailWO'>
                        <Button className='btn' outline color='success'>
                          Show
                        </Button>
                      </NavLink>
                    </td>
                    <td>
                      <NavLink to='/detailWO'>
                        <Button
                          className='btn'
                          outline
                          color='biruicon'
                          disabled={true}>
                          <i className='mdi mdi-pencil' />
                        </Button>{' '}
                      </NavLink>
                      <NavLink to='/detailWO'>
                        <Button
                          className='profile-time-approved'
                          outline
                          color='danger'
                          disabled={true}>
                          <i className='mdi mdi-delete' />
                        </Button>{' '}
                      </NavLink>
                    </td>
                  </tr>
                ))}
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
                  {[...Array(this.pagesCount)].map((page, i) => (
                    <PaginationItem active={i === currentPage} key={i}>
                      <PaginationLink
                        onClick={e => this.handleClick(e, i)}
                        href='#'>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem disabled={currentPage >= this.pagesCount - 1}>
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
