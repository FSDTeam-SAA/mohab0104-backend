const verificationCodeTemplate = (code) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 30px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
    <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
      <h1 style="color: #004080; margin: 0;">Quantivo</h1>
      <p style="font-size: 14px; color: #666;">Your trusted platform to report and resolve company service issues</p>
    </header>
    <main style="padding: 25px 0;">
      <p style="font-size: 16px; color: #333;">Hi there,</p>
      <p style="font-size: 16px; color: #333;">
        We received a request to verify your account on <strong>Quantivo</strong>. Use the code below to continue:
      </p>
      <div style="margin: 30px 0; text-align: center;">
        <span style="display: inline-block; font-size: 30px; font-weight: bold; color: #004080; background: #e8f0fe; padding: 16px 32px; border-radius: 10px; letter-spacing: 6px;">
          ${code}
        </span>
      </div>
      <p style="font-size: 15px; color: #555;">This verification code is valid for the next <strong>5 minutes</strong>.</p>
      <p style="font-size: 15px; color: #555;">If you did not request this, please ignore this email. Your data remains safe.</p>
    </main>
    <footer style="border-top: 1px solid #eee; padding-top: 15px; text-align: center; font-size: 13px; color: #999;">
      &copy; ${new Date().getFullYear()} Quantivo. All rights reserved.<br/>
    </footer>
  </div>
`;

module.exports = verificationCodeTemplate;
