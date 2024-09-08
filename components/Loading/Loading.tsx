import React from 'react'
import { Oval } from 'react-loader-spinner'

const Loading = () => {
  return ( <Oval
    visible={true}
    height="80"
    width="120"
    color="#000000"
    ariaLabel="loading"
    secondaryColor="#ffffff"
  />)
}

export default Loading