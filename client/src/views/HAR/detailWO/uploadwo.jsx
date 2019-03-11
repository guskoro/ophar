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
import CreatableSelect from 'react-select/lib/Creatable';
import axios from 'axios';

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
      type: '',
      priority: '',
      title: '',
      plans: '',
      description: '',
      program: '',
      deadline: '',
      errorAccess: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentDidMount = async () => {
    await this.getPriorities();
    await this.getTypes();
  };

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

  handleChange = plans => {
    this.setState({ plans });
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
      description,
      program,
      deadline
    } = this.state;

    const newWO = {
      type: type,
      priority: priority,
      title: title,
      plans: plans,
      description: description,
      program: program,
      deadline: deadline
    };

    axios
      .post('/api/working-order', newWO)
      .then(() => {
        this.props.history.push('/dashboard');
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
              <Label for='exampleEmail'>Work Order Plans</Label>
              <CreatableSelect
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
              />
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
              <Label for='deadline'>Work Order Deadline</Label>
              <Input
                invalid={errors.deadline ? true : false}
                type='date'
                name='deadline'
                id='deadline'
                value={deadline}
                onChange={this.onChange}
              />
              <FormFeedback>{errors.deadline}</FormFeedback>
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
