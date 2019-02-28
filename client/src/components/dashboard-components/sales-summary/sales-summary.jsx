import React from "react";
import {
  Input,
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	Col,
	Row
} from 'reactstrap';
import { Line, Doughnut } from 'react-chartjs-2';

let completeWO = {
  datasets: [{
    backgroundColor: ['rgba(144,200,249,.7)', 'rgba(66,134,244,.7)'],
    data: [10, 20]
  }],

  // These labels appear in the legend and in the tooltips when hovering different arcs
  labels: [
      'Complete',
      'Incomplete'
  ]
};

let approvedWO = {
  datasets: [{
    backgroundColor: ['rgba(118,172,219,.7)', 'rgba(0,55,104,.7)'],
    data: [18, 12]
  }],

  // These labels appear in the legend and in the tooltips when hovering different arcs
  labels: [
      'Approved',
      'Pending'
  ]
};

class SalesSummary extends React.Component {
	render() {
		return (
			<Card>
				<CardBody>
					<div className="d-flex align-items-center">
						<div>
							<CardTitle>Work Orders Summary</CardTitle>
							<CardSubtitle>{10 + '/' + (10+20)} Complete</CardSubtitle>
						</div>
						<div className="ml-auto d-flex no-block align-items-center">
							<div className="dl">
								<Input type="select" className="custom-select">
									<option value="0">Weekly</option>
									<option value="1">Monthly</option>
									<option value="2">Yearly</option>
								</Input>
							</div>
						</div>
					</div>
					{/* <Row>
						<Col lg="12">
							<div className="campaign ct-charts">
								<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 250 }}>
									<Line data={lineData} options={{ maintainAspectRatio: false, legend: { display: false, labels: { fontFamily: "Nunito Sans" } }, scales: { yAxes: [{ stacked: true, gridLines: { display: false }, ticks: { fontFamily: "Nunito Sans" } }], xAxes: [{ gridLines: { display: false }, ticks: { fontFamily: "Nunito Sans" } }] } }} />
								</div>
							</div>
						</Col>
					</Row> */}
          <Row>
						<Col lg="6">
							<div className="campaign ct-charts">
								<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 250 }}>
									<Doughnut data={completeWO} options={{ maintainAspectRatio: false, legend: { display: true, labels: { fontFamily: "Nunito Sans" } } }} />
								</div>
							</div>
						</Col>
            <Col lg="6">
							<div className="campaign ct-charts">
								<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 250 }}>
									<Doughnut data={approvedWO} options={{ maintainAspectRatio: false, legend: { display: true, labels: { fontFamily: "Nunito Sans" } } }} />
								</div>
							</div>
						</Col>
					</Row>
				</CardBody>
			</Card>
		);
	}
}

export default SalesSummary;
