# Measurement implementation and account handover

Status: integration implemented and tested with an intercepted synthetic GTM ID; all real tracking disabled. The old site publishes Google tag GT-5DCV555P. This is not a GTM container ID or proof of access to its GA4 property. Find existing Site Kit, GA4, GTM, Ads and Search Console properties through owner invitations before creating anything.

The optional module defaults analytics_storage, ad_storage, ad_user_data and ad_personalization to denied. GTM loads only after analytics consent. Reject, allow, withdrawal and reload are implemented. Advertising consent remains denied. Configure approved production mode and the verified GTM ID in src/data/tracking.json only after legal review and container audit. Production CSP permits measurement hosts only when that approved configuration is present. Revalidate the actual container, regional endpoints and Consent Mode behaviour before launch; local interception does not verify live Google tags. Withdrawal stops custom events and updates consent; tag behaviour and cookie cleanup require inspection of the actual container.

| Event          | Trigger                                                            | Classification                       |
| -------------- | ------------------------------------------------------------------ | ------------------------------------ |
| generate_lead  | New durable API receipt; never duplicate or direct thank-you visit | Accepted enquiry, not qualified lead |
| file_upload    | Complete stored upload after receipt                               | Supporting engagement                |
| click_call     | Telephone link click                                               | Engagement, not answered call        |
| click_email    | Email link click                                                   | Engagement, not delivered email      |
| view_project   | Approved project detail, excluding layout preview                  | Engagement                           |
| click_whatsapp | Reserved; no WhatsApp link until number/channel approved           | Engagement                           |

Custom events accept only whitelisted service slugs and attachment counts. Names, email addresses, phone numbers, free text, filenames, files and receipt IDs are excluded. Disable automatic form capture and user-provided data features in the real container. Audit URLs, query strings and referrers for customer information before enabling measurement.

Google Ads: choose one primary enquiry conversion source, either GA4 import or a native Ads conversion, never both as primary. Keep click events secondary. Define the operational funnel: enquiry → qualified → site visit → quote → accepted → completed. Offline qualified-lead imports and enhanced conversions remain blocked pending lawful processing, owner approval and official implementation verification.

Search Console: request access to the existing domain property; DNS holder adds TXT only if verification is absent. Submit the indexable production sitemap after cutover, inspect home/service/contact URLs, and monitor redirect/410 outcomes. Same-domain rebuild does not require Change of Address. No DNS or Google account changes have been made.
