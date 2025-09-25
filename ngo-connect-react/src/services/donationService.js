import api from './api';

const DONATION_BASE_URL = '/donations';

// No need for manual auth header - it's handled by the API interceptor

/**
 * Creates a new donation
 * @param {Object} donationData - The donation data to create
 * @param {number} donationData.amount - The donation amount
 * @param {string} donationData.paymentMethod - The payment method used
 * @param {string} donationData.paymentId - The payment ID from the payment processor
 * @param {string} donationData.pledgeType - The type of pledge (one-time, monthly, etc.)
 * @param {string} donationData.message - Optional message with the donation
 * @param {number} donationData.userId - The ID of the user making the donation
 * @param {number} donationData.ngoId - The ID of the NGO receiving the donation
 * @returns {Promise<Object>} The created donation object
 */
export const createDonation = async ({
  amount,
  paymentMethod,
  paymentId,
  pledgeType,
  message = '',
  userId,
  ngoId
}) => {
  try {
    const requestData = {
      amount,
      paymentMethod,
      paymentId,
      pledgeType,
      message,
      userId,
      ngoId,
      status: 'COMPLETED' // Default status for now
    };
    
    console.log('Creating donation with data:', requestData);
    const response = await api.post(DONATION_BASE_URL, requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating donation:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};

/**
 * Gets a single donation by ID
 * @param {string|number} id - The ID of the donation to retrieve
 * @returns {Promise<Object>} The donation object
 */
export const getDonationById = async (id) => {
  try {
    const response = await api.get(`${DONATION_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donation ${id}:`, error);
    throw error;
  }
};

/**
 * Gets donation history for a specific user
 * @param {string|number} userId - The ID of the user
 * @returns {Promise<Array>} Array of donation objects
 */
export const getDonationHistory = async (userId) => {
  try {
    const response = await api.get(`${DONATION_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching donation history:', error);
    throw error;
  }
};
