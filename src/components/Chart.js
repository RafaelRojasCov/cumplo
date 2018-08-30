import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';

export default class Chart extends Component {

	render() {
		return (
			<div>
				<Line
              data={this.props.chartData}
              options={this.props.options}
            />
			</div>
		)
	}
}
