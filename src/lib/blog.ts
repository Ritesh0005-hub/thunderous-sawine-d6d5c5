// Blog articles. Each block renders as a paragraph, heading, list or formula.
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'formula'; text: string }

export type BlogPost = {
  slug: string
  title: string
  description: string
  category: 'Business' | 'Finance' | 'Jewellery'
  readMinutes: number
  calculator: string
  body: Block[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-calculate-gst-in-india',
    title: 'How to Calculate GST in India',
    description: 'Add GST to a price, remove it from an inclusive amount, and understand the CGST/SGST split.',
    category: 'Business',
    readMinutes: 4,
    calculator: 'gst-calculator',
    body: [
      {
        type: 'p',
        text: 'Goods and Services Tax (GST) is charged on most goods and services sold in India. Whether you are preparing an invoice or checking a bill, there are two calculations you will use most: adding GST to a price, and finding the GST hidden inside a price that already includes it.',
      },
      { type: 'h2', text: 'Adding GST to a price' },
      { type: 'p', text: 'When your price excludes tax, multiply it by the GST rate to get the tax, then add it back.' },
      { type: 'formula', text: 'GST = Price × Rate ÷ 100    ·    Total = Price + GST' },
      { type: 'p', text: 'Example: a service priced at ₹10,000 with 18% GST has ₹1,800 of tax, so the customer pays ₹11,800.' },
      { type: 'h2', text: 'Removing GST from an inclusive price' },
      {
        type: 'p',
        text: 'A common mistake is to take 18% of the inclusive amount. That over-states the tax. Instead, divide by (100 + rate) to find the original price.',
      },
      { type: 'formula', text: 'Price before GST = Inclusive amount × 100 ÷ (100 + Rate)' },
      { type: 'p', text: 'Example: ₹11,800 including 18% GST works out to ₹11,800 × 100 ÷ 118 = ₹10,000, so the GST portion is ₹1,800.' },
      { type: 'h2', text: 'CGST, SGST and IGST' },
      {
        type: 'ul',
        items: [
          'Intra-state sales (buyer and seller in the same state): the GST is split equally into CGST and SGST. 18% GST becomes 9% CGST + 9% SGST.',
          'Inter-state sales: the full rate is charged as IGST.',
          'The total tax is the same either way — only the split changes.',
        ],
      },
      {
        type: 'p',
        text: 'GST rates are revised from time to time, and the right rate depends on the exact product or service. Always confirm the applicable rate from official GST sources or your tax adviser before invoicing.',
      },
    ],
  },
  {
    slug: 'how-to-calculate-profit-margin',
    title: 'How to Calculate Profit Margin',
    description: 'Understand profit, profit margin and why margin is always measured against the selling price.',
    category: 'Business',
    readMinutes: 3,
    calculator: 'profit-margin-calculator',
    body: [
      {
        type: 'p',
        text: 'Profit margin tells you how much of every rupee of sales you actually keep as profit. It is one of the quickest ways to judge whether a product or service is priced well.',
      },
      { type: 'h2', text: 'The formula' },
      { type: 'formula', text: 'Profit = Selling price − Cost    ·    Margin % = Profit ÷ Selling price × 100' },
      { type: 'p', text: 'Example: you buy a product for ₹800 and sell it for ₹1,000. Profit is ₹200, and the margin is ₹200 ÷ ₹1,000 = 20%.' },
      { type: 'h2', text: 'Why margin matters' },
      {
        type: 'ul',
        items: [
          'It lets you compare products with very different prices on equal terms.',
          'It shows how much room you have for discounts before you start losing money.',
          'Tracking it over time reveals rising costs before they hurt your business.',
        ],
      },
      { type: 'h2', text: 'Gross margin vs net margin' },
      {
        type: 'p',
        text: 'The calculation above is a gross margin — it only considers the direct cost of the item. Net margin also subtracts overheads like rent, salaries and marketing. Both are useful; just be clear which one you are using.',
      },
    ],
  },
  {
    slug: 'how-jewellery-prices-are-calculated',
    title: 'How Jewellery Prices Are Calculated',
    description: 'Gold rate, purity, making charges, wastage and GST — what goes into the price of gold jewellery.',
    category: 'Jewellery',
    readMinutes: 5,
    calculator: 'jewellery-price-calculator',
    body: [
      {
        type: 'p',
        text: 'Two pieces of jewellery with the same weight can have very different prices. That is because the final price is built from several parts, and each jeweller may charge them differently. Knowing the parts helps you compare quotes fairly.',
      },
      { type: 'h2', text: '1. Gold rate and purity' },
      {
        type: 'p',
        text: 'Gold purity is measured in karats. 24K is (nearly) pure gold. Jewellery is usually made from 22K, 18K or 14K gold, which contain a share of other metals for strength. Hallmarked purity is shown as fineness: 916 for 22K, 750 for 18K and 585 for 14K.',
      },
      { type: 'formula', text: 'Rate for your purity ≈ 24K rate × fineness  (e.g. × 0.916 for 22K)' },
      { type: 'h2', text: '2. Base gold value' },
      { type: 'formula', text: 'Base gold value = Weight (g) × Gold rate per gram' },
      { type: 'h2', text: '3. Making charges' },
      {
        type: 'p',
        text: 'Making charges pay for design and labour. They may be quoted as a percentage of the gold value, a fixed amount per gram, or a flat amount for the piece. Intricate designs usually carry higher making charges.',
      },
      { type: 'h2', text: '4. Wastage' },
      {
        type: 'p',
        text: 'Some jewellers add a wastage charge for gold lost while cutting, soldering and polishing. It is normally expressed as a percentage of the gold value. Not every jeweller charges it separately.',
      },
      { type: 'h2', text: '5. GST' },
      {
        type: 'p',
        text: 'GST is added on top. Gold jewellery has commonly attracted 3% GST, but treatment of making charges can differ, so check the current rules and the breakdown on your invoice.',
      },
      { type: 'formula', text: 'Final price = Base value + Making charges + Wastage + GST' },
      {
        type: 'ul',
        items: [
          'Ask for the gold rate, making charges and wastage to be listed separately.',
          'Check the hallmark and HUID on the piece.',
          'Stones, enamel and certification may be charged on top of the gold price.',
        ],
      },
    ],
  },
  {
    slug: 'how-loan-emi-works',
    title: 'How Loan EMI Works',
    description: 'What goes into your EMI, why early instalments are mostly interest, and how tenure changes total cost.',
    category: 'Finance',
    readMinutes: 4,
    calculator: 'loan-emi-calculator',
    body: [
      {
        type: 'p',
        text: 'An EMI (Equated Monthly Instalment) is the fixed amount you pay every month to repay a loan. Each EMI contains two parts: interest on the outstanding balance, and repayment of the principal.',
      },
      { type: 'h2', text: 'The EMI formula' },
      { type: 'formula', text: 'EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)' },
      {
        type: 'p',
        text: 'Here P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly instalments. For a ₹5,00,000 loan at 9% for 5 years, the EMI is about ₹10,379 and total interest is about ₹1,22,751.',
      },
      { type: 'h2', text: 'Why early EMIs are mostly interest' },
      {
        type: 'p',
        text: 'Interest is charged on the balance that is still outstanding. At the start the balance is highest, so more of each EMI goes to interest. As you repay, the interest part shrinks and the principal part grows.',
      },
      { type: 'h2', text: 'Tenure vs total cost' },
      {
        type: 'ul',
        items: [
          'A longer tenure lowers your EMI but increases the total interest you pay.',
          'A shorter tenure raises the EMI but saves interest overall.',
          'Prepayments reduce the outstanding balance and can cut total interest significantly — check your lender’s prepayment terms.',
        ],
      },
    ],
  },
  {
    slug: 'markup-vs-profit-margin',
    title: 'Markup vs Profit Margin',
    description: 'Two ways to describe the same profit — and why mixing them up leads to under-pricing.',
    category: 'Business',
    readMinutes: 3,
    calculator: 'markup-calculator',
    body: [
      {
        type: 'p',
        text: 'Markup and margin both describe profit as a percentage, but they use different bases. Markup compares profit to cost. Margin compares profit to selling price. Because the selling price is always higher than the cost (when you are profitable), margin is always the smaller number.',
      },
      { type: 'formula', text: 'Markup % = Profit ÷ Cost × 100    ·    Margin % = Profit ÷ Selling price × 100' },
      { type: 'h2', text: 'A quick example' },
      {
        type: 'p',
        text: 'An item costs ₹500 and you sell it for ₹750. Profit is ₹250. Markup is ₹250 ÷ ₹500 = 50%, while margin is ₹250 ÷ ₹750 ≈ 33.33%.',
      },
      { type: 'h2', text: 'The common pricing mistake' },
      {
        type: 'p',
        text: 'If you want a 30% margin and simply add 30% to your cost, you will only get a 23.08% margin. To hit a target margin, divide the cost by (1 − margin): ₹500 ÷ 0.70 = ₹714.29.',
      },
      {
        type: 'ul',
        items: ['25% markup = 20% margin', '50% markup ≈ 33.33% margin', '100% markup = 50% margin'],
      },
    ],
  },
]

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
