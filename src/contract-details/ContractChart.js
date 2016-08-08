import React, { PropTypes, PureComponent } from 'react';
import { BinaryChart } from 'binary-charts';
import { actions } from '../_store';

const chartToDataType = {
    area: 'ticks',
    candlestick: 'candles',
};

export default class ContractChart extends PureComponent {
    static contextTypes = {
        theme: PropTypes.string.isRequired,
    };

    static propTypes = {
        contract: PropTypes.object,
        chartData: PropTypes.shape({
            ticks: PropTypes.array,
            candles: PropTypes.array,
        }),
        pipSize: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            chartType: 'area',
            dataType: 'ticks',
        };
    }

    changeChartType = type => {
        const { contract } = this.props;
        const { chartType } = this.state;

        if (chartType === type) {
            return undefined;
        }

        const newDataType = chartToDataType[type];
        const toStream = !contract.sell_time;
        this.setState({ chartType: type, dataType: newDataType });

        return actions
            .getDataForContract(contract.contract_id, 1, 'all', newDataType, toStream)
            .catch(err => {
                const serverError = err.error.error;
                if (serverError.code === 'NoRealtimeQuotes' || serverError.code === 'MarketIsClosed') {
                    return actions.getDataForContract(contract.contract_id, 1, 'all', newDataType, false);
                }
                throw new Error(serverError.message);
            });
    }

    render() {
        const { contract, chartData, pipSize } = this.props;
        const { theme } = this.context;
        const { chartType, dataType } = this.state;
        const data = chartData[dataType];
        const allowCandle = !contract.tick_count;
        const rangeChange = (count, durationType) =>
            actions.getDataForContract(contract.contract_id, count, durationType, dataType);

        return (
            <BinaryChart
                className="contract-chart"
                defaultRange={6}
                showAllRangeSelector={false}
                contract={contract}
                ticks={data}
                type={chartType}
                theme={theme}
                rangeChange={contract ? undefined : rangeChange}
                typeChange={allowCandle && this.changeChartType}
                pipSize={pipSize}
            />
        );
    }
}
