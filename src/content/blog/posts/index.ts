import { post as postMouldInCar } from "./mould-in-car-brisbane";
import { post as postFixDents } from "./fix-dents-before-selling-car-brisbane";
import { post as postOpenRecall } from "./sell-car-open-recall-qld";
import { post as postServiceHistory } from "./sell-car-without-service-history-brisbane";
import { post as postClassicCar } from "./sell-classic-car-brisbane";
import { post as postTrailer } from "./sell-trailer-brisbane";
import { post as postProjectCar } from "./sell-project-car-brisbane";
import { post as postRideshare } from "./sell-rideshare-car-brisbane";
import { post as postNovatedLease } from "./sell-car-novated-lease-qld";
import { post as postTwoNames } from "./car-registered-two-names-qld";
import { post as postRustyCar } from "./rusty-car-brisbane";
import { post as postCatalyticConverter } from "./stolen-catalytic-converter-brisbane";
import { post as postTestDrive } from "./test-drive-private-car-sale-qld";
import { post as postBuyerNoTransfer } from "./buyer-not-transferred-rego-qld";
import { post as postRepairerLien } from "./mechanic-wont-release-car-qld";
import { post as postTruck } from "./sell-truck-brisbane";
import { post as postImportedCar } from "./sell-imported-car-brisbane";
import { post as postPrivateSaleRefund } from "./private-car-sale-refund-qld";
import { post as postLostRegoPapers } from "./lost-rego-papers-qld";
import { post as postCompanyCar } from "./sell-company-car-qld";
import { post as postFailedRoadworthy } from "./car-failed-roadworthy-qld";
import { post as postCaravan } from "./sell-caravan-brisbane";
import { post as postFireDamaged } from "./sell-fire-damaged-car-brisbane";
import { post as postPowerOfAttorney } from "./sell-car-power-of-attorney-qld";
import { post as postExpiredRego } from "./expired-rego-qld";
import { post as postImpounded } from "./car-impounded-qld";
import { post as postFamilyGift } from "./gifting-car-family-member-qld";
import { post as postLpgCar } from "./sell-lpg-car-brisbane";
import { post as postAbandonedPrivateProperty } from "./abandoned-car-private-property-qld";
import { post as postStolenRecovered } from "./stolen-car-recovered-qld";
import { post as postMovingOverseas } from "./sell-car-moving-overseas-brisbane";
import { post as postTowAccess } from "./tow-truck-access-brisbane";
import { post as postNoKeys } from "./sell-car-without-keys-brisbane";
import { post as post4wd } from "./sell-4wd-brisbane";
import { post as postVan } from "./sell-van-brisbane";
import { post as postHybridElectric } from "./sell-hybrid-electric-car-brisbane";
import { post as postCarParts } from "./sell-car-for-parts-brisbane";
import { post as postMotorbike } from "./sell-motorbike-brisbane";
import { post as postTowCost } from "./tow-truck-cost-brisbane";
import { post as postTipDisposal } from "./take-car-to-tip-brisbane";
import { post as postCarData } from "./delete-personal-data-from-car-before-selling";
import { post as postDefectNotice } from "./car-defect-notice-qld";
import { post as postInsuranceCancel } from "./cancel-car-insurance-after-selling-car-qld";
import { post as postInterstatePlates } from "./sell-interstate-registered-car-brisbane";
import { post as postUnpaidTolls } from "./unpaid-tolls-selling-car-qld";
import { post as postStreetParking } from "./park-unregistered-car-street-qld";
import { post as postBestPrice } from "./how-to-get-the-best-cash-for-cars-price-brisbane";
import { post as postHighKm } from "./sell-high-kilometre-car-brisbane";
import { post as postRepairOrSell } from "./repair-or-sell-your-car-brisbane";
import { post as postCarWorth } from "./how-much-is-my-car-worth-brisbane";
import { post as postDeceasedEstate } from "./sell-deceased-estate-car-qld";
import { post as postNonRunning } from "./sell-non-running-car-brisbane";
import { post as postWreckersVs } from "./cash-for-cars-vs-wreckers-brisbane";
import { post as postUte } from "./sell-my-ute-brisbane";
import { post as postScamsGuide } from "./how-to-avoid-cash-for-cars-scams-brisbane";
import { post as postFinanceOwing } from "./how-to-sell-a-car-with-finance-owing-qld";
import { post as postHailDamaged } from "./sell-hail-damaged-car-brisbane";
import { post as postCarRecycling } from "./how-car-recycling-works-australia";
import { post as postScrapCar } from "./how-to-scrap-a-car-legally-brisbane";
import { post as postRoadworthy } from "./how-to-get-a-roadworthy-certificate-brisbane";
import { post as postHighIntent0 } from "./sell-car-without-roadworthy-qld";
import { post as postHighIntent1 } from "./how-much-is-scrap-car-worth-brisbane";
import { post as postHighIntent2 } from "./cancel-rego-after-selling-car-qld";
import { post as postHighIntent3 } from "./sell-car-not-in-my-name-qld";
import { post as postHighIntent4 } from "./number-plates-when-selling-car-qld";
import { post as postHighIntent5 } from "./cash-for-cars-vs-private-sale";
import { post as post2 } from "./what-paperwork-to-sell-a-car-qld";
import { post as post6 } from "./sell-flood-damaged-car-brisbane";
import { post as post7 } from "./wovr-written-off-vehicle-register-qld-guide";
import { post as post9 } from "./how-to-cancel-car-rego-qld";
import { post as post18 } from "./how-to-transfer-car-ownership-qld";
import { post as post20 } from "./how-to-sell-your-car-for-cash-brisbane";
import { post as post23 } from "./preparing-your-car-for-pickup";

// Retired posts competed with canonical location, service, or cornerstone
// pages, or repeated thin unsupported transaction advice. Their slugs use
// permanent redirects from the shared consolidation contract, and
// check-content-integrity.mjs blocks republishing or linking to them.

export const rawBlogPosts = [
  postMouldInCar,
  postFixDents,
  postOpenRecall,
  postServiceHistory,
  postClassicCar,
  postTrailer,
  postProjectCar,
  postRideshare,
  postNovatedLease,
  postTwoNames,
  postRustyCar,
  postCatalyticConverter,
  postTestDrive,
  postBuyerNoTransfer,
  postRepairerLien,
  postTruck,
  postImportedCar,
  postPrivateSaleRefund,
  postLostRegoPapers,
  postCompanyCar,
  postFailedRoadworthy,
  postCaravan,
  postFireDamaged,
  postPowerOfAttorney,
  postExpiredRego,
  postImpounded,
  postFamilyGift,
  postLpgCar,
  postAbandonedPrivateProperty,
  postStolenRecovered,
  postMovingOverseas,
  postTowAccess,
  postNoKeys,
  post4wd,
  postVan,
  postHybridElectric,
  postCarParts,
  postMotorbike,
  postTowCost,
  postTipDisposal,
  postCarData,
  postDefectNotice,
  postInsuranceCancel,
  postInterstatePlates,
  postUnpaidTolls,
  postStreetParking,
  postBestPrice,
  postHighKm,
  postRepairOrSell,
  postCarWorth,
  postDeceasedEstate,
  postNonRunning,
  postWreckersVs,
  postUte,
  postScamsGuide,
  postFinanceOwing,
  postHailDamaged,
  postCarRecycling,
  postScrapCar,
  postRoadworthy,
  postHighIntent0,
  postHighIntent1,
  postHighIntent2,
  postHighIntent3,
  postHighIntent4,
  postHighIntent5,
  post2,
  post6,
  post7,
  post9,
  post18,
  post20,
  post23,
];
