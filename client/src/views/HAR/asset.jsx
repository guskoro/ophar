import React from "react";

import img1 from '../../assets/images/users/1.jpg';
import {
	Button,
    ButtonGroup,
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	Col,
	CustomInput,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Nav,
	Pagination,
	PaginationItem,
	PaginationLink,
	Row,
	Table,
	Tooltip
} from 'reactstrap';

import { NavLink } from 'react-router-dom';

class Projects extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);

		this.toggle10 = this.toggle10.bind(this);
		this.toggle20 = this.toggle20.bind(this);
		this.toggle30 = this.toggle30.bind(this);
		this.toggle40 = this.toggle40.bind(this);
		this.state = {
			tooltipOpen10: false,
			tooltipOpen20: false,
			tooltipOpen30: false,
			tooltipOpen40: false
		};
	}

	toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

	toggle10() {
		this.setState({
			tooltipOpen10: !this.state.tooltipOpen10
		});
	}

	toggle20() {
		this.setState({
			tooltipOpen20: !this.state.tooltipOpen20
		});
	}

	toggle30() {
		this.setState({
			tooltipOpen30: !this.state.tooltipOpen30
		});
	}

	toggle40() {
		this.setState({
			tooltipOpen40: !this.state.tooltipOpen40
		});
	}

	render() {
		return (
			/*--------------------------------------------------------------------------------*/
			/* Used In Dashboard-4 [General]                                                  */
			/*--------------------------------------------------------------------------------*/

			<Card>
				<CardBody>
					<div className="d-flex align-items-center">
						<div>
							<CardTitle>Workorders</CardTitle>
							<CardSubtitle>HAR | Asset</CardSubtitle>
						</div>
						<div className="ml-auto d-flex no-block align-items-center">
							<div className="dl">
								<Input type="select" className="custom-select">
									<option value="0">Monthly</option>
									<option value="1">Daily</option>
									<option value="2">Weekly</option>
									<option value="3">Yearly</option>
								</Input>
							</div>
							<div className="dl">
								{/* <NavLink to="/uploadWO">
									<Button className="btn" color="success">Upload</Button>{' '}
								</NavLink> */}
								<Button color="success" onClick={this.toggle}>{this.props.buttonLabel}Upload WO</Button>
                                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                                    <ModalHeader toggle={this.toggle}>Workorders</ModalHeader>
                                    <ModalBody>
									<Form>
										<FormGroup>
											<Label for="exampleEmail">Work Title</Label>
											<Input />
										</FormGroup>
										<FormGroup>
											<Label for="exampleText">Work Detail Description</Label>
											<Input type="textarea" name="text" id="exampleText" />
										</FormGroup>
										<FormGroup>
											<Label for="exampleEmail">Work Plan</Label>
											<Input />
										</FormGroup>
										<FormGroup>
										<Label for="exampleSelect">Priority</Label>
										<Input type="select" name="select" id="exampleSelect">
											<option>Critical</option>
											<option>High</option>
											<option>Medium</option>
											<option>Low</option>
										</Input>
										</FormGroup>
										<FormGroup>
										<Label for="exampleSelect">Work Type</Label>
										<Input type="select" name="select" id="exampleSelect">
											<option>FOC</option>
											<option>FOT</option>
											<option>PS</option>
										</Input>
										</FormGroup>
										<FormGroup>
										<Label for="exampleSelect">Work Program Type</Label>
										<Input type="select" name="select" id="exampleSelect">
											<option>Rutin</option>
											<option>Non Rutin</option>
										</Input>
										</FormGroup>
										<FormGroup>
											<Label for="exampleDate">Done Target</Label>
											<Input
												type="date"
												name="date"
												id="exampleDate"
												placeholder="date placeholder"/>
										</FormGroup>
									</Form>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.toggle}>Submit</Button>{' '}
                                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                    </ModalFooter>
                                    </Modal>
							</div>
							<div className="dl">
								<InputGroup>
									<InputGroupAddon addonType="append"><Button color="primary">Search</Button></InputGroupAddon>
									<Input placeholder="Search.." />
								</InputGroup>
							</div>
						</div>
					</div>
					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">Code</th>
								<th className="border-0">PIC</th>
								<th className="border-0">Type</th>
								<th className="border-0">Description</th>
								<th className="border-0">Priority</th>
								<th className="border-0">Assigned User</th>
								<th className="border-0">Target Date</th>
								<th className="border-0">Status</th>
								<th className="border-0">Details</th>
								<th className="border-0">Action</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>012SAKX</td>
								<td>
									<div className="d-flex no-block align-items-center">
										<div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="45" /></div>
										<div className=""><h5 className="mb-0 font-16 font-medium">Hanna Gover</h5><span>hgover@gmail.com</span></div>
									</div>
								</td>
								<td>FOC</td>
								<td>Elite Admin</td>
								<td>Highest</td>
								<td>Guskoro, Puguh</td>
								<td className="blue-grey-text  text-darken-4 font-medium">12-04-2019</td>
								<td>
									<i className="fa fa-circle text-danger" id="tlp1"></i>
									<Tooltip placement="top" isOpen={this.state.tooltipOpen10} target="tlp1" toggle={this.toggle10}>Rejected</Tooltip>
								</td>
								<td>
									<Button className="btn" outline color="success">Show</Button>
								</td>
								<td>
									<Button className="btn" outline color="primary" disabled>Edit</Button>{' '}
									<Button className="btn" outline color="danger" disabled>Delete</Button>{' '}
								</td>
							</tr>
							<tr>
								<td>012SAKX</td>
								<td>
									<div className="d-flex no-block align-items-center">
										<div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="45" /></div>
										<div className=""><h5 className="mb-0 font-16 font-medium">Hanna Gover</h5><span>hgover@gmail.com</span></div>
									</div>
								</td>
								<td>FOT</td>
								<td>Elite Admin</td>
								<td>High</td>
								<td>Guskoro, Puguh</td>
								<td className="blue-grey-text  text-darken-4 font-medium">$96K</td>
								<td>
									<i className="fa fa-circle text-success" id="tlp2"></i>
									<Tooltip placement="top" isOpen={this.state.tooltipOpen20} target="tlp2" toggle={this.toggle20}>In Progress</Tooltip>
								</td>
								<td>
									<Button className="btn" outline color="success">Show</Button>
								</td>
								<td>
									<Button className="btn" outline color="primary">Edit</Button>{' '}
									<Button className="btn" outline color="danger">Delete</Button>{' '}
								</td>
							</tr>
							<tr>
								<td>012SAKX</td>
								<td>
									<div className="d-flex no-block align-items-center">
										<div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="45" /></div>
										<div className=""><h5 className="mb-0 font-16 font-medium">Hanna Gover</h5><span>hgover@gmail.com</span></div>
									</div>
								</td>
								<td>PS</td>
								<td>Elite Admin</td>
								<td>Medium</td>
								<td>Guskoro, Puguh</td>
								<td className="blue-grey-text  text-darken-4 font-medium">$96K</td>
								<td>
									<i className="fa fa-circle text-warning" id="tlp3"></i>
									<Tooltip placement="top" isOpen={this.state.tooltipOpen30} target="tlp3" toggle={this.toggle30}>Pending Approval</Tooltip>
								</td>
								<td>
									<Button className="btn" outline color="success">Show</Button>
								</td>
								<td>
									<Button className="btn" outline color="primary">Edit</Button>{' '}
									<Button className="btn" outline color="danger">Delete</Button>{' '}
								</td>
							</tr>
							<tr>
								<td>012SAKX</td>
								<td>
									<div className="d-flex no-block align-items-center">
										<div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="45" /></div>
										<div className=""><h5 className="mb-0 font-16 font-medium">Hanna Gover</h5><span>hgover@gmail.com</span></div>
									</div>
								</td>
								<td>Elite Admin</td>
								<td>Elite Admin</td>
								<td>Low</td>
								<td>Guskoro, Puguh</td>
								<td className="blue-grey-text  text-darken-4 font-medium">$96K</td>
								<td>
									<i className="fa fa-circle text-muted" id="tlp4"></i>
									<Tooltip placement="top" isOpen={this.state.tooltipOpen40} target="tlp4" toggle={this.toggle40}>WO Done</Tooltip>
								</td>
								<td>
									<Button className="btn" outline color="success">Show</Button>
								</td>
								<td>
									<Button className="btn" outline color="primary" disabled="false">Edit</Button>{' '}
									<Button className="btn" outline color="danger" disabled={false}>Delete</Button>{' '}
								</td>
							</tr>
						</tbody>
					</Table>
					<Row>
						<Col xs="12" md="12">
						<CardBody className="border-top">
							<Pagination aria-label="Page navigation example">
							<PaginationItem disabled>
								<PaginationLink previous href="#" />
							</PaginationItem>
							<PaginationItem active>
								<PaginationLink href="#">
								1
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">
								2
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">
								3
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">
								4
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">
								5
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink next href="#" />
							</PaginationItem>
							</Pagination>
						</CardBody>
						</Col>
					</Row>
				</CardBody>
			</Card>
		);
	}
}

export default Projects;
