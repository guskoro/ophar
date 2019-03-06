import React from 'react';
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormFeedback,
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
  UncontrolledDropdown
} from 'reactstrap';

import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authAction';
import profilephoto from '../../assets/images/users/1.jpg';

/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
import logodarkicon from '../../assets/images/logo_icon+.png';
import logodarktext from '../../assets/images/logoIconText.png';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggleLogin = this.toggleLogin.bind(this);

    this.toggle = this.toggle.bind(this);
    this.showMobilemenu = this.showMobilemenu.bind(this);
    this.state = {
      errors: [],
      isOpen: false,
      email: '',
      password: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(user);

    this.toggleLogin();
    // this.props.registerUser(newUser, this.props.history);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
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
    const { errors } = this.state;

    return (
      <header className='topbar navbarbg' data-navbarbg='skin1'>
        <Navbar className='top-navbar' dark expand='md'>
          <div className='navbar-header' id='logobg' data-logobg='skin6'>
            {/*--------------------------------------------------------------------------------*/}
            {/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
            {/*--------------------------------------------------------------------------------*/}
            <NavbarBrand href='/'>
              <b className='logo-icon'>
                <img
                  src={logodarkicon}
                  width='50px'
                  alt='homepage'
                  className='dark-logo'
                />
              </b>
              <span className='logo-text'>
                <img
                  src={logodarktext}
                  alt='homepage'
                  className='dark-logo'
                  width='130px'
                />
              </span>
            </NavbarBrand>
            {/*--------------------------------------------------------------------------------*/}
            {/* Mobile View Toggler  [visible only after 768px screen]                         */}
            {/*--------------------------------------------------------------------------------*/}
            <a
              className='nav-toggler d-block d-md-none'
              onClick={this.showMobilemenu}>
              <i className='ti-menu ti-close' />
            </a>
          </div>
          <Collapse
            className='navbarbg'
            isOpen={this.state.isOpen}
            navbar
            data-navbarbg='skin1'>
            <Nav className='ml-auto float-right' navbar>
              {/* Tombol gawe lek gak login */}
              {this.props.auth.isAuthenticated == false && (
                <Button color='biruicon' onClick={this.toggleLogin}>
                  {this.props.buttonLabel}Login
                </Button>
              )}
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggleLogin}
                className={this.props.className}>
                <ModalHeader toggle={this.toggleLogin}>Login</ModalHeader>
                <Form onSubmit={this.onSubmit}>
                  <ModalBody>
                    <FormGroup className='batas-kanan'>
                      <Label for='email'>Email</Label>
                      <Input
                        invalid={errors.email ? true : false}
                        type='email'
                        name='email'
                        id='email'
                        placeholder='Email'
                        value={this.state.email}
                        onChange={this.onChange}
                      />
                      <FormFeedback>{errors.email}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <Label for='password'>Password</Label>
                      <Input
                        invalid={errors.password ? true : false}
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Password'
                        value={this.state.password}
                        onChange={this.onChange}
                      />
                      <FormFeedback>{errors.password}</FormFeedback>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button color='biruicon' type='submit'>
                      Login
                    </Button>{' '}
                    <Button color='secondary' onClick={this.toggleLogin}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
              {/* <NavItem>
								<a href="" className="btn btn-danger mr-2" style={{ marginTop: '15px' }}>Upgrade to Pro</a>
							</NavItem> */}
              {/*--------------------------------------------------------------------------------*/}
              {/* Start Profile Dropdown                                                         */}
              {/*--------------------------------------------------------------------------------*/}
              {this.props.auth.isAuthenticated && (
                <UncontrolledDropdown nav inNavbar>
                  {/* Logo gawe lek wes login tok */}
                  <DropdownToggle nav caret className='pro-pic'>
                    <img
                      src={profilephoto}
                      alt='user'
                      className='rounded-circle'
                      width='31'
                    />
                  </DropdownToggle>
                  <DropdownMenu right className='user-dd'>
                    <DropdownItem divider />
                    <Button
                      color='ndewo'
                      className='btn-rounded ml-3 mb-2 mt-2'>
                      Logout
                    </Button>
                    <DropdownItem divider />
                    <NavLink to='/newWO'>
                      <Button
                        color='ndewo'
                        className='btn-rounded ml-3 mb-2 mt-2'>
                        New Workordes
                      </Button>
                    </NavLink>
                    <DropdownItem divider />
                    <NavLink to='/register'>
                      <Button
                        color='ndewo'
                        className='btn-rounded ml-3 mb-2 mt-2'>
                        Users
                      </Button>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
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

Header.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Header));
