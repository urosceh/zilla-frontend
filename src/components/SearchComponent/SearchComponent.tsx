import React, {useState} from "react";
import "./SearchComponent.css";

const SearchComponent = ({setData, placeholder}: {setData: React.Dispatch<React.SetStateAction<string>>; placeholder: string}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData(searchTerm);
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <label htmlFor="searchInput">
          <i className="fa fa-search"></i> {/* Assuming you're using font awesome for the magnifying glass icon */}
        </label>
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
