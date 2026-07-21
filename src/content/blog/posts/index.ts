import { post as postAuctionVs } from "./cash-for-cars-vs-car-auction-brisbane";
import { post as postSandgate } from "./cash-for-cars-sandgate";
import { post as postStrathpine } from "./cash-for-cars-strathpine";
import { post as postSellFast } from "./how-to-sell-a-car-fast-brisbane";
import { post as postHighKm } from "./sell-high-kilometre-car-brisbane";
import { post as postRepairOrSell } from "./repair-or-sell-your-car-brisbane";
import { post as postSuv } from "./sell-my-suv-brisbane";
import { post as postCarWorth } from "./how-much-is-my-car-worth-brisbane";
import { post as postHybridEv } from "./sell-hybrid-or-electric-car-brisbane";
import { post as postDeceasedEstate } from "./sell-deceased-estate-car-qld";
import { post as postNonRunning } from "./sell-non-running-car-brisbane";
import { post as postFreeCarRemoval } from "./free-car-removal-brisbane";
import { post as postWreckersVs } from "./cash-for-cars-vs-wreckers-brisbane";
import { post as postUte } from "./sell-my-ute-brisbane";
import { post as postScamsGuide } from "./how-to-avoid-cash-for-cars-scams-brisbane";
import { post as postFinanceOwing } from "./how-to-sell-a-car-with-finance-owing-qld";
import { post as postVan } from "./sell-my-van-brisbane";
import { post as postWrittenOff } from "./sell-written-off-car-brisbane";
import { post as postBlownEngine } from "./sell-car-with-blown-engine-brisbane";
import { post as postNewYear } from "./new-year-car-cleanout-brisbane";
import { post as postChristmas } from "./sell-your-car-before-christmas-brisbane";
import { post as postHailDamaged } from "./sell-hail-damaged-car-brisbane";
import { post as postDamagedCar } from "./sell-damaged-car-brisbane";
import { post as postCarRecycling } from "./how-car-recycling-works-australia";
import { post as postBestTime } from "./best-time-to-sell-your-car-brisbane";
import { post as postScrapCar } from "./how-to-scrap-a-car-legally-brisbane";
import { post as postRoadworthy } from "./how-to-get-a-roadworthy-certificate-brisbane";
import { post as postFirst } from "./sell-old-truck-brisbane";
import { post as postHighIntent0 } from "./sell-car-without-roadworthy-qld";
import { post as postHighIntent1 } from "./how-much-is-scrap-car-worth-brisbane";
import { post as postHighIntent2 } from "./cancel-rego-after-selling-car-qld";
import { post as postHighIntent3 } from "./sell-car-not-in-my-name-qld";
import { post as postHighIntent4 } from "./number-plates-when-selling-car-qld";
import { post as postHighIntent5 } from "./cash-for-cars-vs-private-sale";
import { post as postNew } from "./sell-junk-car-brisbane";
import { post as post0 } from "./cash-for-cars-moreton-bay";
import { post as post1 } from "./end-of-financial-year-car-sale-brisbane";
import { post as post2 } from "./what-paperwork-to-sell-a-car-qld";
import { post as post3 } from "./sell-accident-car-brisbane";
import { post as post4 } from "./sell-used-4wd-brisbane";
import { post as post5 } from "./trade-in-vs-cash-for-cars-brisbane";
import { post as post6 } from "./sell-flood-damaged-car-brisbane";
import { post as post7 } from "./wovr-written-off-vehicle-register-qld-guide";
import { post as post8 } from "./scrap-metal-prices-brisbane-2026";
import { post as post9 } from "./how-to-cancel-car-rego-qld";
import { post as post10 } from "./how-to-sell-a-car-without-rego-brisbane";
import { post as postRedlands } from "./cash-for-cars-redlands";
import { post as post18 } from "./how-to-transfer-car-ownership-qld";
import { post as post20 } from "./how-to-sell-your-car-for-cash-brisbane";
import { post as post21 } from "./what-happens-to-your-car-after-selling";
import { post as post22 } from "./signs-your-car-is-worth-more-as-scrap";
import { post as post23 } from "./preparing-your-car-for-pickup";

// NOTE: suburb-level "cash for cars {suburb}" posts were retired in July 2026 —
// they competed with the /locations/{suburb} landing pages for the same
// queries. Each retired slug 301s to its location page (see
// legacyIndexingRedirects in next.config.ts), and check-content-integrity.mjs
// blocks new posts whose slug collides with a location page.

export const rawBlogPosts = [
  postAuctionVs,
  postSandgate,
  postStrathpine,
  postSellFast,
  postHighKm,
  postRepairOrSell,
  postSuv,
  postCarWorth,
  postHybridEv,
  postDeceasedEstate,
  postNonRunning,
  postFreeCarRemoval,
  postWreckersVs,
  postUte,
  postScamsGuide,
  postFinanceOwing,
  postVan,
  postWrittenOff,
  postBlownEngine,
  postNewYear,
  postChristmas,
  postHailDamaged,
  postDamagedCar,
  postCarRecycling,
  postBestTime,
  postScrapCar,
  postRoadworthy,
  postFirst,
  postHighIntent0,
  postHighIntent1,
  postHighIntent2,
  postHighIntent3,
  postHighIntent4,
  postHighIntent5,
  postRedlands,
  postNew,
  post0,
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
  post7,
  post8,
  post9,
  post10,
  post18,
  post20,
  post21,
  post22,
  post23,
];
