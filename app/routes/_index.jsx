import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  const [{collections}, featuredProducts] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTIONS_QUERY),
    context.storefront.query(FEATURED_PRODUCTS_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0] ?? null,
    collections: collections.nodes.slice(0, 6),
    featuredProducts: featuredProducts.products.nodes.slice(0, 4),
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Curated for the modern lifestyle</h1>
          <p className="hero__subtitle">
            Discover quality products handpicked for style and substance. Shop
            our latest collection and find something you’ll love.
          </p>
          <Link to="/collections/all" className="hero__cta">
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Featured Collection */}
      {data.featuredCollection && (
        <section className="section">
          <div className="container">
            <h2 className="section-heading">Featured Collection</h2>
            <FeaturedCollection collection={data.featuredCollection} />
          </div>
        </section>
      )}

      {/* Featured Products */}
      {data.featuredProducts?.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <h2 className="section-heading">Bestsellers</h2>
            <div className="products-grid">
              {data.featuredProducts.map((product) => (
                <ProductItem key={product.id} product={product} loading="eager" />
              ))}
            </div>
            <div style={{textAlign: 'center', marginTop: '2rem'}}>
              <Link
                to="/collections/all"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  border: '2px solid var(--color-text)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Products (deferred) */}
      <section className="section">
        <div className="container">
          <h2 className="section-heading">New Arrivals</h2>
          <Suspense
            fallback={
              <div className="products-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: 1,
                      background: 'var(--color-border)',
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </div>
            }
          >
            <Await resolve={data.recommendedProducts}>
              {(response) => (
                <div className="products-grid">
                  {response?.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </section>

      {/* Collections Grid */}
      {data.collections?.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <h2 className="section-heading">Shop by Category</h2>
            <div className="collections-grid">
              {data.collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="trust-item">
          <div className="trust-item__icon">✓</div>
          <div className="trust-item__title">Free Shipping</div>
          <div className="trust-item__desc">
            On orders over $50
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-item__icon">↺</div>
          <div className="trust-item__title">Easy Returns</div>
          <div className="trust-item__desc">
            30-day return policy
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-item__icon">★</div>
          <div className="trust-item__title">Quality Guarantee</div>
          <div className="trust-item__desc">
            Curated with care
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturedCollection({collection}) {
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <Image data={image} sizes="100vw" aspectRatio="16/9" />
      )}
      <div className="featured-collection__overlay">
        <h3 className="featured-collection__title">{collection.title}</h3>
      </div>
    </Link>
  );
}

function CollectionCard({collection}) {
  const image = collection?.image;
  return (
    <Link
      className="collection-card"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <Image data={image} sizes="(min-width: 640px) 33vw, 50vw" aspectRatio="4/5" />
      )}
      <div className="collection-card__overlay">
        <h4 className="collection-card__title">{collection.title}</h4>
      </div>
    </Link>
  );
}

const FEATURED_COLLECTIONS_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const FEATURED_PRODUCTS_QUERY = `#graphql
  fragment FeaturedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query FeaturedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: BEST_SELLING, reverse: true) {
      nodes {
        ...FeaturedProduct
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
