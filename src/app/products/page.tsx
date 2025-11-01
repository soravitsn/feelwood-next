import { client } from '@/lib/sanity.client'

type Product = {
  _id: string
  title: string
}

export default async function ProductsPage() {
  const products = await client.fetch<Product[]>(`
    *[_type == "product"]{ _id, title } | order(_createdAt desc)
  `)

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">สินค้า Feel Wood</h1>
      {products.length === 0 ? (
        <p>ยังไม่มีสินค้า</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {products.map((p) => (
            <li key={p._id}>{p.title}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
