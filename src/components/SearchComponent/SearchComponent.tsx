import React, {Dispatch, SetStateAction, useState} from "react";
import "./SearchComponent.css";

interface Props {
  searchData: string;
  setSearchData: Dispatch<SetStateAction<string>>;
}

const SearchComponent: React.FC<Props> = ({searchData, setSearchData}) => {
  const [searchTerm, setSearchTerm] = useState<string>(searchData);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchData(searchTerm);
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <input id="searchInput" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
        <button type="submit">
          <span role="img" aria-label="search">
            🔍
          </span>
        </button>
      </div>
    </form>
  );
};

export default SearchComponent;
