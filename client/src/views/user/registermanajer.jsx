import React from 'react';

import img1 from '../../assets/images/users/1.jpg';
import img2 from '../../assets/images/users/2.jpg';
import img3 from '../../assets/images/users/3.jpg';
import img4 from '../../assets/images/users/4.jpg';

import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  CustomInput,
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
  Nav,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  Tooltip
} from 'reactstrap';

import { NavLink } from 'react-router-dom';

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
  }
}

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);

    this.toggle10 = this.toggle10.bind(this);
    this.toggle20 = this.toggle20.bind(this);
    this.toggle30 = this.toggle30.bind(this);
    this.toggle40 = this.toggle40.bind(this);
    this.state = {
      tooltipOpen10: false,
      tooltipOpen20: false,
      tooltipOpen30: false,
      tooltipOpen40: false
    };
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

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
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
              <div className='dl'>
                <NavLink to='/registerform'>
                  <Button className='btn' color='success'>
                    Add User
                  </Button>{' '}
                </NavLink>
              </div>
              <div className='dl'>
                <Input type='select' className='custom-select'>
                  <option value='0'>All</option>
                  <option value='1'>CM</option>
                  <option value='2'>PM</option>
                  <option value='3'>Asset</option>
                  <option value='4'>P3AK</option>
                </Input>
              </div>
            </div>
          </div>
          <Table className='no-wrap v-middle' responsive>
            <thead>
              <tr className='border-0'>
                <th className='border-0'>No</th>
                <th className='border-0'>Divisi</th>
                <th className='border-0'>Name</th>
                <th className='border-0'>Role</th>
                <th className='border-0'>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>PM</td>
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
                        Dino Puguh Mugholladoh
                      </h5>
                      <span>dino@mugholladoh.com</span>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge color='primary' className='ml-0' pill>
                    Manager
                  </Badge>
                </td>
                <td>
                  <Button
                    className='btn'
                    outline
                    color='biruicon'
                    onClick={this.toggle}>
                    {this.props.buttonLabel}Edit
                  </Button>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Register</ModalHeader>
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
                          <Input type='select' name='select' id='exampleSelect'>
                            <option>...</option>
                            <option>Admin</option>
                            <option>Manager</option>
                            <option>Supervisor</option>
                            <option>Engineer</option>
                          </Input>
                        </FormGroup>
                        <FormGroup>
                          <Label for='exampleSelect'>Division</Label>
                          <Input type='select' name='select' id='exampleSelect'>
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
                    Delete
                  </Button>{' '}
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>CM</td>
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
                        Dino Puguh Mugholladoh
                      </h5>
                      <span>dino@mugholladoh.com</span>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge color='secondary' className='ml-0' pill>
                    Supervisor
                  </Badge>
                </td>
                <td>
                  <Button
                    className='btn'
                    outline
                    color='biruicon'
                    onClick={this.toggle}>
                    {this.props.buttonLabel}Edit
                  </Button>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Register</ModalHeader>
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
                          <Input type='select' name='select' id='exampleSelect'>
                            <option>...</option>
                            <option>Admin</option>
                            <option>Manager</option>
                            <option>Supervisor</option>
                            <option>Engineer</option>
                          </Input>
                        </FormGroup>
                        <FormGroup>
                          <Label for='exampleSelect'>Division</Label>
                          <Input type='select' name='select' id='exampleSelect'>
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
                      <Button color='primarya' onClick={this.toggle}>
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
                    Delete
                  </Button>{' '}
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Asset</td>
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
                        Dino Puguh Mugholladoh
                      </h5>
                      <span>dino@mugholladoh.com</span>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge color='light' className='ml-0' pill>
                    Engineer
                  </Badge>
                </td>
                <td>
                  <Button
                    className='btn'
                    outline
                    color='biruicon'
                    onClick={this.toggle}>
                    {this.props.buttonLabel}Edit
                  </Button>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Register</ModalHeader>
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
                          <Input type='select' name='select' id='exampleSelect'>
                            <option>...</option>
                            <option>Admin</option>
                            <option>Manager</option>
                            <option>Supervisor</option>
                            <option>Engineer</option>
                          </Input>
                        </FormGroup>
                        <FormGroup>
                          <Label for='exampleSelect'>Division</Label>
                          <Input type='select' name='select' id='exampleSelect'>
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
                      <Button color='primarya' onClick={this.toggle}>
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
                    Delete
                  </Button>{' '}
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>CM</td>
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
                        Guskoro Pradipta Prana Arief
                      </h5>
                      <span>guskoro@mugholladoh.com</span>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge color='success' className='ml-0' pill>
                    Admin
                  </Badge>
                </td>
                <td>
                  <Button
                    className='btn'
                    outline
                    color='biruicon'
                    onClick={this.toggle}>
                    {this.props.buttonLabel}Edit
                  </Button>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Register</ModalHeader>
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
                          <Input type='select' name='select' id='exampleSelect'>
                            <option>...</option>
                            <option>Admin</option>
                            <option>Manager</option>
                            <option>Supervisor</option>
                            <option>Engineer</option>
                          </Input>
                        </FormGroup>
                        <FormGroup>
                          <Label for='exampleSelect'>Division</Label>
                          <Input type='select' name='select' id='exampleSelect'>
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
                      <Button color='primarya' onClick={this.toggle}>
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
                    Delete
                  </Button>{' '}
                </td>
              </tr>
            </tbody>
          </Table>
          <Row>
            <Col xs='12' md='12'>
              <CardBody className='border-top'>
                <Pagination aria-label='Page navigation example'>
                  <PaginationItem disabled>
                    <PaginationLink previous href='#' />
                  </PaginationItem>
                  <PaginationItem active>
                    <PaginationLink href='#'>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#'>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#'>3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#'>4</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#'>5</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink next href='#' />
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
