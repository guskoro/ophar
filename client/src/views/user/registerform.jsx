import React from 'react';
import { Button, Card, CardBody, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

export default class Example extends React.Component {
  render() {
    return (
        <Card>
            <CardBody>
                <Form>
                    <FormGroup>
                        <Label for="exampleEmail">Name</Label>
                        <Input />
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" name="email" id="exampleEmail" placeholder="Email" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input type="password" name="password" id="examplePassword" placeholder="Password" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleSelect">Role</Label>
                        <Input type="select" name="select" id="exampleSelect">
                            <option>...</option>
                            <option>Admin</option>
                            <option>User</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleSelect">Division</Label>
                        <Input type="select" name="select" id="exampleSelect">
                            <option>...</option>
                            <option>PM</option>
                            <option>CM</option>
                            <option>Asset</option>
                            <option>P3ak</option>
                        </Input>
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>
            </CardBody>
        </Card>
    );
  }
}