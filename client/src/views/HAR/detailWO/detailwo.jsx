import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CustomInput,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Table
} from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import classnames from 'classnames';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTab = this.toggleTab.bind(this);

    this.toggle = this.toggle.bind(this);

    this.state = {
      detailWO: {},
      isOpen: false,
      activeTab: '1',
      modal: false,
      id: this.props.match.params.id
    };
  }

  async componentDidMount() {
    await this.getDetailWO();
  }

  async getDetailWO() {
    await axios
      .get(`/api/working-order/${this.state.id}`)
      .then(res => {
        this.setState({
          detailWO: res.data
        });
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

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    // console.log(this.state.detailWO.pic.name);

    return (
      <Card>
        <CardBody>
          <Row>
            <Col sm={12} lg={4}>
              <div>
                <div className='d-flex no-block align-items-center'>
                  <div className='mr-2'>
                    <img
                      src='https://imgix.ranker.com/user_node_img/50007/1000136055/original/yao-ming-rage-face-photo-u2?w=650&q=50&fm=pjpg&fit=crop&crop=faces'
                      alt='user'
                      className='rounded-circle'
                      width='100'
                    />
                  </div>
                  <div className=''>
                    <h1 className='mb-0 font-28 font-medium'>
                      {/* {this.state.detailWO.pic.name} */}
                    </h1>
                    <span>hgover@gmail.com</span>
                  </div>
                </div>
              </div>
              <div className='profile'>
                <h1 className='mb-1 font-20 font-medium'>
                  {this.state.detailWO.title}
                </h1>
              </div>
              {this.state.detailWO.approved_by_manager ? (
                <div className='profile'>
                  <h5>
                    <Badge color='success' className='ml-0' pill>
                      Approved at{' '}
                      {moment(this.state.detailWO.start).format(
                        'DD-MM-YYYY HH:mm'
                      )}
                    </Badge>
                  </h5>
                </div>
              ) : (
                <div className='profile'>
                  <h5>
                    <Badge color='warning' className='ml-0' pill>
                      Pending Approval
                    </Badge>
                  </h5>
                </div>
              )}
              <div className='profile'>
                <h1 className='mb-0 font-16 font-medium' color='info'>
                  Deadline{' '}
                  {moment().isAfter(this.state.detailWO.deadline)
                    ? 'is overdue'
                    : moment().to(this.state.detailWO.deadline)}{' '}
                  :
                  <span className='profile-time-approved'>
                    {moment(this.state.detailWO.deadline).format(
                      'DD-MM-YYYY HH:mm'
                    )}
                  </span>
                </h1>
              </div>
              {/* Iki lek login berdasar divisine dewe2, lek gak, gak metu tombol e */}
              <div className='profile'>
                <Button outline color='danger' onClick={this.toggle}>
                  {this.props.buttonLabel}Done
                </Button>
                <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggle}
                  className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>Done Work</ModalHeader>
                  <ModalBody>Are you sure to end this work?</ModalBody>
                  <ModalFooter>
                    <Button color='primary' onClick={this.toggle}>
                      Yes
                    </Button>{' '}
                    <Button color='secondary' onClick={this.toggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* Digawe lek user mitek edit nang halaman divisi */}
                <Button
                  outline
                  color='success'
                  className='profile-time-approved'>
                  Save
                </Button>
                <Button
                  outline
                  color='danger'
                  className='profile-time-approved'
                  onClick={this.toggle}>
                  {this.props.buttonLabel}Decline
                </Button>
                <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggle}
                  className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>Decline Work</ModalHeader>
                  <ModalBody>Are you sure to decline this work?</ModalBody>
                  <ModalFooter>
                    <Button color='primary' onClick={this.toggle}>
                      Yes
                    </Button>{' '}
                    <Button color='secondary' onClick={this.toggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>

                <Button
                  outline
                  color='success'
                  className='profile-time-approved'>
                  Approve
                </Button>
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
                              <th className='border-0'>Work Plan</th>
                              <th className='border-0'>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* {this.state.detailWO.plans.map(plan => {
                              return (
                                <tr>
                                  <td>{plan}</td>
                                  <td>
                                    <CustomInput
                                      type='checkbox'
                                      id='exampleCustomCheckbox1'
                                      label='Done'
                                    />
                                  </td>
                                </tr>
                              );
                            })} */}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </TabPane>

                  <TabPane tabId='2'>
                    <Row>
                      <Col sm='12'>
                        <Table
                          borderless
                          className='no-wrap v-middle'
                          responsive>
                          <tbody>
                            <tr>
                              <td>Work Type</td>
                              <td>FOC</td>
                            </tr>
                            <tr>
                              <td>Work Program</td>
                              <td>{this.state.detailWO.program}</td>
                            </tr>
                            <tr>
                              <td>Priority</td>
                              <td>Ciritcal</td>
                            </tr>
                            <tr>
                              <td>Work Description</td>
                              <td>{this.state.detailWO.description}</td>
                            </tr>
                            <tr>
                              <td>Work Note</td>
                              <td>{this.state.detailWO.note}</td>
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
        </CardBody>
      </Card>
    );
  }
}
