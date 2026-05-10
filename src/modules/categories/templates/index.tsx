import { Suspense } from "react"
import { notFound } from "next/navigation"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
// 💡 載入商品列表元件
import PaginatedProducts from "@modules/store/templates/paginated-products"

// 💡 抓取所有分類 API (無快取、無錯誤過濾器版本)
async function getCategories() {
  const baseUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  try {
    const headers: Record<string, string> = {}
    if (publishableKey) {
      headers["x-publishable-api-key"] = publishableKey
    }

    const res = await fetch(`${baseUrl}/store/product-categories`, {
      headers,
      cache: "no-store",
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.product_categories || []
  } catch (error) {
    return []
  }
}

const CategoryTemplate = async ({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: any // 當前點擊的分類資料
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // 如果網址錯誤找不到分類，回傳 404
  if (!category || !category.id) notFound()

  // 取得所有商品分類 (給側邊欄與手機選單使用)
  const allCategories = await getCategories()

  return (
    <div
      // 🌟 加入 min-h-screen 確保內容夠高，把 Footer 推到底部
      className="flex flex-col small:flex-row small:items-start py-6 content-container min-h-screen"
      data-testid="category-container"
    >
      {/* =========================================
          📱 手機版專屬：下拉篩選與分類面板 (Accordion) 
          ========================================= */}
      <div className="w-full small:hidden mb-6">
        <details className="group border border-stone-200 rounded-lg bg-white overflow-hidden shadow-sm">
          <summary className="flex justify-between items-center p-4 font-bold text-stone-900 cursor-pointer list-none select-none bg-stone-50 [&::-webkit-details-marker]:hidden">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-stone-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>商品篩選與分類</span>
            </div>
            <svg
              className="w-5 h-5 text-stone-400 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div className="p-4 border-t border-stone-200 flex flex-col gap-y-6">
            <div>
              <span className="text-sm font-bold text-stone-900 mb-3 block">
                商品分類
              </span>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="inline-block px-4 py-2 rounded-full text-xs border border-stone-200 bg-white text-stone-600 hover:border-[#5A1216] hover:text-[#5A1216] transition-colors"
                  >
                    所有商品
                  </LocalizedClientLink>
                </li>
                {allCategories.map((c: any) => {
                  const cleanHandle = c.handle
                    ? c.handle.replace(/^\/+/, "")
                    : ""
                  if (!cleanHandle) return null

                  // 💡 判斷是否為「目前所在分類」
                  const isActive = category.id === c.id

                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/categories/${cleanHandle}`}
                        className={`inline-block px-4 py-2 rounded-full text-xs transition-colors ${
                          isActive
                            ? "font-bold bg-[#5A1216] text-white border border-[#5A1216]"
                            : "border border-stone-200 bg-white text-stone-600 hover:border-[#5A1216] hover:text-[#5A1216]"
                        }`}
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <RefinementList sortBy={sort} />
            </div>
          </div>
        </details>
      </div>

      {/* =========================================
          💻 電腦版專屬：左側側邊欄 (Sidebar) 
          ========================================= */}
      <div className="hidden small:flex flex-col gap-y-8 w-[250px] pr-8 shrink-0">
        <div className="flex flex-col gap-y-4">
          <span className="text-base-semi text-ui-fg-base">商品分類</span>
          <ul className="text-ui-fg-subtle text-base-regular flex flex-col gap-y-2">
            <li>
              <LocalizedClientLink
                href="/store"
                className="hover:text-ui-fg-interactive transition-colors"
              >
                所有商品
              </LocalizedClientLink>
            </li>
            {allCategories.map((c: any) => {
              const cleanHandle = c.handle ? c.handle.replace(/^\/+/, "") : ""
              if (!cleanHandle) return null

              // 💡 判斷是否為「目前所在分類」
              const isActive = category.id === c.id

              return (
                <li key={c.id}>
                  <LocalizedClientLink
                    href={`/categories/${cleanHandle}`}
                    className={`hover:text-ui-fg-interactive transition-colors ${
                      isActive ? "font-semibold text-ui-fg-base" : ""
                    }`}
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              )
            })}
          </ul>
        </div>

        <RefinementList sortBy={sort} />
      </div>

      {/* =========================================
          🌟 右側主內容區 (商品列表)
          ========================================= */}
      <div className="w-full flex-1">
        <div className="mb-6 text-2xl-semi">
          <h1 data-testid="category-page-title">{category.name}</h1>
          {/* 如果分類有設定描述，會顯示在這裡 */}
          {category.description && (
            <p className="text-base-regular text-ui-fg-subtle mt-2">
              {category.description}
            </p>
          )}
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id} // 💡 確保只抓取這個分類下的商品
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default CategoryTemplate
