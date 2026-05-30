import type { TocItem } from "./types"

export function formatArticleDate(dateString: string): string {
  const d = new Date(dateString)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
}

export function parseArticleTags(keywords?: string | null): string[] {
  if (!keywords?.trim()) {
    return ["唐宋珠寶", "專業鑑定"]
  }
  return keywords.split(",").map((t) => t.trim()).filter(Boolean)
}

/** 清洗 HTML 並為 h2/h3 注入錨點 id（供目錄與 SEO 內部連結） */
export function buildArticleContentWithToc(html?: string | null): {
  html: string
  toc: TocItem[]
} {
  const source = html ?? ""
  let cleanContent = source
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
    .replace(/(<br\s*\/?>\s*){2,}/gi, "<br />")

  const toc: TocItem[] = []

  cleanContent = cleanContent.replace(
    /<(h[23])([^>]*)>(.*?)<\/\1>/gi,
    (_match, tag, attrs, text) => {
      const plainText = String(text).replace(/<[^>]+>/g, "").trim()
      const id = `heading-${toc.length}`
      toc.push({ id, text: plainText, level: String(tag).toLowerCase() })
      return `<${tag}${attrs} id="${id}" class="scroll-mt-32">${text}</${tag}>`
    }
  )

  return { html: cleanContent, toc }
}
