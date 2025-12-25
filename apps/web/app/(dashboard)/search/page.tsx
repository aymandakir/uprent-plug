// Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic'

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Properties</h1>
      <p>Property search loading...</p>
    </div>
  )
}
