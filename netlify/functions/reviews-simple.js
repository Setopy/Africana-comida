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
    console.log('Reviews-simple function called');
    
    if (event.httpMethod === 'GET') {
      // Return sample reviews
      const sampleReviews = [
        {
          _id: '1',
          name: 'Adunni Okafor',
          email: 'adunni@example.com',
          rating: 5,
          comment: 'Amazing jollof rice! Tastes just like home. The portions are generous and the service is excellent.',
          createdAt: '2024-06-10T10:00:00Z',
          approved: true
        },
        {
          _id: '2',
          name: 'Kwame Asante',
          email: 'kwame@example.com',
          rating: 4,
          comment: 'The suya was perfectly spiced and the meat was tender. Will definitely be coming back for more.',
          createdAt: '2024-06-09T15:30:00Z',
          approved: true
        },
        {
          _id: '3',
          name: 'Fatima Ibrahim',
          email: 'fatima@example.com',
          rating: 5,
          comment: 'Best Nigerian restaurant in town! The egusi soup reminded me of my grandmother\'s cooking.',
          createdAt: '2024-06-08T12:15:00Z',
          approved: true
        },
        {
          _id: '4',
          name: 'Michael Johnson',
          email: 'mike@example.com',
          rating: 4,
          comment: 'First time trying Nigerian food and I was blown away. The flavors are incredible!',
          createdAt: '2024-06-07T18:45:00Z',
          approved: true
        }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          results: sampleReviews.length,
          data: sampleReviews
        })
      };
    }

    if (event.httpMethod === 'POST') {
      // Handle review submission
      const body = event.body ? JSON.parse(event.body) : {};
      console.log('Review submission:', body);
      
      // Send email notification
      console.log(`New review submission from ${body.name} (${body.email})`);
      console.log(`Rating: ${body.rating}/5`);
      console.log(`Comment: ${body.comment}`);
      
      // TODO: In a real implementation, save to database
      // TODO: Send email to ogunji.st@gmail.com
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Thank you for your review! It will be visible after approval.',
          data: {
            ...body,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            approved: false
          }
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Reviews-simple function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};