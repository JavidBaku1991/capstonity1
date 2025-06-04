import React from 'react'
import { createRoot } from 'react-dom/client' // 👈 use the new API
import PropTypes from 'prop-types'

const Hello = props => (
  <div>Hello {props.name}!</div>
)

Hello.defaultProps = {
  name: 'David'
}

Hello.propTypes = {
  name: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.body.appendChild(document.createElement('div'))
  const root = createRoot(container) // 👈 create a root
  root.render(<Hello name="React" />) // 👈 render to root
})
