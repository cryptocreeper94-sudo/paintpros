import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTenant } from "@/context/TenantContext";
import type { SeoPage } from "@shared/schema";

interface SeoManagerProps {
  pagePath?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function SeoManager({ pagePath, fallbackTitle, fallbackDescription }: SeoManagerProps) {
  const [location] = useLocation();
  const tenant = useTenant();
  const currentPath = pagePath || location;
  
  const { data: seoData } = useQuery<SeoPage>({
    queryKey: ["/api/seo/pages/path", currentPath],
    enabled: !!currentPath,
  });
  
  useEffect(() => {
    const updateMetaTags = () => {
      const title = seoData?.metaTitle || fallbackTitle || `${tenant.name} - ${tenant.tagline}`;
      const description = seoData?.metaDescription || fallbackDescription || tenant.seo?.description || tenant.description;
      const keywords = seoData?.metaKeywords || tenant.seo?.keywords?.join(", ") || "";
      const canonicalUrl = seoData?.canonicalUrl || window.location.href;
      const ogImage = seoData?.ogImage || "/og-image.png";
      
      document.title = title;
      
      const setMeta = (name: string, content: string, isProperty = false) => {
        const attr = isProperty ? "property" : "name";
        let meta = document.querySelector(`meta[${attr}="${name}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute(attr, name);
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content);
      };
      
      setMeta("description", description);
      setMeta("keywords", keywords);
      setMeta("robots", seoData?.metaRobots || "index, follow");
      setMeta("author", tenant.name);
      
      setMeta("og:title", seoData?.ogTitle || title, true);
      setMeta("og:description", seoData?.ogDescription || description, true);
      setMeta("og:image", ogImage, true);
      setMeta("og:url", canonicalUrl, true);
      setMeta("og:type", seoData?.ogType || "website", true);
      setMeta("og:site_name", seoData?.ogSiteName || tenant.name, true);
      setMeta("og:locale", seoData?.ogLocale || "en_US", true);
      
      setMeta("twitter:card", seoData?.twitterCard || "summary_large_image");
      setMeta("twitter:title", seoData?.twitterTitle || title);
      setMeta("twitter:description", seoData?.twitterDescription || description);
      setMeta("twitter:image", seoData?.twitterImage || ogImage);
      if (seoData?.twitterSite) {
        setMeta("twitter:site", seoData.twitterSite);
      }
      
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrl);
      
      const existingScript = document.querySelector('script[type="application/ld+json"]#seo-structured-data');
      if (seoData?.structuredData && seoData?.structuredDataType) {
        let script = existingScript;
        if (!script) {
          script = document.createElement("script");
          script.setAttribute("type", "application/ld+json");
          script.setAttribute("id", "seo-structured-data");
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(seoData.structuredData);
      } else if (existingScript) {
        existingScript.remove();
      }
    };
    
    updateMetaTags();
  }, [seoData, tenant, fallbackTitle, fallbackDescription]);
  
  return null;
}

export function generateLocalBusinessSchema(tenant: any) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": tenant.name,
    "description": tenant.description,
    "telephone": tenant.phone || "",
    "email": tenant.email || "",
    "address": tenant.address ? {
      "@type": "PostalAddress",
      "streetAddress": tenant.address.street || "",
      "addressLocality": tenant.address.city,
      "addressRegion": tenant.address.state,
      "postalCode": tenant.address.zip || "",
      "addressCountry": "US"
    } : undefined,
    "aggregateRating": tenant.credentials?.googleRating ? {
      "@type": "AggregateRating",
      "ratingValue": tenant.credentials.googleRating,
      "reviewCount": tenant.credentials.reviewCount || 0
    } : undefined,
    "priceRange": "$$",
    "openingHours": "Mo-Fr 08:00-18:00",
    "sameAs": [
      tenant.social?.facebook,
      tenant.social?.instagram,
      tenant.social?.twitter,
      tenant.social?.linkedin,
    ].filter(Boolean)
  };
}

export function generateServiceSchema(serviceName: string, description: string, tenant: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": tenant.name
    },
    "areaServed": tenant.seo?.serviceAreas?.map((area: string) => ({
      "@type": "City",
      "name": area
    })) || []
  };
}

export function generateOrganizationSchema(tenant: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": tenant.name,
    "description": tenant.description,
    "url": window.location.origin,
    "logo": tenant.logo ? `${window.location.origin}${tenant.logo}` : undefined,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": tenant.phone || "",
      "contactType": "customer service"
    }
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
