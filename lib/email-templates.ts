/**
 * Pre-compiled email templates
 * These are embedded directly in the code to work in Next.js production builds
 *
 * Template variables:
 * - %RECEIVER_NAME% - User's name (derived from email)
 * - %PLAN_TITLE% - Title of the training plan
 * - %PLAN_SUMMARY% - Brief summary of the plan
 * - %PROFILE_INTRO% - Profile intro paragraph with user details
 * - %EXERCISE_OVERVIEW% - Detailed exercise explanations
 * - %PROGRAM_SPLIT% - Quick A/B/C reference split
 * - %DETAILED_SESSIONS% - Full session details
 * - %SAFETY_NOTES% - Safety and prehab notes
 * - %PROGRESSION_RULES% - Progression guidelines
 * - %COACHING_CTA% - Personal coaching call-to-action
 */

export const TRAINING_PLAN_TEMPLATE = `<!doctype html>
<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title>Your Personalized Training Plan</title>
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }

    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 12px !important;
      }
      .content-padding {
        padding: 16px !important;
      }
      h1, .h1 {
        font-size: 24px !important;
      }
      h3, .h3 {
        font-size: 18px !important;
      }
    }

    /* Plan content styling */
    .plan-content h3 {
      color: #e65100;
      margin-top: 24px;
      margin-bottom: 12px;
    }

    .plan-content h4 {
      color: #e65100;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    .plan-content h5 {
      color: #333;
      margin-top: 12px;
      margin-bottom: 8px;
    }

    .plan-content ul {
      margin: 0;
      padding-left: 20px;
    }

    .plan-content li {
      margin-bottom: 6px;
    }

    .plan-content table {
      width: 100%;
    }

    .plan-content td {
      padding: 4px 8px 4px 0;
    }
  </style>
  <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
</head>

<body style="word-spacing:normal;background-color:#f4f4f4;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    %PLAN_TITLE% - Your custom partner acrobatics training program
  </div>
  
  <div aria-label="Your Personalized Training Plan" aria-roledescription="email" style="background-color:#f4f4f4;" role="article">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #e65100 0%, #ff8a50 100%);margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:30px 20px;text-align:center;">
              <div style="font-size:32px;font-weight:bold;line-height:1.4;text-align:center;color:#ffffff;">
                🤸 AcroWorld
              </div>
              <div style="font-size:14px;line-height:1.6;text-align:center;color:#ffcc80;margin-top:8px;">
                Partner Acrobatics Training Plans
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Main Content Container -->
    <div class="container" style="background:#ffffff;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;width:100%;">
        <tbody>
          <tr>
            <td class="content-padding" style="direction:ltr;font-size:0px;padding:32px 24px;text-align:left;">
              
              <!-- Greeting -->
              <div style="font-size:20px;line-height:1.6;color:#333333;margin-bottom:8px;">
                Hey %RECEIVER_NAME%! 👋
              </div>
              <div style="font-size:15px;line-height:1.7;color:#555555;margin-bottom:24px;">
                Your personalized partner acrobatics training plan is ready. This program was created specifically 
                for your profile and goals.
              </div>

              <!-- Plan Title -->
              <div style="background:linear-gradient(135deg, #fff5f0 0%, #ffe8e0 100%);border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
                <div class="h1" style="font-size:26px;font-weight:bold;line-height:1.4;color:#e65100;">
                  %PLAN_TITLE%
                </div>
                <div style="font-size:15px;font-style:italic;line-height:1.6;color:#666666;margin-top:12px;">
                  %PLAN_SUMMARY%
                </div>
              </div>

              <!-- Divider -->
              <div style="border-top:2px solid #ffcc80;margin:24px 0;"></div>

              <!-- Profile Intro -->
              <div class="plan-content">
                %PROFILE_INTRO%
              </div>

              <!-- Exercise Overview -->
              <div class="plan-content">
                %EXERCISE_OVERVIEW%
              </div>

              <!-- Divider -->
              <div style="border-top:1px solid #e0e0e0;margin:24px 0;"></div>

              <!-- Program Split (Quick Reference) -->
              <div class="plan-content">
                %PROGRAM_SPLIT%
              </div>

              <!-- Divider -->
              <div style="border-top:1px solid #e0e0e0;margin:24px 0;"></div>

              <!-- Detailed Sessions -->
              <div class="plan-content">
                %DETAILED_SESSIONS%
              </div>

              <!-- Safety Notes -->
              <div class="plan-content">
                %SAFETY_NOTES%
              </div>

              <!-- Progression Rules -->
              <div class="plan-content">
                %PROGRESSION_RULES%
              </div>

              <!-- Divider -->
              <div style="border-top:2px solid #ffcc80;margin:32px 0;"></div>

              <!-- Coaching CTA -->
              <div class="plan-content">
                %COACHING_CTA%
              </div>

              <!-- Final CTA -->
              <div style="text-align:center;padding:24px 0;">
                <div style="font-size:16px;line-height:1.6;color:#666666;">
                  Ready to start your training journey? 💪
                </div>
                <div style="font-size:14px;line-height:1.6;color:#888888;margin-top:8px;">
                  Print this plan or save it for easy reference during your sessions.
                </div>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#333333;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#333333;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:30px 20px;text-align:center;">
              <div style="font-size:16px;font-weight:bold;line-height:1.6;color:#ffffff;">
                Happy Training! 🤸
              </div>
              <div style="font-size:12px;line-height:1.6;color:#999999;margin-top:16px;">
                Created by AcroWorld<br>
                Your partner acrobatics training companion
              </div>
              <div style="font-size:11px;line-height:1.6;color:#666666;margin-top:20px;">
                You received this email because you requested a training plan from AcroWorld.<br>
                © 2026 AcroWorld. All rights reserved.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</body>

</html>`;
