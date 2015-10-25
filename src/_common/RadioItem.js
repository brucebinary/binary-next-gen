import React from 'react';

export default class RadioGroup extends React.Component {

	static propTypes = {
		className: React.PropTypes.string,
		defaultChecked: React.PropTypes.bool,
		img: React.PropTypes.string,
		label: React.PropTypes.string,
		name: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		value: React.PropTypes.any,
	};

	render() {
		const {defaultChecked, img, label, name, onChange, value} = this.props;

		return (
			<span className="radio-item">
				<input id={value}
					type="radio"
					name={name}
					value={value}
					defaultChecked={defaultChecked}
					onChange={onChange} />
				<label htmlFor={value}>
					{img && <img src={img} />}
					{label}
				</label>
			</span>
		);
	}
}
