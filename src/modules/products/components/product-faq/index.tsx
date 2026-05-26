import { getProductSeo } from "@lib/product"
import type { HttpTypes } from "@medusajs/types"

type ProductFaqProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductFaq({ product }: ProductFaqProps) {
  const faqs = getProductSeo(product).faqs?.filter(
    (f) => f.question?.trim() && f.answer?.trim()
  )

  if (!faqs?.length) return null

  return (
    <section
      className="content-container my-12 border-t border-stone-200 pt-10"
      aria-labelledby="product-faq-heading"
    >
      <h2
        id="product-faq-heading"
        className="text-xl font-serif font-bold text-[#5A1216] mb-6"
      >
        常見問題
      </h2>
      <dl className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={`${faq.question}-${index}`}
            className="rounded-lg border border-stone-200 bg-[#FDFBF7] p-5"
          >
            <dt className="font-medium text-stone-900 mb-2">{faq.question}</dt>
            <dd className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
