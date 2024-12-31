import React from "react"
import ContentLoader from "react-content-loader"

const OverviewRealTimeEnergyLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={1220}
    height={425}
    viewBox="0 0 1220 425"
    backgroundColor="#e6e6e6"
    foregroundColor="#d6d6d6"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="872" height="425" />
    <rect x="905" y="0" rx="0" ry="0" width="317" height="425" />
  </ContentLoader>
)

export default OverviewRealTimeEnergyLoader

