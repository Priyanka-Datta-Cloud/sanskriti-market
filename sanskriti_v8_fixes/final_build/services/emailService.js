const sendOrderConfirmation = async (order, user) => {
  console.log(`[Email] Order confirmation sent to ${user.email} for order ${order.orderNumber}`);
  return true;
};

const sendWelcomeEmail = async (user) => {
  console.log(`[Email] Welcome email sent to ${user.email}`);
  return true;
};

module.exports = { sendOrderConfirmation, sendWelcomeEmail };
