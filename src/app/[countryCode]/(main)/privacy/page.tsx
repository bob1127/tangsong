import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "隱私權政策 | 唐宋珠寶",
  description: "唐宋珠寶的隱私權政策與資料保護聲明。",
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "2026年05月04日"

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* 標題區塊 */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-serif text-[#5A1216] tracking-[0.15em] mb-4">
            隱私權政策
          </h1>
          <p className="text-[#D4AF37] tracking-widest text-sm font-medium">
            PRIVACY POLICY
          </p>
          <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto mt-6"></div>
        </div>

        {/* 內容區塊 */}
        <div className="bg-white p-8 md:p-12 border border-[#E8DCC4]/50 shadow-sm text-stone-700 font-sans leading-relaxed text-sm md:text-base">
          <p className="mb-8">
            唐宋珠寶（以下簡稱「本公司」或「我們」）十分重視您的隱私權。為了讓您能夠安心使用本網站的各項服務與資訊，特此向您說明本網站的隱私權保護政策，以保障您的權益，請您詳閱下列內容：
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-serif text-[#5A1216] tracking-wider mb-4 border-l-4 border-[#D4AF37] pl-3">
              一、隱私權保護政策的適用範圍
            </h2>
            <p className="text-stone-600">
              隱私權保護政策內容，包括本網站如何處理在您使用網站服務時收集到的個人識別資料。隱私權保護政策不適用於本網站以外的相關連結網站，也不適用於非本網站所委託或參與管理的人員。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-serif text-[#5A1216] tracking-wider mb-4 border-l-4 border-[#D4AF37] pl-3">
              二、個人資料的蒐集、處理及利用方式
            </h2>
            <ul className="list-disc pl-5 space-y-3 text-stone-600">
              <li>
                <strong className="text-stone-800 font-medium">
                  會員註冊與登入：
                </strong>
                當您註冊本網站會員或使用第三方帳號（如：LINE、Google、Facebook）進行快捷登入時，我們將會擷取您授權的必要資訊（如：姓名、電子郵件、大頭貼等），僅用於建立會員檔案與提供專屬服務。
              </li>
              <li>
                <strong className="text-stone-800 font-medium">
                  購物與結帳：
                </strong>
                當您進行商品購買、預約鑑賞時，我們將蒐集您的姓名、聯絡電話、收件地址及付款相關資訊，以利完成物流配送、發票開立與客戶服務。
              </li>
              <li>
                <strong className="text-stone-800 font-medium">
                  網站瀏覽：
                </strong>
                於一般瀏覽時，伺服器會自行記錄相關行徑，包括您使用連線設備的 IP
                位址、使用時間、使用的瀏覽器、瀏覽及點選資料記錄等，做為我們增進網站服務的參考依據，此記錄為內部應用，決不對外公佈。
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-serif text-[#5A1216] tracking-wider mb-4 border-l-4 border-[#D4AF37] pl-3">
              三、資料之保護
            </h2>
            <p className="text-stone-600 mb-3">
              本網站主機均設有防火牆、防毒系統等相關的各項資訊安全設備及必要的安全防護措施，保護您的個人資料採用嚴格的保護措施。只由經過授權的人員才能接觸您的個人資料，相關處理人員皆簽有保密合約，如有違反保密義務者，將受相關法律處分。
            </p>
            <p className="text-stone-600">
              如因業務需要有必要委託其他單位提供服務時（例如：物流配送、第三方支付金流），本網站亦會嚴格要求其遵守保密義務，並且採取必要檢查程序以確定其將確實遵守。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-serif text-[#5A1216] tracking-wider mb-4 border-l-4 border-[#D4AF37] pl-3">
              四、網站對外的相關連結
            </h2>
            <p className="text-stone-600">
              本網站的網頁提供其他網站的網路連結，您也可經由本網站所提供的連結，點選進入其他網站。但該連結網站不適用本網站的隱私權保護政策，您必須參考該連結網站中的隱私權保護政策。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-serif text-[#5A1216] tracking-wider mb-4 border-l-4 border-[#D4AF37] pl-3">
              五、Cookie 之使用
            </h2>
            <p className="text-stone-600">
              為了提供您最佳的服務，本網站會在您的電腦中放置並取用我們的
              Cookie。若您不願接受 Cookie
              的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，即可拒絕
              Cookie
              的寫入，但可能會導致網站某些功能（如：會員登入狀態維持、購物車內容）無法正常執行。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-serif text-[#5A1216] tracking-wider mb-4 border-l-4 border-[#D4AF37] pl-3">
              六、隱私權保護政策之修正
            </h2>
            <p className="text-stone-600">
              本網站隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上。當您繼續使用本網站服務時，即視為您已閱讀、瞭解並同意接受修改後之隱私權政策。
            </p>
          </section>

          {/* 聯絡我們 & 更新日期 */}
          <div className="mt-16 pt-8 border-t border-[#E8DCC4] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
            <p>
              若您對隱私權政策有任何疑問，請聯繫客服：
              <a
                href="mailto:service@tangsong.com.tw"
                className="text-[#D4AF37] hover:text-[#5A1216] transition-colors"
              >
                service@tangsong.com.tw
              </a>
            </p>
            <p>最後更新日期：{lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
