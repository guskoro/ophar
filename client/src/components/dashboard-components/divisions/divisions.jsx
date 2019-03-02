import React, { Component } from 'react';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Row,
  Col
} from 'reactstrap';

import Countup from 'react-countup';

import { NavLink } from 'react-router-dom';

import img1 from '../../../assets/images/division/1.png';
import img2 from '../../../assets/images/division/2.png';
import img3 from '../../../assets/images/division/3.png';
import img4 from '../../../assets/images/division/4.png';

class Divisions extends Component {
  render() {
    return (
      <div>
        <Row>
            <Col xs="12" md="3">
              <Card>
                {/* <CardImg top width="100%" src={img1} /> */}
                <CardBody>
                  <CardTitle>Corrective Maintenance</CardTitle>
                  <CardSubtitle>Dian Katro</CardSubtitle>
                  <h1 className="display-3"><Countup end={72} duration={1} /></h1>
                  <CardText>Total Work Orders</CardText>
                    <NavLink to="/cm">
                      <Button color="danger">Let me in</Button>
                    </NavLink>
                </CardBody>
              </Card>
            </Col>
            <Col xs="12" md="3">
              <Card>
                {/* <CardImg top width="100%" src={img2} /> */}
                <CardBody>
                  <CardTitle>Preventive Maintenance</CardTitle>
                  <CardSubtitle>Dian Katro</CardSubtitle>
                  <h1 className="display-3"><Countup end={63} duration={1} /></h1>
                  <CardText>Total Work Orders</CardText>
                  <Button color="danger">Let me in</Button>
                </CardBody>
              </Card>
            </Col>
            <Col xs="12" md="3">
              <Card>
                {/* <CardImg top width="100%" src={img3} /> */}
                <CardBody>
                  <CardTitle>Assets</CardTitle>
                  <CardSubtitle>Dian Katro</CardSubtitle>
                  <CardText>
                    <h1 className="display-3"><Countup end={45} duration={1} /></h1>
                  </CardText>
                  <CardText>Total Work Orders</CardText>
                  <Button color="danger">Let me in</Button>
                </CardBody>
              </Card>
            </Col>
            <Col xs="12" md="3">
              <Card>
                {/* <CardImg top width="100%" src={img4} /> */}
                <CardBody>
                  <CardTitle>Patrols and Controls</CardTitle>
                  <CardSubtitle>Dian Katro</CardSubtitle>
                  <h1 className="display-3"><Countup end={36} duration={1} /></h1>
                  <CardText>Total Work Orders</CardText>
                  <NavLink>
                    <Button color="danger">Let me in</Button>
                  </NavLink>
                </CardBody>
              </Card>
            </Col>
          </Row>
      </div>
    )
  }
}

export default Divisions;