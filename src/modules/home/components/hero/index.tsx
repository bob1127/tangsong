import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import Carousel from "../../../../components/HeroCarousel"
import MarketTicker from "../../../../components/MarketTicker"
import TradingViewChart from "../../../../components/TradingViewChart"
import DetailedPriceTable from "../../../../components/DetailedPriceTable"
import News from "../../../../components/NewsSection"
import ScientificDetection from "../../../../components/ScientificDetection"
import HistoricalTrendChart from "../../../../components/HistoricalTrendChart" // 你的路徑
import FeaturedProducts from "../../../../components/FeaturedProducts"
import GoldFAQ from "../../../../components/GoldFAQ"
const Hero = () => {
  return (
    <div className="w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <Carousel />
      {/* <MarketTicker /> */}

      <DetailedPriceTable />
      <FeaturedProducts />
      <ScientificDetection />
      <News />
      <HistoricalTrendChart />
      <GoldFAQ />
    </div>
  )
}

export default Hero
