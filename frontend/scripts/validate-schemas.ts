/**
 * CLI Schema Validation Test Suite
 * Validates generated schemas and interconnected entity graphs across:
 * - Core Homepage & Global Entities (Organization, Brand, WebSite, SoftwareApplication)
 * - Navigation & BreadcrumbList
 * - Content Entities (Article, FAQPage, HowTo, DefinedTerm, ItemList)
 * - Multi-adapter compliance (Google Rich Results, Schema.org standard, Search Console)
 * - Zero synthetic rating / review enforcement
 */

import { JsonLdPipeline } from '../src/schema/jsonld/pipeline.ts';
import { SchemaValidator } from '../src/schema/validators/schema.validator.ts';
import {
  createArticleSchema,
  createFAQPageSchema,
  createHowToSchema,
  createDefinedTermSchema,
  createComparisonItemListSchema,
} from '../src/schema/generators/content.generators.ts';
import {
  createVerifiedAggregateRatingSchema,
  createVerifiedReviewSchema,
} from '../src/schema/generators/stubs.generators.ts';

export function runSchemaValidation() {
  console.log('------------------------------------------------------------');
  console.log('🚀 [Schema Engine] Starting Enterprise Structured Data Audit');
  console.log('------------------------------------------------------------');

  const pipeline = JsonLdPipeline.getInstance();

  // Test 1: Global Entities Graph (Homepage simulation)
  console.log('\n[Test 1] Validating Homepage Global Entity Graph...');
  const homeDoc = pipeline.generatePageGraph({
    url: 'https://restaurantos.com/',
    title: 'Restaurant OS — The Operating System for Modern Restaurants',
    description: 'All-in-one POS, KDS, inventory, and online ordering system designed for restaurant operations.',
    inLanguage: 'en-US',
    breadcrumbs: [
      { name: 'Home', url: 'https://restaurantos.com/' }
    ],
  });

  const homeNodes = homeDoc['@graph'];
  console.log(` -> Generated ${homeNodes.length} nodes in Homepage @graph.`);
  const homeResults = SchemaValidator.validateGraph(homeNodes);
  let hasErrors = false;

  homeResults.forEach((res, idx) => {
    const node = homeNodes[idx];
    if (!res.valid) {
      hasErrors = true;
      console.error(` ❌ Node #${idx + 1} (${node['@type']}): FAIL with ${res.errors.length} errors:`);
      res.errors.forEach((e) => console.error(`    - [${e.field}] ${e.message}`));
    } else {
      console.log(` ✅ Node #${idx + 1} (${node['@type']}): PASS (${res.warnings.length} warnings)`);
    }
  });

  // Test 2: Content Entities & Rich Results (Article, FAQPage, HowTo, DefinedTerm, ItemList)
  console.log('\n[Test 2] Validating Rich Content Generators (Article, FAQPage, HowTo, DefinedTerm, ItemList)...');
  const sampleArticle = createArticleSchema({
    url: 'https://restaurantos.com/resources/guides/complete-cloud-pos-guide',
    headline: 'The Complete Guide to Cloud POS Architecture in 2026',
    description: 'An architectural deep-dive into real-time order synchronization and fault tolerance for commercial kitchens.',
    datePublished: '2026-03-15T08:00:00.000Z',
    dateModified: '2026-03-20T10:00:00.000Z',
    author: {
      name: 'Puspender Singh',
      jobTitle: 'Principal Systems Architect',
      sameAs: ['https://linkedin.com/in/puspender'],
    },
    image: 'https://restaurantos.com/images/guides/pos-guide.jpg',
    wordCount: 2850,
  });

  const sampleFaq = createFAQPageSchema({
    url: 'https://restaurantos.com/resources/faq/pos-hardware-compatibility',
    questions: [
      {
        question: 'Does Restaurant OS run offline when internet connectivity drops?',
        answer: 'Yes, Restaurant OS features local mesh synchronization and stores orders locally in IndexedDB until internet access is restored.',
      },
      {
        question: 'What receipt printers and cash drawers are natively supported?',
        answer: 'Restaurant OS supports all standard ESC/POS ethernet, Bluetooth, and USB thermal receipt printers.',
      },
    ],
  });

  const sampleHowTo = createHowToSchema({
    url: 'https://restaurantos.com/resources/tutorials/how-to-set-up-kds',
    name: 'How to Set Up Kitchen Display System (KDS) Hardware',
    description: 'Step-by-step instructions for station routing and kitchen tablet configuration.',
    steps: [
      { name: 'Connect to Kitchen Mesh', text: 'Power on the Android or iPad display and connect to the restaurant local Wi-Fi network.' },
      { name: 'Assign Station Station Profile', text: 'Select Hot Line, Salad Bar, or Expediter in the Station Settings.' },
    ],
  });

  const sampleTerm = createDefinedTermSchema({
    term: 'Table Turn Time',
    definition: 'The average duration in minutes from when a party is seated until the table is cleared and reset for the next guest.',
    termCode: 'METRIC-TTT-01',
    inDefinedTermSetUrl: 'https://restaurantos.com/resources/glossary',
  });

  const sampleComparison = createComparisonItemListSchema({
    url: 'https://restaurantos.com/compare/restaurant-os-vs-toast',
    name: 'Restaurant OS vs Toast POS: Enterprise Comparison 2026',
    description: 'Detailed feature, pricing, and hardware comparison between Restaurant OS and Toast POS.',
    items: [
      { name: 'Restaurant OS Cloud Kitchen Suite', url: 'https://restaurantos.com/features/cloud-pos', description: 'Real-time multi-terminal POS' },
      { name: 'Toast POS Platform', url: 'https://pos.toasttab.com', description: 'Legacy terminal platform' },
    ],
  });

  const contentDoc = pipeline.generatePageGraph({
    url: 'https://restaurantos.com/resources/guides/complete-cloud-pos-guide',
    title: 'The Complete Guide to Cloud POS Architecture in 2026',
    description: 'An architectural deep-dive into real-time order synchronization.',
    inLanguage: 'en-US',
    breadcrumbs: [
      { name: 'Home', url: 'https://restaurantos.com/' },
      { name: 'Resources', url: 'https://restaurantos.com/resources' },
      { name: 'Guides', url: 'https://restaurantos.com/resources/guides' },
      { name: 'Complete Cloud POS Guide', url: 'https://restaurantos.com/resources/guides/complete-cloud-pos-guide' },
    ],
    pageEntities: [sampleArticle, sampleFaq, sampleHowTo, sampleTerm, sampleComparison],
  });

  const contentNodes = contentDoc['@graph'];
  console.log(` -> Generated ${contentNodes.length} nodes in Rich Content Page @graph.`);
  const contentResults = SchemaValidator.validateGraph(contentNodes);

  contentResults.forEach((res, idx) => {
    const node = contentNodes[idx];
    if (!res.valid) {
      hasErrors = true;
      console.error(` ❌ Node #${idx + 1} (${node['@type']}): FAIL with ${res.errors.length} errors:`);
      res.errors.forEach((e) => console.error(`    - [${e.field}] ${e.message}`));
    } else {
      console.log(` ✅ Node #${idx + 1} (${node['@type']}): PASS (${res.warnings.length} warnings)`);
    }
  });

  // Test 3: Synthetic / Unverified Review Gatekeeper Policy
  console.log('\n[Test 3] Validating Zero-Synthetic-Review Gatekeeper Policy...');
  const syntheticRating = createVerifiedAggregateRatingSchema(
    'https://restaurantos.com/#softwareapplication',
    {
      ratingValue: 5.0,
      reviewCount: 100,
      isVerifiedRealData: false, // NOT verified real reviews!
    }
  );
  if (syntheticRating === null) {
    console.log(' ✅ Gatekeeper successfully blocked unverified aggregate rating (returned null).');
  } else {
    hasErrors = true;
    console.error(' ❌ Gatekeeper failed: allowed synthetic aggregate rating without verified data!');
  }

  const syntheticReview = createVerifiedReviewSchema(
    'https://restaurantos.com/#softwareapplication',
    {
      authorName: 'Fake Customer',
      reviewRating: 5,
      reviewBody: 'Best POS ever!',
      datePublished: '2026-03-01',
      isVerifiedRealData: false,
    }
  );
  if (syntheticReview === null) {
    console.log(' ✅ Gatekeeper successfully blocked unverified single review (returned null).');
  } else {
    hasErrors = true;
    console.error(' ❌ Gatekeeper failed: allowed synthetic review without verified data!');
  }

  // Test 4: Serialization test (safe escaping)
  console.log('\n[Test 4] Validating Safe JSON-LD Serialization...');
  const serialized = pipeline.serializeToScript(contentDoc);
  if (serialized.includes('<script>') || serialized.includes('</script>')) {
    hasErrors = true;
    console.error(' ❌ Serialization failed: unsafe script tags unescaped in JSON-LD output!');
  } else {
    console.log(` ✅ Serialization passed: safe JSON-LD string generated (${serialized.length} bytes).`);
  }

  console.log('------------------------------------------------------------');
  if (hasErrors) {
    console.error('❌ [Schema Engine] Validation FAILED. Resolve errors above.');
    process.exit(1);
  } else {
    console.log('🎉 [Schema Engine] All Schema & Entity Graph tests PASSED with zero blocking errors!');
    console.log('------------------------------------------------------------');
  }
}

runSchemaValidation();
