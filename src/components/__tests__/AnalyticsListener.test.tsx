// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const trackEventMock = vi.fn();

vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
}));

import { AnalyticsListener } from "@/components/AnalyticsListener";
import { BUSINESS } from "@/lib/site";

beforeEach(() => {
  trackEventMock.mockReset();
});

afterEach(() => {
  cleanup();
});

describe("AnalyticsListener", () => {
  it("tracks contact and verified outbound links without emitting their URLs", () => {
    render(
      <>
        <AnalyticsListener />
        <a
          href="tel:0481438444"
          data-track-location="header"
          onClick={(event) => event.preventDefault()}
        >
          <span>Call</span>
        </a>
        <a
          href="mailto:info@caraway.au"
          onClick={(event) => event.preventDefault()}
        >
          Email
        </a>
        <a
          href={BUSINESS.googleBusinessUrl}
          data-track-label="Google reviews"
          data-track-location="trust"
          onClick={(event) => event.preventDefault()}
        >
          Google
        </a>
        <a
          href={BUSINESS.abrUrl}
          data-track-label="ABR record"
          data-track-location="footer"
          onClick={(event) => event.preventDefault()}
        >
          ABR
        </a>
      </>,
    );

    fireEvent.click(screen.getByText("Call"));
    fireEvent.click(screen.getByText("Email"));
    fireEvent.click(screen.getByText("Google"));
    fireEvent.click(screen.getByText("ABR"));

    expect(trackEventMock.mock.calls).toEqual([
      ["phone_click", { location: "header" }],
      ["email_click", { location: "page" }],
      ["google_business_click", { location: "trust" }],
      [
        "authority_link_click",
        { label: "ABR record", location: "footer" },
      ],
    ]);
    expect(JSON.stringify(trackEventMock.mock.calls)).not.toMatch(
      /tel:|mailto:|https?:\/\//,
    );
  });

  it("does not turn ordinary internal links into analytics events", () => {
    render(
      <>
        <AnalyticsListener />
        <a href="#quote" onClick={(event) => event.preventDefault()}>
          Cash for cars
        </a>
      </>,
    );

    fireEvent.click(screen.getByText("Cash for cars"));

    expect(trackEventMock).not.toHaveBeenCalled();
  });

  it("tracks the review handoff without sending a URL or customer data", () => {
    render(
      <>
        <AnalyticsListener />
        <a
          href={BUSINESS.googleBusinessUrl}
          data-track-label="Caraway on Google"
          data-track-location="review_handoff"
          onClick={(event) => event.preventDefault()}
        >
          Open Caraway on Google
        </a>
      </>,
    );

    fireEvent.click(screen.getByText("Open Caraway on Google"));

    expect(trackEventMock).toHaveBeenCalledOnce();
    expect(trackEventMock).toHaveBeenCalledWith("google_business_click", {
      location: "review_handoff",
    });
    expect(JSON.stringify(trackEventMock.mock.calls)).not.toMatch(
      /cid=|https?:\/\/|phone|email|registration|vin/i,
    );
  });
});
