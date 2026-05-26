import Link from "next/link"
import type { HttpTypes } from "@medusajs/types"

type ProductBreadcrumbProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav
      className="content-container py-4 text-xs tracking-widest text-stone-400"
      aria-label="麵包屑導覽"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-[#5A1216] transition-colors">
            首頁
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/store" className="hover:text-[#5A1216] transition-colors">
            線上商城
          </Link>
        </li>
        {product.collection?.handle && product.collection.title && (
          <>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/collections/${product.collection.handle}`}
                className="hover:text-[#5A1216] transition-colors"
              >
                {product.collection.title}
              </Link>
            </li>
          </>
        )}
        <li aria-hidden="true">/</li>
        <li className="text-[#5A1216] line-clamp-1">{product.title}</li>
      </ol>
    </nav>
  )
}
