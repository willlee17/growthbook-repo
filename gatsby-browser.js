import React from 'react'
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'

let visitor_id = localStorage.getItem("growthbook_visitor_id");

if (!visitor_id) {
  visitor_id = create_UUID();
  localStorage.setItem('growthbook_visitor_id', visitor_id)
}

const growthbook = new GrowthBook({
  apiHost: process.env.GATSBY_GROWTHBOOK_API_HOST,
  clientKey: process.env.GATSBY_GROWTHBOOK_CLIENT_KEY,
  enableDevMode: true,
  attributes: {
    id: visitor_id,
    url: window.location.href,
  },
  trackingCallback: (experiment, result) => {
    console.log("testing testing");
  },
});

/**
 * Wraps the apps page element with Segment's Consent Manager.
 *
 * See:
 * https://github.com/segmentio/consent-manager
 * https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#wrapPageElement
 * https://github.com/segmentio/consent-manager/issues/10#issuecomment-679896358
 */
export const wrapPageElement = ({ element }) => {
  return (
      <GrowthBookProvider growthbook={growthbook}>{element}</GrowthBookProvider>
  );
};
