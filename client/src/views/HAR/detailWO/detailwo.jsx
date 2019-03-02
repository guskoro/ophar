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
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
    Table,
    Tooltip
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
      activeTab: '1'
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
    this.setState({
      isOpen: !this.state.isOpen
    });
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
                            <Badge color="success" className="ml-0" pill>Approved</Badge>
                            <span className="profile-time-approved">At January, 12th - 2019</span>
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
                                    <Col sm="6">
                                        <Card body>
                                        <CardTitle>Special Title Treatment</CardTitle>
                                        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                        <Button>Go somewhere</Button>
                                        </Card>
                                    </Col>
                                    <Col sm="6">
                                        <Card body>
                                        <CardTitle>Special Title Treatment</CardTitle>
                                        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                        <Button>Go somewhere</Button>
                                        </Card>
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