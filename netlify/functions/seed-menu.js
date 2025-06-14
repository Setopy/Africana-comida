const { connectToDatabase } = require('./shared/mongodb');
const { MenuItem } = require('./shared/models');

const sampleMenuItems = [
  {
    name: "Jollof Rice",
    description: "Traditional Nigerian spiced rice dish with vegetables and your choice of protein",
    price: 15.99,
    category: "main",
    ingredients: ["Rice", "Tomatoes", "Onions", "Bell Peppers", "Spices"],
    allergens: [],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true,
    image: "https://via.placeholder.com/300x200?text=Jollof+Rice"
  },
  {
    name: "Suya",
    description: "Grilled spiced meat skewers, a popular Nigerian street food",
    price: 12.99,
    category: "starters",
    ingredients: ["Beef", "Suya Spice", "Onions", "Tomatoes"],
    allergens: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true,
    image: "https://via.placeholder.com/300x200?text=Suya"
  },
  {
    name: "Egusi Soup",
    description: "Rich Nigerian soup made with ground melon seeds and leafy vegetables",
    price: 18.99,
    category: "soups",
    ingredients: ["Melon Seeds", "Spinach", "Palm Oil", "Meat", "Fish"],
    allergens: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true,
    image: "https://via.placeholder.com/300x200?text=Egusi+Soup"
  },
  {
    name: "Plantain",
    description: "Sweet fried plantains, a perfect side dish",
    price: 6.99,
    category: "sides",
    ingredients: ["Plantains", "Palm Oil"],
    allergens: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isAvailable: true,
    image: "https://via.placeholder.com/300x200?text=Plantain"
  },
  {
    name: "Chin Chin",
    description: "Crispy Nigerian snack, perfect with tea or coffee",
    price: 8.99,
    category: "desserts",
    ingredients: ["Flour", "Sugar", "Milk", "Oil"],
    allergens: ["Gluten", "Milk"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    image: "https://via.placeholder.com/300x200?text=Chin+Chin"
  },
  {
    name: "Zobo Drink",
    description: "Refreshing Nigerian drink made with hibiscus leaves and natural spices",
    price: 4.99,
    category: "drinks",
    ingredients: ["Hibiscus Leaves", "Ginger", "Pineapple", "Cucumber"],
    allergens: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isAvailable: true,
    image: "https://via.placeholder.com/300x200?text=Zobo+Drink"
  }
];

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    await connectToDatabase();
    
    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    
    // Insert sample menu items
    const insertedItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`Inserted ${insertedItems.length} menu items`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: `Successfully seeded ${insertedItems.length} menu items`,
        data: insertedItems
      })
    };
    
  } catch (error) {
    console.error('Seed menu error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to seed menu items',
        error: error.message
      })
    };
  }
};