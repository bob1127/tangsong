"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

// 🇹🇼 這裡將排序選項的標籤改為繁體中文
const sortOptions = [
  {
    value: "created_at",
    label: "最新上架",
  },
  {
    value: "price_asc",
    label: "價格：由低至高",
  },
  {
    value: "price_desc",
    label: "價格：由高至低",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title="排序方式" // 🇹🇼 將 "Sort by" 改為 "排序方式"
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
