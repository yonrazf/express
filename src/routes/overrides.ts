import { Router, Request, Response } from "express";
import { withAuthentication } from "@frontegg/client";

const router = Router();

router.get("/overrides", (req: Request, res: Response) => {
  res.send({
    localizations: {
      en: {},
    },
    themeV2: {
      loginBox: {
        boxStyle: {
          boxShadow: "none",
        },
        boxFooter: {
          html: '<!DOCTYPE html>\n                        <html lang="en">\n                        <head>\n                            <meta charset="UTF-8">\n                            <meta name="viewport" content="width=device-width, initial-scale=1.0">\n                            <title>Login Page</title>\n                            <style>\n                                .footer-container {\n                                    display: flex;\n                                    flex-direction: column;\n                                    align-items: center;\n                                    gap: 20px;\n                                }\n                                .footer-text {\n                                    text-align: center;\n                                    margin-top: 30px;\n                                    color: #1C1D22;\n                                    font-family: \'DM Sans\';\n                                    font-size: 12px;\n                                    font-weight: 400;\n                                }\n                                .footer-link {\n                                    color: #1C1D22;\n                                    text-decoration: underline;\n                                }\n                                .footer-link:hover {\n                                    text-decoration: underline;\n                                }\n                                .contact-text {\n                                    font-family: \'DM Sans\';\n                                    font-size: 12px;\n                                    font-weight: 400;\n                                    color: #6947CF;\n                                }\n                                .contact-link {\n                                    color: #6947CF;\n                                    text-decoration: none;\n                                }\n                                .contact-link:hover {\n                                    color: #5029AB; /* Darker purple shade for hover, change as needed */\n                                }\n                            </style>\n                        </head>\n                        <body>\n                            <div class="footer-container">\n                                <div class="footer-text">\n                                    <p>\n                                        By signing in, I agree to the \n                                        <a href="https://www.prompt.security/policies/saas-terms-of-use" target="_blank" rel="noopener noreferrer" class="footer-link">Terms of Use</a> \n                                        and \n                                        <a href="https://www.prompt.security/policies/privacy-policy" target="_blank" rel="noopener noreferrer" class="footer-link">Privacy Policy</a>.\n                                    </p>\n                                </div>\n                                <p class="contact-text">\n                                    Contact us: <a href="mailto:support@prompt.security" class="contact-link">support@prompt.security</a>\n                                </p>\n                            </div>\n                        </body>\n                        </html>                                       \n                    ',
          type: "inline",
        },
        login: {
          disclaimer: {
            textStyle: {
              display: "none",
            },
          },
        },
        inputTheme: {
          base: {
            borderRadius: "8px",
          },
        },
        passkeysButtonTheme: {
          hover: {
            backgroundColor: "#0C1A40",
            color: "#FFFFFF",
          },
          base: {
            color: "#737582",
            background: "#DDDEE3",
          },
        },
        submitButtonTheme: {
          base: {
            backgroundColor: "#6947CF",
          },
          hover: {
            backgroundColor: "#0C1A40",
          },
        },
        layout: {
          type: "float-left",
          splitSize: 50,
          sideElement: {
            html: '<!DOCTYPE html>\n                            <html lang="en">\n                            <head>\n                                <meta charset="UTF-8">\n                                <meta name="viewport" content="width=device-width, initial-scale=1.0">\n                                <title>Login Page</title>\n                                <style>\n                                    .fe-page-side-element {\n                                        background-image: none !important;\n                                    }\n\n                                    .sideElementContainer {\n                                        pointer-events: none;\n                                        user-select: none;\n                                        width: 100%;\n                                        height: 100vh;\n                                        display: flex;\n                                        flex-direction: column;\n                                        justify-content: center;\n                                        align-items: center;\n                                        position: relative;\n                                    }\n                                    .sideElementLogo {\n                                        z-index: 10;\n                                    }\n                                    .sideElementDecorativeImage {\n                                        position: absolute;\n                                        top: 50%;\n                                        right: 0;\n                                        height: max(50%, 500px);\n                                        width: max(50%, 500px);\n                                        transform: translateY(-50%);\n                                        mix-blend-mode: multiply;\n                                    }\n                                </style>\n                            </head>\n                            <body>\n                                <div class="sideElementContainer">\n                                    <img src="https://ps-public-resources.s3.eu-north-1.amazonaws.com/login-text.svg" alt="Login Text" class="sideElementLogo">\n                                    <img src="https://ps-public-resources.s3.eu-north-1.amazonaws.com/prompt-icon-background.svg" alt="Decorative Background" class="sideElementDecorativeImage">\n                                </div>\n                            </body>\n                            </html>',
            type: "inline",
          },
        },
        rootStyle: {
          background: "linear-gradient(180deg, #26115D 0%, #8C6AE7 100%)",
        },
        boxMessageStyle: {
          display: "none",
        },
        boxTitleStyle: {
          display: "none",
        },
        logo: {
          image:
            "https://cdn.prod.website-files.com/671a5fabfac952255b7e6de4/671a5fabfac952255b7e6f62_Prompt%20Logo%20Main.svg",
        },
      },
    },
  });
});

export { router as MetadataRouter };
