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
      cmValue: 0,
      cmMax: 72,
      pmValue: 0,
      pmMax: 63,
      assetsValue: 0,
      assetsMax: 90,
      controlsValue: 0,
      controlsMax: 36,
      cmTooltip: false,
      pmTooltip: false,
      assetsTooltip: false,
      controlsTooltip: false
    };
  }

  componentDidMount() {
    this.cmProgressUp();
    this.pmProgressUp();
    this.assetsProgressUp();
    this.controlsProgressUp();
  }

  cmProgressUp() {
    let percent = this.state.cmValue;
    let max = this.state.cmMax;
    for (; percent < max; percent++) {
      this.setState({
        cmValue: percent
      });
    }
  }

  pmProgressUp() {
    let percent = this.state.pmValue;
    let max = this.state.pmMax;
    for (; percent < max; percent++) {
      this.setState({
        pmValue: percent
      });
    }
  }

  assetsProgressUp() {
    let percent = this.state.assetsValue;
    let max = this.state.assetsMax;
    for (; percent < max; percent++) {
      this.setState({
        assetsValue: percent
      });
    }
  }

  controlsProgressUp() {
    let percent = this.state.controlsValue;
    let max = this.state.controlsMax;
    for (; percent < max; percent++) {
      this.setState({
        controlsValue: percent
      });
    }
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
                <Progress id="cmProgress" animated color="primary" value={this.state.cmValue} />
                <Tooltip placement="top" isOpen={this.state.cmTooltip} autohide={false} target="cmProgress" toggle={this.cmToggle}>{this.state.cmMax}%</Tooltip>
              </Col>
            </Row>
            <Row>
            <Col xs="3" md="3">
                <CardText>Preventive Maintenance</CardText>
              </Col>
              <Col xs="9" md="9">
              <Progress id="pmProgress" animated color="primary" value={this.state.pmValue} />
              <Tooltip placement="top" isOpen={this.state.pmTooltip} autohide={false} target="pmProgress" toggle={this.pmToggle}>{this.state.pmMax}%</Tooltip>
              </Col>
            </Row>
            <Row>
            <Col xs="3" md="3">
                <CardText>Assets</CardText>
              </Col>
              <Col xs="9" md="9">
              <Progress id="assetsProgress" animated color="primary" value={this.state.assetsValue} />
              <Tooltip placement="top" isOpen={this.state.assetsTooltip} autohide={false} target="assetsProgress" toggle={this.assetsToggle}>{this.state.assetsMax}%</Tooltip>
              </Col>
            </Row>
            <Row>
            <Col xs="3" md="3">
                <CardText>Controls</CardText>
              </Col>
              <Col xs="9" md="9">
              <Progress id="controlsProgress" animated color="primary" value={this.state.controlsValue} />
              <Tooltip placement="top" isOpen={this.state.controlsTooltip} autohide={false} target="controlsProgress" toggle={this.controlsToggle}>{this.state.controlsMax}%</Tooltip>
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