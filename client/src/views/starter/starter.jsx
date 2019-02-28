import React from 'react';
import {
    Row,
    Col
} from 'reactstrap';
import { SalesSummary, Feeds, Divisions, DivisionProgress } from 'components/dashboard-components';

class Starter extends React.Component {
    render() {
        return (
            <div>
                <Row>
                    <Col sm={6} lg={8}>
                        <SalesSummary />
                    </Col>
                    <Col sm={6} lg={4}>
                        <Feeds />
                    </Col>
                </Row>
                <Divisions />
                <Row>
                  <Col sm={12} lg={12}>
                    <DivisionProgress />
                  </Col>
                </Row>
                {/* <Row>
                    <Col sm={12}>
                        <Projects />
                    </Col>
                </Row> */}
            </div>
        );

    }
}

export default Starter;
