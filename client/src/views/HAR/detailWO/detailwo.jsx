import React from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    CustomInput,
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
    Table,
} from 'reactstrap';

import classnames from 'classnames';

import img1 from '../../../assets/images/users/1.jpg';
import img2 from '../../../assets/images/users/2.jpg';
import img3 from '../../../assets/images/users/3.jpg';
import img4 from '../../../assets/images/users/4.jpg';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTab = this.toggleTab.bind(this);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false,
      activeTab: '1',
      modal: false
    };
  }

  toggleTab(tab) {
      if(this.state.activeTab !== tab) {
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
    return (
        <Card>
            <CardBody>
                <Row>
                    <Col sm={12} lg={4}>
                        <div>
                            <div className="d-flex no-block align-items-center">
                                <div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="100" /></div>
                                <div className=""><h1 className="mb-0 font-28 font-medium">Hanna Gover</h1><span>hgover@gmail.com</span></div>
                            </div>
                        </div>
                        <div className="profile">
                            <h1 className="mb-1 font-20 font-medium">Work Title</h1>
                        </div>
                        {/* iki lek wo wes di aprroved */}
                        <div className="profile">
                            <Badge color="success" className="ml-0" pill>Approved</Badge>
                            <span className="profile-time-approved">At January, 12th - 2019</span>
                        </div>
                        {/* Iki lek wo durung di approved */}
                        <div className="profile">
                            <Badge color="warning" className="ml-0" pill>Pending</Badge>
                        </div>
                        <div className="profile">
                            <h1 className="mb-0 font-16 font-medium">Remaining Time : <span className="profile-time-approved">50 Hours</span></h1>
                        </div>
                        <div className="profile">
                            <h1 className="mb-0 font-16 font-medium" color="info">Done Target : <span className="profile-time-approved">March, 12th - 2019</span></h1>
                        </div>
                        {/* Iki lek login berdasar divisine dewe2, lek gak, gak metu tombol e */}
                        <div className="profile">
                            <Button outline color="danger" onClick={this.toggle}>{this.props.buttonLabel}Done</Button>
                                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                                    <ModalHeader toggle={this.toggle}>Done Work</ModalHeader>
                                    <ModalBody>
                                        Are you sure to end this work?    
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.toggle}>Yes</Button>{' '}
                                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                                {/* Digawe lek user mitek edit nang halaman divisi */}
                            <Button outline color="info" className="profile-time-approved">Save</Button>
                            <Button outline color="info" className="profile-time-approved">Approve</Button>
                        </div>
                    </Col>
                    
                    <Col sm={12} lg={8}>
                        <div>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.toggleTab('1'); }}>
                                        Progress Plan
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '2' })}
                                        onClick={() => { this.toggleTab('2'); }}>
                                        Work Detail
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            {/* ISI Tab Lur */}
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    <Row>
                                        <Col sm="12">
                                        <Table className="no-wrap v-middle" responsive>
                                            <thead>
                                                <tr className="border-0">
                                                    <th className="border-0">Work Plan</th>
                                                    <th className="border-0">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1. Syahdat</td>
                                                    <td><CustomInput type="checkbox" id="exampleCustomCheckbox1" label="Done" /></td>
                                                </tr>
                                                <tr>
                                                    <td>2. Sholat</td>
                                                    <td><CustomInput type="checkbox" id="exampleCustomCheckbox2" label="In Progress" /></td>
                                                </tr>
                                                <tr>
                                                    <td>3. Zakat</td>
                                                    <td><CustomInput type="checkbox" id="exampleCustomCheckbox3" label="In Progress" /></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        </Col>
                                    </Row>
                                </TabPane>
                                
                                <TabPane tabId="2">
                                    <Row>
                                    <Col sm="12">
                                        <Table borderless className="no-wrap v-middle" responsive>
                                            <tbody>
                                                <tr>
                                                    <td>Work Type</td>
                                                    <td>FOC</td>
                                                </tr>
                                                <tr>
                                                    <td>Work Program Type</td>
                                                    <td>Rutin</td>
                                                </tr>
                                                <tr>
                                                    <td>Priority</td>
                                                    <td>Ciritcal</td>
                                                </tr>
                                                <tr>
                                                    <td>Work Description</td>
                                                    <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</td>
                                                </tr>
                                                <tr>
                                                    <td>Work Plan</td>
                                                    <td>1. lorem, 2. Ipsum</td>
                                                </tr>
                                                <tr>
                                                    <td>Work Note</td>
                                                    <td>Jangan lupa sahur dan berbuka</td>
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