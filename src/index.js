_ = require('lodash')
moment = require('moment')
// faker = require('faker')

React = require('react')
Component = React.Component
Link = require('react-router-dom').Link

// MUI = require('@material-ui/core')

observable = require('mobx').observable
observer = require('mobx-react').observer

AxiosGet = require('react-axios').Get
AxiosPost = require('react-axios').Post

app = require('./context').default.app

require('./routes')
