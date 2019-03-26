import React from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Form,
  Col,
  CustomInput,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Table
} from 'reactstrap';

import isEmpty from '../../../validations/is-empty';
import axios from 'axios';
import Pusher from 'pusher-js';
import FileDownload from 'js-file-download';
import swal from 'sweetalert';
import moment from 'moment';
import classnames from 'classnames';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import Select from 'react-select';
import DayPicker from 'react-day-picker';

import MomentLocaleUtils, {
  formatDate,
  parseDate
} from 'react-day-picker/moment';

const pusher = new Pusher('12f41be129ba1c0d7a3c', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('ophar-app');

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTab = this.toggleTab.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
    this.downloadReport = this.downloadReport.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

    this.state = {
      currentUser: {},
      errors: [],
      detailWO: {},
      isOpen: false,
      activeTab: '1',
      id: this.props.match.params.id,
      plans: [],
      users: [],
      notes: [],
      plan: '',
      note: '',
      modal: false,
      priority: '',
      title: '',
      description: '',
      plans: [],
      program: '',
      type: '',
      types: [],
      priorities: []
    };
  }

  onSubmit(e) {
    e.preventDefault();

    const {
      type,
      priority,
      title,
      plans,
      users,
      description,
      program,
      deadline
    } = this.state;

    const newWO = {
      type: type,
      priority: priority,
      title: title,
      plans: plans,
      users: users,
      description: description,
      program: program,
      deadline: deadline
    };

    console.log(newWO);
    axios
      .post('/api/working-order', newWO)
      .then(() => {
        swal({
          title: 'Success!',
          text: 'You added a new work order!',
          icon: 'success',
          button: 'OK!'
        });
        this.setState({
          errors: [],
          inputValue: '',
          plans: '',
          users: [],
          type: '',
          priority: '',
          title: '',
          description: '',
          program: '',
          deadline: undefined
        });
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.setState({
            errorAccess: true
          });
        } else {
          this.setState({ errors: err.response.data });
        }
      });
  }

  componentDidMount = async () => {
    await this.getDetailWO();
    await this.getCurrentUser();
    await this.getPusher();
  };

  getPusher = async () => {
    await channel.bind('done-wo', data => {
      if (data._id === this.state.detailWO._id) {
        const woCustom = {
          _id: data._id,
          title: data.title,
          description: data.description,
          division: data.division,
          type: data.type.name,
          priority: data.priority.name,
          plans: data.plans,
          plans_string: data.plans_string,
          users: data.users,
          program: data.program,
          notes: data.notes,
          approved_by_spv: data.approved_by_spv,
          approved_by_manager: data.approved_by_manager,
          approved_by_engineer: data.approved_by_engineer,
          rejected: data.rejected,
          rejected_by_engineer: data.rejected_by_engineer,
          done: data.done,
          start: data.start,
          deadline: data.deadline,
          end: data.end,
          report: data.report,
          created_at: data.created_at,
          pic_id: data.pic._id,
          pic_name: data.pic.name,
          pic_email: data.pic.email,
          pic_avatar: data.pic.avatar
        };

        this.setState({
          detailWO: woCustom,
          plans: woCustom.plans,
          users: woCustom.users,
          notes: woCustom.notes
        });
      }
    });

    await channel.bind('approve-wo', data => {
      if (data._id === this.state.detailWO._id) {
        const woCustom = {
          _id: data._id,
          title: data.title,
          description: data.description,
          division: data.division,
          type: data.type.name,
          priority: data.priority.name,
          plans: data.plans,
          plans_string: data.plans_string,
          users: data.users,
          program: data.program,
          notes: data.notes,
          approved_by_spv: data.approved_by_spv,
          approved_by_manager: data.approved_by_manager,
          approved_by_engineer: data.approved_by_engineer,
          rejected: data.rejected,
          rejected_by_engineer: data.rejected_by_engineer,
          done: data.done,
          start: data.start,
          deadline: data.deadline,
          end: data.end,
          report: data.report,
          created_at: data.created_at,
          pic_id: data.pic._id,
          pic_name: data.pic.name,
          pic_email: data.pic.email,
          pic_avatar: data.pic.avatar
        };

        this.setState({
          detailWO: woCustom,
          plans: woCustom.plans,
          users: woCustom.users,
          notes: woCustom.notes
        });
      }
    });

    await channel.bind('reject-wo', data => {
      if (data._id === this.state.detailWO._id) {
        const woCustom = {
          _id: data._id,
          title: data.title,
          description: data.description,
          division: data.division,
          type: data.type.name,
          priority: data.priority.name,
          plans: data.plans,
          plans_string: data.plans_string,
          users: data.users,
          program: data.program,
          notes: data.notes,
          approved_by_spv: data.approved_by_spv,
          approved_by_manager: data.approved_by_manager,
          approved_by_engineer: data.approved_by_engineer,
          rejected: data.rejected,
          rejected_by_engineer: data.rejected_by_engineer,
          done: data.done,
          start: data.start,
          deadline: data.deadline,
          end: data.end,
          report: data.report,
          created_at: data.created_at,
          pic_id: data.pic._id,
          pic_name: data.pic.name,
          pic_email: data.pic.email,
          pic_avatar: data.pic.avatar
        };

        this.setState({
          detailWO: woCustom,
          plans: woCustom.plans,
          users: woCustom.users,
          notes: woCustom.notes
        });
      }
    });

    await channel.bind('update-wo', data => {
      if (data._id === this.state.detailWO._id) {
        const woCustom = {
          _id: data._id,
          title: data.title,
          description: data.description,
          division: data.division,
          type: data.type.name,
          priority: data.priority.name,
          plans: data.plans,
          plans_string: data.plans_string,
          users: data.users,
          program: data.program,
          notes: data.notes,
          approved_by_spv: data.approved_by_spv,
          approved_by_manager: data.approved_by_manager,
          approved_by_engineer: data.approved_by_engineer,
          rejected: data.rejected,
          rejected_by_engineer: data.rejected_by_engineer,
          done: data.done,
          start: data.start,
          deadline: data.deadline,
          end: data.end,
          report: data.report,
          created_at: data.created_at,
          pic_id: data.pic._id,
          pic_name: data.pic.name,
          pic_email: data.pic.email,
          pic_avatar: data.pic.avatar
        };
        this.setState({
          detailWO: woCustom,
          plans: woCustom.plans,
          users: woCustom.users,
          notes: woCustom.notes
        });
      }
    });

    await channel.bind('add-note-wo', data => {
      if (data._id === this.state.detailWO._id) {
        const woCustom = {
          _id: data._id,
          title: data.title,
          description: data.description,
          division: data.division,
          type: data.type.name,
          priority: data.priority.name,
          plans: data.plans,
          plans_string: data.plans_string,
          users: data.users,
          program: data.program,
          notes: data.notes,
          approved_by_spv: data.approved_by_spv,
          approved_by_manager: data.approved_by_manager,
          approved_by_engineer: data.approved_by_engineer,
          rejected: data.rejected,
          rejected_by_engineer: data.rejected_by_engineer,
          done: data.done,
          start: data.start,
          deadline: data.deadline,
          end: data.end,
          report: data.report,
          created_at: data.created_at,
          pic_id: data.pic._id,
          pic_name: data.pic.name,
          pic_email: data.pic.email,
          pic_avatar: data.pic.avatar
        };

        this.setState({
          detailWO: woCustom,
          plans: woCustom.plans,
          users: woCustom.users,
          notes: woCustom.notes
        });
      }
    });

    await channel.bind('upload-report-wo', data => {
      if (data._id === this.state.detailWO._id) {
        const woCustom = {
          _id: data._id,
          title: data.title,
          description: data.description,
          division: data.division,
          type: data.type.name,
          priority: data.priority.name,
          plans: data.plans,
          plans_string: data.plans_string,
          users: data.users,
          program: data.program,
          notes: data.notes,
          approved_by_spv: data.approved_by_spv,
          approved_by_manager: data.approved_by_manager,
          approved_by_engineer: data.approved_by_engineer,
          rejected: data.rejected,
          rejected_by_engineer: data.rejected_by_engineer,
          done: data.done,
          start: data.start,
          deadline: data.deadline,
          end: data.end,
          report: data.report,
          created_at: data.created_at,
          pic_id: data.pic._id,
          pic_name: data.pic.name,
          pic_email: data.pic.email,
          pic_avatar: data.pic.avatar
        };

        this.setState({
          detailWO: woCustom,
          plans: woCustom.plans,
          users: woCustom.users,
          notes: woCustom.notes
        });
      }
    });
  };

  getCurrentUser = () => {
    axios
      .get('/api/user/current')
      .then(res => {
        this.setState({
          currentUser: res.data
        });
      })
      .catch(err => {
        if (err.response.status === 401) this.setState({ currentUser: {} });
      });
  };

  getDetailWO = async () => {
    await axios
      .get(`/api/working-order/${this.state.id}`)
      .then(res => {
        this.setState({
          detailWO: res.data,
          plans: res.data.plans,
          users: res.data.users,
          notes: res.data.notes
        });
      })
      .catch(err => console.log(err.response.data));
  };

  onDone = async data => {
    await swal({
      title: 'Done work order',
      text: 'Are you sure to done this work order?',
      icon: 'info',
      buttons: true
    }).then(result => {
      if (result) {
        return axios
          .post(`/api/working-order/done/${data._id}`)
          .then(res => {
            if (res.status === 200) {
              swal('Good! Your work order is done!', {
                icon: 'success'
              });
              this.getDetailWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  };

  onReject = async data => {
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
              this.getDetailWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  };

  onApprove = async data => {
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
              this.getDetailWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  };

  onAddNote = async e => {
    e.preventDefault();
    console.log(this.state.note);
    const noteRequest = {
      note: this.state.note
    };

    await axios
      .post(`/api/working-order/add-note/${this.state.id}`, noteRequest)
      .then(res => {
        if (res.status === 200) {
          this.setState({ note: '' });
          this.getDetailWO();
        }
      })
      .catch(err => console.log(err));
  };

  onAddPlan = data => {
    swal({
      text: 'Add plan for this work order',
      content: {
        element: 'input',
        attributes: {
          value: this.state.plan
        }
      },
      button: 'Add Plan'
    }).then(plan => {
      const newWorkingOrder = {
        plan: plan
      };
      return axios
        .patch(`/api/working-order/${data._id}`, newWorkingOrder)
        .then(res => {
          if (res.status === 200) {
            this.getDetailWO();
          }
        })
        .catch(err => console.log(err));
    });
  };

  downloadReport = async () => {
    await axios
      .get(`/api/working-order/download-report/${this.state.id}`, {
        responseType: 'blob'
      })
      .then(res => {
        console.log(res);
        FileDownload(res.data, this.state.detailWO.report);
      })
      .catch(err => console.log(err.response.data));
  };

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  toggleModal() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onChangeCheckbox = e => {
    const plans = this.state.plans;

    plans[e.target.id].done = e.target.checked;

    this.setState({
      plans: plans
    });

    const newWorkingOrder = {
      plans: this.state.plans
    };

    axios
      .patch(`/api/working-order/${this.state.id}`, newWorkingOrder)
      .then(() => {
        this.getDetailWO();
      })
      .catch(err => console.log(err.response.data));
  };

  render() {
    const {
      detailWO,
      users,
      currentUser,
      errors,
      note,
      notes,
      priorities,
      types,
      type,
      priority,
      title,
      plans,
      list_users,
      description,
      program
    } = this.state;

    return (
      <Card>
        <CardBody>
          <Row>
            <Col sm={12} lg={4}>
              <div>
                <div className='d-flex no-block align-items-center'>
                  <div className='mr-2'>
                    <img
                      src={`https:${detailWO.pic_avatar}`}
                      alt='user'
                      className='rounded-circle'
                      width='100'
                    />
                  </div>
                  <div className=''>
                    <h1 className='mb-0 font-28 font-medium'>
                      {detailWO.pic_name}
                    </h1>
                    <span>{detailWO.division}</span>
                    <h4>
                      <Badge color='success' className='ml-0'>
                        WO Created at{' '}
                        {moment(detailWO.created_at).format('DD/MM/YYYY')}
                      </Badge>
                    </h4>
                  </div>
                  <div>
                    {currentUser.role === 'field support' && (
                      <td>
                        <Button
                          outline
                          color='danger'
                          onClick={this.toggleModal}>
                          <i className='mdi mdi-pencil' />
                          {this.props.buttonLabel}
                        </Button>
                        <Modal
                          isOpen={this.state.modal}
                          toggle={this.toggleModal}
                          className={this.props.className}>
                          <ModalHeader toggle={this.toggleModal}>
                            Edit Work Order
                          </ModalHeader>
                          <ModalBody>
                            <Form onSubmit={this.onSubmit}>
                              <FormGroup>
                                <Input
                                  invalid={errors.access ? true : false}
                                  hidden
                                />
                                <FormFeedback>{errors.access}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='title'>Work Order Title</Label>
                                <Input
                                  invalid={errors.title ? true : false}
                                  type='text'
                                  name='title'
                                  id='title'
                                  placeholder='Input title'
                                  value={title}
                                  onChange={this.onChange}
                                />
                                <FormFeedback>{errors.title}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='description'>
                                  Work Order Description
                                </Label>
                                <Input
                                  invalid={errors.description ? true : false}
                                  type='textarea'
                                  name='description'
                                  id='description'
                                  placeholder='Input description'
                                  value={description}
                                  onChange={this.onChange}
                                />
                                <FormFeedback>
                                  {errors.description}
                                </FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='plans'>Work Order Plans</Label>
                                <Input
                                  invalid={errors.plans ? true : false}
                                  type='textarea'
                                  name='plans'
                                  id='plans'
                                  rows={9}
                                  placeholder='Input plans'
                                  value={plans}
                                  onChange={this.onChange}
                                />
                                {/* <CreatableSelect
                components={components}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder='Type plan and press enter...'
                value={plans}
              /> */}
                              </FormGroup>
                              <FormGroup>
                                <Label for='deadline' className='block-display'>
                                  Work Order Deadline
                                </Label>
                                <DayPicker
                                  id='deadline'
                                  formatDate={formatDate}
                                  parseDate={parseDate}
                                  onDayClick={this.handleDayClick}
                                  selectedDays={this.state.deadline}
                                />
                                <FormFeedback>{errors.deadline}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='priority'>
                                  Work Order Priority
                                </Label>
                                <Input
                                  invalid={errors.priority ? true : false}
                                  type='select'
                                  name='priority'
                                  id='priority'
                                  value={priority}
                                  onChange={this.onChange}>
                                  <option value='' disabled>
                                    Select priority
                                  </option>
                                  {priorities.map((priority, id) => {
                                    return (
                                      <option key={id} value={priority._id}>
                                        {priority.name}
                                      </option>
                                    );
                                  })}
                                </Input>
                                <FormFeedback>{errors.priority}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='type'>Work Order Type</Label>
                                <Input
                                  invalid={errors.type ? true : false}
                                  type='select'
                                  name='type'
                                  id='type'
                                  value={type}
                                  onChange={this.onChange}>
                                  <option value='' disabled>
                                    Select type
                                  </option>
                                  {types.map((type, id) => {
                                    return (
                                      <option key={id} value={type._id}>
                                        {type.name}
                                      </option>
                                    );
                                  })}
                                </Input>
                                <FormFeedback>{errors.type}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='program'>Work Order Program</Label>
                                <Input
                                  invalid={errors.program ? true : false}
                                  type='select'
                                  name='program'
                                  id='program'
                                  value={program}
                                  onChange={this.onChange}>
                                  <option value='' disabled>
                                    Select program
                                  </option>
                                  <option value='Non-rutin'>Non Rutin</option>
                                  <option value='Rutin'>Rutin</option>
                                </Input>
                                <FormFeedback>{errors.program}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for='users'>Work Order users</Label>
                                <Select
                                  isMulti
                                  name='colors'
                                  options={list_users}
                                  onChange={this.handleChangeSelect}
                                  className='basic-multi-select'
                                  classNamePrefix='select'
                                  value={users}
                                />
                              </FormGroup>
                              <Button type='submit' color='biruicon'>
                                Submit
                              </Button>
                            </Form>
                          </ModalBody>
                          <ModalFooter>
                            <Button color='primary' onClick={this.toggleModal}>
                              Save
                            </Button>{' '}
                            <Button
                              color='secondary'
                              onClick={this.toggleModal}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </td>
                    )}
                  </div>
                </div>
              </div>
              <div className='profile'>
                <h1 className='mb-1 font-20 font-medium'>{detailWO.title}</h1>
              </div>
              {detailWO.rejected && (
                <div className='profile'>
                  <h4>
                    <Badge color='danger' className='ml-0' pill>
                      Rejected
                    </Badge>
                  </h4>
                </div>
              )}
              {!(
                detailWO.approved_by_spv ||
                detailWO.approved_by_manager ||
                detailWO.rejected
              ) && (
                <div className='profile'>
                  <h4>
                    <Badge color='warning' className='ml-0' pill>
                      Pending Approval
                    </Badge>
                  </h4>
                </div>
              )}
              {detailWO.approved_by_spv &&
                !detailWO.approved_by_manager &&
                !detailWO.done &&
                !detailWO.rejected && (
                  <div className='profile'>
                    <h4>
                      <Badge color='warning' className='ml-0' pill>
                        Approved by Supervisor
                      </Badge>
                    </h4>
                  </div>
                )}
              {detailWO.approved_by_spv &&
                detailWO.approved_by_manager &&
                !detailWO.done &&
                !detailWO.approved_by_engineer &&
                !detailWO.rejected_by_engineer && (
                  <div className='profile'>
                    <h4>
                      <Badge color='success' className='ml-0' pill>
                        Approved by Manager at{' '}
                        {moment(detailWO.start).format('DD-MM-YYYY HH:mm')}
                      </Badge>
                    </h4>
                  </div>
                )}
              {detailWO.approved_by_spv &&
                detailWO.approved_by_manager &&
                !detailWO.approved_by_engineer &&
                detailWO.rejected_by_engineer && (
                  <div className='profile'>
                    <h4>
                      <Badge color='danger' className='ml-0' pill>
                        Rejected by Engineer
                      </Badge>
                    </h4>
                  </div>
                )}
              {detailWO.done &&
                !detailWO.approved_by_engineer &&
                !detailWO.rejected_by_engineer && (
                  <div className='profile'>
                    <h4>
                      <Badge color='warning' className='ml-0' pill>
                        Pending Approval Engineer
                      </Badge>
                    </h4>
                  </div>
                )}
              {detailWO.done && detailWO.approved_by_engineer && (
                <div className='profile'>
                  <h4>
                    <Badge color='info' className='ml-0' pill>
                      Done at {moment(detailWO.end).format('DD-MM-YYYY HH:mm')}
                    </Badge>
                  </h4>
                </div>
              )}
              {!detailWO.done &&
                !detailWO.rejected &&
                !detailWO.rejected_by_engineer && (
                  <div className='profile'>
                    <h1 className='mb-0 font-16 font-medium' color='info'>
                      Deadline{' '}
                      {moment().isAfter(detailWO.deadline)
                        ? 'is overdue'
                        : moment().to(detailWO.deadline)}{' '}
                      :
                      <span className='profile-time-approved'>
                        {moment(detailWO.deadline).format('DD-MM-YYYY HH:mm')}
                      </span>
                    </h1>
                  </div>
                )}
              {/* Iki lek login berdasar divisine dewe2, lek gak, gak metu tombol e */}
              {!detailWO.approved_by_engineer && !detailWO.rejected && (
                <div className='profile batas-kanan'>
                  {users.filter(user => {
                    return user._id === currentUser._id;
                  }).length > 0 &&
                    detailWO.approved_by_manager &&
                    !detailWO.done && (
                      <React.Fragment>
                        <Button
                          onClick={this.onDone.bind(this, detailWO)}
                          outline
                          color='biruicon'
                          className='profile batas-kanan'>
                          Done
                        </Button>
                      </React.Fragment>
                    )}
                  {(currentUser.role === 'manager' &&
                    !detailWO.approved_by_manager &&
                    detailWO.approved_by_spv &&
                    !detailWO.done) ||
                  (currentUser.role === 'supervisor' &&
                    !detailWO.approved_by_spv &&
                    !detailWO.done) ||
                  (currentUser._id === detailWO.pic_id &&
                    detailWO.approved_by_manager &&
                    detailWO.approved_by_spv &&
                    detailWO.done) ? (
                    <React.Fragment>
                      <Button
                        onClick={this.onReject.bind(this, detailWO)}
                        outline
                        color='danger'
                        className='profile batas-kanan'>
                        Reject
                      </Button>
                      <Button
                        onClick={this.onApprove.bind(this, detailWO)}
                        outline
                        color='success'
                        className='profile batas-kanan'>
                        Approve
                      </Button>
                      {/* <Button
                        onClick={this.onAddNote.bind(this, detailWO)}
                        outline
                        color='secondary'
                        className='profile batas-kanan'>
                        Add Note
                      </Button> */}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </div>
              )}
              <div>
                {users.filter(user => {
                  return user._id === currentUser._id;
                }).length > 0 &&
                  detailWO.approved_by_spv &&
                  detailWO.approved_by_manager &&
                  !detailWO.approved_by_engineer && (
                    <FilePond
                      className='batas-atas'
                      server={{
                        url: `http://localhost:5000/api/working-order/upload-report/${
                          this.state.id
                        }`,
                        process: {
                          headers: {
                            Authorization: localStorage.getItem('jwtToken')
                          }
                        }
                      }}
                    />
                  )}
              </div>
            </Col>

            <Col sm={12} lg={8}>
              <div>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames('pointer-hover', {
                        active: this.state.activeTab === '1'
                      })}
                      onClick={() => {
                        this.toggleTab('1');
                      }}>
                      Progress Plan
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames('pointer-hover', {
                        active: this.state.activeTab === '2'
                      })}
                      onClick={() => {
                        this.toggleTab('2');
                      }}>
                      Work Detail
                    </NavLink>
                  </NavItem>
                </Nav>
                {/* ISI Tab Lur */}
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId='1'>
                    <Row>
                      <Col sm='12'>
                        <Table className='no-wrap v-middle' responsive>
                          <thead>
                            <tr className='border-0'>
                              <th className='border-0'>
                                {(currentUser._id === detailWO.pic_id ||
                                  users.filter(user => {
                                    return user._id === currentUser._id;
                                  }).length > 0) &&
                                  !detailWO.rejected &&
                                  !detailWO.done && (
                                    <Button
                                      onClick={this.onAddPlan.bind(
                                        this,
                                        detailWO
                                      )}
                                      outline
                                      color='success'
                                      className='profile batas-kanan'>
                                      Add Work Plan{' '}
                                      <span>
                                        <i className='mdi mdi-plus' />
                                      </span>
                                    </Button>
                                  )}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailWO.plans &&
                              detailWO.plans.map((plan, id) => {
                                return (
                                  <tr key={id}>
                                    <td>
                                      <CustomInput
                                        checked={this.state.plans[id].done}
                                        onChange={this.onChangeCheckbox}
                                        disabled={
                                          currentUser.role === 'manager' ||
                                          currentUser.role === 'supervisor' ||
                                          isEmpty(currentUser) ||
                                          !(
                                            users.filter(user => {
                                              return (
                                                user._id === currentUser._id
                                              );
                                            }).length > 0
                                          ) ||
                                          detailWO.rejected ||
                                          detailWO.done ||
                                          !(
                                            detailWO.approved_by_manager &&
                                            detailWO.approved_by_spv
                                          )
                                        }
                                        id={id}
                                        type='checkbox'
                                        name={id}
                                        label={plan.name}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId='2'>
                    <Row>
                      <Col sm='12'>
                        <Table borderless className='wrap v-middle' responsive>
                          <tbody>
                            <tr>
                              <td>Assigned Users</td>
                              <td>
                                <ul className='ml-0'>
                                  {this.state.users.map((user, id) => {
                                    return (
                                      <li key={id} className='ml-0'>
                                        {user.name}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td>Work Type</td>
                              <td>{detailWO.type}</td>
                            </tr>
                            <tr>
                              <td>Work Program</td>
                              <td>{detailWO.program}</td>
                            </tr>
                            <tr>
                              <td>Priority</td>
                              <td>{detailWO.priority}</td>
                            </tr>
                            <tr>
                              <td>Work Description</td>
                              <td>{detailWO.description}</td>
                            </tr>
                            {/* <tr>
                              <td>Work Note</td>
                              <td>{detailWO.note}</td>
                            </tr> */}
                            {(currentUser.role === 'manager' ||
                              currentUser.role === 'supervisor' ||
                              currentUser._id === detailWO.pic_id ||
                              users.filter(user => {
                                return user._id === currentUser._id;
                              }).length > 0) &&
                              detailWO.report && (
                                <tr>
                                  <td>Work Report</td>
                                  <td>
                                    <Button
                                      outline
                                      color='info'
                                      onClick={this.downloadReport}>
                                      Download Report
                                    </Button>
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
            </Col>
          </Row>
          <Row className='batas-atas'>
            <Col sm='12' md='12' lg='12'>
              {(currentUser.role === 'manager' &&
                detailWO.approved_by_spv &&
                !detailWO.approved_by_engineer) ||
              (currentUser.role === 'supervisor' &&
                !detailWO.approved_by_engineer) ||
              (currentUser._id === detailWO.pic_id &&
                !detailWO.approved_by_engineer) ||
              (users.filter(user => {
                return user._id === currentUser._id;
              }).length > 0 &&
                detailWO.approved_by_manager &&
                detailWO.approved_by_spv &&
                !detailWO.approved_by_engineer) ? (
                <FormGroup className='batas-atas'>
                  <Form onSubmit={this.onAddNote}>
                    <Label for='note'>Add Note</Label>
                    <Input
                      invalid={errors.note ? true : false}
                      type='textarea'
                      name='note'
                      id='note'
                      placeholder='Input note'
                      value={note}
                      onChange={this.onChange}
                    />
                    <FormFeedback>{errors.note}</FormFeedback>
                    <Button
                      type='submit'
                      color='biruicon'
                      className='batas-atas'>
                      Submit
                    </Button>
                  </Form>
                </FormGroup>
              ) : (
                ''
              )}
              <div className='batas-atas'>
                <ListGroup>
                  {notes.map((note, id) => {
                    return (
                      <ListGroupItem key={id}>
                        <ListGroupItemHeading>
                          <div className='pro-pic'>
                            <img
                              src={`https:${note.user.avatar}`}
                              alt='user'
                              className='rounded-circle batas-kanan'
                              width='31'
                            />
                            <span>{note.user.name}</span>
                            <Badge
                              color={classnames({
                                primary: note.user.role.name === 'manager',
                                success: note.user.role.name === 'supervisor',
                                danger: note.user.role.name === 'admin',
                                warning: note.user.role.name === 'engineer',
                                secondary:
                                  note.user.role.name === 'field support'
                              })}
                              className='ml-1'
                              pill>
                              {note.user.role.name}
                            </Badge>
                          </div>
                        </ListGroupItemHeading>
                        <ListGroupItemText>{note.message}</ListGroupItemText>
                        <ListGroupItemText>
                          <small>
                            {moment(note.created_at).format(
                              'dddd, DD-MM-YYYY HH:mm'
                            )}
                          </small>
                        </ListGroupItemText>
                      </ListGroupItem>
                    );
                  })}
                </ListGroup>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}
