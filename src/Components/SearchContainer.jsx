import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Search } from "@mui/icons-material";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 300px;
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: #6b3ceb;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearchClick = () => {
    if (query.trim()) {
      navigate(`/ai?question=${encodeURIComponent(query)}`);
    }
  };

  return (
    <InputContainer>
      <SearchInput
        type="text"
        placeholder="Chat with our AI"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton onClick={handleSearchClick}>
        <Search />
      </IconButton>
    </InputContainer>
  );
};

export default SearchBox;
