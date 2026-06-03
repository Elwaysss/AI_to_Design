export interface ProductPage {
  id: string
  title: string
  route: string
  role: string
  summary: string
}

export interface ProductSpec {
  productName: string
  slug: string
  pages: ProductPage[]
  representativePageId: string
}
