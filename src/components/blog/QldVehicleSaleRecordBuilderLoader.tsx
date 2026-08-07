"use client";

import dynamic from "next/dynamic";

const QldVehicleSaleRecordBuilder = dynamic(() =>
  import("@/components/blog/QldVehicleSaleRecordBuilder").then(
    (module) => module.QldVehicleSaleRecordBuilder,
  ),
);

/**
 * Keep the dynamic import inside a Client Component so unrelated articles do
 * not receive the builder implementation chunk. SSR stays enabled so the
 * builder heading, privacy notice and initial checklist exist in page HTML.
 */
export function QldVehicleSaleRecordBuilderLoader() {
  return <QldVehicleSaleRecordBuilder />;
}
