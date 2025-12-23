export function DashboardSidebar() {
  const items = ["Dashboard", "Search", "Matches", "Applications", "Settings"];
  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4">
      <nav className="space-y-2 text-sm font-medium text-gray-700">
        {items.map((item) => (
          <div key={item} className="rounded-lg px-3 py-2 hover:bg-gray-100">
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}

