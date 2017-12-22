import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Button, InputGroup, ServerErrorMsg, ErrorMsg } from 'binary-components';
import { getConstraints } from './SettingsSelfExclusion.validation.config';
import UpdateNotice from '../containers/UpdateNotice';
import { api } from '../_data/LiveData';
import ValidationManager from '../_utils/ValidationManager';

export default class SettingsSelfExclusion extends PureComponent {

  props: {
    max_balance: number,
    max_turnover: number,
    max_losses: number,
    max_7day_turnover: number,
    max_7day_losses: number,
    max_30day_turnover: number,
    max_30day_losses: number,
    max_open_bets: number,
    session_duration_limit: number,
    timeout_until: number,
    exclude_until: string,
  };

  constructor(props) {
    super(props);
    this.DOMNodes = {};
    const formData = this.getFormData(props);
    this.state = {
      formData,
      errors: {},
      serverError: false,
      success: false,
    };

    this.constraints = getConstraints(this.state.formData);
    this.validationMan = new ValidationManager(this.constraints);
  }

  getFormData(props) {
    return {
      max_balance: props.max_balance,
      max_turnover: props.max_turnover,
      max_losses: props.max_losses,
      max_7day_turnover: props.max_7day_turnover,
      max_7day_losses: props.max_7day_losses,
      max_30day_turnover: props.max_30day_turnover,
      max_30day_losses: props.max_30day_losses,
      max_open_bets: props.max_open_bets,
      session_duration_limit: props.session_duration_limit,
      timeout_until_time: props.timeout_until,
      timeout_until_date: props.timeout_until,
      exclude_until: props.exclude_until,
    };
  }

  componentWillReceiveProps(nextProps) {
		const formData = this.getFormData(nextProps);
		this.setState({ formData });
	}

  onEntryChange = (e: SyntheticEvent) => {
    const s = this.validationMan.validateFieldAndGetNewState(e, this.state.formData);
    this.setState(s);
  }

  componentWillUnmount() {
    clearTimeout(this.hideSuccess);
  }

  onFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const newErrors = this.validationMan.validateAll(this.state.formData);
    this.setState({ errors: newErrors });
    const keys = Object.keys(newErrors);
    if (keys.length > 0) {
      this.DOMNodes[keys[0]].scrollIntoView({ block: 'center', behavior: 'smooth' });
    } else {
      this.updateSelfExclusion();
    }
  }

  updateSelfExclusion = async () => {
    const { timeout_until_time, timeout_until_date, ...newSettings } = this.state.formData;
    if (timeout_until_date && timeout_until_time) {
      const timeout_until = moment(timeout_until_date + ' ' + timeout_until_time).valueOf() / 1000;
      newSettings.timeout_until = timeout_until;
    }
    try {
      await api.setSelfExclusion(newSettings);
      this.setState({
        success: true,
        serverError: false,
      });
      document.getElementsByClassName('update-notice')[0].scrollIntoView();
      api.getSelfExclusion();
      api.getAccountLimits();
      this.hideSuccess = setTimeout(() => {
        this.setState({ success: false });
        if (newSettings.exclude_until || newSettings.timeout_until) {
          window.location.reload();
        }
      }, 3000);
    } catch (e) {
      this.setState({ serverError: e.error.error.message });
    }
  }

  render() {
    const { formData, success, serverError, errors } = this.state;
    const addToFormDOM = inp => { if (inp) this.DOMNodes[inp.props.id] = ReactDOM.findDOMNode(inp); }; // eslint-disable-line react/no-find-dom-node
    return (
      <div className="settings-self-exclusion">
        <form onSubmit={this.onFormSubmit}>
          {serverError && <ServerErrorMsg text={serverError} />}
          {Object.keys(this.state.errors) > 0 && <ErrorMsg text="Please fill the form with valid values" />}
          <UpdateNotice text="Settings updated" show={success} />
          <InputGroup
            id="max_balance" ref={addToFormDOM}
            label="Maximum account cash balance"
            type="text"
            maxLength="20"
            // hint="Once this limit is reached, you may no longer deposit."
            defaultValue={formData.max_balance}
            onChange={this.onEntryChange}
          />
          {errors.max_balance && <ErrorMsg text={errors.max_balance[0]} />}
          <InputGroup
            id="max_turnover" ref={addToFormDOM}
            label="Daily turnover limit"
            type="text"
            maxLength="20"
            // hint="Maximum aggregate contract purchases per day."
            defaultValue={formData.max_turnover}
            onChange={this.onEntryChange}
          />
          {errors.max_turnover && <ErrorMsg text={errors.max_turnover[0]} />}
          <InputGroup
            id="max_losses" ref={addToFormDOM}
            label="Daily limit on losses"
            type="text"
            maxLength="20"
            // hint="Maximum aggregate loss per day."
            defaultValue={formData.max_losses}
            onChange={this.onEntryChange}
          />
          {errors.max_losses && <ErrorMsg text={errors.max_losses[0]} />}
          <InputGroup
            id="max_7day_turnover" ref={addToFormDOM}
            label="7-day turnover limit"
            type="text"
            maxLength="20"
            // hint="Maximum aggregate contract purchases over a 7-day period."
            defaultValue={formData.max_7day_turnover}
            onChange={this.onEntryChange}
          />
          {errors.max_7day_turnover && <ErrorMsg text={errors.max_7day_turnover[0]} />}
          <InputGroup
            id="max_7day_losses" ref={addToFormDOM}
            label="7-day limit on losses"
            type="text"
            maxLength="20"
            // hint="Maximum aggregate loss over a 7-day period."
            defaultValue={formData.max_7day_losses}
            onChange={this.onEntryChange}
          />
          {errors.max_7day_losses && <ErrorMsg text={errors.max_7day_losses[0]} />}
          <InputGroup
            id="max_30day_turnover" ref={addToFormDOM}
            label="30-day turnover limit"
            type="text"
            maxLength="20"
            // hint="Maximum aggregate contract purchases over a 30-day period."
            defaultValue={formData.max_30day_turnover}
            onChange={this.onEntryChange}
          />
          {errors.max_30day_turnover && <ErrorMsg text={errors.max_30day_turnover[0]} />}
          <InputGroup
            id="max_30day_losses" ref={addToFormDOM}
            label="30-day limit on losses"
            type="text"
            maxLength="20"
            // hint="Maximum aggregate loss over a 30-day period."
            defaultValue={formData.max_30day_losses}
            onChange={this.onEntryChange}
          />
          {errors.max_30day_losses && <ErrorMsg text={errors.max_30day_losses[0]} />}
          <InputGroup
            id="max_open_bets" ref={addToFormDOM}
            label="Maximum number of open positions"
            type="number"
            maxLength="4"
            defaultValue={formData.max_open_bets}
            onChange={this.onEntryChange}
          />
          {errors.max_open_bets && <ErrorMsg text={errors.max_open_bets[0]} />}
          <InputGroup
            id="session_duration_limit" ref={addToFormDOM}
            label="Session duration limit, in minutes"
            type="number"
            maxLength="5"
            // hint="You will be automatically logged out after such time."
            defaultValue={formData.session_duration_limit}
            onChange={this.onEntryChange}
          />
          {errors.session_duration_limit && <ErrorMsg text={errors.session_duration_limit[0]} />}
          <InputGroup
            id="timeout_until_date" ref={addToFormDOM}
            label="Time out until date"
            type="date"
            maxLength="10"
            defaultValue={formData.timeout_until_date || 'yyyy-mm-dd'}
            onChange={this.onEntryChange}
          />
          {errors.timeout_until_date && <ErrorMsg text={errors.timeout_until_date[0]} />}
          <InputGroup
            id="timeout_until_time" ref={addToFormDOM}
            label="Time out until time"
            type="time"
            maxLength="8"
            defaultValue={formData.timeout_until_time || '--:--:--'}
            onChange={this.onEntryChange}
          />
          {errors.timeout_until_time && <ErrorMsg text={errors.timeout_until_time[0]} />}
          <InputGroup
            id="exclude_until" ref={addToFormDOM}
            label="Exclude me from the website until"
            type="date"
            maxLength="10"
            defaultValue={formData.exclude_until || 'yyyy-mm-dd'}
            onChange={this.onEntryChange}
          />
          {errors.exclude_until && <ErrorMsg text={errors.exclude_until[0]} />}
          <Button text="Update" />
        </form>
      </div>
    );
  }
}
