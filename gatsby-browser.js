import React from 'react'
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'

// export const onClientEntry = () => {
//     let script = document.createElement('script')
//     script.src = "https://cdn.jsdelivr.net/npm/@growthbook/growthbook/dist/bundles/auto.min.js"
//     script.async = true

//     script.setAttribute('data-client-key', process.env.GATSBY_GROWTHBOOK_CLIENT_KEY)
//     script.setAttribute('data-api-host', process.env.GATSBY_GROWTHBOOK_API_HOST)
  
//     document.head.appendChild(script)
// }

const create_UUID = () => {
    let dt = new Date().getTime();
  
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
       let r = (dt + Math.random() * 16) % 16 | 0;
       dt = Math.floor(dt / 16);
       return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

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
    const params = new URLSearchParams(window.location.search)
    const version = params.get(`gb-${experiment.key}`)

    if (version) return

    localStorage.setItem(`growthbook_experiment_${experiment.key}`, result.key)

    window.analytics.track('Experiment Viewed', {
      experimentId: experiment.key,
      variationId: result.key
    })
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
