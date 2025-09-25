/**
 * Mock payment service that simulates a successful payment after a short delay
 * @param {Object} paymentData - The payment details
 * @param {number} paymentData.amount - The amount to be paid
 * @param {string} paymentData.email - The donor's email
 * @param {string} paymentData.name - The donor's name
 * @returns {Promise<Object>} - A promise that resolves with payment success data
 */
const processMockPayment = (paymentData) => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({
        success: true,
        paymentId: 'pay_mock_' + Math.random().toString(36).substr(2, 16),
        amount: paymentData.amount,
        currency: 'INR',
        status: 'succeeded',
        timestamp: new Date().toISOString(),
        receipt: `rcpt_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        paymentMethod: 'card',
        card: {
          last4: '4242',
          brand: 'visa',
          funding: 'credit'
        }
      });
    }, 1500);
  });
};

export { processMockPayment };
