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
    const { httpMethod, path } = event;
    const body = event.body ? JSON.parse(event.body) : {};
    
    console.log('Users-simple function called:', httpMethod, path);

    if (httpMethod === 'POST' && path.includes('register')) {
      console.log('Registration attempt:', body);
      
      // Validate required fields
      const { name, email, password, phone } = body;
      if (!name || !email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false,
            message: 'Name, email, and password are required' 
          })
        };
      }

      // Send registration notification email
      console.log(`=== NEW USER REGISTRATION ===`);
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Phone: ${phone || 'Not provided'}`);
      console.log(`Registration Time: ${new Date().toISOString()}`);
      console.log(`Notification should be sent to: ogunji.st@gmail.com`);
      
      // TODO: In real implementation:
      // 1. Hash password
      // 2. Save to database  
      // 3. Send welcome email to user
      // 4. Send notification email to ogunji.st@gmail.com
      // 5. Generate JWT tokens

      // Simulate successful registration
      const mockUser = {
        id: Date.now().toString(),
        name,
        email,
        role: 'customer',
        phone: phone || null,
        createdAt: new Date().toISOString()
      };

      const mockTokens = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      };

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Registration successful! Welcome to Africana Comida.',
          user: mockUser,
          ...mockTokens
        })
      };
    }

    if (httpMethod === 'POST' && path.includes('login')) {
      const { email, password } = body;
      
      console.log('Login attempt:', email);
      
      // Simple mock authentication
      if (email && password) {
        const mockUser = {
          id: 'user-123',
          name: 'Test User',
          email,
          role: 'customer'
        };

        const mockTokens = {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now()
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: mockUser,
            ...mockTokens
          })
        };
      }

      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          success: false,
          message: 'Invalid credentials' 
        })
      };
    }

    if (httpMethod === 'GET' && path.includes('profile')) {
      // Mock profile endpoint
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'customer'
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
    console.error('Users-simple function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        message: 'Server error' 
      })
    };
  }
};