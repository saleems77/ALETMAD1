export const getCoupons = () => [
  { id: 1, code: "SUMMER20", discount: 20, expiresAt: "2025-08-31" },
  { id: 2, code: "WINTER10", discount: 10, expiresAt: "2025-12-31" },
];

export const validateCoupon = (code) => {
  const coupons = getCoupons();
  return coupons.some((coupon) => coupon.code === code);
};

export const generateCoupon = (discount, expiry) => ({
  code: `COUPON-${Math.floor(Math.random() * 10000)}`,
  discount,
  expiresAt: expiry,
});

export const generateInvitationLink = () => {
  const randomId = Math.floor(Math.random() * 10000);
  return `https://yourplatform.com/invite/${randomId}`;
};
