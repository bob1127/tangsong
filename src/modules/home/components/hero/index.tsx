import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import Carousel from "../../../../components/HeroCarousel"
import MarketTicker from "../../../../components/MarketTicker"
import TradingViewChart from "../../../../components/TradingViewChart"
import DetailedPriceTable from "../../../../components/DetailedPriceTable"
import News from "../../../../components/NewsSection"
import HistoricalTrendChart from "../../../../components/HistoricalTrendChart" // 你的路徑
const Hero = () => {
  return (
    <div className="w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <Carousel />
      {/* 拔掉原本的 fixed wrapper，直接呼叫元件 */}
      <MarketTicker />
      <TradingViewChart />
      <DetailedPriceTable />
      <HistoricalTrendChart />
      <News />
    </div>
  )
}

export default Hero
