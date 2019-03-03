import React from 'react';
import {
	Button,
	Collapse,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Nav,
	Navbar,
	NavbarBrand,
	UncontrolledDropdown,
} from 'reactstrap';

import profilephoto from '../../assets/images/users/1.jpg';

/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
import logodarkicon from '../../assets/images/logo_icon+.png';

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.toggleLogin = this.toggleLogin.bind(this)

		this.toggle = this.toggle.bind(this);
		this.showMobilemenu = this.showMobilemenu.bind(this);
		this.state = {
			isOpen: false
		};
	}
	/*--------------------------------------------------------------------------------*/
	/*To open NAVBAR in MOBILE VIEW                                                   */
	/*--------------------------------------------------------------------------------*/
	toggleLogin() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
	
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}
	/*--------------------------------------------------------------------------------*/
	/*To open SIDEBAR-MENU in MOBILE VIEW                                             */
	/*--------------------------------------------------------------------------------*/
	showMobilemenu() {
		document.getElementById('main-wrapper').classList.toggle('show-sidebar');
	}

	render() {
		return (
			<header className="topbar navbarbg" data-navbarbg="skin1">
				<Navbar className="top-navbar" dark expand="md">
					<div className="navbar-header" id="logobg" data-logobg="skin6">
						{/*--------------------------------------------------------------------------------*/}
						{/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
						{/*--------------------------------------------------------------------------------*/}
						<NavbarBrand href="/">
							<b className="logo-icon">
								<img 
									src={logodarkicon} 
									width="50px"
									alt="homepage" 
									className="dark-logo" 
								/>
							</b>
						</NavbarBrand>
						{/*--------------------------------------------------------------------------------*/}
						{/* Mobile View Toggler  [visible only after 768px screen]                         */}
						{/*--------------------------------------------------------------------------------*/}
						<a className="nav-toggler d-block d-md-none" onClick={this.showMobilemenu}>
							<i className="ti-menu ti-close" />
						</a>
					</div>
					<Collapse className="navbarbg" isOpen={this.state.isOpen} navbar data-navbarbg="skin1" >
						<Nav className="ml-auto float-right" navbar>
							<Button color="info" onClick={this.toggleLogin}>{this.props.buttonLabel}Login</Button>
							<Modal isOpen={this.state.modal} toggle={this.toggleLogin} className={this.props.className}>
							<ModalHeader toggle={this.toggleLogin}>Login</ModalHeader>
							<ModalBody>
								<Form inline>
									<FormGroup>
									<Label for="exampleEmail" hidden>Email</Label>
									<Input type="email" name="email" id="exampleEmail" placeholder="Email" />
									</FormGroup>
									{' '}
									<FormGroup>
									<Label for="examplePassword" hidden>Password</Label>
									<Input type="password" name="password" id="examplePassword" placeholder="Password" />
									</FormGroup>
									{' '}
								</Form>
							</ModalBody>
							<ModalFooter>
							<Button color="primary" onClick={this.toggleLogin}>Submit</Button>{' '}
							<Button color="secondary" onClick={this.toggleLogin}>Cancel</Button>
							</ModalFooter>
							</Modal>
							{/* <NavItem>
								<a href="" className="btn btn-danger mr-2" style={{ marginTop: '15px' }}>Upgrade to Pro</a>
							</NavItem> */}
							{/*--------------------------------------------------------------------------------*/}
							{/* Start Profile Dropdown                                                         */}
							{/*--------------------------------------------------------------------------------*/}
							<UncontrolledDropdown nav inNavbar>
								<DropdownToggle nav caret className="pro-pic">
									<img
										src={profilephoto}
										alt="user"
										className="rounded-circle"
										width="31"
									/>
								</DropdownToggle>
								<DropdownMenu right className="user-dd">
									<DropdownItem divider />
									<Button
										color="danger"
										className="btn-rounded ml-3 mb-2 mt-2">
										Logout
                  					</Button>
								</DropdownMenu>
							</UncontrolledDropdown>
							{/*--------------------------------------------------------------------------------*/}
							{/* End Profile Dropdown                                                           */}
							{/*--------------------------------------------------------------------------------*/}
						</Nav>
					</Collapse>
				</Navbar>
			</header>
		);
	}
}
export default Header;
