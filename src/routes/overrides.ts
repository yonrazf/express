import { Router, Request, Response } from "express";
import { FronteggAppOptions } from "@frontegg/types";
import { withAuthentication } from "@frontegg/client";
import { authenticator } from "../auth/authenticator";

const router = Router();

const localizations: FronteggAppOptions["localizations"] = {
  en: {
    loginBox: {
      login: {
        title: "title",
        signUpMessage: "signUpMessage",
        signUpLink: "signUpLink",
        forgotPassword: "forgotPassword",
        emailInputLabel: "emailInputLabel",
        emailInputPlaceholder: "emailInputPlaceholder",
        emailMustBeValid: "emailMustBeValid",
        emailIsRequired: "emailIsRequired",
        passwordInputLabel: "passwordInputLabel",
        passwordInputPlaceholder: "passwordInputPlaceholder",
        passwordMustBeCharacters: "passwordMustBeCharacters",
        passwordIsRequired: "passwordIsRequired",
        login: "login",
        continue: "continue",
        invalidTitle: "invalidTitle",
        signInWithSocialLogin: "signInWithSocialLogin",
        backToLogin: "backToLogin",
        mfaTitle: "mfaTitle",
        mfaSubtitle: "mfaSubtitle",
        mfaAuthenticatorTitle: "mfaAuthenticatorTitle",
        mfaInputLabel: "mfaInputLabel",
        mfaCodeIsRequired: "mfaCodeIsRequired",
        mfaCodeLengthAtLeast6: "mfaCodeLengthAtLeast6",
        twoFactorCodeIsRequired: "twoFactorCodeIsRequired",
        twoFactorCodeLengthAtLeast8: "twoFactorCodeLengthAtLeast8",
        mfaRememberThisDevice: "mfaRememberThisDevice",
        mfaRememberLongerThenYear: "mfaRememberLongerThenYear",
        disableMultiFactorTitle: "disableMultiFactorTitle",
        disableMultiFactorMessage: "disableMultiFactorMessage",
        recoverMfaTitle: "recoverMfaTitle",
        recoverMfaMessage: "recoverMfaMessage",
        disabledMultiFactorClickHereButton:
          "disabledMultiFactorClickHereButton",
        enterRecoveryCode: "enterRecoveryCode",
        disabledMultiFactorButton: "disabledMultiFactorButton",
        missingPolicyErrorMessage: "missingPolicyErrorMessage",
        magicLinkTitle: "magicLinkTitle",
        magicLinkText: "magicLinkText",
        magicLinkResend: "magicLinkResend",
        magicLinkResending: "magicLinkResending",
        invalidMagicLinkTitle: "invalidMagicLinkTitle",
        invalidMagicLinkText: "invalidMagicLinkText",
        smsOtcTitle: "smsOtcTitle",
        smsOtcMessage: "smsOtcMessage",
        smsOtcChangePhoneMessage: "smsOtcChangePhoneMessage",
        otcTitle: "otcTitle",
        otcMessage: "otcMessage",
        otcInputLabel: "otcInputLabel",
        otcInputPlaceholder: "otcInputPlaceholder",
        otcCodeIsRequired: "otcCodeIsRequired",
        otcContinue: "otcContinue",
        otcHaventReceivedCode: "otcHaventReceivedCode",
        otcResend: "otcResend",
        otcResending: "otcResending",
        otcInvalidLengthCode: "otcInvalidLengthCode",
        ssoRedirectToMessage: "ssoRedirectToMessage",
        failedOicdLoginTitle: "failedOicdLoginTitle",
        failedOicdBackToLogin: "failedOicdBackToLogin",
        failedSamlDefaultError: "failedSamlDefaultError",
        failedSamlBackToLogin: "failedSamlBackToLogin",
        joinTenantTitle: "joinTenantTitle",
        failedJoinTenantTitle: "failedJoinTenantTitle",
        failedJoinTenantBackButton: "failedJoinTenantBackButton",
        forceMfaTitle: "forceMfaTitle",
        forceMfaMessage: "forceMfaMessage",
        forceMfaScanQueryDescription1: "forceMfaScanQueryDescription1",
        forceMfaScanQueryDescription2: "forceMfaScanQueryDescription2",
        forceMfaInputLabel: "forceMfaInputLabel",
        forceMfaInputPlaceholder: "forceMfaInputPlaceholder",
        forceMfaVerifyButton: "forceMfaVerifyButton",
        forceMfaRememberThisDevice: "forceMfaRememberThisDevice",
        forceMfaRememberLongerThenYear: "forceMfaRememberLongerThenYear",

        disclaimerText: "disclaimerText",
        termsLinkText: "termsLinkText",
        termsLink: "termsLink",
        privacyLinkText: "privacyLinkText",
        privacyLink: "privacyLink",
        termsAndPrivacyConjunctionText: "termsAndPrivacyConjunctionText",
        oneTouchLoginTitle: "oneTouchLoginTitle",
        oneTouchLoginMessage: "oneTouchLoginMessage",
        oneTouchLoginButton: "oneTouchLoginButton",
        touchId: "touchId",
        androidLoginTitle: "androidLoginTitle",
        androidLoginMessage: "androidLoginMessage",
        androidLoginButton: "androidLoginButton",
        android: "android",
        usbLoginTitle: "usbLoginTitle",
        usbLoginMessage: "usbLoginMessage",
        usbLoginButton: "usbLoginButton",
        usb: "usb",
        smsLoginTitle: "smsLoginTitle",
        smsLoginMessage: "smsLoginMessage",
        smsLoginButton: "smsLoginButton",
        sms: "sms",
        smsLoginChangePhoneTitle: "smsLoginChangePhoneTitle",
        smsLoginChangePhoneMessage: "smsLoginChangePhoneMessage",
        smsLoginChangePhoneInputLabel: "smsLoginChangePhoneInputLabel",
        smsLoginChangePhoneButton: "smsLoginChangePhoneButton",
        smsLoginPinTitle: "smsLoginPinTitle",
        smsLoginPinMessage: "smsLoginPinMessage",
        smsLoginPinButton: "smsLoginPinButton",
        loginWelcomeTitle: "loginWelcomeTitle",
        loginWelcomeSubtitleSubtitle: "loginWelcomeSubtitleSubtitle",
        loginWelcomeKnownUserSubtitle: "loginWelcomeKnownUserSubtitle",
        registerNewQuickLoginTitle: "registerNewQuickLoginTitle",
        registerNewQuickLoginTitleWithSocial:
          "registerNewQuickLoginTitleWithSocial",
        registerNewQuickLoginSubtitle: "registerNewQuickLoginSubtitle",
        phoneIsRequired: "phoneIsRequired",
        phoneIsInvalid: "phoneIsInvalid",
        forceEnrollMfaTitle: "forceEnrollMfaTitle",
        forceEnrollMfaSubtitle: "forceEnrollMfaSubtitle",
        forceEnrollMfaAuthenticatorApp: "forceEnrollMfaAuthenticatorApp",
        forceEnrollMfaAuthenticatorAppDescription:
          "forceEnrollMfaAuthenticatorAppDescription",
        forceEnrollMfaSMS: "forceEnrollMfaSMS",
        forceEnrollMfaPlatform: "forceEnrollMfaPlatform",
        forceEnrollMfaCrossPlatform: "forceEnrollMfaCrossPlatform",
        forceEnrollMfaCrossPlatformDescription:
          "forceEnrollMfaCrossPlatformDescription",
        preEnrollMfaSMSTitle: "preEnrollMfaSMSTitle",
        preEnrollMfaSMSSubtitle: "preEnrollMfaSMSSubtitle",
        preEnrollMfaSMSSubmitButtonMessage:
          "preEnrollMfaSMSSubmitButtonMessage",
        mfaSMSTitle: "mfaSMSTitle",
        mfaSMSSubtitle: "mfaSMSSubtitle",
        mfaSMSResendCode: "mfaSMSResendCode",
        enrollMfaSMSBackMessage: "enrollMfaSMSBackMessage",
        moreWaysToAuthenticate: "moreWaysToAuthenticate",
        loginMfaSMS: "loginMfaSMS",
        loginMfaSMSDescription: "loginMfaSMSDescription",
        loginMfaPlatform: "loginMfaPlatform",
        loginMfaPlatformDescription: "loginMfaPlatformDescription",
        loginMfaCrossPlatform: "loginMfaCrossPlatform",
        loginMfaCrossPlatformDescription: "loginMfaCrossPlatformDescription",
        loginMfaAuthenticatorApp: "loginMfaAuthenticatorApp",
        loginMfaAuthenticatorAppDescription:
          "loginMfaAuthenticatorAppDescription",
        loginMfaAuthenticatorAppTitle: "loginMfaAuthenticatorAppTitle",
        loginMfaHelpMessage: "loginMfaHelpMessage",
        useRecoveryCode: "useRecoveryCode",
      },
      socialLogins: {
        socialloginMainButtonTextPrefix: "socialloginMainButtonTextPrefix",
        socialloginButtonTextPrefix: "socialloginButtonTextPrefix",
        socialsignUpMainButtonTextPrefix: "socialsignUpMainButtonTextPrefix",
        socialsignUpButtonTextPrefix: "socialsignUpButtonTextPrefix",
        socialactivationMainButtonTextPrefix:
          "socialactivationMainButtonTextPrefix",
        socialactivationButtonTextPrefix: "socialactivationButtonTextPrefix",
        invalidTitle: "invalidTitle",
        failedBackToLogin: "failedBackToLogin",
        failedInvalidCallbackUrl: "failedInvalidCallbackUrl",
      },
      signup: {
        title: "title",
        firstNameInputLabel: "firstNameInputLabel",
        firstNameInputPlaceholder: "firstNameInputPlaceholder",
        lastNameInputLabel: "lastNameInputLabel",
        lastNameInputPlaceholder: "lastNameInputPlaceholder",
        emailInputLabel: "emailInputLabel",
        emailInputPlaceholder: "emailInputPlaceholder",
        passwordInputLabel: "passwordInputLabel",
        passwordInputPlaceholder: "passwordInputPlaceholder",
        confirmPasswordInputLabel: "confirmPasswordInputLabel",
        confirmPasswordInputPlaceholder: "confirmPasswordInputPlaceholder",
        signupButtonText: "signupButtonText",
      },
      forgetPassword: {
        title: "title",
        description: "description",
        emailInputLabel: "emailInputLabel",
        emailInputPlaceholder: "emailInputPlaceholder",
        emailMustBeValid: "emailMustBeValid",
        emailIsRequired: "emailIsRequired",
        submitButtonText: "submitButtonText",
        backToLogin: "backToLogin",
        resetEmailSentTitle: "resetEmailSentTitle",
        resetEmailSentMessage: "resetEmailSentMessage",
      },
    },
  },
};

const themeV2: FronteggAppOptions["themeOptions"] = {
  loginBox: {
    boxStyle: {
      boxShadow: "none",
    },
  },
};

router.get("/overrides", (req: Request, res: Response) => {
  res.send({
    localizations,
    themeV2,
  });
});

export { router as MetadataRouter };
