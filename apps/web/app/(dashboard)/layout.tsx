import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold">
            🏠 Uprent Plus
          </Link>
          <div className="flex gap-6">
            <Link href="/dashboard/matches" className="hover:text-blue-600">
              Matches
            </Link>
            <Link href="/dashboard/search" className="hover:text-blue-600">
              Search Criteria
            </Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-red-600 hover:underline cursor-pointer">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}