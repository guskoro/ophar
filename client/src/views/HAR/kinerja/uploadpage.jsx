import React from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import { CardSubtitle, CardTitle, Col, Row } from 'reactstrap';

class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      WOs: [],
      filtered: [],
      query: 0,
      currentPage: 0,
      pagesCount: 0,
      activeTab: '1'
    };
  }

  render() {
    return (
      <Row>
        <Col sm='12'>
          <div className='d-flex align-items-center batas-atas'>
            <div>
              <CardTitle>File Upload</CardTitle>
              <CardSubtitle>HAR | Performance</CardSubtitle>
            </div>
          </div>
        </Col>
        <Col xs='12' md='3'>
          <div>
            <FilePond allowMultiple={true} />
            <p className='App-intro'>AR RAW DATA</p>
          </div>
        </Col>
        <Col xs='12' md='3'>
          <div>
            <FilePond />
            <p className='App-intro'>RAW DATA</p>
          </div>
        </Col>
        <Col xs='12' md='3'>
          <div>
            <FilePond />
            <p className='App-intro'>FMS</p>
          </div>
        </Col>
        <Col xs='12' md='3'>
          <div>
            <FilePond />
            <p className='App-intro'>HALO</p>
          </div>
        </Col>
        <Col xs='12' md='3'>
          <div>
            <FilePond />
            <p className='App-intro'>Offline Assets</p>
          </div>
        </Col>
      </Row>
    );
  }
}

export default Upload;
