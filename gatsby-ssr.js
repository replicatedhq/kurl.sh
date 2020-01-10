import React from "react";
export function onRenderBody(
  { setHeadComponents }
) {
  setHeadComponents([
    <script type="text/javascript"
      dangerouslySetInnerHTML={{
        __html:`
        console.log("111");
        var _paq = _paq || [];
      _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
    (function() {
    var u="//${process.env.MATOMO_URL}/";
        _paq.push(['setTrackerUrl', u+'data/']);
        _paq.push(['setSiteId', ${process.env.MATOMO_SITE_ID}]);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'js/'; s.parentNode.insertBefore(g,s);
        })();`
      }}
    />
  ]);
}