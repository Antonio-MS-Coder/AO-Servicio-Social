import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  canonical,
  noindex = false,
  nofollow = false,
}) => {
  const location = useLocation();
  
  // Default values
  const defaultTitle = 'DOOM - Directorio Obregonense de Oficios para el Mundial 2026';
  const defaultDescription = 'Conecta con oportunidades laborales del Mundial FIFA 2026 en Álvaro Obregón. Encuentra trabajadores verificados y empleos en construcción, hostelería, traducción, seguridad y más.';
  const defaultKeywords = 'Mundial 2026, FIFA 2026, empleos CDMX, trabajos Álvaro Obregón, oficios México, World Cup jobs, empleos temporales';
  const defaultImage = 'https://doom-ao.gob.mx/og-image.jpg';
  const baseUrl = 'https://doom-ao.gob.mx';
  
  // Final values
  const finalTitle = title ? `${title} | DOOM Mundial 2026` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  const finalImage = image || defaultImage;
  const finalCanonical = canonical || `${baseUrl}${location.pathname}`;
  
  useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        const attributeMatch = selector.match(/\[([^=]+)="([^"]+)"\]/);
        if (attributeMatch) {
          element.setAttribute(attributeMatch[1], attributeMatch[2]);
        }
        document.head.appendChild(element);
      }
      element.content = content;
    };
    
    // Update meta tags
    updateMetaTag('meta[name="description"]', finalDescription);
    updateMetaTag('meta[name="keywords"]', finalKeywords);
    
    // Robots meta tag
    const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
    updateMetaTag('meta[name="robots"]', robotsContent);
    
    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', finalTitle);
    updateMetaTag('meta[property="og:description"]', finalDescription);
    updateMetaTag('meta[property="og:image"]', finalImage);
    updateMetaTag('meta[property="og:url"]', finalCanonical);
    updateMetaTag('meta[property="og:type"]', type);
    
    // Twitter Card tags
    updateMetaTag('meta[property="twitter:title"]', finalTitle);
    updateMetaTag('meta[property="twitter:description"]', finalDescription);
    updateMetaTag('meta[property="twitter:image"]', finalImage);
    
    // Article specific meta tags
    if (type === 'article') {
      if (author) updateMetaTag('meta[property="article:author"]', author);
      if (publishedTime) updateMetaTag('meta[property="article:published_time"]', publishedTime);
      if (modifiedTime) updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
      if (section) updateMetaTag('meta[property="article:section"]', section);
      tags?.forEach(tag => {
        const tagElement = document.createElement('meta');
        tagElement.setAttribute('property', 'article:tag');
        tagElement.content = tag;
        document.head.appendChild(tagElement);
      });
    }
    
    // Update canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = finalCanonical;
    
    // Add structured data for current page
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: finalTitle,
      description: finalDescription,
      url: finalCanonical,
      image: finalImage,
      inLanguage: 'es-MX',
      isPartOf: {
        '@type': 'WebSite',
        name: 'DOOM - Directorio Obregonense de Oficios Mundialista',
        url: baseUrl,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: location.pathname.split('/').filter(Boolean).map((segment, index, array) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
          item: `${baseUrl}/${array.slice(0, index + 1).join('/')}`,
        })),
      },
    };
    
    // Add or update structured data script
    let scriptElement = document.querySelector('script#page-structured-data') as HTMLScriptElement;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'page-structured-data';
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(structuredData);
    
    // Cleanup function
    return () => {
      // Clean up any dynamically added article tags
      if (type === 'article' && tags) {
        const tagElements = document.querySelectorAll('meta[property="article:tag"]');
        tagElements.forEach(el => el.remove());
      }
    };
  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    finalImage,
    finalCanonical,
    type,
    author,
    publishedTime,
    modifiedTime,
    section,
    tags,
    noindex,
    nofollow,
    location,
  ]);
  
  return null; // This component doesn't render anything visible
};

export default SEOHead;