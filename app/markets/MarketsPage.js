import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MarketsActions from '../_actions/MarketsActions';
import MarketsList from './MarketsList';
import MarketsSearch from './MarketsSearch';
import { LiveData } from 'binary-live-api';

@connect(state => ({ markets: state.markets }))
export default class MarketsPage extends React.Component {

	constructor(props) {
		super(props);

		const liveData = new LiveData('2BpkX3lNIkuKH5VLIQqDHTJWNsYgOBTEBL85u9iMszP4RqHLGd5SM1Jt1TgqssbFNdHAi3cTgO6ubLuHYa1iXm77l7G5q4EMU50vjU85YRJF4VqcOYzFLDqieWEOsc7y')

		liveData.onDataChange = (function(data) {
			this.state = { activeSymbols: liveData.activeSymbols };

			if (data != 'active_symbols') return;

			const { markets, dispatch } = this.props;
			const actions = bindActionCreators(MarketsActions, dispatch);
			const parsed = Object.keys(data.active_symbols).map(m => ({
				id: data.active_symbols[m].symbol,
				name: data.active_symbols[m].display_name
			}));
			actions.updateMarkets(parsed);
		}).bind(this);
	}

	render() {

		const { markets, dispatch } = this.props;
		const actions = bindActionCreators(MarketsActions, dispatch);

		return (
			<div>
				<MarketsSearch actions={actions} />
  				<MarketsList markets={markets.shownMarkets} />
			</div>
		);
	}
}
