import React, {Component, PropTypes} from 'react'
import ResultsList from './results-list'
import cx from 'classnames'

const DELTA_MOVE = 1
const UP = 'ArrowUp'
const DOWN = 'ArrowDown'
const ENTER = 'Enter'
const ESCAPE = 'Escape'

export default class FormBasic extends Component {
  constructor (...args) {
    super(...args)

    const { selectFirstByDefault, initialValue, focus } = this.props

    this.input = null
    this.defaultPosition = selectFirstByDefault ? 0 : -1
    this.state = {
      active: this.defaultPosition,
      value: initialValue,
      showResultList: false,
      focus
    }
  }

  _moveDown = () => {
    const { active } = this.state
    const lastPosition = this.props.suggests.length - 1
    return active === lastPosition
      ? active
      : active + DELTA_MOVE
  }

  _moveUp = () => {
    const { active } = this.state
    return active === this.defaultPosition
      ? active
      : active - DELTA_MOVE
  }

  _upDownHandler = (event) => {
    // Never go to negative values or value higher than the list length
    const active = event.key === DOWN
      ? this._moveDown()
      : this._moveUp()
    this.setState({ active })
    event.stopPropagation()
    event.preventDefault()
  }

  _enterHandler = () => {
    const suggest = this.props.suggests[this.state.active]

    if (suggest) {
      const value = suggest.literal || suggest.content
      this.setState({ value })
      this.handleSelect(suggest)
    }
  }

  _escapeHandler = () => {
    this.setState({
      showResultList: false,
      active: null
    })
  }

  _focusInput = () => {
    this.input.focus()
  }

  _handleChange = (event) => {
    const value = event.target.value
    this.setState({
      value,
      active: this.defaultPosition
    })
    this.props.handleChange(value)
  }

  _handleSubmit = () => {
    this.props.handleSubmit(this.state.value)
  }

  _handleClear = () => {
    this._handleChange({
      target: {
        value: ''
      }
    })
    this._focusInput()
  }

  _handleSelect = (suggest) => {
    this.setState({
      value: suggest.literal || suggest.content
    })
    this.props.handleSelect(suggest)
  }

  _handleKeyDown = (event) => {
    this.setState({
      showResultList: true
    })

    switch (event.key) {
      case UP:
      case DOWN:
        this._upDownHandler(event)
        break
      case ENTER:
        this._enterHandler()
        break
      case ESCAPE:
        this._escapeHandler()
        break
    }
  }

  _renderResultList () {
    const { suggests } = this.props
    const { active } = this.state

    return suggests && suggests.length > 0
      ? (
        <ResultsList
          {...this.props}
          handleSelect={this._handleSelect}
          active={active}
          />
        )
      : null
  }

  componentDidMount () {
    if (this.state.focus) {
      this._focusInput()
    }
  }

  componentWillReceiveProps ({ focus }) {
    if (this.state.focus !== focus) {
      this.setState({ focus })
    }
  }

  componentWillUpdate (nextProps, { focus }) {
    if (focus) {
      this._focusInput()
    }
  }

  render () {
    const { placeholder, handleFocus, handleBlur, submit, collapsed } = this.props
    const { text: submitText, icon: SubmitIcon } = submit
    const { value, showResultList } = this.state
    const formBasicClassName = cx('sui-FormBasic', {
      'is-collapsed': submit && collapsed
    })
    return (
      <div className='sui-FormBasic-wrap'>
        <div className={formBasicClassName}>
          <div className='sui-FormBasic-inputWrap'>
            <input
              ref={node => { this.input = node }}
              value={value}
              placeholder={placeholder}
              className='sui-FormBasic-input'
              type='text'
              onChange={this._handleChange}
              onKeyDown={this._handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {value &&
              <span
                className='sui-FormBasic-clear'
                onClick={this._handleClear}
              />
            }
          </div>
          {submit &&
            <button className='sui-FormBasic-submit' onClick={this._handleSubmit}>
              {SubmitIcon && <SubmitIcon svgClass='sui-FormBasic-submitIcon' />}
              {submitText && submitText}
            </button>
          }
        </div>
        {showResultList && this._renderResultList()}
      </div>
    )
  }
}

FormBasic.propTypes = {
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func,
  handleClear: PropTypes.func,
  handleSelect: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  initialValue: PropTypes.string,
  placeholder: PropTypes.string,
  suggests: PropTypes.array.isRequired,
  selectFirstByDefault: PropTypes.bool,
  focus: PropTypes.bool,
  collapsed: PropTypes.bool,
  submit: PropTypes.shape({
    icon: PropTypes.func,
    text: PropTypes.string
  })
}

FormBasic.defaultProps = {
  initialValue: '',
  selectFirstByDefault: true,
  focus: false,
  submit: false
}

FormBasic.displayName = 'FormBasic'
