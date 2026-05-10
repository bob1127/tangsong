import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import PaginatedProducts from "./paginated-products"

// 💡 抓取分類 API
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
      cache: "no-store", // 保證每次都抓最新資料
    })

    if (!res.ok) {
      console.error("❌ [Store] 分類 API 回應錯誤")
      return []
    }

    const data = await res.json()
    return data.product_categories || []
  } catch (error) {
    console.error("❌ [Store] 無法連線至後端抓取分類:", error)
    return []
  }
}

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const categories = await getCategories()

  return (
    <div
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
            {/* 展開/收起 箭頭動畫 */}
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
            {/* 手機版分類 (採用更適合手指點擊的按鈕設計) */}
            <div>
              <span className="text-sm font-bold text-stone-900 mb-3 block">
                商品分類
              </span>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-[#5A1216] text-white border border-[#5A1216]"
                  >
                    所有商品
                  </LocalizedClientLink>
                </li>
                {categories.map((c: any) => {
                  const cleanHandle = c.handle
                    ? c.handle.replace(/^\/+/, "")
                    : ""
                  if (!cleanHandle) return null

                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/categories/${cleanHandle}`}
                        className="inline-block px-4 py-2 rounded-full text-xs border border-stone-200 bg-white text-stone-600 hover:border-[#5A1216] hover:text-[#5A1216] transition-colors"
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* 手機版排序 */}
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
        {/* 商品分類區塊 */}
        <div className="flex flex-col gap-y-4">
          <span className="text-base-semi">商品分類</span>
          <ul className="text-ui-fg-subtle text-base-regular flex flex-col gap-y-2">
            <li>
              <LocalizedClientLink
                href="/store"
                className="hover:text-ui-fg-interactive transition-colors font-semibold text-ui-fg-base"
              >
                所有商品
              </LocalizedClientLink>
            </li>
            {categories.map((c: any) => {
              const cleanHandle = c.handle ? c.handle.replace(/^\/+/, "") : ""
              if (!cleanHandle) return null

              return (
                <li key={c.id}>
                  <LocalizedClientLink
                    href={`/categories/${cleanHandle}`}
                    className="hover:text-ui-fg-interactive transition-colors"
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 排序方式 */}
        <RefinementList sortBy={sort} />
      </div>

      {/* =========================================
          🌟 右側主內容區 (商品列表)
          ========================================= */}
      <div className="w-full flex-1">
        <div className="mb-6 text-2xl-semi">
          <h1 data-testid="store-page-title">所有商品</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
