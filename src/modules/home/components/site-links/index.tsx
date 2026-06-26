import Link from "next/link"
import { PRIMARY_SITE_LINKS } from "@lib/seo/site-navigation"

/**
 * 首頁可見導覽區：強化站內連結結構，協助搜尋引擎產生 Sitelinks（子連結）。
 */
export default function HomeSiteLinks() {
  return (
    <section
      className="w-full border-t border-stone-200 bg-[#FDFBF7] py-12"
      aria-labelledby="home-site-links-heading"
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <h2
          id="home-site-links-heading"
          className="text-lg font-serif font-bold text-[#5A1216] tracking-wide mb-2"
        >
          網站導覽
        </h2>
        <p className="text-sm text-stone-500 mb-8">前往唐宋珠寶主要服務頁面</p>
        <nav aria-label="網站主要頁面">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRIMARY_SITE_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="group block rounded-lg border border-stone-200 bg-white p-5 hover:border-[#D4AF37]/60 hover:shadow-sm transition-all"
                >
                  <span className="text-base font-medium text-[#5A1216] group-hover:text-[#82111F] transition-colors">
                    {link.name}
                  </span>
                  <p className="mt-2 text-sm text-stone-500 leading-relaxed line-clamp-2">
                    {link.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
