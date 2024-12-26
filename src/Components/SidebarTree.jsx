import React, { useEffect, useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView"; // Ensure correct import path
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const SidebarTree = ({ treeArray, handleItemIdChange, topBarSelection }) => {
  const [selectedItemId, setSelectedItemId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to traverse the tree and find the selected item based on the current URL
  const findSelectedItemId = (currentPath, nodes, parentPath = "") => {
    for (const node of nodes) {
      const nodePath = `${parentPath}/${node.id}`.replace(/\/+/g, "/");

      // If the current path matches this node, return the node's id
      if (currentPath === nodePath) {
        return node.id;
      }

      // Recursively check children
      if (node.children) {
        const childId = findSelectedItemId(
          currentPath,
          node.children,
          nodePath
        );
        if (childId) return childId;
      }
    }
    return null; // No match found
  };

  // Update selected item based on the current URL
  useEffect(() => {
    const currentPath = location.pathname
      .replace(`/peppl_p1/${topBarSelection}`, "")
      .replace(/^\/+/, ""); // Relative path
    const selectedId = findSelectedItemId(
      `/peppl_p1/${topBarSelection}/${currentPath}`,
      treeArray
    );
    setSelectedItemId(location.pathname.split('/')[location.pathname.split('/').length - 1]);
  }, [location, treeArray, topBarSelection]);

  // Handle item selection change and navigate
  const handleItemSelectionChange = (event, itemId, isSelected) => {
    if (isSelected) {
      setSelectedItemId(itemId);
      handleItemIdChange(itemId);

      // Construct the full path dynamically
      const fullPath = findFullPath(
        itemId,
        treeArray,
        `/peppl_p1/${topBarSelection}`
      );
      if (fullPath) {
        navigate(fullPath);
      }
    }
  };

  // Helper function to find the full path of a node by ID (used for navigation)
  const findFullPath = (nodeId, nodes, parentPath = "") => {
    for (const node of nodes) {
      const currentPath = `${parentPath}/${node.id}`;
      if (node.id === nodeId) return currentPath;
      if (node.children) {
        const childPath = findFullPath(nodeId, node.children, currentPath);
        if (childPath) return childPath;
      }
    }
    return null; // Node not found
  };

  return (
    <div>
      <RichTreeView
        items={treeArray} // The sidebar tree structure
        selectedItems={selectedItemId} // Highlight the selected item based on the URL
        onItemSelectionToggle={handleItemSelectionChange} // Handle item selection
      />
    </div>
  );
};

SidebarTree.propTypes = {
  treeArray: PropTypes.array.isRequired,
  handleItemIdChange: PropTypes.func.isRequired,
  topBarSelection: PropTypes.string.isRequired,
};

export default SidebarTree;
