# Tesco Wrapped 2025 🎵🛒

## Project Overview

A "Spotify Wrapped" style experience for Tesco Clubcard shopping data. This project analyzes purchase history from 2025 and creates a beautiful, humorous, scrollable web experience showcasing shopping habits and key metrics.

## Data Source

- **File**: `data/synthetic_tesco_data.json`
- **Time Period**: January 2025 - October 2025
- **Customer**: Alex Smith (user@example.com)
- **Data Size**: 3,161 lines of JSON data

### Data Structure

```json
{
  "Customer Profile And Contact Data": {
    "Online Account": {
      "email address": "user@example.com",
      "surname": "Smith",
      "first name": "Alex",
      "title": "Mr"
    }
  },
  "Purchase": [[
    {
      "basketValueGross": "18.65",
      "basketValueNet": "17.45",
      "overallBasketSavings": "1.20",
      "purchaseType": "instore",
      "timeStamp": "2025-01-11 00:00:00",
      "storeId": "5121",
      "storeName": "LONDON KENSINGTON EXT",
      "storeFormat": "Extra",
      "storeAddress": "Cromwell Road,LONDON,GREATER LONDON",
      "paymentType": [{ 
        "type": "MASTERCARD_DEBIT", 
        "category": "Contactless", 
        "amount": "17.45" 
      }],
      "product": [
        {
          "name": "Tesco Finest Sourdough Bread 400G",
          "quantity": "1",
          "price": "2.20",
          "channel": "instore",
          "weightInGrams": "400",
          "volumeInLitres": "NA"
        }
      ]
    }
  ]]
}
```

## Key Metrics to Extract

### 💰 Spending Metrics
1. **Total Spend** - Overall amount spent at Tesco
2. **Average Basket Size** - Mean transaction value
3. **Biggest Single Shop** - Maximum transaction value
4. **Monthly Spend Breakdown** - Spending trends over time
5. **Total Savings** - Amount saved with Clubcard

### 🛒 Shopping Behavior
6. **Trip Count** - Total number of store visits
7. **Favorite Store** - Most frequently visited location
8. **Store Format Preference** - Express vs Metro vs Extra
9. **Night Owl Score** - Late night shopping habits (after 10pm)
10. **Busiest Shopping Month** - Peak spending period
11. **Payment Method Preference** - Most used payment type

### 🍫 Product Insights
12. **Top 5 Products** - Most frequently purchased items
13. **Flavor of the Summer** - Most bought item June-August
14. **Chocolate Obsession Index** - Total chocolate items purchased
15. **Unique Products** - Variety of different items bought
16. **Total Items** - Overall product count across all trips

## Design Aesthetic

### Color Palette
- **Primary**: Tesco Blue (`#00539F`)
- **Accent**: Tesco Red (`#EE2537`)
- **Background**: Dark gradients (Spotify Wrapped style)
- **Text**: White with opacity variations

### Typography
- **Headings**: Montserrat (Bold/Black weights)
- **Body**: Open Sans
- **Stats**: Large, gradient-colored numbers

### Layout Style
- Full-screen scrollable slides
- Smooth scroll-snap behavior
- Centered content with dramatic reveals
- Mobile responsive design

### Humorous Tone
- "Every little helps... you spend £X"
- "That's like a second home, but with more meal deals"
- "It's not a problem, it's a lifestyle"
- "We're not judging... okay, we're impressed"
- "Hot girl summer? More like [product] summer"

## Slide Structure

### Slide 1: Welcome
- Title: "Your Tesco Wrapped 2025"
- Subtitle: "Every little helps... spend a lot 😉"
- Background: Tesco Blue gradient

### Slide 2: Total Spend
- Metric: Total £ spent
- Context: "£X per trip"
- Fun fact: "Every little helps... the quarterly earnings!"

### Slide 3: Trip Count
- Metric: Number of visits
- Fun fact: "That's like a second home, but with more meal deals"

### Slide 4: Favorite Store
- Metric: Most visited store name
- Count: Number of visits
- Fun fact: "The staff probably know your name by now"

### Slide 5: Top Product
- Metric: #1 most purchased item
- Count: Number of times bought
- Fun fact: "It's not a problem, it's a lifestyle"

### Slide 6: Flavor of Summer
- Metric: Most bought item June-August
- Count: Summer purchase count
- Fun fact: "Hot girl summer? More like [product] summer"

### Slide 7: Chocolate Obsession
- Metric: Total chocolate items
- Fun fact: "We're not judging... okay, we're impressed"

