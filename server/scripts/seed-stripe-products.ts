// Seed Stripe products and prices for PaintPros.io
// Run with: npx tsx server/scripts/seed-stripe-products.ts

import { getUncachableStripeClient } from "../stripeClient";

async function seedStripeProducts() {
  console.log("Connecting to Stripe...");
  const stripe = await getUncachableStripeClient();
  
  // Verify connection
  const account = await stripe.accounts.retrieve();
  console.log(`Connected to Stripe account: ${account.business_profile?.name || account.id}`);
  
  const products: { name: string; description: string; prices: { nickname: string; unit_amount: number; recurring?: { interval: 'month' | 'year' } }[] }[] = [
    // AI Credit Packs (one-time purchases)
    {
      name: "AI Credits - Starter Pack",
      description: "1,000 AI credits for PaintPros.io estimator and assistant features",
      prices: [{ nickname: "Starter Pack", unit_amount: 1000 }] // $10
    },
    {
      name: "AI Credits - Value Pack",
      description: "2,500 AI credits for PaintPros.io estimator and assistant features",
      prices: [{ nickname: "Value Pack", unit_amount: 2500 }] // $25
    },
    {
      name: "AI Credits - Pro Pack",
      description: "5,000 AI credits for PaintPros.io estimator and assistant features",
      prices: [{ nickname: "Pro Pack", unit_amount: 5000 }] // $50
    },
    {
      name: "AI Credits - Business Pack",
      description: "10,000 AI credits for PaintPros.io estimator and assistant features",
      prices: [{ nickname: "Business Pack", unit_amount: 10000 }] // $100
    },
    // Subscription Tiers
    {
      name: "PaintPros.io Estimator Tool",
      description: "Standalone estimator with AI-powered pricing, lead capture, and customer-facing tool",
      prices: [
        { nickname: "Estimator Monthly", unit_amount: 2900, recurring: { interval: 'month' } },
        { nickname: "Estimator Annual", unit_amount: 29000, recurring: { interval: 'year' } } // ~$241.67/yr, 2 months free
      ]
    },
    {
      name: "PaintPros.io Full Suite",
      description: "Complete business platform with website, estimator, booking, CRM, crew management, and all features",
      prices: [
        { nickname: "Full Suite Monthly", unit_amount: 19900, recurring: { interval: 'month' } },
        { nickname: "Full Suite Annual", unit_amount: 199000, recurring: { interval: 'year' } } // ~$1658/yr, 2 months free
      ]
    },
    {
      name: "PaintPros.io Franchise License",
      description: "Multi-location franchise license with territory exclusivity and priority support",
      prices: [
        { nickname: "Franchise Monthly", unit_amount: 49900, recurring: { interval: 'month' } },
        { nickname: "Franchise Annual", unit_amount: 499000, recurring: { interval: 'year' } } // ~$4158/yr, 2 months free
      ]
    }
  ];

  const createdProducts: { product: string; productId: string; prices: { nickname: string; priceId: string; amount: number }[] }[] = [];

  for (const productData of products) {
    // Check if product already exists
    const existingProducts = await stripe.products.search({
      query: `name:'${productData.name}'`
    });

    let product;
    if (existingProducts.data.length > 0) {
      product = existingProducts.data[0];
      console.log(`Product already exists: ${product.name} (${product.id})`);
    } else {
      product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
      });
      console.log(`Created product: ${product.name} (${product.id})`);
    }

    const priceResults: { nickname: string; priceId: string; amount: number }[] = [];

    for (const priceData of productData.prices) {
      // Check if price already exists for this product
      const existingPrices = await stripe.prices.list({
        product: product.id,
        active: true
      });
      
      const matchingPrice = existingPrices.data.find(p => 
        p.unit_amount === priceData.unit_amount && 
        (priceData.recurring ? p.recurring?.interval === priceData.recurring.interval : !p.recurring)
      );

      let price;
      if (matchingPrice) {
        price = matchingPrice;
        console.log(`  Price already exists: ${priceData.nickname} - ${price.id}`);
      } else {
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: priceData.unit_amount,
          currency: 'usd',
          nickname: priceData.nickname,
          ...(priceData.recurring && { recurring: priceData.recurring })
        });
        console.log(`  Created price: ${priceData.nickname} - ${price.id}`);
      }

      priceResults.push({
        nickname: priceData.nickname,
        priceId: price.id,
        amount: priceData.unit_amount
      });
    }

    createdProducts.push({
      product: productData.name,
      productId: product.id,
      prices: priceResults
    });
  }

  console.log("\n========================================");
  console.log("STRIPE PRODUCTS AND PRICES CREATED");
  console.log("========================================\n");
  
  console.log("Copy these price IDs to your code:\n");
  
  for (const product of createdProducts) {
    console.log(`// ${product.product}`);
    for (const price of product.prices) {
      const amount = (price.amount / 100).toFixed(2);
      console.log(`//   ${price.nickname}: $${amount} -> "${price.priceId}"`);
    }
    console.log("");
  }

  // Output as JSON for easy copying
  console.log("\nJSON format for code integration:");
  console.log(JSON.stringify(createdProducts, null, 2));
}

seedStripeProducts()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding products:", error);
    process.exit(1);
  });
