// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// Import React and ReactDOM
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './src/App'

// Initialize React
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root')
  const root = ReactDOM.createRoot(container)
  
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
})
