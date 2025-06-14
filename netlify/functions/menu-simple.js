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

    // Complete Nigerian menu with 6 items per category
    const sampleMenu = [
      // STARTERS (6 items)
      {
        _id: '1',
        name: 'Suya',
        description: 'Spicy grilled beef skewers seasoned with ground peanuts and spices. Popular Nigerian street food.',
        price: 100,
        category: 'starters',
        ingredients: ['Beef', 'Suya Spice', 'Onions', 'Tomatoes'],
        allergens: ['Nuts'],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 4
      },
      {
        _id: '2',
        name: 'Akara',
        description: 'Deep-fried bean cakes made from black-eyed peas. A popular breakfast and snack item.',
        price: 100,
        category: 'starters',
        ingredients: ['Black-eyed Peas', 'Onions', 'Peppers', 'Oil'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 1
      },
      {
        _id: '3',
        name: 'Peppered Snail',
        description: 'Spicy snails cooked in rich pepper sauce with traditional Nigerian spices.',
        price: 100,
        category: 'starters',
        ingredients: ['Snails', 'Bell Peppers', 'Scotch Bonnet', 'Onions', 'Palm Oil'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 5
      },
      {
        _id: '4',
        name: 'Kilishi',
        description: 'Nigerian dried meat jerky seasoned with spices. A protein-rich traditional snack.',
        price: 100,
        category: 'starters',
        ingredients: ['Beef', 'Groundnut Paste', 'Spices', 'Ginger'],
        allergens: ['Nuts'],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 3
      },
      {
        _id: '5',
        name: 'Puff Puff',
        description: 'Sweet deep-fried dough balls, light and fluffy. Perfect starter or snack.',
        price: 100,
        category: 'starters',
        ingredients: ['Flour', 'Yeast', 'Sugar', 'Oil'],
        allergens: ['Gluten'],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: false,
        isAvailable: true,
        spicyLevel: 0
      },
      {
        _id: '6',
        name: 'Peppered Gizzard',
        description: 'Tender chicken gizzards cooked in spicy pepper sauce with onions.',
        price: 100,
        category: 'starters',
        ingredients: ['Chicken Gizzard', 'Bell Peppers', 'Onions', 'Spices'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 4
      },

      // MAIN DISHES (6 items)
      {
        _id: '7',
        name: 'Jollof Rice',
        description: 'Traditional Nigerian spiced rice cooked in rich tomato sauce with vegetables and choice of protein.',
        price: 100,
        category: 'main',
        ingredients: ['Rice', 'Tomatoes', 'Onions', 'Bell Peppers', 'Spices'],
        allergens: [],
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 2
      },
      {
        _id: '8',
        name: 'Pounded Yam with Egusi',
        description: 'Smooth pounded yam served with rich egusi soup made from ground melon seeds and vegetables.',
        price: 100,
        category: 'main',
        ingredients: ['Yam', 'Melon Seeds', 'Spinach', 'Palm Oil', 'Meat', 'Fish'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 3
      },
      {
        _id: '9',
        name: 'Fried Rice',
        description: 'Nigerian-style fried rice with mixed vegetables, liver, and aromatic spices.',
        price: 100,
        category: 'main',
        ingredients: ['Rice', 'Vegetables', 'Liver', 'Curry', 'Thyme'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 1
      },
      {
        _id: '10',
        name: 'Ofada Rice & Stew',
        description: 'Local Nigerian rice served with spicy designer stew made with assorted meat.',
        price: 100,
        category: 'main',
        ingredients: ['Ofada Rice', 'Bell Peppers', 'Scotch Bonnet', 'Assorted Meat', 'Locust Beans'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 4
      },
      {
        _id: '11',
        name: 'Beans and Plantain',
        description: 'Nigerian brown beans cooked with spices, served with fried ripe plantain.',
        price: 100,
        category: 'main',
        ingredients: ['Brown Beans', 'Plantain', 'Palm Oil', 'Onions', 'Peppers'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 2
      },
      {
        _id: '12',
        name: 'Amala and Ewedu',
        description: 'Yam flour swallow served with ewedu soup and buka stew.',
        price: 100,
        category: 'main',
        ingredients: ['Yam Flour', 'Ewedu Leaves', 'Locust Beans', 'Assorted Meat'],
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 3
      },

      // DESSERTS (6 items)
      {
        _id: '13',
        name: 'Chin Chin',
        description: 'Sweet, crunchy fried pastry snack made from flour and sugar. Perfect dessert treat.',
        price: 100,
        category: 'desserts',
        ingredients: ['Flour', 'Sugar', 'Milk', 'Oil', 'Nutmeg'],
        allergens: ['Gluten', 'Milk'],
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isAvailable: true,
        spicyLevel: 0
      },
      {
        _id: '14',
        name: 'Kuli Kuli',
        description: 'Crunchy groundnut snack seasoned with spices. A traditional Northern Nigerian treat.',
        price: 100,
        category: 'desserts',
        ingredients: ['Groundnuts', 'Ginger', 'Cloves', 'Salt'],
        allergens: ['Nuts'],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 1
      },
      {
        _id: '15',
        name: 'Coconut Candy',
        description: 'Sweet coconut strips cooked in sugar syrup until crystallized.',
        price: 100,
        category: 'desserts',
        ingredients: ['Coconut', 'Sugar', 'Ginger'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 0
      },
      {
        _id: '16',
        name: 'Boli and Groundnut',
        description: 'Roasted plantain served with roasted groundnuts. A popular street dessert.',
        price: 100,
        category: 'desserts',
        ingredients: ['Plantain', 'Groundnuts'],
        allergens: ['Nuts'],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 0
      },
      {
        _id: '17',
        name: 'Meat Pie',
        description: 'Flaky pastry filled with seasoned minced meat and vegetables.',
        price: 100,
        category: 'desserts',
        ingredients: ['Flour', 'Minced Meat', 'Potatoes', 'Carrots', 'Butter'],
        allergens: ['Gluten'],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isAvailable: true,
        spicyLevel: 1
      },
      {
        _id: '18',
        name: 'Tiger Nut Pudding',
        description: 'Creamy pudding made from tiger nuts, served chilled with coconut flakes.',
        price: 100,
        category: 'desserts',
        ingredients: ['Tiger Nuts', 'Coconut Milk', 'Sugar', 'Dates'],
        allergens: ['Nuts'],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 0
      },

      // DRINKS (3 items)
      {
        _id: '19',
        name: 'Zobo Drink',
        description: 'Refreshing hibiscus drink infused with ginger, pineapple, and natural spices.',
        price: 100,
        category: 'drinks',
        ingredients: ['Hibiscus Leaves', 'Ginger', 'Pineapple', 'Cucumber', 'Watermelon'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 0
      },
      {
        _id: '20',
        name: 'Soda',
        description: 'Refreshing carbonated soft drinks - Coca-Cola, Fanta, Sprite, and other popular brands.',
        price: 100,
        category: 'drinks',
        ingredients: ['Carbonated Water', 'Sugar', 'Natural Flavors'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isAvailable: true,
        spicyLevel: 0
      },
      {
        _id: '21',
        name: 'Water',
        description: 'Pure bottled water - still or sparkling mineral water to quench your thirst.',
        price: 100,
        category: 'drinks',
        ingredients: ['Purified Water'],
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