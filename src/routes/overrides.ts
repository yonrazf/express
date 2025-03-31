import { Router, Request, Response } from "express";
import { withAuthentication } from "@frontegg/client";
import { authenticator } from "../auth/authenticator";

const router = Router();

router.get("/overrides", (req: Request, res: Response) => {
  res.send({
    localizations: {
      en: {
        loginBox: {
          login: {
            signUpMessage: "",
          },
        },
      },
    },
    themeV2: {
      loginBox: {
        boxStyle: {
          boxShadow: "none",
        },
        boxFooter: {
          html: '<!DOCTYPE html>\n                        <html lang="en">\n                        <head>\n                            <meta charset="UTF-8">\n                            <meta name="viewport" content="width=device-width, initial-scale=1.0">\n                            <title>Login Page</title>\n                            <style>\n                                .footer-container {\n                                    display: flex;\n                                    flex-direction: column;\n                                    align-items: center;\n                                    gap: 20px;\n                                }\n                                .footer-text {\n                                    text-align: center;\n                                    margin-top: 30px;\n                                    color: #1C1D22;\n                                    font-family: \'DM Sans\';\n                                    font-size: 12px;\n                                    font-weight: 400;\n                                }\n                                .footer-link {\n                                    color: #1C1D22;\n                                    text-decoration: underline;\n                                }\n                                .footer-link:hover {\n                                    text-decoration: underline;\n                                }\n                                .contact-text {\n                                    font-family: \'DM Sans\';\n                                    font-size: 12px;\n                                    font-weight: 400;\n                                    color: #6947CF;\n                                }\n                                .contact-link {\n                                    color: #6947CF;\n                                    text-decoration: none;\n                                }\n                                .contact-link:hover {\n                                    color: #5029AB; /* Darker purple shade for hover, change as needed */\n                                }\n                            </style>\n                        </head>\n                        <body>\n                            <div class="footer-container">\n                                <div class="footer-text">\n                                    <p>\n                                        By signing in, I agree to the \n                                        <a href="" target="_blank" rel="noopener noreferrer" class="footer-link">Terms of Use</a> \n                                        and \n                                        <a href="" target="_blank" rel="noopener noreferrer" class="footer-link">Privacy Policy</a>.\n                                    </p>\n                                </div>\n                                <p class="contact-text">\n                                    Contact us: <a href="mailto:" class="contact-link">support@</a>\n                                </p>\n                            </div>\n                        </body>\n                        </html>                                       \n                    ',
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
            html: '<!DOCTYPE html>\n                            <html lang="en">\n                            <head>\n                                <meta charset="UTF-8">\n                                <meta name="viewport" content="width=device-width, initial-scale=1.0">\n                                <title>Login Page</title>\n                                <style>\n                                    .fe-page-side-element {\n                                        background-image: none !important;\n                                    }\n\n                                    .sideElementContainer {\n                                        pointer-events: none;\n                                        user-select: none;\n                                        width: 100%;\n                                        height: 100vh;\n                                        display: flex;\n                                        flex-direction: column;\n                                        justify-content: center;\n                                        align-items: center;\n                                        position: relative;\n                                    }\n                                    .sideElementLogo {\n                                        z-index: 10;\n                                    }\n                                    .sideElementDecorativeImage {\n                                        position: absolute;\n                                        top: 50%;\n                                        right: 0;\n                                        height: max(50%, 500px);\n                                        width: max(50%, 500px);\n                                        transform: translateY(-50%);\n                                        mix-blend-mode: multiply;\n                                    }\n                                </style>\n                            </head>\n                            <body>\n                                <div class="sideElementContainer">\n                                    <img src="https://blog.snappymob.com/wp-content/uploads/2020/12/8-Tips-for-Designing-Empty-Placeholder-Pages-Leni-Featured.png" alt="Login Text" class="sideElementLogo">\n                                    <img src="https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Decorative Background" class="sideElementDecorativeImage">\n                                </div>\n                            </body>\n                            </html>',
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
            "https://st2.depositphotos.com/4035913/6124/i/450/depositphotos_61243733-stock-illustration-business-company-logo.jpg",
        },
      },
    },
  });
});

export { router as MetadataRouter };
