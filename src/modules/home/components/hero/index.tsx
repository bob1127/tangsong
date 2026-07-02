import type { MetalsData } from "@lib/metals/types"
import Carousel from "../../../../components/HeroCarousel"
import DetailedPriceTable from "../../../../components/DetailedPriceTable"
import News from "../../../../components/NewsSection"
import ScientificDetection from "../../../../components/ScientificDetection"
import HistoricalTrendChart from "../../../../components/HistoricalTrendChart"
import FeaturedProducts from "../../../../components/FeaturedProducts"
import GoldFAQ from "../../../../components/GoldFAQ"
import HomeSiteLinks from "../site-links"

type HeroProps = {
  initialMetalsData?: MetalsData | null
  heroSlides?: string[]
}

const Hero = ({ initialMetalsData = null, heroSlides }: HeroProps) => {
  return (
    <div className="w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      {/* <Carousel slides={heroSlides} /> */}

      <DetailedPriceTable initialData={initialMetalsData} />
      <FeaturedProducts />
      <ScientificDetection />
      <News />
      <HistoricalTrendChart />
      <GoldFAQ showViewAllLink />
      <HomeSiteLinks />
    </div>
  )
}

export default Hero
