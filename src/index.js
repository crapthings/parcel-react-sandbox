_ = require('lodash')
moment = require('moment')
faker = require('faker')

React = require('react')
Component = React.Component

MUI = require('@material-ui/core')

observable = require('mobx').observable
observer = require('mobx-react').observer

app = require('./context').default.app

require('./routes')
