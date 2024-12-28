import React from "react"
import ContentLoader from "react-content-loader"

const RealTimeLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={1220}
    height={1308}
    viewBox="0 0 1220 1308"
    backgroundColor="#e6e6e6"
    foregroundColor="#d6d6d6"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="872" height="425" />
    <rect x="905" y="0" rx="0" ry="0" width="317" height="425" />
    <rect x="0" y="442" rx="0" ry="0" width="872" height="425" />
    <rect x="905" y="442" rx="0" ry="0" width="317" height="425" />
    <rect x="0" y="882" rx="0" ry="0" width="872" height="425" />
    <rect x="905" y="882" rx="0" ry="0" width="317" height="425" />
  </ContentLoader>
)

export default RealTimeLoader

