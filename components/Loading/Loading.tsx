import React from 'react'
import { Oval } from 'react-loader-spinner'

const Loading = () => {
  return ( <Oval
    visible={true}
    height="80"
    width="80"
    color="#000000"
    ariaLabel="loading"
  />)
}

export default Loading