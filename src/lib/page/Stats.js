import React, { useEffect, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { useRouter } from 'next/router'

import * as GTM from '@lib/stats/gtm'

const gtmContainerId = process.env.GTM_CONTAINER_ID

export default function Meta({ data, metaConfig = {} }) {
  const router = useRouter()

  const { getGTMDimensions = () => {} } = metaConfig
  const dimensions = getGTMDimensions(data) || {}

  const isSSR =
    !process.browser || window.__NEXT_DATA__.props.isSSR === undefined

  useEffect(
    function() {
      if (!isSSR) {
        setTimeout(() => {
          GTM.logPageview(dimensions)
        }, 500)
      }
    },
    [router.asPath],
  )

  return (
    <Fragment>
      <Helmet
        script={[
          {
            type: 'text/javascript',
            innerHTML: `
              dataLayer = [];
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmContainerId}');`,
          },
        ]}>
        <noscript>
          {`<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}" height="0" width="0" style="display: none; visibility: hidden"></iframe>`}
        </noscript>
      </Helmet>
    </Fragment>
  )
}
