import { getHomeSeo } from "../../libs/seo/seo";
import { DEFAULT_OG_IMAGE, getSiteUrl, localeUrl } from "../../libs/seo/site";
import { getPublicUserInfo } from "../../libs/seo/user-info";
import { localize } from "../../utils/localize";

/**
 * schema.org structured data for the homepage: the WebSite and the Person it
 * belongs to (name, job title from the SEO row, photo, profile links), so
 * search engines can show a richer result. Renders nothing without data.
 */
export async function HomeJsonLd({ locale }: { locale: string }) {
  const [seo, info] = await Promise.all([
    getHomeSeo(locale),
    getPublicUserInfo().catch(() => undefined),
  ]);
  if (!seo && !info) return null;

  const site = getSiteUrl();
  const url = localeUrl(locale);
  const image = new URL(seo?.ogImage || DEFAULT_OG_IMAGE, site).toString();
  const person = info && {
    "@type": "Person",
    "@id": `${site}/#person`,
    name: info.user.username,
    url,
    image: info.user.avatarUrl ?? image,
    jobTitle: seo ? localize(locale, seo.jobTitle_en, seo.jobTitle_ar) || undefined : undefined,
    email: info.gmail ? `mailto:${info.gmail}` : undefined,
    sameAs: [info.github, info.linkedin].filter(Boolean),
  };
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url,
        name: seo ? localize(locale, seo.metaTitle_en, seo.metaTitle_ar) : info?.user.username,
        description: seo
          ? localize(locale, seo.metaDescription_en, seo.metaDescription_ar)
          : undefined,
        inLanguage: locale,
        image,
        ...(person && { author: { "@id": person["@id"] } }),
      },
      ...(person ? [person] : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON in a script tag: escape "<" so text can't close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
