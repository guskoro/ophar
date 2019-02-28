import React, { Component } from 'react';
import {
  Card,
  Input,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Progress,
  Tooltip
} from 'reactstrap';

class DivisionProgress extends Component {
  constructor(props) {
    super(props);

    this.cmToggle = this.cmToggle.bind(this);
    this.pmToggle = this.pmToggle.bind(this);
    this.assetsToggle = this.assetsToggle.bind(this);
    this.controlsToggle = this.controlsToggle.bind(this);
    
    this.state = {
      cmTooltip: false,
      pmTooltip: false,
      assetsTooltip: false,
      controlsTooltip: false
    };
  }

  cmToggle() {
      this.setState({
        cmTooltip: !this.state.cmTooltip
      });
  }

  pmToggle() {
    this.setState({
      pmTooltip: !this.state.pmTooltip
    });
}

assetsToggle() {
  this.setState({
    assetsTooltip: !this.state.assetsTooltip
  });
}

controlsToggle() {
  this.setState({
    controlsTooltip: !this.state.controlsTooltip
  });
}
  
  render() {
    return (
      <div>
        <Card>
				<CardBody>
					<div className="d-flex align-items-center">
						<div>
							<CardTitle>Division Progress</CardTitle>
						</div>
					</div>
          <div className="progress-area">
            <Row>
              <Col xs="3" md="3">
                <CardText>Corrective Maintenance</CardText>
              </Col>
              <Col xs="9" md="9">
                <Progress id="cmProgress" animated color="warning" value={72} />
                <Tooltip placement="top" isOpen={this.state.cmTooltip} autohide={false} target="cmProgress" toggle={this.cmToggle}>72%</Tooltip>
              </Col>
            </Row>
            <Row>
            <Col xs="3" md="3">
                <CardText>Preventive Maintenance</CardText>
              </Col>
              <Col xs="9" md="9">
              <Progress id="pmProgress" animated color="info" value={63} />
              <Tooltip placement="top" isOpen={this.state.pmTooltip} autohide={false} target="pmProgress" toggle={this.pmToggle}>63%</Tooltip>
              </Col>
            </Row>
            <Row>
            <Col xs="3" md="3">
                <CardText>Assets</CardText>
              </Col>
              <Col xs="9" md="9">
              <Progress id="assetsProgress" animated color="success" value={90} />
              <Tooltip placement="top" isOpen={this.state.assetsTooltip} autohide={false} target="assetsProgress" toggle={this.assetsToggle}>90%</Tooltip>
              </Col>
            </Row>
            <Row>
            <Col xs="3" md="3">
                <CardText>Controls</CardText>
              </Col>
              <Col xs="9" md="9">
              <Progress id="controlsProgress" animated color="danger" value={35} />
              <Tooltip placement="top" isOpen={this.state.controlsTooltip} autohide={false} target="controlsProgress" toggle={this.controlsToggle}>35%</Tooltip>
              </Col>
            </Row>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default DivisionProgress;