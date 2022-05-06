import {forwardRef} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Poly from '@s-ui/react-primitive-polymorphic-element'

import {BASE_CLASS_ITEM_HEADER_ICON} from './settings.js'

const AccordionItemHeaderIconDefault = forwardRef(
  ({as = 'i', children, isExpanded, animationDuration}, forwardedRef) => {
    return (
      <Poly
        as={as}
        ref={forwardedRef}
        className={cx(BASE_CLASS_ITEM_HEADER_ICON, {
          [`${BASE_CLASS_ITEM_HEADER_ICON}--expanded`]: isExpanded
        })}
        style={{
          transition: `transform ${animationDuration}ms ${
            isExpanded ? 'ease-out' : 'ease-in'
          }`
        }}
      >
        {children}
      </Poly>
    )
  }
)

AccordionItemHeaderIconDefault.displayName = 'AccordionItemHeaderIconDefault'

AccordionItemHeaderIconDefault.propTypes = {}

export default AccordionItemHeaderIconDefault
