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
                  Total Duration
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
                  Total Ticket
                </NavLink>
              </NavItem>
            </Nav>
            {/* ISI Tab Lur */}
            <TabContent activeTab={this.state.activeTab}>
              {/* Tiap tap */}
              <TabPane tabId='1'>
                <Duration />
              </TabPane>

              <TabPane tabId='2'>
                <Ticket />
              </TabPane>
            </TabContent>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default Projects;
