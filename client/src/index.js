Sugar = require('sugar')
Sugar.extend()
_ = require('lodash')
moment = require('moment')
nanoid = require('nanoid')
faker = require('faker')

React = require('react')
Component = React.Component
Fragment = React.Fragment

const mobx = require('mobx')
action = mobx.action
autorun = mobx.autorun
observable = mobx.observable
observer = require('mobx-react').observer

app = require('./context').app

// app.dsclient.login()

// MUI = require('@material-ui/core')
Link = require('react-router-dom').Link

Axios = require('./components/common/axios').default
require('./components/routes')

// app.loginWithToken()
