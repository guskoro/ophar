import React from 'react';

import img1 from '../../../assets/images/users/1.jpg';
// import img2 from '../../assets/images/users/2.jpg';
// import img3 from '../../assets/images/users/3.jpg';
// import img4 from '../../assets/images/users/4.jpg';

import {
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
  Table,
  Tooltip
} from 'reactstrap';

import { NavLink } from 'react-router-dom';

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    // Reject Modal & Approve Modal
    this.toggleR = this.toggleR.bind(this);
    this.toggleA = this.toggleA.bind(this);

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

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleR() {
    this.setState(prevState => ({
      modalR: !prevState.modalR
    }));
  }

  toggleA() {
    this.setState(prevState => ({
      modalA: !prevState.modalA
    }));
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
    return (
      /*--------------------------------------------------------------------------------*/
      /* Used In Dashboard-4 [General]                                                  */
      /*--------------------------------------------------------------------------------*/
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div>
              <CardTitle>New Workorders</CardTitle>
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
                <InputGroup>
                  <InputGroupAddon addonType='append'>
                    <Input placeholder='Search..' />
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
                <th className='border-0'>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>012SAKX</td>
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
                      <h5 className='mb-0 font-16 font-medium'>Hanna Gover</h5>
                      <span>hgover@gmail.com</span>
                    </div>
                  </div>
                </td>
                <td>Elite Admin</td>
                <td>Elite Admin</td>
                <td>Low</td>
                <td>Guskoro, Puguh</td>
                <td className='blue-grey-text  text-darken-4 font-medium'>
                  $96K
                </td>
                <td>
                  <i className='fa fa-circle text-muted' id='tlp4' />
                  <Tooltip
                    placement='top'
                    isOpen={this.state.tooltipOpen40}
                    target='tlp4'
                    toggle={this.toggle40}>
                    WO Done
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
                  <Button
                    className='btn'
                    outline
                    color='biruicon'
                    onClick={this.toggleA}>
                    {this.props.buttonLabel}
                    <i className='mdi mdi-check' />
                  </Button>{' '}
                  <Modal
                    isOpen={this.state.modalA}
                    toggle={this.toggleA}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggleA}>
                      Approve Workorders
                    </ModalHeader>
                    <ModalBody>
                      Are you sure want to approve this work?
                    </ModalBody>
                    <ModalFooter>
                      <Button color='biruicon' onClick={this.toggleA}>
                        Yes
                      </Button>{' '}
                      <Button color='secondary' onClick={this.toggleA}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                  <Button
                    className='profile-time-approved'
                    outline
                    color='danger'
                    onClick={this.toggleR}>
                    {this.props.buttonLabel}
                    <i className='mdi mdi-close' />
                  </Button>{' '}
                  <Modal
                    isOpen={this.state.modalR}
                    toggle={this.toggleR}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggleR}>
                      Reject Workorders
                    </ModalHeader>
                    <ModalBody>
                      Are you sure want to reject this work?
                    </ModalBody>
                    <ModalFooter>
                      <Button color='biruicon' onClick={this.toggleR}>
                        Yes
                      </Button>{' '}
                      <Button color='secondary' onClick={this.toggleR}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </td>
                <td>
                  <Button outline color='secondary' onClick={this.toggle}>
                    {this.props.buttonLabel}Add a note
                  </Button>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add a note</ModalHeader>
                    <ModalBody>
                      <Form>
                        <FormGroup>
                          <Label for='exampleText'>Work Note</Label>
                          <Input type='textarea' name='text' id='exampleText' />
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
                </td>
              </tr>
            </tbody>
          </Table>
          <Row>
            <Col xs='12' md='12'>
              <CardBody className='border-top'>
                <Pagination aria-label='Page navigation example'>
                  <PaginationItem disable>
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