### Slide 8: Night Owl Score
- Metric: Late-night trips (after 10pm)
- Fun fact: "Midnight munchies sorted! 🦉"

### Slide 9: Savings
- Metric: Total Clubcard savings
- Fun fact: "Financial genius right here 💰"

### Slide 10: Biggest Splurge
- Metric: Largest single transaction
- Additional stats: Average basket, unique products, payment method

### Slide 11: Finale
- Thank you message
- "See you at the checkouts, [Name]! 🛒"

## Technical Implementation

### Technology Stack
- **Language**: Python 3.x (standard library only)
- **Data Processing**: JSON parsing, datetime, collections
- **Output**: Static HTML with embedded CSS
- **Dependencies**: None (uses only stdlib)

### Python Script: `analyze_tesco_data.py`

**Key Functions:**
1. `load_data(filepath)` - Load JSON data
2. `analyze_tesco_data(data)` - Extract all metrics
3. `generate_html_report(insights, customer_name)` - Create HTML output

**Analysis Process:**
1. Parse purchase array
2. Iterate through each transaction
3. Extract timestamp, basket value, savings, products
4. Aggregate by month, hour, store, payment type
5. Identify patterns (chocolate, summer items, night shops)
6. Calculate statistics (mean, max, counts)
7. Generate HTML with embedded data

### Output: `tesco_wrapped.html`

**Features:**
- Scroll-snap container
- 11 full-screen slides
- Responsive design
- Gradient backgrounds
- Animated text reveals (via scroll)
- Embedded Tesco logo
- Mobile-friendly

## Usage Instructions

### Running the Analysis

```bash
python analyze_tesco_data.py
```

### Expected Output

```
🛒 Loading Tesco data...
📊 Analyzing your shopping habits...
🎨 Creating your Tesco Wrapped...

✨ Tesco Wrapped 2025 Generated! ✨

👤 Customer: Alex
💰 Total Spend: £XXX.XX
🛍️  Total Trips: XXX
💳 Total Savings: £XX.XX
🏆 Top Product: [Product Name] (XXx)
☀️  Summer Flavor: [Product Name] (XXx)
🏪 Favorite Store: [Store Name] (XX visits)

📄 Open 'tesco_wrapped.html' in your browser to see your full wrapped!
```

### Viewing Results

1. Open `tesco_wrapped.html` in any modern browser
2. Scroll down to see each slide
3. Experience the full Tesco Wrapped journey!

## Future Enhancements

### Potential Additions
- [ ] Shopping time heatmap (day of week × hour)
- [ ] Product category breakdown (food vs household vs clothing)
- [ ] Year-over-year comparisons
- [ ] Store location map visualization
- [ ] Seasonal spending patterns
- [ ] "You vs Average Tesco Customer" comparisons
- [ ] Social sharing functionality
- [ ] Animated transitions between slides
- [ ] Background music (Tesco jingle remix?)
- [ ] Print/PDF export option

### Advanced Analytics
- [ ] Product recommendation engine based on purchase history
- [ ] Basket composition analysis (healthy vs treats ratio)
- [ ] Brand loyalty metrics (Tesco own-brand vs name brands)
- [ ] Meal planning insights (breakfast/lunch/dinner patterns)
- [ ] Carbon footprint estimation
- [ ] Nutritional analysis (if nutritional data available)

## Project Structure

```
TescoWrapped/
├── data/
│   └── Tesco-Customer-Data-20190925.json
├── analyze_tesco_data.py
├── tesco_wrapped.html (generated)
├── requirements.txt
├── CLAUDE.md (this file)
├── AGENTS.md
├── KNOWLEDGE.md
├── RULES.md
└── tessl.json
```

## Notes

- Data is anonymized with `[REDACTED]` fields for privacy
- All purchases are in-store (no online delivery data)
- Currency is GBP (£)
- Timestamps are in format: `YYYY-MM-DD HH:MM:SS`
- No external dependencies required - uses only Python standard library

## Inspiration

This project combines:
- **Spotify Wrapped**: Scrollable slides, bold stats, humorous tone
- **Tesco Branding**: Blue/red colors, "Every little helps" tagline
- **Data Visualization**: Making grocery shopping data fun and engaging

The goal is to create a shareable, entertaining visualization that makes mundane grocery data feel exciting and personal - just like Spotify does with music listening habits.

---

*Every little helps make this project amazing! 🛒✨*
