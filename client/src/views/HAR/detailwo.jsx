import React from 'react';
import {
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from 'reactstrap';

import classnames from 'classnames';

import img1 from '../../assets/images/users/1.jpg';

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
                <div>
                    <div className="d-flex no-block align-items-center">
                        <div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="100" /></div>
                        <div className=""><h1 className="mb-0 font-28 font-medium">Hanna Gover</h1><span>hgover@gmail.com</span></div>
                    </div>
                </div>
                <div>
                    {/* TAB e lur */}
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggleTab('1'); }}>
                                Progress
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggleTab('2'); }}>
                                Work Detail
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => { this.toggleTab('3'); }}>
                                Work Description
                            </NavLink>
                        </NavItem>
                    </Nav>
                    {/* ISI Tab Lur */}
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <Col sm="12">
                                    <h4>Tab 1 Contents</h4>
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
            </CardBody>
        </Card>
    );
  }
}