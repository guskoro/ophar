import React from 'react';
import classnames from 'classnames';
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
import axios from 'axios';
import { NavLink } from 'react-router-dom';

class Projects extends React.Component {
  constructor(props) {
    super(props);

    // Pagination
    this.pageSize = 2;
    this.pagesCount = Math.ceil(this.dataSet.length / this.pageSize);

    this.toggle = this.toggle.bind(this);
    this.state = {
      WOs: [],
      currentPage: 0
    };
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
    await axios
      .get('/api/working-order?division=corrective+maintenance')
      .then(res => {
        this.setState({
          WOs: res.data
        });
      })
      .catch(err => console.log(err.response.data));
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
              <div className='dl'>
                <Input type='select' className='custom-select'>
                  <option value='0'>All</option>
                  <option value='1'>Pending Approval</option>
                  <option value='2'>On Progress</option>
                  <option value='3'>Done</option>
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
              {this.state.WOs.slice(
                currentPage * this.pageSize,
                (currentPage + 1) * this.pageSize
              ).map((data, id) => {
                return (
                  <tr key={id}>
                    <td>{data._id}</td>
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
                          <span>{data.pic.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{data.type.name}</td>
                    <td>{data.title}</td>
                    <td>{data.priority.name}</td>
                    <td>{data.program}</td>
                    <td className='blue-grey-text  text-darken-4 font-medium'>
                      {data.deadline}
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
                      <NavLink to='/detailWO'>
                        <Button className='btn' outline color='success'>
                          Show
                        </Button>
                      </NavLink>
                    </td>
                    <td>
                      <NavLink to='/detailWO'>
                        <Button className='btn' outline color='info'>
                          <i className='mdi mdi-pencil' />
                        </Button>{' '}
                      </NavLink>
                      <NavLink to='/detailWO'>
                        <Button
                          className='profile-time-approved'
                          outline
                          color='danger'>
                          <i className='mdi mdi-delete' />
                        </Button>{' '}
                      </NavLink>
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
