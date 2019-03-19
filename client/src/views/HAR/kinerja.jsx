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
import Duration from './kinerja/duration.jsx';
import Ticket from './kinerja/ticket.jsx';
import Upload from './kinerja/uploadpage.jsx';
import Disturbance from './kinerja/disturbance.jsx';
import Amartaasset from './kinerja/amartaasset.jsx';
import Scada20kv from './kinerja/scada20kv.jsx';

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
                  Upload
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
                  Total Duration
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
                  Total Ticket
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames('pointer-hover', {
                    active: this.state.activeTab === '4'
                  })}
                  onClick={() => {
                    this.toggleTab('4');
                  }}>
                  Total Disturbance
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames('pointer-hover', {
                    active: this.state.activeTab === '5'
                  })}
                  onClick={() => {
                    this.toggleTab('5');
                  }}>
                  Total Offline Assets
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames('pointer-hover', {
                    active: this.state.activeTab === '6'
                  })}
                  onClick={() => {
                    this.toggleTab('6');
                  }}>
                  Scada 20kv
                </NavLink>
              </NavItem>
            </Nav>
            {/* ISI Tab Lur */}
            <TabContent activeTab={this.state.activeTab}>
              {/* Tiap tap */}
              <TabPane tabId='1'>
                <Upload />
              </TabPane>

              <TabPane tabId='2'>
                <Duration />
              </TabPane>

              <TabPane tabId='3'>
                <Ticket />
              </TabPane>

              <TabPane tabId='4'>
                <Disturbance />
              </TabPane>

              <TabPane tabId='5'>
                <Amartaasset />
              </TabPane>

              <TabPane tabId='6'>
                <Scada20kv />
              </TabPane>
            </TabContent>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default Projects;
