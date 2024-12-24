export const getFeederNode = (key, sideBarTreeArray = {}) => {
  let stack = [];
  const dfs = (node, key) => {
    if (node.id === key) {
      stack.push(node);
      return;
    } else if (node.children) {
      let i;
      for (i = 0; i < node.children.length; i++) {
        dfs(node.children[i], key);
      }
    }
    return null;
  };
  const values = Object.values(sideBarTreeArray);

  for (let j = 0; j < values.length; j++) {
    for (let k = 0; k < values[j].length; k++) {
      if (stack.length) {
        return stack;
      }
      dfs(values[j][k], key);
    }
  }

};
