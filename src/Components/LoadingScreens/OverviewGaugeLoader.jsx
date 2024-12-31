import React from "react"
import ContentLoader from "react-content-loader"

const OverviewGaugeLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={314}
    height={333}
    viewBox="0 0 314 333"
    backgroundColor="#e6e6e6"
    foregroundColor="#d6d6d6"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="314" height="333" />
  </ContentLoader>
)

export default OverviewGaugeLoader

