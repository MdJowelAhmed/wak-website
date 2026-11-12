import { describe, expect, it } from "vitest";
import { getProductCardPricing } from "../../helpers/product-pricing";

describe("getProductCardPricing", () => {
  it("treats invalid discounts as regular price", () => {
    expect(getProductCardPricing(100, 0)).toEqual({
      currentPrice: 100,
      discount: 0,
    });
    expect(getProductCardPricing(100, 120)).toEqual({
      currentPrice: 100,
      discount: 0,
    });
    expect(getProductCardPricing(100, 100)).toEqual({
      currentPrice: 100,
      discount: 0,
    });
  });

  it("computes sale price when discount is lower than list", () => {
    expect(getProductCardPricing(100, 80)).toEqual({
      currentPrice: 80,
      originalPrice: 100,
      discount: 20,
    });
  });
});
