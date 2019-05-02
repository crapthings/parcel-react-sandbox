_ = require('lodash')
moment = require('moment')

React = require('react')
Component = React.Component

autorun = require('mobx').autorun
observable = require('mobx').observable
observer = require('mobx-react').observer

app = require('./context').app
App = require('./context').App

// MUI = require('@material-ui/core')
Link = require('react-router-dom').Link

require('./axios')
require('./helpers')
require('./components/common/axios')
require('./components/routes')
require('./auth')
