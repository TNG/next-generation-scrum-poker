export const getTtl = (expiryTimeHours: string): number =>
  Math.floor(Date.now() / 1000 + parseFloat(expiryTimeHours) * 60 * 60);
