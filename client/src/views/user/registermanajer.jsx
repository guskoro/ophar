import React from 'react';

import img1 from '../../assets/images/users/1.jpg';

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table
} from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.pageSize = 5;

    this.state = {
      users: [],
      modal: false,
      currentPage: 0,
      pagesCount: 0
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount = async () => {
    await this.getUsers();
  };

  getUsers = async () => {
    await axios
      .get('/api/user')
      .then(res => {
        this.setState({
          users: res.data,
          pagesCount: Math.ceil(res.data.length / this.pageSize)
        });
      })
      .catch(err => console.log(err.response.data));
  };

  handleClick(e, index) {
    e.preventDefault();

    this.setState({
      currentPage: index
    });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

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
              <CardTitle>Register for Admin</CardTitle>
              <CardSubtitle>HAR</CardSubtitle>
            </div>
            <div className='ml-auto d-flex no-block align-items-center'>
              <div className='dl batas-kanan'>
                <Link to='/registerform'>
                  <Button className='btn' color='success'>
                    <i className='mdi mdi-plus' />
                  </Button>{' '}
                </Link>
              </div>
              <div className='dl batas-kanan'>
                <InputGroup>
                  <Input placeholder='Search..' />
                  <InputGroupAddon addonType='append'>
                    <Button color='biruicon'>
                      <i className='mdi mdi-magnify' />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className='dl batas-kanan'>
                <Input type='select' className='custom-select'>
                  <option value='0'>All</option>
                  <option value='1'>Corrective Maintenance</option>
                  <option value='2'>Preventive Maintenance</option>
                  <option value='3'>Assets</option>
                  <option value='4'>Patrols and Controls</option>
                </Input>
              </div>
            </div>
          </div>
          <Table className='no-wrap v-middle' responsive>
            <thead>
              <tr className='border-0'>
                <th className='border-0'>ID</th>
                <th className='border-0'>Division</th>
                <th className='border-0'>Name</th>
                <th className='border-0'>Role</th>
                <th className='border-0'>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users
                .slice(
                  currentPage * this.pageSize,
                  (currentPage + 1) * this.pageSize
                )
                .map((data, id) => {
                  let roleName = data.role.name;
                  return (
                    <tr key={id}>
                      <td>{data._id.slice(0, 9).toUpperCase() + '...'}</td>
                      <td>
                        {data.division ? data.division.name : 'No division'}
                      </td>
                      <td>
                        <div className='d-flex no-block align-items-center'>
                          <div className='mr-2'>
                            <img
                              src={`https:${data.avatar}`}
                              alt='user'
                              className='rounded-circle'
                              width='45'
                            />
                          </div>
                          <div className=''>
                            <h5 className='mb-0 font-16 font-medium'>
                              {data.name}
                            </h5>
                            <span>{data.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge
                          color={classnames({
                            primary: roleName == 'manager',
                            success: roleName == 'supervisor',
                            danger: roleName == 'admin',
                            warning: roleName == 'engineer'
                          })}
                          className='ml-0'
                          pill>
                          {roleName}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          className='btn'
                          outline
                          color='biruicon'
                          onClick={this.toggle}>
                          {this.props.buttonLabel}
                          <i className='mdi mdi-pencil' />
                        </Button>
                        <Modal
                          isOpen={this.state.modal}
                          toggle={this.toggle}
                          className={this.props.className}>
                          <ModalHeader toggle={this.toggle}>Edit</ModalHeader>
                          <ModalBody>
                            <Form>
                              <FormGroup>
                                <Label for='exampleEmail'>Name</Label>
                                <Input />
                              </FormGroup>
                              <FormGroup>
                                <Label for='exampleEmail'>Email</Label>
                                <Input
                                  type='email'
                                  name='email'
                                  id='exampleEmail'
                                  placeholder='Email'
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label for='examplePassword'>Password</Label>
                                <Input
                                  type='password'
                                  name='password'
                                  id='examplePassword'
                                  placeholder='Password'
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label for='exampleSelect'>Role</Label>
                                <Input
                                  type='select'
                                  name='select'
                                  id='exampleSelect'>
                                  <option>...</option>
                                  <option>Admin</option>
                                  <option>Manager</option>
                                  <option>Supervisor</option>
                                  <option>Engineer</option>
                                </Input>
                              </FormGroup>
                              <FormGroup>
                                <Label for='exampleSelect'>Division</Label>
                                <Input
                                  type='select'
                                  name='select'
                                  id='exampleSelect'>
                                  <option>...</option>
                                  <option>PM</option>
                                  <option>CM</option>
                                  <option>Asset</option>
                                  <option>P3ak</option>
                                </Input>
                              </FormGroup>
                            </Form>
                          </ModalBody>
                          <ModalFooter>
                            <Button color='biruicon' onClick={this.toggle}>
                              Submit
                            </Button>{' '}
                            <Button color='secondary' onClick={this.toggle}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Modal>
                        <Button
                          className='profile-time-approved'
                          outline
                          color='danger'>
                          <i className='mdi mdi-delete' />
                        </Button>{' '}
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
