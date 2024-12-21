export const extractFieldsForStacked = ({
  apiKey,
  topBar,
  parentName,
  parentName2,
  tree,
}) => {
  let apiEndpoints = [];

  if (topBar && !parentName && !parentName2) {
    const topBarNode = tree[topBar];
    if (topBarNode) {
      topBarNode.forEach((child) => {
        if (child.id !== "overview" && child.apis) {
          apiEndpoints.push(...child.apis);
        }
      });
    }
  } else if (topBar && parentName && !parentName2) {
    const parentNode = tree[topBar]?.find((item) => item.id === parentName);
    if (parentNode?.children) {
      parentNode.children.forEach((child) => {
        if (child.apis) apiEndpoints.push(...child.apis);
      });
    }
  }

  return apiEndpoints.map((api) => ({
    key: api.split("/api/")[1]?.replace(/\//g, ""),
    label: api.split("/api/")[1]?.replace(/_/g, " ").toUpperCase(),
  }));
};

export const extractFieldsForDonut = ({
  topBar,
  parentName,
  parentName2,
  tree,
}) => {
  let apiEndpoints = [];

  if (parentName && !parentName2) {
    const parentNode = tree[topBar]?.find((item) => item.id === parentName);
    parentNode?.children?.forEach((child) => {
      if (child.apis) apiEndpoints.push(...child.apis);
    });
  }

  return apiEndpoints.map((api) => ({
    key: api.split("/api/")[1]?.replace(/\//g, ""),
    label: api.split("/api/")[1]?.replace(/_/g, " ").toUpperCase(),
  }));
};
