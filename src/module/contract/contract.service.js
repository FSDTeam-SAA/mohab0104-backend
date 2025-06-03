const config = require("../../config");
const sendEmailMessage = require("../../utilts/sendMessageEmail");
const sendMessageTemplate = require("../../utilts/sendMessageTemplate");

const sendMessage = async (payload) => {
  const { email, subject, message } = payload;
  if (!email || !subject || !message) {
    throw new Error("Please fill all the fields");
  }

  const result = await sendEmailMessage({
    from: email,
    to: config.email.adminEmail,
    subject,
    html: sendMessageTemplate({ email, subject, message }),
  });
  if (!result.success) {
    throw new Error(`Failed to send email: ${result.error}`);
  }

  return;
};

const contractService = {
  sendMessage,
};
module.exports = contractService;
