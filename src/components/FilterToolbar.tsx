import { Search } from "./Search";

const FilterToolbar = ({
  filters,
}: {
  filters: { name: string; options: string[] }[];
}) => {
  return (
    <>
      <Search onSearch={() => console.log("test")} />
      <div className="flex flex-row items-center justify-center gap-2">
        {filters.map((filter) => (
          <div>{filter.name}</div>
        ))}
      </div>
    </>
  );
};

export default FilterToolbar;
