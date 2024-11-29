import React, { useEffect, useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarTree = ({ treeArray, handleItemIdChange, topBarSelection }) => {
  const [selectedItemId, setSelectedItemId] = useState(
    `overview_${topBarSelection}`
  );
  const navigate = useNavigate();
  const location = useLocation();

  // Trigger the parent handler when the selected item changes
  useEffect(() => {
    handleItemIdChange(selectedItemId);
  }, [selectedItemId, handleItemIdChange]);

  // Update selected item when the top bar selection changes
  useEffect(() => {
    setSelectedItemId(`overview_${topBarSelection}`);
  }, [topBarSelection]);

  // Handle item selection change and navigate
  const handleItemSelectionChange = (event, itemId, isSelected) => {
    if (isSelected) {
      setSelectedItemId(itemId);
      navigate(`/peppl_p1/${topBarSelection}/${itemId}`); // Construct the URL dynamically
    }
  };

  return (
    <div>
      <RichTreeView
        items={treeArray}
        selectedItems={selectedItemId}
        onItemSelectionToggle={handleItemSelectionChange}
      />
    </div>
  );
};

export default SidebarTree;
