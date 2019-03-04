// import React from 'react';

// import {
//   Button,
//   Card,
//   CardBody,
//   CardTitle,
//   CardSubtitle,
//   Col,
//   Form,
//   FormGroup,
//   Input,
//   InputGroup,
//   InputGroupAddon,
//   Label,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
//   Pagination,
//   PaginationItem,
//   PaginationLink,
//   Row,
//   Table,
//   Tooltip
// } from 'reactstrap';

//                 <Modal
//                   isOpen={this.state.modal}
//                   toggle={this.toggle}
//                   className={this.props.className}>
//                   <ModalHeader toggle={this.toggle}>Workorders</ModalHeader>
//                   <ModalBody>
//                     <Form>
//                       <FormGroup>
//                         <Label for='exampleEmail'>Work Title</Label>
//                         <Input />
//                       </FormGroup>
//                       <FormGroup>
//                         <Label for='exampleText'>Work Detail Description</Label>
//                         <Input type='textarea' name='text' id='exampleText' />
//                       </FormGroup>
//                       <FormGroup>
//                         <Label for='exampleEmail'>Work Plan</Label>
//                         <Input />
//                       </FormGroup>
//                       <FormGroup>
//                         <Label for='exampleSelect'>Priority</Label>
//                         <Input type='select' name='select' id='exampleSelect'>
//                           <option>Critical</option>
//                           <option>High</option>
//                           <option>Medium</option>
//                           <option>Low</option>
//                         </Input>
//                       </FormGroup>
//                       <FormGroup>
//                         <Label for='exampleSelect'>Work Type</Label>
//                         <Input type='select' name='select' id='exampleSelect'>
//                           <option>FOC</option>
//                           <option>FOT</option>
//                           <option>PS</option>
//                         </Input>
//                       </FormGroup>
//                       <FormGroup>
//                         <Label for='exampleSelect'>Work Program Type</Label>
//                         <Input type='select' name='select' id='exampleSelect'>
//                           <option>Rutin</option>
//                           <option>Non Rutin</option>
//                         </Input>
//                       </FormGroup>
//                       <FormGroup>
//                         <Label for='exampleDate'>Done Target</Label>
//                         <Input
//                           type='date'
//                           name='date'
//                           id='exampleDate'
//                           placeholder='date placeholder'
//                         />
//                       </FormGroup>
//                     </Form>
//                   </ModalBody>
//                   <ModalFooter>
//                     <Button color='primary' onClick={this.toggle}>
//                       Submit
//                     </Button>{' '}
//                     <Button color='secondary' onClick={this.toggle}>
//                       Cancel
//                     </Button>
//                   </ModalFooter>
//                 </Modal>