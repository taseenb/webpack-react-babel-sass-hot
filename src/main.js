import './stylesheets/main.sass'

import React from 'react'
import ReactDOM from 'react-dom'

const title = 'Ok'

console.log('hello world!')

ReactDOM.render(<div>{title}</div>, document.getElementById('app'))

module.hot.accept()
