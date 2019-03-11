import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from 'reactstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authAction';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      role: '',
      division: '',
      roles: [],
      divisions: [],
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.errors !== nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  async componentDidMount() {
    await this.getRoles();
    await this.getDivisions();
  }

  async getRoles() {
    await axios
      .get('/api/role')
      .then(res => {
        this.setState({
          roles: res.data
        });
      })
      .catch(err => console.log(err.response.data));
  }

  async getDivisions() {
    await axios
      .get('/api/division')
      .then(res => {
        this.setState({
          divisions: res.data
        });
      })
      .catch(err => console.log(err.response.data));
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      role: this.state.role,
      division: this.state.division
    };

    // this.props.registerUser(newUser, this.props.history);
    axios
      .post('/api/user/register', newUser)
      .then(() => this.props.history.push('/register'))
      .catch(err =>
        this.setState({
          errors: err.response.data
        })
      );
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { errors } = this.state;

    return (
      <Card>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Input invalid={errors.access ? true : false} hidden />
              <FormFeedback>{errors.access}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='name'>Name</Label>
              <Input
                invalid={errors.name ? true : false}
                type='text'
                name='name'
                id='name'
                placeholder='Name'
                value={this.state.name}
                onChange={this.onChange}
              />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
            <FormGroup>
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
            <FormGroup>
              <Label for='password2'>Password Confirmation</Label>
              <Input
                invalid={errors.password2 ? true : false}
                type='password'
                name='password2'
                id='password2'
                placeholder='Password Confirmation'
                value={this.state.password2}
                onChange={this.onChange}
              />
              <FormFeedback>{errors.password2}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='role'>Role</Label>
              <Input
                invalid={errors.role ? true : false}
                type='select'
                name='role'
                id='role'
                value={this.state.role}
                onChange={this.onChange}>
                <option value='' disabled>
                  Select role
                </option>
                {this.state.roles.map((role, id) => {
                  return (
                    <option key={id} value={role._id}>
                      {role.name}
                    </option>
                  );
                })}
              </Input>
              <FormFeedback>{errors.role}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='division'>Division</Label>
              <Input
                invalid={errors.division ? true : false}
                type='select'
                name='division'
                id='division'
                value={this.state.division}
                onChange={this.onChange}>
                <option value='' disabled>
                  Select division
                </option>
                {this.state.divisions.map((division, id) => {
                  return (
                    <option key={id} value={division._id}>
                      {division.name}
                    </option>
                  );
                })}
              </Input>
              <FormFeedback>{errors.division}</FormFeedback>
            </FormGroup>
            <Button type='submit' color='biruicon'>
              Register
            </Button>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
