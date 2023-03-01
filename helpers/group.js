/**
 * Edit modes
 */
export const HOLDER_ACCEPT = 1;
export const PARTICIPANT_ACCEPT = 2;
export const HOLDER_REQUEST = 3;
export const PARTICIPANT_REQUEST = 4;
export const SELF_VERIFY = 5;

/**
 * Verification statuses
 */
export const HOLDER_VERIFIED = 1;
export const PARTICIPANT_VERIFIED = 2;
export const BOTH_VERIFIED = 3;

export function getEditMode(userId, detail) {
  let isHolder = false;

  if (detail.group.holder == userId) {
    isHolder = true;
  }

  if (isHolder) {
    if (detail.user._id == userId) {
      return SELF_VERIFY;
    }

    if (
      detail.verified === HOLDER_VERIFIED ||
      detail.verified === BOTH_VERIFIED
    ) {
      return HOLDER_REQUEST;
    }

    return HOLDER_ACCEPT;
  } else {
    if (
      detail.verified === PARTICIPANT_VERIFIED ||
      detail.verified === BOTH_VERIFIED
    ) {
      return PARTICIPANT_REQUEST;
    }

    return PARTICIPANT_ACCEPT;
  }
}
