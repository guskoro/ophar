import React, { Component } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from 'reactstrap';
import autosize from 'autosize';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import CreatableSelect from 'react-select/lib/Creatable';
import Select from 'react-select';
import swal from 'sweetalert';
import axios from 'axios';

import MomentLocaleUtils, {
  formatDate,
  parseDate
} from 'react-day-picker/moment';

const components = {
  DropdownIndicator: null
};

const createOption = label => ({
  label,
  value: label
});

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      priorities: [],
      inputValue: '',
      plans: [],
      types: [],
      list_users: [],
      users: [],
      type: '',
      priority: '',
      title: '',
      description: '',
      program: '',
      deadline: '',
      errorAccess: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
  }

  componentDidMount = async () => {
    await this.getPriorities();
    await this.getTypes();
    await this.getUsers();
    await autosize(this.textarea);
  };

  handleDayClick(day) {
    this.setState({ deadline: day });
  }

  getPriorities = async () => {
    await axios
      .get('/api/priority')
      .then(res => {
        this.setState({
          priorities: res.data
        });
      })
      .catch(err => console.log(err.response.data));
  };

  getTypes = async () => {
    await axios
      .get('/api/type')
      .then(res => {
        this.setState({
          types: res.data
        });
      })
      .catch(err => console.log(err.response.data));
  };

  getUsers = async () => {
    await axios
      .get('/api/user')
      .then(res => {
        let users = [];
        res.data.map(user => {
          if (user.role.name === 'field support') {
            users.push({
              value: user._id,
              label: user.name
            });
          }
        });

        this.setState({
          list_users: users
        });
      })
      .catch(err => console.log(err.response.data));
  };

  handleChange = plans => {
    this.setState({ plans });
  };

  handleChangeSelect = users => {
    this.setState({ users });
  };

  handleInputChange = inputValue => {
    this.setState({ inputValue });
  };

  handleKeyDown = event => {
    const { inputValue, plans } = this.state;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.setState({
          inputValue: '',
          plans: [...plans, createOption(inputValue)]
        });
        event.preventDefault();
    }
  };

  onSubmit(e) {
    e.preventDefault();

    const {
      type,
      priority,
      title,
      plans,
      users,
      description,
      program,
      deadline
    } = this.state;

    const newWO = {
      type: type,
      priority: priority,
      title: title,
      plans: plans,
      users: users,
      description: description,
      program: program,
      deadline: deadline
    };

    console.log(newWO);
    axios
      .post('/api/working-order', newWO)
      .then(() => {
        swal({
          title: 'Success!',
          text: 'You added a new work order!',
          icon: 'success',
          button: 'OK!'
        });
        this.setState({
          errors: [],
          inputValue: '',
          plans: '',
          users: [],
          type: '',
          priority: '',
          title: '',
          description: '',
          program: '',
          deadline: undefined
        });
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.setState({
            errorAccess: true
          });
        } else {
          this.setState({ errors: err.response.data });
        }
      });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onDismiss() {
    this.setState({ errorAccess: false });
  }

  render() {
    const {
      errors,
      inputValue,
      priorities,
      types,
      type,
      priority,
      title,
      plans,
      users,
      list_users,
      description,
      program,
      deadline
    } = this.state;

    return (
      <Card>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Input invalid={errors.access ? true : false} hidden />
              <FormFeedback>{errors.access}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='title'>Work Order Title</Label>
              <Input
                invalid={errors.title ? true : false}
                type='text'
                name='title'
                id='title'
                placeholder='Input title'
                value={title}
                onChange={this.onChange}
              />
              <FormFeedback>{errors.title}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='description'>Work Order Description</Label>
              <Input
                invalid={errors.description ? true : false}
                type='textarea'
                name='description'
                id='description'
                placeholder='Input description'
                value={description}
                onChange={this.onChange}
              />
              <FormFeedback>{errors.description}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='plans'>Work Order Plans</Label>
              <Input
                invalid={errors.plans ? true : false}
                type='textarea'
                name='plans'
                id='plans'
                rows={9}
                placeholder='Input plans'
                value={plans}
                onChange={this.onChange}
              />
              {/* <CreatableSelect
                components={components}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder='Type plan and press enter...'
                value={plans}
              /> */}
            </FormGroup>
            <FormGroup>
              <Label for='deadline' className='block-display'>
                Work Order Deadline
              </Label>
              <DayPicker
                id='deadline'
                formatDate={formatDate}
                parseDate={parseDate}
                onDayClick={this.handleDayClick}
                selectedDays={this.state.deadline}
              />
              <FormFeedback>{errors.deadline}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='priority'>Work Order Priority</Label>
              <Input
                invalid={errors.priority ? true : false}
                type='select'
                name='priority'
                id='priority'
                value={priority}
                onChange={this.onChange}>
                <option value='' disabled>
                  Select priority
                </option>
                {priorities.map((priority, id) => {
                  return (
                    <option key={id} value={priority._id}>
                      {priority.name}
                    </option>
                  );
                })}
              </Input>
              <FormFeedback>{errors.priority}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='type'>Work Order Type</Label>
              <Input
                invalid={errors.type ? true : false}
                type='select'
                name='type'
                id='type'
                value={type}
                onChange={this.onChange}>
                <option value='' disabled>
                  Select type
                </option>
                {types.map((type, id) => {
                  return (
                    <option key={id} value={type._id}>
                      {type.name}
                    </option>
                  );
                })}
              </Input>
              <FormFeedback>{errors.type}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='program'>Work Order Program</Label>
              <Input
                invalid={errors.program ? true : false}
                type='select'
                name='program'
                id='program'
                value={program}
                onChange={this.onChange}>
                <option value='' disabled>
                  Select program
                </option>
                <option value='Non-rutin'>Non Rutin</option>
                <option value='Rutin'>Rutin</option>
              </Input>
              <FormFeedback>{errors.program}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for='users'>Work Order users</Label>
              <Select
                isMulti
                name='colors'
                options={list_users}
                onChange={this.handleChangeSelect}
                className='basic-multi-select'
                classNamePrefix='select'
                value={users}
              />
            </FormGroup>
            <FormGroup>
              <Alert
                color='danger'
                isOpen={this.state.errorAccess}
                toggle={this.onDismiss}>
                Sorry, you don't have access to add working order
              </Alert>
            </FormGroup>
            <Button type='submit' color='biruicon'>
              Submit
            </Button>
          </Form>
        </CardBody>
      </Card>
    );
  }
}
