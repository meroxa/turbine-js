// This unit test example uses the Jest, a JavaScript testing framework (https://jestjs.io/)
// However, feel free to use any testing framework of your choice
// To learn more about how to use Jest go to https://jestjs.io/docs/getting-started
// To run this unit test, use `yarn test` or `npm run test` after `yarn install`

// Your eCommerce store has a catalog of products available for sale
// Here is an example product from your catalog

const product = {
    id: 9582724,
    category: 'camping',
    product_type: 'sleeping-bag',
    product_name: 'Forte 35 Sleeping Bag - Womens',
    stock: true,
    reviews: {
        avg_rating: 5,
        review_count: 35,
    }
}

// Customers have access to a filter to find the product they want
// They can filter by `product_type` and `reviews`

const filter = {
    product_type: 'sleeping-bag',
    stock: true,
    reviews: {
        avg_rating: 4,
        review_count: 35,
    }
}

// Check that the product_type matches the filter selection

test('The product is the right product_type', () => {
    expect(product.product_type).toBe(filter.product_type)
});

// Check that the avg_rating matches the filter selection 

test('The product rating is equal to or above selected avg_rating', () => {
    expect(product.reviews.avg_rating).toBeGreaterThanOrEqual(filter.reviews.avg_rating);
});

// We don't want to show products out of stock
// Check the product is in stock

test('The product is in stock', () => {
    expect(product.stock).not.toBe(false);
});