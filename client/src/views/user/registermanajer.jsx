import React from 'react';

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
  FormFeedback,
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
      data: {},
      id: '',
      name: '',
      email: '',
      password: '',
      role: '',
      division: '',
      users: [],
      divisions: [],
      roles: [],
      modal: false,
      modalDelete: false,
      currentPage: 0,
      pagesCount: 0,
      errors: {}
    };

    this.toggle = this.toggle.bind(this);
    this.toggleModals = this.toggleModals.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    await this.getUsers();
    await this.getRoles();
    await this.getDivisions();
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

  async getRoles() {
    await axios
      .get('/api/role')
      .then(res => {
        this.setState({
          roles: res.data
        });
      })
      .catch(err => console.log(err.response.data));
  }

  async getDivisions() {
    await axios
      .get('/api/division')
      .then(res => {
        this.setState({
          divisions: res.data
        });
      })
      .catch(err => console.log(err.response.data));
  }

  async onDelete(data) {
    await axios
      .delete(`/api/user/${data._id}`)
      .then(res => {
        if (res.status === 200) {
          this.toggleModals();
          this.getUsers();
        }
      })
      .catch(err => err.response.data);
  }

  onSubmit(e) {
    e.preventDefault();

    const updateUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      role: this.state.role
      // division: this.state.division
    };

    axios
      .patch(`/api/user/${this.state.id}`, updateUser)
      .then(() => {
        this.toggle.bind(this, this.state.data);
        this.getUsers();
      })
      .catch(err =>
        this.setState({
          errors: err.response.data
        })
      );
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleClick(e, index) {
    e.preventDefault();

    this.setState({
      currentPage: index
    });
  }

  toggleModals() {
    this.setState(prevState => ({
      modalDelete: !prevState.modalDelete
    }));
  }

  toggle(data) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      id: data._id,
      name: data.name,
      email: data.email,
      // password: data.password,
      role: data.role._id,
      data: data,
      division: ''
    }));
    if (data.division) {
      this.setState({
        division: data.division._id
      });
    }
  }

  render() {
    const { currentPage, errors } = this.state;

    return (
      /*--------------------------------------------------------------------------------*/
      /* Menampilkan semua WO untuk semua USER                                          */
      /*--------------------------------------------------------------------------------*/

      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div>
              <CardTitle>List Users</CardTitle>
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
                          onClick={this.toggle.bind(this, data)}>
                          {this.props.buttonLabel}
                          <i className='mdi mdi-pencil' />
                        </Button>
                        <Modal
                          isOpen={this.state.modal}
                          toggle={this.toggle.bind(this, data)}
                          className={this.props.className}>
                          <ModalHeader toggle={this.toggle.bind(this, data)}>
                            Edit
                          </ModalHeader>
                          <Form onSubmit={this.onSubmit}>
                            <ModalBody>
                              <FormGroup>
                                <Input
                                  invalid={errors.access ? true : false}
                                  hidden
                                />
                                <FormFeedback>{errors.access}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='name'>Name</Label>
                                <Input
                                  invalid={errors.name ? true : false}
                                  type='text'
                                  name='name'
                                  id='name'
                                  placeholder='Name'
                                  value={this.state.name}
                                  onChange={this.onChange}
                                />
                                <FormFeedback>{errors.name}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='email'>Email</Label>
                                <Input
                                  invalid={errors.email ? true : false}
                                  type='email'
                                  name='email'
                                  id='email'
                                  placeholder='Email'
                                  value={this.state.email}
                                  onChange={this.onChange}
                                />
                                <FormFeedback>{errors.email}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='password'>Password</Label>
                                <Input
                                  invalid={errors.password ? true : false}
                                  type='password'
                                  name='password'
                                  id='password'
                                  placeholder='Password'
                                  value={this.state.password}
                                  onChange={this.onChange}
                                />
                                <FormFeedback>{errors.password}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='role'>Role</Label>
                                <Input
                                  invalid={errors.role ? true : false}
                                  type='select'
                                  name='role'
                                  id='role'
                                  value={this.state.role}
                                  onChange={this.onChange}>
                                  <option value='' disabled>
                                    Select role
                                  </option>
                                  {this.state.roles.map((role, id) => {
                                    return (
                                      <option key={id} value={role._id}>
                                        {role.name}
                                      </option>
                                    );
                                  })}
                                </Input>
                                <FormFeedback>{errors.role}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='division'>Division</Label>
                                <Input
                                  invalid={errors.division ? true : false}
                                  type='select'
                                  name='division'
                                  id='division'
                                  value={this.state.division}
                                  onChange={this.onChange}>
                                  <option value='' disabled>
                                    Select division
                                  </option>
                                  {this.state.divisions.map((division, id) => {
                                    return (
                                      <option key={id} value={division._id}>
                                        {division.name}
                                      </option>
                                    );
                                  })}
                                </Input>
                                <FormFeedback>{errors.division}</FormFeedback>
                              </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                              <Button color='biruicon' type='submit'>
                                Submit
                              </Button>{' '}
                              <Button
                                color='secondary'
                                onClick={this.toggle.bind(this, data)}>
                                Cancel
                              </Button>
                            </ModalFooter>
                          </Form>
                        </Modal>
                        <Button
                          onClick={this.toggleModals}
                          className='profile-time-approved'
                          outline
                          color='danger'>
                          <i className='mdi mdi-delete' />
                        </Button>
                        <Modal
                          isOpen={this.state.modalDelete}
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
