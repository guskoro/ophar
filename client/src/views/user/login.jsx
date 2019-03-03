import React from 'react';
import { 
    Button, 
    Card,
    CardBody,
    Col,
    Form, 
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';

export default class Example extends React.Component {
  render() {
    return (
        <Col xs="12" md="6">
        <Card>
            <CardBody>
                <Form inline>
                    <Label for="exampleEmail" sm={2} size="lg">Login</Label>
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
                    <Button color="primary">Submit</Button>
                </Form>
            </CardBody>
        </Card>
        </Col>
    );
  }
}