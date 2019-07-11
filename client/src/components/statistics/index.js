import _ from 'lodash'
import React, { Component, useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const [results, setResults] = useState({})
const [ready, setReady] = useState(false)

export default () => {

  useEffect(() => {
    const getResults = async () => {
      const { data } = await axios.get('http://localhost:4006/api/statistics')
      setResults(data)
      setReady(true)
    }

    getResults()
  }, [])

  if (!ready) return <div>loading</div>

  return (
    <div>
      {_.map(results.groupsGroupByType, (v, k) => (
        <div key={`groupsGroupByType-${k}`}>{k}: {v}</div>
      ))}
    </div>
  )
}
