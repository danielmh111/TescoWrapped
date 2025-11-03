# Tesco Wrapped 2025

A Spotify Wrapped-style dashboard for visualizing your Tesco supermarket transaction data. This interactive, scrollable dashboard presents your shopping habits in a fun, visually appealing way.

## Features

- **Scrollable Card Interface**: Instagram story-style navigation through your shopping insights
- **Vibrant Design**: Bold gradients and smooth animations inspired by Spotify Wrapped 2024
- **Personalized Insights**: Your shopping patterns, favorite products, and fun facts
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for running the local server)

### Running the Dashboard

1. Open a terminal and navigate to the project directory:
   ```bash
   cd C:\Users\Daniel\Documents\TescoWrapped
   ```

2. Start the local HTTP server:
   ```bash
   python -m http.server 8000
   ```

3. Open your browser and go to:
   ```
   http://localhost:8000
   ```

4. Scroll down to explore your Tesco Wrapped!

### Alternative: Using Node.js

If you prefer Node.js, you can use `npx` to start a server:

```bash
npx http-server -p 8000
```

## What You'll See

The dashboard includes the following insights:

1. **Welcome Screen**: Personalized greeting
2. **Total Visits**: How many times you shopped at Tesco
3. **Total Spending**: Your yearly grocery budget
4. **Total Savings**: Money saved with Clubcard deals
5. **Favorite Store**: Your most-visited location
6. **Top Product**: Your most frequently purchased item
7. **Top 5 Items**: Your shopping essentials
8. **Shopping Personality**: Weekend Warrior or Weekday Regular?
9. **Busiest Month**: When you shopped the most
10. **Fun Facts**: Quirky statistics (like milk in bathtubs!)
11. **Payment Method**: Your preferred way to pay
12. **Year Summary**: A wrap-up of your shopping year

## Design Principles

Based on research of Spotify Wrapped 2024, this dashboard follows these key principles:

- **Typography as Hero**: Large, bold numbers and text as the main visual element
- **Vibrant Colors**: Dynamic gradients and solid colors that pop
- **Smooth Animations**: Fade-ins, scale effects, and floating elements
- **Story-Based Navigation**: Sequential revelation of insights
- **Shareability**: Each screen is screenshot-worthy
- **Emotional Connection**: Personal, fun, and engaging copy

## Data Structure

The dashboard analyzes synthetic Tesco transaction data including:

- Customer profile information
- Purchase history with timestamps
- Transaction details (store, basket value, savings)
- Product details (names, quantities, prices)
- Payment methods

## Technology Stack

- **HTML5**: Structure
- **CSS3**: Styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: Data processing and dynamic rendering
- **No dependencies**: Lightweight and fast

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Credits

Design inspired by Spotify Wrapped 2024, adapted for grocery shopping insights.

## License

This is a personal project for educational and entertainment purposes.
