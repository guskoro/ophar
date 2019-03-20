import React, { Component } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
  Row
} from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';
import swal from 'sweetalert';
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
      types: [],
      arid: '',
      iid: '',
      region: '',
      description: '',
      classification: '',
      rootcause: '',
      rootdetail: '',
      impact: '',
      type: '',
      start: '',
      end: '',
      arrequest: '',
      ardestination: '',
      arregion: '',
      arcreate: '',
      arclose: '',
      arend: '',
      recduration: '',
      ttr: '',
      kronologi: '',
      improve: '',
      saidi: '',
      month: '',
      week: '',

      errorAccess: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentDidMount = async () => {
    await this.getTypes();
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
      arid,
      iid,
      region,
      description,
      classification,
      rootcause,
      rootdetail,
      impact,
      type,
      start,
      end,
      arrequest,
      ardestination,
      arregion,
      arcreate,
      arclose,
      arend,
      recduration,
      ttr,
      kronologi,
      improve,
      saidi,
      month,
      week
    } = this.state;

    const newUS = {
      type: type,
      arid: arid,
      iid: iid,
      region: region,
      description: description,
      classification: classification,
      rootcause: rootcause,
      rootdetail: rootdetail,
      impact: impact,
      type: type,
      start: start,
      end: end,
      arrequest: arrequest,
      ardestination: ardestination,
      arregion: arregion,
      arcreate: arcreate,
      arclose: arclose,
      arend: arend,
      recduration: recduration,
      ttr: ttr,
      kronologi: kronologi,
      improve: improve,
      saidi: saidi,
      month: month,
      week: week
    };

    axios
      .post('/api/upload-scada20kv', newUS)
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
          plans: [],
          arid: '',
          iid: '',
          region: '',
          description: '',
          classification: '',
          rootcause: '',
          rootdetail: '',
          impact: '',
          type: '',
          start: '',
          end: '',
          arrequest: '',
          ardestination: '',
          arregion: '',
          arcreate: '',
          arclose: '',
          arend: '',
          recduration: '',
          ttr: '',
          kronologi: '',
          improve: '',
          saidi: '',
          month: '',
          week: ''
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
      types,
      arid,
      iid,
      region,
      description,
      classification,
      rootcause,
      rootdetail,
      impact,
      type,
      start,
      end,
      arrequest,
      ardestination,
      arregion,
      arcreate,
      arclose,
      arend,
      recduration,
      ttr,
      kronologi,
      improve,
      saidi,
      month,
      week
    } = this.state;

    return (
      <Card>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Input invalid={errors.access ? true : false} hidden />
              <FormFeedback>{errors.access}</FormFeedback>
            </FormGroup>
            <Row form>
              <Col md={5}>
                <FormGroup>
                  <Label for='arid'>AR ID</Label>
                  <Input
                    invalid={errors.arid ? true : false}
                    type='text'
                    name='arid'
                    id='arid'
                    placeholder='Input arid'
                    value={arid}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.arid}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for='iid'>Incident ID</Label>
                  <Input
                    invalid={errors.iid ? true : false}
                    type='text'
                    name='iid'
                    id='iid'
                    placeholder='Input Incident ID'
                    value={iid}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.iid}</FormFeedback>
                </FormGroup>
              </Col>

              <Col md={2}>
                <FormGroup>
                  <Label for='region'>Incident Region</Label>
                  <Input
                    invalid={errors.region ? true : false}
                    type='text'
                    name='region'
                    id='region'
                    placeholder='Input region'
                    value={region}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.region}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for='description'>Incident Description</Label>
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
            <Row>
              <Col md='4'>
                <FormGroup>
                  <Label for='classification'>Incident Classification</Label>
                  <Input
                    invalid={errors.classification ? true : false}
                    type='text'
                    name='classification'
                    id='classification'
                    placeholder='Input classification'
                    value={classification}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.classification}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='4'>
                <FormGroup>
                  <Label for='rootcause'>Incident Root Cause</Label>
                  <Input
                    invalid={errors.rootcause ? true : false}
                    type='text'
                    name='rootcause'
                    id='rootcause'
                    placeholder='Input rootcause'
                    value={rootcause}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.rootcause}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='4'>
                <FormGroup>
                  <Label for='rootdetail'>Incident Root Detail</Label>
                  <Input
                    invalid={errors.rootdetail ? true : false}
                    type='text'
                    name='rootdetail'
                    id='rootdetail'
                    placeholder='Input rootdetail'
                    value={rootdetail}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.rootdetail}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md='2'>
                <FormGroup>
                  <Label for='impact'>Incident Service Impact</Label>
                  <Input
                    invalid={errors.impact ? true : false}
                    type='select'
                    name='impact'
                    id='impact'
                    value={impact}
                    onChange={this.onChange}>
                    <option value='' disabled>
                      Select impact
                    </option>
                    <option value='yes'>Yes</option>
                    <option value='no'>No</option>
                  </Input>
                  <FormFeedback>{errors.impact}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='2'>
                <FormGroup>
                  <Label for='type'>Incident Source Category</Label>
                  <Input
                    invalid={errors.type ? true : false}
                    type='select'
                    name='type'
                    id='type'
                    value={type}
                    onChange={this.onChange}>
                    <option value='' disabled>
                      Select Category
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
              </Col>
              <Col md='4'>
                <FormGroup>
                  <Label for='start'>Start Incident</Label>
                  <Input
                    invalid={errors.start ? true : false}
                    type='text'
                    name='start'
                    id='start'
                    placeholder='Input start'
                    value={start}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.start}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='4'>
                <FormGroup>
                  <Label for='end'>End Incident</Label>
                  <Input
                    invalid={errors.end ? true : false}
                    type='text'
                    name='end'
                    id='end'
                    placeholder='Input end'
                    value={end}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.end}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md='2'>
                <FormGroup>
                  <Label for='arrequest'>AR Request</Label>
                  <Input
                    invalid={errors.arrequest ? true : false}
                    type='text'
                    name='arrequest'
                    id='arrequest'
                    placeholder='Input AR Request'
                    value={arrequest}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.arrequest}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='2'>
                <FormGroup>
                  <Label for='ardestination'>AR Destination</Label>
                  <Input
                    invalid={errors.ardestination ? true : false}
                    type='text'
                    name='ardestination'
                    id='ardestination'
                    placeholder='Input ARdestination'
                    value={ardestination}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.ardestination}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='2'>
                <FormGroup>
                  <Label for='arregion'>AR Region</Label>
                  <Input
                    invalid={errors.arregion ? true : false}
                    type='text'
                    name='arregion'
                    id='arregion'
                    placeholder='Input ARregion'
                    value={arregion}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.arregion}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='2'>
                <FormGroup>
                  <Label for='arcreate'>AR Create</Label>
                  <Input
                    invalid={errors.arcreate ? true : false}
                    type='text'
                    name='arcreate'
                    id='arcreate'
                    placeholder='Input ARcreate'
                    value={arcreate}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.arcreate}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='2'>
                <FormGroup>
                  <Label for='arclose'>AR Close</Label>
                  <Input
                    invalid={errors.arclose ? true : false}
                    type='text'
                    name='arclose'
                    id='arclose'
                    placeholder='Input ARclose'
                    value={arclose}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.arclose}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='2'>
                <FormGroup>
                  <Label for='arend'>AR End</Label>
                  <Input
                    invalid={errors.arend ? true : false}
                    type='text'
                    name='arend'
                    id='arend'
                    placeholder='Input ARend'
                    value={arend}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.arend}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md='6'>
                <FormGroup>
                  <Label for='recduration'>Recovery Duration</Label>
                  <Input
                    invalid={errors.recduration ? true : false}
                    type='text'
                    name='recduration'
                    id='recduration'
                    placeholder='Input Recovery Duration'
                    value={recduration}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.recduration}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='6'>
                <FormGroup>
                  <Label for='ttr'>Incident TTR</Label>
                  <Input
                    invalid={errors.ttr ? true : false}
                    type='text'
                    name='ttr'
                    id='ttr'
                    placeholder='Input Recovery Duration'
                    value={ttr}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.ttr}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label for='kronologi'>Kronologi</Label>
              <Input
                invalid={errors.kronologi ? true : false}
                type='text'
                name='kronologi'
                id='kronologi'
                placeholder='Input Recovery Duration'
                value={kronologi}
                onChange={this.onChange}
              />
              <FormFeedback>{errors.kronologi}</FormFeedback>
            </FormGroup>
            <Row>
              <Col md='4'>
                <FormGroup>
                  <Label for='improve'>Improve</Label>
                  <Input
                    invalid={errors.improve ? true : false}
                    type='text'
                    name='improve'
                    id='improve'
                    placeholder='Input Recovery Duration'
                    value={improve}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.improve}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='4'>
                <FormGroup>
                  <Label for='saidi'>SAIDI</Label>
                  <Input
                    invalid={errors.saidi ? true : false}
                    type='text'
                    name='saidi'
                    id='saidi'
                    placeholder='Input Recovery Duration'
                    value={saidi}
                    onChange={this.onChange}
                  />
                  <FormFeedback>{errors.saidi}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='2'>
                <FormGroup>
                  <Label for='month'>Month</Label>
                  <Input
                    invalid={errors.month ? true : false}
                    type='select'
                    name='month'
                    id='month'
                    value={month}
                    onChange={this.onChange}>
                    <option value='' disabled>
                      Select Month
                    </option>
                    <option value='M1'>January</option>
                    <option value='M2'>February</option>
                    <option value='M3'>March</option>
                    <option value='M4'>April</option>
                    <option value='M5'>May</option>
                    <option value='M6'>June</option>
                    <option value='M7'>July</option>
                    <option value='M8'>August</option>
                    <option value='M9'>September</option>
                    <option value='M10'>October</option>
                    <option value='M11'>November</option>
                    <option value='M12'>December</option>
                  </Input>
                  <FormFeedback>{errors.month}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md='2'>
                <FormGroup>
                  <Label for='week'>Week</Label>
                  <Input
                    invalid={errors.week ? true : false}
                    type='select'
                    name='week'
                    id='week'
                    value={week}
                    onChange={this.onChange}>
                    <option value='' disabled>
                      Select Week
                    </option>
                    <option value='W1'>Week 1</option>
                    <option value='W2'>Week 2</option>
                    <option value='W3'>Week 3</option>
                    <option value='W4'>Week 4</option>
                  </Input>
                  <FormFeedback>{errors.week}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
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
