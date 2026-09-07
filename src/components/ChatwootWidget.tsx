'use client';

import Script from 'next/script';

export default function ChatwootWidget() {
  return (
    <Script
      id="chatwoot-widget"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.chatwootSettings = {"position":"right","type":"standard","launcherTitle":""};
          (function(d,t) {
            var BASE_URL="https://app.chatwoot.com";
            var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=BASE_URL+"/packs/js/sdk.js";
            g.async = true;
            s.parentNode.insertBefore(g,s);
            g.onload=function(){
              if (window.chatwootSDK) {
                window.chatwootSDK.run({
                  websiteToken: 'rvyUBQzsRq92oGuTfJFALwYz',
                  baseUrl: BASE_URL
                });
              }
            };
          })(document,"script");
        `,
      }}
    />
  );
}
