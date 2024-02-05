import { useState } from "react";
import { Input } from "rsuite";
export const Search = ({ onSearch }: { onSearch: () => void }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch();
  };

  return (
    <Input onChange={handleSearch} placeholder="Default Input" value={search} />
  );
};
