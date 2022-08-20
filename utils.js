/*
 * UTILITY Fn:
 * Linear Interpolation:
 * get values between L(eft) & R(ight)
 * based on the p(ercent)
 *
 * L plus the difference times the percentage
 * when p is 0, you only have L
 * when p is 1, you're left with R
 *    (the minus-L will cancel-out the L)
 * so the output-values range from L to R
 */
function lerp(L,R,p) {
  return L+(R-L)*p;
}
