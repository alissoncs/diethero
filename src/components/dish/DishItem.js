import React from 'react';
import PropTypes from 'prop-types';
import { isArray, isFunction, isNumber } from 'lodash';
import { foodCalories } from '../../services/kcalculator';

export default class DishItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enableEditG: true,
    };
    this.classComponent = ['dish-item'];
  }
  onIncrement() {
    const item = Object.assign({}, this.props.item);
    if (isNumber(item.g)) {
      item.g += 50;
    } else {
      item.g = 50;
    }
    this.props.onChange(item);
  }
  onDecrement() {
    const item = Object.assign({}, this.props.item);
    if (isNumber(item.g)) {
      item.g -= 50;
    } else {
      item.g = 50;
    }
    if (item.g > 0) {
      this.props.onChange(item);
    }
  }
  renderEditGForm() {
    const { item, onChange } = this.props;
    if (!onChange) return <div className="g-control-fixed">{`${item.g}g`}</div>; // pode editar

    return (
      <div className="g-control">
        <button
          type="button"
          className="btn btn-dec"
          title="-50g"
          tabIndex="-1"
          onClick={this.onDecrement.bind(this)}
        >
          -
        </button>
        <input
          type="tel"
          value={item.g || ''}
          tabIndex={0}
          onFocus={event => {
            event.target.select();
          }}
          onChange={this.onChangeG.bind(this)}
        />
        <button
          tabIndex="-1"
          type="button"
          className="btn btn-inc"
          title="+50g"
          onClick={this.onIncrement.bind(this)}
        >
          +
        </button>
      </div>
    );
  }
  renderRemoveButton() {
    if (!this.props.onRemove) return null;
    const { item } = this.props;

    return (
      <button
        className="btn-remove"
        disabled={!isFunction(this.props.onRemove)}
        onClick={() => {
          this.onRemove(item);
        }}
      >
        &times;
      </button>
    );
  }
  onChangeG(event) {
    let newG = event.target.value;
    const { item } = this.props;
    newG = parseInt(newG);
    if (newG) {
      item.g = newG > 2000 ? 2000 : newG;
    } else {
      item.g = null;
    }

    this.props.onChange(item);
  }
  enableEditG() {
    this.setState({
      enableEditG: true,
    });
  }
  onRemove(item) {
    if (this.props.onRemove) {
      this.props.onRemove(item);
    }
  }
  componentWillMount() {}
  componentDidMount() {
    setTimeout(() => {
      this.classComponent.push('fadeIn');
      this.forceUpdate();
    }, 0);
  }
  render() {
    let { item } = this.props;

    return (
      <div
        id={'dish-item-' + item.id}
        className={this.classComponent.join(' ')}
      >
        <strong className="item-name">{`${item.name}`}</strong>
        <span className="item-kcal">{`${foodCalories(item)}kcal`}</span>
        {this.renderEditGForm()}
        {this.renderRemoveButton()}
      </div>
    );
  }
}

DishItem.propTypes = {
  item: PropTypes.object.isRequired,
  onRemove: PropTypes.func,
  onChange: PropTypes.func,
};
