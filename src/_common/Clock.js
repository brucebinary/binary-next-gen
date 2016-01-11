import React from 'react';
import { FormattedTime } from 'react-intl';

export default class Clock extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            time: new Date(),
        };
        setInterval(() => this.setState({ time: new Date() }), 1000);
    }

    render() {
        const { time } = this.state;
        return (
            <FormattedTime value={time} hour="numeric" minute="numeric" second="numeric" />
        );
    }
}
