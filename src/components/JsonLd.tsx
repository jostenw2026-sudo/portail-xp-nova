import { site } from "@/content/site";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: `${site.name} — ${site.baseline}`,
  legalName: site.legalName,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "134, Rue 1813, Vallée Bastos",
    addressLocality: site.city,
    addressCountry: "CM",
  },
  areaServed: ["Cameroun", "Afrique centrale"],
  slogan: site.devise,
};

export function breadcrumbLd(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: `${site.url}${it.href}`,
    })),
  };
}

export function serviceLd(name: string, description: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: `${site.name} — ${site.baseline}` },
    areaServed: ["Cameroun", "Afrique centrale"],
    url: `${site.url}/metiers/${slug}`,
  };
}

export function personLd(name: string, role: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    worksFor: { "@type": "Organization", name: site.legalName },
    url: `${site.url}/equipe/${slug}`,
  };
}
