import React from 'react';
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import classnames from 'classnames';
import HarTools from '../HAR/asset/listtoolshar.jsx';
import HarWO from '../HAR/asset/listwoohar.jsx';
import HarK3 from '../HAR/asset/listk3har.jsx';

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTab = this.toggleTab.bind(this);

    this.state = {
      activeTab: '1'
    };
  }

  // Tab
  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    const { currentPage } = this.state;
    return (
      /*--------------------------------------------------------------------------------*/
      /* Used In Dashboard-4 [General]                                                  */
      /*--------------------------------------------------------------------------------*/
      <Card>
        <CardBody>
          <div>
            <Nav tabs>
              {/* Banyak Tab */}
              <NavItem>
                <NavLink
                  className={classnames('pointer-hover', {
                    active: this.state.activeTab === '1'
                  })}
                  onClick={() => {
                    this.toggleTab('1');
                  }}>
                  Workorders
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
                  Tools HAR
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames('pointer-hover', {
                    active: this.state.activeTab === '3'
                  })}
                  onClick={() => {
                    this.toggleTab('3');
                  }}>
                  K3 HAR
                </NavLink>
              </NavItem>
            </Nav>
            {/* ISI Tab Lur */}
            <TabContent activeTab={this.state.activeTab}>
              {/* Tiap tap */}
              <TabPane tabId='1'>
                <HarWO />
              </TabPane>

              <TabPane tabId='2'>
                <HarTools />
              </TabPane>

              <TabPane tabId='3'>
                <HarK3 />
              </TabPane>
            </TabContent>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default Projects;
