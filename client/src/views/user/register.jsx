import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

export default class Example extends React.Component {
  render() {
    return (
      <Card>
        <CardBody>
          <Form>
            <FormGroup>
              <Label for='name'>Name</Label>
              <Input type='text' name='name' id='name' placeholder='Name' />
            </FormGroup>
            <FormGroup>
              <Label for='email'>Email</Label>
              <Input type='email' name='email' id='email' placeholder='Email' />
            </FormGroup>
            <FormGroup>
              <Label for='password'>Password</Label>
              <Input
                type='password'
                name='password'
                id='password'
                placeholder='Password'
              />
            </FormGroup>
            <FormGroup>
              <Label for='password2'>Password Confirmation</Label>
              <Input
                type='password'
                name='password2'
                id='password2'
                placeholder='Password Confirmation'
              />
            </FormGroup>
            <FormGroup>
              <Label for='role'>Role</Label>
              <Input type='select' name='role' id='role'>
                <option selected disabled>
                  Select role
                </option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Supervisor</option>
                <option>Engineer</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for='division'>Division</Label>
              <Input type='select' name='division' id='division'>
                <option selected disabled>
                  Select division
                </option>
                <option>Corrective Maintenance</option>
                <option>Preventive Maintenance</option>
                <option>Assets</option>
                <option>Patrols and Controls</option>
              </Input>
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
