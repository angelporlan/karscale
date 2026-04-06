type BlogTaxonomy = {
  category: string;
  subcategory: string;
  slug: string;
};

const FALLBACK_CATEGORY = 'uncategorized';
const FALLBACK_SUBCATEGORY = 'general';

export function getBlogTaxonomyFromId(id: string): BlogTaxonomy {
  const parts = id.split('/').filter(Boolean);

  if (parts.length >= 4) {
    const slug = parts[parts.length - 1];
    const category = parts[1];
    const subcategory = parts[2];

    return { category, subcategory, slug };
  }

  if (parts.length === 3) {
    return {
      category: parts[1],
      subcategory: FALLBACK_SUBCATEGORY,
      slug: parts[2],
    };
  }

  if (parts.length === 2) {
    return {
      category: FALLBACK_CATEGORY,
      subcategory: FALLBACK_SUBCATEGORY,
      slug: parts[1],
    };
  }

  return {
    category: FALLBACK_CATEGORY,
    subcategory: FALLBACK_SUBCATEGORY,
    slug: parts[0] ?? id,
  };
}

export function formatTaxonomyLabel(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function getBlogUrlPath(id: string): string {
  const { category, subcategory, slug } = getBlogTaxonomyFromId(id);
  return `${category}/${subcategory}/${slug}`;
}
