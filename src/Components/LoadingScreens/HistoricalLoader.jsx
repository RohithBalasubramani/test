import React from "react"
import ContentLoader from "react-content-loader"

const HistoricalLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={1228}
    height={3625}
    viewBox="0 0 1228 3625"
    backgroundColor="#e6e6e6"
    foregroundColor="#d6d6d6"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="1228" height="493" />
    <rect x="0" y="513" rx="0" ry="0" width="1228" height="493" />
    <rect x="0" y="1026" rx="0" ry="0" width="1228" height="493" />
    <rect x="0" y="1539" rx="0" ry="0" width="1228" height="493" />
    <rect x="0" y="2052" rx="0" ry="0" width="1228" height="493" />
    <rect x="0" y="2565" rx="0" ry="0" width="1228" height="493" />
  </ContentLoader>
)

export default HistoricalLoader

