import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  CustomInput,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
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
import swal from 'sweetalert';
import moment from 'moment';
import classnames from 'classnames';

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

    this.state = {
      currentUser: {},
      errors: [],
      detailWO: {},
      report: '',
      isOpen: false,
      activeTab: '1',
      id: this.props.match.params.id,
      modalNote: false,
      note: '',
      plans: []
    };
  }

  async componentDidMount() {
    await this.getDetailWO();
    await this.getCurrentUser();
    await this.getPusher();
  }

  async getPusher() {
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
          program: data.program,
          note: data.note,
          approved_by_spv: data.approved_by_spv,
          approved_by_manager: data.approved_by_manager,
          rejected: data.rejected,
          done: data.done,
          start: data.start,
          deadline: data.deadline,
          end: data.end,
          created_at: data.created_at,
          pic_name: data.pic.name,
          pic_email: data.pic.email,
          pic_avatar: data.pic.avatar
        };

        this.setState({
          detailWO: woCustom,
          plans: woCustom.plans
        });
      }
    });
  }

  getCurrentUser() {
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
  }

  async getDetailWO() {
    await axios
      .get(`/api/working-order/${this.state.id}`)
      .then(res => {
        this.setState({
          detailWO: res.data,
          plans: res.data.plans
        });
      })
      .catch(err => console.log(err.response.data));
  }

  async onDone(data) {
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
              this.getDetailWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
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
              this.getDetailWO();
            }
          })
          .catch(err => err.response.data);
      }
    });
  }

  async onAddNote(e, data) {
    e.preventDefault();

    const newWorkingOrder = {
      note: this.state.note
    };

    await axios
      .patch(`/api/working-order/${data._id}`, newWorkingOrder)
      .then(res => {
        if (res.status === 200) {
          this.getDetailWO();
          this.toggleNote(data);
        }
      })
      .catch(err => console.log(err.response.data));
  }

  async onAddPlan(e, data) {
    e.preventDefault();

    const newWorkingOrder = {
      plan: this.state.plan
    };

    await axios
      .patch(`/api/working-order/${data._id}`, newWorkingOrder)
      .then(res => {
        if (res.status === 200) {
          this.getDetailWO();
          this.togglePlan(data);
        }
      })
      .catch(err => console.log(err.response.data));
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleNote(data) {
    this.setState(prevState => ({
      modalNote: !prevState.modalNote,
      note: data.note
    }));
  }

  togglePlan(data) {
    this.setState(prevState => ({
      modalPlan: !prevState.modalPlan,
      plan: data.plan
    }));
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onChangeCheckbox(e) {
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

    // console.log(plans, e.target.id, e.target.checked, plans[0]);
  }

  render() {
    const { detailWO, currentUser, errors, report } = this.state;

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
                  </div>
                </div>
              </div>
              <div className='profile'>
                <h1 className='mb-1 font-20 font-medium'>{detailWO.title}</h1>
              </div>
              {detailWO.rejected && (
                <div className='profile'>
                  <h5>
                    <Badge color='danger' className='ml-0' pill>
                      Rejected
                    </Badge>
                  </h5>
                </div>
              )}
              {!(
                detailWO.approved_by_spv ||
                detailWO.approved_by_manager ||
                detailWO.rejected
              ) && (
                <div className='profile'>
                  <h5>
                    <Badge color='warning' className='ml-0' pill>
                      Pending Approval
                    </Badge>
                  </h5>
                </div>
              )}
              {detailWO.approved_by_spv &&
                !detailWO.approved_by_manager &&
                !detailWO.done &&
                !detailWO.rejected && (
                  <div className='profile'>
                    <h5>
                      <Badge color='warning' className='ml-0' pill>
                        Approved by Supervisor
                      </Badge>
                    </h5>
                  </div>
                )}
              {detailWO.approved_by_spv &&
                detailWO.approved_by_manager &&
                !detailWO.done && (
                  <div className='profile'>
                    <h5>
                      <Badge color='success' className='ml-0' pill>
                        Approved by Manager at{' '}
                        {moment(detailWO.start).format('DD-MM-YYYY HH:mm')}
                      </Badge>
                    </h5>
                  </div>
                )}
              {detailWO.done && (
                <div className='profile'>
                  <h5>
                    <Badge color='info' className='ml-0' pill>
                      Done at {moment(detailWO.end).format('DD-MM-YYYY HH:mm')}
                    </Badge>
                  </h5>
                </div>
              )}
              {!detailWO.done && !detailWO.rejected && (
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
              {!detailWO.done && !detailWO.rejected && (
                <div className='profile batas-kanan'>
                  {currentUser.division === detailWO.division &&
                    detailWO.approved_by_manager && (
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
                    detailWO.approved_by_spv) ||
                  (currentUser.role === 'supervisor' &&
                    !detailWO.approved_by_spv) ? (
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
                      <Button
                        onClick={this.toggleNote.bind(this, detailWO)}
                        outline
                        color='secondary'
                        className='profile batas-kanan'>
                        Add Note
                      </Button>
                      <Modal
                        isOpen={this.state.modalNote}
                        toggle={this.toggleNote.bind(this, detailWO)}
                        className={this.props.className}>
                        <ModalHeader
                          toggle={this.toggleNote.bind(this, detailWO)}>
                          Add a note
                        </ModalHeader>
                        <Form
                          onSubmit={e => {
                            this.onAddNote(e, detailWO);
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
                              onClick={this.toggleNote.bind(this, detailWO)}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Form>
                      </Modal>
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </div>
              )}
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
                                <Button
                                  onClick={this.togglePlan.bind(this, detailWO)}
                                  outline
                                  color='secondary'
                                  className='profile batas-kanan'>
                                  Add Work Plan
                                </Button>
                                <Modal
                                  isOpen={this.state.modalPlan}
                                  toggle={this.togglePlan.bind(this, detailWO)}
                                  className={this.props.className}>
                                  <ModalHeader
                                    toggle={this.togglePlan.bind(
                                      this,
                                      detailWO
                                    )}>
                                    Add a new plan
                                  </ModalHeader>
                                  <Form
                                    onSubmit={e => {
                                      this.onAddPlan(e, detailWO);
                                    }}>
                                    <ModalBody>
                                      <FormGroup>
                                        <Label for='plan'>Work Plan</Label>
                                        <Input
                                          type='textarea'
                                          name='plan'
                                          id='plan'
                                          value={this.state.plan}
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
                                        onClick={this.togglePlan.bind(
                                          this,
                                          detailWO
                                        )}>
                                        Cancel
                                      </Button>
                                    </ModalFooter>
                                  </Form>
                                </Modal>
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
                                          currentUser.division !==
                                            detailWO.division ||
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
                            <tr>
                              <td>Work Note</td>
                              <td>{detailWO.note}</td>
                            </tr>
                            <tr>
                              <td>Work Report</td>
                              <td>Report e Field Support Lur</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md='4'>
              <FormGroup>
                <Label for='report'>Work Order Report</Label>
                <Input
                  invalid={errors.report ? true : false}
                  type='textarea'
                  name='report'
                  id='report'
                  placeholder='Input Report'
                  value={report}
                  onChange={this.onChange}
                />
                <FormFeedback>{errors.report}</FormFeedback>
              </FormGroup>
              <Button type='submit' color='biruicon'>
                Submit
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}
