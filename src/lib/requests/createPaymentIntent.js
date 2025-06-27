export async function createPaymentIntent(customerName, selectedCourseName, customerPhone, customerEmail) {
  try {
    const response = await fetch('/api/stripe/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        selectedCourseName,
        customerName,
        customerEmail,
        customerPhone
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    const data = await response.json();
    return {
      success: true,
      clientSecret: data.clientSecret,
      amount: data.amount,
      currency: data.currency
    };

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error.message
    };
  }
}