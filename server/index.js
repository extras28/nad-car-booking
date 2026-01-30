require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail", // or your preferred service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Routes
app.get("/api/health", (req, res) => {
    res.send("Car Booking API is running");
});

app.post("/api/book", async (req, res) => {
    const { name, phone, email, pickup, destination, date, passengers, notes } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${process.env.EMAIL_USER}, ${email}`, // Send to both owner and customer
        subject: `Xác nhận đặt chuyến - ${name}`,
        html: `
            <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <div style="width: 70px; height: 70px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 15px; line-height: 70px;">
                <span style="font-size: 32px;">🚗</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Xác Nhận Đặt Xe</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;">Yêu cầu của bạn đã được tiếp nhận</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px;">
              <p style="margin: 0; color: #333; font-size: 16px; line-height: 1.6;">
                Xin chào <strong style="color: #1e88e5;">${name}</strong>,
              </p>
              <p style="margin: 15px 0 0; color: #666; font-size: 15px; line-height: 1.6;">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Dưới đây là thông tin chi tiết chuyến đi của bạn:
              </p>
            </td>
          </tr>

          <!-- Booking Details Card -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e3eaf2;">
                
                <!-- Pickup -->
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e3eaf2;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 36px; height: 36px; background-color: #e3f2fd; border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="font-size: 18px;">📍</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Điểm đón</p>
                          <p style="margin: 4px 0 0; color: #1e293b; font-size: 15px; font-weight: 500;">${pickup}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Destination -->
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e3eaf2;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 36px; height: 36px; background-color: #e8f5e9; border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="font-size: 18px;">🎯</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Điểm đến</p>
                          <p style="margin: 4px 0 0; color: #1e293b; font-size: 15px; font-weight: 500;">${destination}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Date Time -->
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e3eaf2;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 36px; height: 36px; background-color: #fff3e0; border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="font-size: 18px;">📅</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Ngày giờ</p>
                          <p style="margin: 4px 0 0; color: #1e293b; font-size: 15px; font-weight: 500;">${date}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Vehicle & Passengers Row -->
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e3eaf2;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 100%; vertical-align: top;">
                          <table role="presentation">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <div style="width: 36px; height: 36px; background-color: #f3e5f5; border-radius: 8px; text-align: center; line-height: 36px;">
                                  <span style="font-size: 18px;">👥</span>
                                </div>
                              </td>
                              <td style="padding-left: 12px;">
                                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Số khách</p>
                                <p style="margin: 4px 0 0; color: #1e293b; font-size: 15px; font-weight: 500;">${passengers} người</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Phone -->
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 36px; height: 36px; background-color: #e0f2f1; border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="font-size: 18px;">📞</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Số điện thoại</p>
                          <p style="margin: 4px 0 0; color: #1e293b; font-size: 15px; font-weight: 500;">${phone}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Notes Section -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #e3f2fd; border-left: 4px solid #1e88e5; padding: 16px 20px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #1565c0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📝 Ghi chú</p>
                <p style="margin: 8px 0 0; color: #0d47a1; font-size: 14px; line-height: 1.5;">${notes}</p>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="border-top: 1px solid #e3eaf2;"></div>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 25px 30px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                Có thắc mắc? Liên hệ với chúng tôi
              </p>
              <p style="margin: 10px 0 0;">
                <a href="tel:0972873688" style="color: #1e88e5; text-decoration: none; font-weight: 600;">📞 0972873688</a>
                <span style="color: #ccc; margin: 0 10px;">|</span>
                <a href="mailto:dungdtp201@gmail.com" style="color: #1e88e5; text-decoration: none; font-weight: 600;">✉️ dungdtp201@gmail.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f0f4f8; padding: 25px 30px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 10px 0 0; color: #94a3b8; font-size: 11px;">
                Bạn nhận được email này vì đã đặt xe trên hệ thống của chúng tôi.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        res.status(200).json({ success: true, message: "Đã nhận yêu cầu! Email xác nhận đã được gửi." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Lỗi xử lý yêu cầu. Vui lòng thử lại." });
    }
});

// Capture all other routes and return the index.html from static folder
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
module.exports = app;
