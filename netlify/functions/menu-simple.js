exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('Menu-simple function called');
    console.log('Environment check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'not found',
      nodeEnv: process.env.NODE_ENV
    });

    // Test mongoose import
    let mongooseStatus = 'not tested';
    try {
      const mongoose = require('mongoose');
      mongooseStatus = 'imported successfully';
      console.log('Mongoose imported successfully');
    } catch (err) {
      mongooseStatus = `import failed: ${err.message}`;
      console.error('Mongoose import failed:', err);
    }

    // Complete Nigerian menu items
    const sampleMenu = [
      // STARTERS (3 items)
      
      {
        _id: '1',
        name: 'Akara',
        description: 'Deep-fried bean cakes made from beans. A popular breakfast and snack item.',
        price: 100,
        category: 'appetizer',
        ingredients: ['Beans', 'Onions', 'Peppers', 'Oil', 'Chicken'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 1
      },
      
     
      {
        _id: '2',
        name: 'Puff Puff',
        description: 'Sweet deep-fried dough balls, light and fluffy. Perfect starter or snack.',
        price: 50,
        category: 'appetizer',
        ingredients: ['Flour', 'Yeast', 'Sugar', 'Oil', 'Chicken'],
        allergens: ['Gluten'],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isAvailable: true,
        spicyLevel: 0
      },

      
      {
        _id: '3',
        name: 'Peppered Gizzard',
        description: 'Tender chicken gizzards cooked in spicy pepper sauce with onions.',
        price: 100,
        category: 'appetizer',
        ingredients: ['Chicken Gizzard', 'Bell Peppers', 'Onions', 'Spices'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 4
      },

      // MAIN DISHES (7 items)
      {
        _id: '4',
        name: 'Jollof Rice',
        description: 'Traditional Nigerian spiced rice cooked in rich tomato sauce and chicken.',
        price: 100,
        category: 'main-course',
        ingredients: ['Rice', 'Tomatoes', 'Onions', 'Bell Peppers', 'Spices', 'Chicken'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 2
      },
     
      {
        _id: '5',
        name: 'Fried Rice',
        description: 'Nigerian-style fried rice with mixed vegetables, and spices.',
        price: 100,
        category: 'main-course',
        ingredients: ['Rice', 'Vegetables', 'green pepper', 'yellow pepper', 'Curry', 'Thyme', 'Chicken'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 1
      },
      
      {
        _id: '6',
        name: 'Beans and Plantain',
        description: 'Beans cooked with spices, served with fried ripe plantain.',
        price: 100,
        category: 'main-course',
        ingredients: ['Beans', 'Plantain', 'Oil', 'Onions', 'Peppers'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 2
      },
      
      {
        _id: '7',
        name: 'Egg, Fried Potato, Fried Plantain',
        description: 'A hearty breakfast combination of scrambled eggs, crispy fried potatoes, and sweet fried plantain.',
        price: 120,
        category: 'main-course',
        ingredients: ['Eggs', 'Potatoes', 'Plantain', 'Oil', 'Salt', 'Onions'],
        allergens: ['Eggs'],
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 0
      },

      {
        _id: '8',
        name: 'Spaghetti and Egg',
        description: 'Nigerian-style spaghetti cooked with vegetables and served with eggs.',
        price: 100,
        category: 'main-course',
        ingredients: ['Spaghetti', 'Eggs', 'Tomatoes', 'Onions', 'Bell Peppers', 'Vegetable Oil'],
        allergens: ['Gluten', 'Eggs'],
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isAvailable: true,
        spicyLevel: 1
      },

      {
        _id: '9',
        name: 'Wheat and Egushi soup',
        description: 'Nigerian wheat meal served as a swallow with egushi soup. A nutritious and filling staple.',
        price: 100,
        category: 'main-course',
        ingredients: ['Wheat Flour', 'Water'],
        allergens: ['Gluten'],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: false,
        isAvailable: true,
        spicyLevel: 0
      },

      
      
      // DESSERTS (2 items)
     
      {
        _id: '11',
        name: 'Boli, stew and  chicken',
        description: 'Roasted plantain served with stew and chicken. A popular street dessert.',
        price: 100,
        category: 'dessert',
        ingredients: ['Plantain', 'Groundnuts'],
        allergens: ['Nuts'],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 0
      },
      {
        _id: '12',
        name: 'Meat Pie',
        description: 'Flaky pastry filled with seasoned minced meat and vegetables.',
        price: 50,
        category: 'dessert',
        ingredients: ['Flour', 'Minced Meat', 'Potatoes', 'Carrots', 'Butter'],
        allergens: ['Gluten'],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isAvailable: true,
        spicyLevel: 1
      },
     

      // DRINKS (2 items)
      
      {
        _id: '13',
        name: 'Soda',
        description: 'Refreshing carbonated soft drinks - Coca-Cola, Fanta, Sprite, and other popular brands.',
        price: 50,
        category: 'beverage',
        ingredients: ['Carbonated Water', 'Sugar', 'Natural Flavors'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 0
      },

      {
        _id: '14',
        name: 'Natural Water',
        description: 'Pure natural bottled water. Perfect for hydration and cleansing the palate.',
        price: 50,
        category: 'beverage',
        ingredients: ['Natural Spring Water'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 0
      }
      
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: sampleMenu,
        debug: {
          functionWorking: true,
          mongooseStatus,
          timestamp: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    console.error('Menu-simple function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error',
        error: error.message,
        stack: error.stack
      })
    };
  }
};
