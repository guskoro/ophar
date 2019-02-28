import React from "react";
import {
	Card,
	CardBody,
  CardTitle,
  Badge
} from 'reactstrap';

class Feeds extends React.Component {
	render() {
		return (
			<Card>
				<CardBody>
					<CardTitle>Overview this month</CardTitle>
					<div className="feed-widget">
						<ul className="list-style-none feed-body m-0 pb-3">
							<li className="feed-item">
								<div className="feed-icon bg-info"><i className="far fa-envelope"></i></div> Hi, you have 4 Work Order requests. 
							</li>
							<li className="feed-item">
								<div className="feed-icon bg-info"><i className="ti-server"></i></div> Wow, there are 9 Work Orders.
							</li>
							<li className="feed-item">
								<div className="feed-icon bg-info"><i className="far fa-thumbs-down"></i></div> Ohh, there are 4 Work Orders overdue.
							</li>
							<li className="feed-item">
								<div className="feed-icon bg-info"><i className="far fa-thumbs-up"></i></div> Good job, 5 Work Orders complete.
							</li>
						</ul>
					</div>
				</CardBody>
			</Card>
		);
	}
}

export default Feeds;
