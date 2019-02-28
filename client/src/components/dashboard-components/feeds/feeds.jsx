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
								<div className="feed-icon bg-info"><i className="far fa-bell"></i></div> Hi, you have 4 Working Order requests. 
							</li>
							<li className="feed-item">
								<div className="feed-icon bg-success"><i className="ti-server"></i></div> Wow, there are 9 Working Orders.
							</li>
							<li className="feed-item">
								<div className="feed-icon bg-warning"><i className="ti-shopping-cart"></i></div> Ohh, there are 4 Working Order overdue.
							</li>
							<li className="feed-item">
								<div className="feed-icon bg-danger"><i className="ti-user"></i></div> Good job, 5 Working Order complete.
							</li>
						</ul>
					</div>
				</CardBody>
			</Card>
		);
	}
}

export default Feeds;
