export const APP = Object.freeze({
  ENV: {
    LOCAL: "local",
    DEV: "devlopment",
    QA: "qa",
    STAGING: "staging",
    PROD: "production",
  },
  LIMIT: 10,
  STATUS: {
    ACTIVE: 1,
    INACTIVE: 2,
    DELETED: 3,
  },
  USERROLE: {
    EMPLOYEE: 2,
    ADMIN: 1,
  },
  SALT_ROUND: 10,
  SESSION: {
    INACTIVE: 0,
    ACTIVE: 1,
  },
  PROFILE_STATUS: {
    NOT_SET: 0,
  },

  EMAIL_VERIFIED: {
    NO: 0,
    YES: 1,
  },
  RANDOM_STRING_LENGTH: 10,
});
