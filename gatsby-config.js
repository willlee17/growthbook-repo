require("dotenv").config({
  path: `.env`,
})

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `visual-editor`,
    siteUrl: `https://www.yourdomain.tld`
  },
  headers: [
    {
      source: '*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value:
            'script-src "self" "unsafe-inline" "unsafe-eval"'
        }
      ]
    }
  ],
  plugins: ["gatsby-plugin-emotion"]
};