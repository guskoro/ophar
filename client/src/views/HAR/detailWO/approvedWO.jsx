import React from 'react';
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
  Table
} from 'reactstrap';
import swal from 'sweetalert';
import axios from 'axios';
import Pusher from 'pusher-js';
import moment from 'moment';
import { Link } from 'react-router-dom';

const pusher = new Pusher('12f41be129ba1c0d7a3c', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('ophar-app');

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.pageSize = 5;
    // this.onChange = this.onChange.bind(this);
    this.state = {
      WOs: [],
      filtered: [],
      currentPage: 0,
      pagesCount: 0,
      modal: false,
      role: '',
      modalNote: false,
      note: ''
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

  handleClick(e, index) {
    e.preventDefault();

    this.setState({
      currentPage: index
    });
  }

  async componentDidMount() {
    await this.getCurrentUser();
    await this.getWO();
    await this.getPusher();
  }

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

    await channel.bind('delete-wo', data => {
      this.setState(state => {
        const WOs = state.WOs.filter(item => item._id !== data._id);

        return {
          WOs,
          filtered: WOs,
          pagesCount: Math.ceil(WOs.length / this.pageSize)
        };
      });
    });
  }

  async getCurrentUser() {
    await axios
      .get('/api/user/current')
      .then(res => {
        this.setState({
          role: res.data.role
        });
      })
      .catch(err => console.log(err.response.data));
  }

  async getWO() {
    let query = 'approved_by_spv=false&rejected=false';
    if (this.state.role === 'manager') {
      query = 'approved_by_spv=true&approved_by_manager=false&rejected=false';
    }

    await axios
      .get(`/api/working-order?${query}`)
      .then(res => {
        this.setState({
          WOs: res.data,
          filtered: res.data,
          pagesCount: Math.ceil(res.data.length / this.pageSize)
        });
      })
      .catch(err => console.log(err.response.data));
  }

  async onApprove(data) {
    await swal({
      title: 'Approve work order',
      text: 'Are you sure to approve this work order?',
      icon: 'info',
      buttons: true
    }).then(result => {
      if (result) {
        return axios
          .post(`/api/working-order/approve/${data._id}`)
          .then(res => {
            if (res.status === 200) {
              swal('Yey! This work order is approved!', {
                icon: 'success'
              });
              this.getWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  }

  async onReject(data) {
    await swal({
      title: 'Reject work order',
      text: 'Are you sure to reject this work order?',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(result => {
      if (result) {
        return axios
          .post(`/api/working-order/reject/${data._id}`)
          .then(res => {
            if (res.status === 200) {
              swal('Ohh! This work order is rejected!', {
                icon: 'success'
              });
              this.getWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  }

  async onAddNote(e, data) {
    e.preventDefault();

    console.log(this.state.note);

    const newWorkingOrder = {
      note: this.state.note
    };

    await axios
      .patch(`/api/working-order/${data._id}`, newWorkingOrder)
      .then(res => {
        if (res.status === 200) {
          this.getWO();
          this.toggleNote(data);
        }
      })
      .catch(err => console.log(err));
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleNote(data) {
    this.setState(prevState => ({
      modalNote: !prevState.modalNote,
      note: data.note
    }));
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
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
              <CardTitle>New Work Orders</CardTitle>
              <CardSubtitle>HAR</CardSubtitle>
            </div>
            <div className='ml-auto d-flex no-block align-items-center'>
              <div className='dl batas-kanan'>
                <Input type='select' className='custom-select'>
                  <option value='0'>All</option>
                  <option value='1'>Corrective Maintenance</option>
                  <option value='2'>Preventive Maintenance</option>
                  <option value='3'>Assets</option>
                  <option value='4'>Patrols and Controls</option>
                </Input>
              </div>
              <div className='dl'>
                <InputGroup>
                  <InputGroupAddon addonType='append'>
                    <Input
                      type='text'
                      className='input'
                      onChange={this.handleChange}
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
                <th className='border-0'>Details</th>
                <th className='border-0'>Action</th>
                <th className='border-0'>Note</th>
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
                            <span>{data.division}</span>
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
                        <Link to={{ pathname: `/detailWO/${data._id}` }}>
                          <Button className='btn' outline color='success'>
                            Show
                          </Button>
                        </Link>
                      </td>
                      <td>
                        <Button
                          className='btn'
                          outline
                          color='biruicon'
                          onClick={this.onApprove.bind(this, data)}>
                          <i className='mdi mdi-check' />
                        </Button>
                        <Button
                          className='profile-time-approved'
                          outline
                          color='danger'
                          onClick={this.onReject.bind(this, data)}>
                          <i className='mdi mdi-close' />
                        </Button>
                      </td>
                      <td>
                        <Button
                          onClick={this.toggleNote.bind(this, data)}
                          outline
                          color='secondary'
                          className='btn'>
                          Add Note
                        </Button>
                        <Modal
                          isOpen={this.state.modalNote}
                          toggle={this.toggleNote.bind(this, data)}
                          className={this.props.className}>
                          <ModalHeader
                            toggle={this.toggleNote.bind(this, data)}>
                            Add a note
                          </ModalHeader>
                          <Form
                            onSubmit={e => {
                              this.onAddNote(e, data);
                            }}>
                            <ModalBody>
                              <FormGroup>
                                <Label for='note'>Work Note</Label>
                                <Input
                                  type='textarea'
                                  name='note'
                                  id='note'
                                  value={this.state.note}
                                  onChange={this.onChange}
                                />
                              </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                              <Button color='biruicon' type='submit'>
                                Submit
                              </Button>
                              <Button
                                color='secondary'
                                onClick={this.toggleNote.bind(this, data)}>
                                Cancel
                              </Button>
                            </ModalFooter>
                          </Form>
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
