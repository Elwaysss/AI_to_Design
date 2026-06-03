import type { ProductSpec } from '../types/product-spec'
import fixture from '../fixtures/generic-product-spec.json'

/** Load product spec — MVP uses built-in fixture; replace with platform API later. */
export async function loadProductSpec(_slug?: string): Promise<ProductSpec> {
  return fixture as ProductSpec
}

/** Synchronous access for components that already have fixture data. */
export function loadProductSpecSync(): ProductSpec {
  return fixture as ProductSpec
}
