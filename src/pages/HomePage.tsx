import FilterToolbar from "../components/FilterToolbar";

const HomePage = () => {
  const filters = [
    {
      name: "Status",
      options: ["Open", "In Progress", "Done"],
      onChange: () => {},
    },
    { name: "Assignee", options: ["Me", "Unassigned"] },
  ];

  return (
    <div>
      <FilterToolbar filters={filters} />
      <div>Tabela</div>
    </div>
  );
};

export default HomePage;
