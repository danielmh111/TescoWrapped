// Tesco Wrapped 2025 - Data Analysis and Visualization

let transactionData = null;

// Load and process data
async function loadData() {
    try {
        const response = await fetch('./data/synthetic_tesco_data.json');
        transactionData = await response.json();
        analyzeAndRender();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('container').innerHTML = '<div class="card gradient-1"><h1 class="card-title">Error loading data</h1></div>';
    }
}

// Analyze transaction data
function analyzeData() {
    const purchases = transactionData.Purchase[0];

    // Total spending
    const totalSpent = purchases.reduce((sum, p) => sum + parseFloat(p.basketValueNet), 0);

    // Total trips
    const totalTrips = purchases.length;

    // Total savings
    const totalSavings = purchases.reduce((sum, p) => sum + parseFloat(p.overallBasketSavings), 0);

    // Average basket size
    const avgBasket = totalSpent / totalTrips;

    // Biggest single shop
    const biggestShop = Math.max(...purchases.map(p => parseFloat(p.basketValueNet)));

    // Store frequency
    const storeFrequency = {};
    purchases.forEach(p => {
        const storeName = p.storeName;
        storeFrequency[storeName] = (storeFrequency[storeName] || 0) + 1;
    });
    const favoriteStore = Object.keys(storeFrequency).reduce((a, b) =>
        storeFrequency[a] > storeFrequency[b] ? a : b
    );
    const favoriteStoreCount = storeFrequency[favoriteStore];

    // Product analysis
    const productFrequency = {};
    const productSpending = {};
    let totalProducts = 0;
    let chocolateCount = 0;
    const uniqueProducts = new Set();

    purchases.forEach(purchase => {
        purchase.product.forEach(product => {
            const name = product.name;
            const qty = parseInt(product.quantity);
            const price = parseFloat(product.price);

            totalProducts += qty;
            uniqueProducts.add(name);
            productFrequency[name] = (productFrequency[name] || 0) + qty;
            productSpending[name] = (productSpending[name] || 0) + (price * qty);

            // Count chocolate products
            if (name.toLowerCase().includes('chocolate') ||
                name.toLowerCase().includes('choc ')) {
                chocolateCount += qty;
            }
        });
    });

    const topProduct = Object.keys(productFrequency).reduce((a, b) =>
        productFrequency[a] > productFrequency[b] ? a : b
    );
    const topProductCount = productFrequency[topProduct];

    // Time analysis
    const monthFrequency = {};
    const dayOfWeekFrequency = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let nightOwlTrips = 0;

    // Summer flavor (June-August)
    const summerProducts = {};

    // Monthly product tracking for spike detection
    const monthlyProductData = {}; // { productName: { 'January': count, 'February': count, ... } }

    purchases.forEach(p => {
        const date = new Date(p.timeStamp);
        const month = date.getMonth(); // 0-11
        const monthName = date.toLocaleString('default', { month: 'long' });
        const dayOfWeek = date.getDay();
        const hour = date.getHours();

        monthFrequency[monthName] = (monthFrequency[monthName] || 0) + 1;
        dayOfWeekFrequency[dayOfWeek]++;

        // Night owl check (after 10pm)
        if (hour >= 22) {
            nightOwlTrips++;
        }

        // Summer months (June=5, July=6, August=7)
        if (month >= 5 && month <= 7) {
            p.product.forEach(product => {
                const name = product.name;
                const qty = parseInt(product.quantity);
                summerProducts[name] = (summerProducts[name] || 0) + qty;
            });
        }

        // Track all products by month
        p.product.forEach(product => {
            const name = product.name;
            const qty = parseInt(product.quantity);

            if (!monthlyProductData[name]) {
                monthlyProductData[name] = {};
            }
            monthlyProductData[name][monthName] = (monthlyProductData[name][monthName] || 0) + qty;
        });
    });

    const busiestMonth = Object.keys(monthFrequency).reduce((a, b) =>
        monthFrequency[a] > monthFrequency[b] ? a : b
    );

    const favoriteDayIndex = Object.keys(dayOfWeekFrequency).reduce((a, b) =>
        dayOfWeekFrequency[a] > dayOfWeekFrequency[b] ? a : b
    );
    const favoriteDay = dayNames[favoriteDayIndex];

    // Summer flavor - most bought item in summer
    let summerFlavor = null;
    let summerFlavorCount = 0;
    if (Object.keys(summerProducts).length > 0) {
        summerFlavor = Object.keys(summerProducts).reduce((a, b) =>
            summerProducts[a] > summerProducts[b] ? a : b
        );
        summerFlavorCount = summerProducts[summerFlavor];
    }

    // Weekend vs Weekday
    const weekendTrips = dayOfWeekFrequency[0] + dayOfWeekFrequency[6];
    const weekdayTrips = totalTrips - weekendTrips;
    const shoppingPersonality = weekendTrips > weekdayTrips ? 'Weekend Warrior' : 'Weekday Regular';

    // Payment method
    const paymentMethods = {};
    purchases.forEach(p => {
        if (p.paymentType && p.paymentType.length > 0) {
            const method = p.paymentType[0].type;
            paymentMethods[method] = (paymentMethods[method] || 0) + 1;
        }
    });
    const favoritePayment = Object.keys(paymentMethods).reduce((a, b) =>
        paymentMethods[a] > paymentMethods[b] ? a : b
    );

    // Top 5 products
    const top5Products = Object.entries(productFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Spike detection - find product with most abnormal monthly variation
    let spikeProduct = null;
    let spikeMonth = null;
    let spikeData = null;
    let maxVariation = 0;

    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

    Object.keys(monthlyProductData).forEach(productName => {
        const monthlyData = monthlyProductData[productName];
        const monthlyValues = monthOrder.map(m => monthlyData[m] || 0);
        const totalCount = monthlyValues.reduce((a, b) => a + b, 0);

        // Only consider products purchased at least 10 times total
        if (totalCount < 10) return;

        // Calculate standard deviation and mean
        const mean = totalCount / monthlyValues.length;
        const variance = monthlyValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlyValues.length;
        const stdDev = Math.sqrt(variance);

        // Coefficient of variation (higher = more variable/spikey)
        const coefficientOfVariation = mean > 0 ? stdDev / mean : 0;

        if (coefficientOfVariation > maxVariation) {
            maxVariation = coefficientOfVariation;
            spikeProduct = productName;

            // Find the month with the highest count
            const maxMonthValue = Math.max(...monthlyValues);
            const maxMonthIndex = monthlyValues.indexOf(maxMonthValue);
            spikeMonth = monthOrder[maxMonthIndex];

            // Store monthly data
            spikeData = monthOrder.map((month, index) => ({
                month,
                count: monthlyValues[index]
            }));
        }
    });

    return {
        totalSpent,
        totalTrips,
        totalSavings,
        avgBasket,
        biggestShop,
        favoriteStore,
        favoriteStoreCount,
        topProduct,
        topProductCount,
        busiestMonth,
        favoriteDay,
        shoppingPersonality,
        favoritePayment,
        top5Products,
        totalProducts,
        uniqueProducts: uniqueProducts.size,
        chocolateCount,
        nightOwlTrips,
        summerFlavor,
        summerFlavorCount,
        spikeProduct,
        spikeMonth,
        spikeData,
        customerName: transactionData['Customer Profile And Contact Data']['Online Account']['first name']
    };
}

// Helper function to generate emoji bar chart HTML (vertical bars)
function generateEmojiBarChart(spikeData, emoji = '🍷') {
    if (!spikeData || spikeData.length === 0) return '';

    const maxCount = Math.max(...spikeData.map(d => d.count));

    return spikeData.map(data => {
        const barHeight = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
        const emojiCount = Math.max(1, Math.ceil(data.count / 3)); // Scale emojis
        const emojis = emoji.repeat(Math.min(emojiCount, 10)); // Cap at 10 emojis for vertical

        return `
            <div class="emoji-bar-column">
                <div class="emoji-bar-content" style="height: ${barHeight}%">
                    <span class="emoji-count">${data.count > 0 ? data.count : ''}</span>
                    <div class="emoji-icons">${data.count > 0 ? emojis : ''}</div>
                </div>
                <span class="emoji-bar-label">${data.month.substring(0, 3)}</span>
            </div>
        `;
    }).join('');
}

// Generate cards with humorous Tesco-themed content
function generateCards(insights) {
    const cards = [
        // Slide 1: Welcome
        {
            gradient: 'gradient-1',
            content: `
                <h1 class="card-title">Your Tesco Wrapped 2025</h1>
                <p class="card-subtitle">Every little helps... spend a lot 😉</p>
                <div class="bg-shape shape-1"></div>
                <div class="bg-shape shape-2"></div>
            `
        },
        // Slide 2: Total Spend
        {
            gradient: 'gradient-2',
            content: `
                <h2 class="card-title">You spent</h2>
                <div class="card-number">£${insights.totalSpent.toFixed(2)}</div>
                <p class="card-subtitle">£${insights.avgBasket.toFixed(2)} per trip</p>
                <p class="card-description">Every little helps... the quarterly earnings! 💰</p>
                <div class="bg-shape shape-1"></div>
                <div class="bg-shape shape-3"></div>
            `
        },
        // Slide 3: Trip Count
        {
            gradient: 'gradient-3',
            content: `
                <h2 class="card-title">You visited Tesco</h2>
                <div class="card-number">${insights.totalTrips}</div>
                <p class="card-subtitle">times this year</p>
                <p class="card-description">That's like a second home, but with more meal deals 🏠</p>
                <div class="bg-shape shape-2"></div>
            `
        },
        // Slide 4: Favorite Store
        {
            gradient: 'gradient-4',
            content: `
                <h2 class="card-title">Your go-to store</h2>
                <p class="card-subtitle">${insights.favoriteStore}</p>
                <div class="card-number">${insights.favoriteStoreCount}</div>
                <p class="card-description">visits - The staff probably know your name by now 👋</p>
                <div class="bg-shape shape-1"></div>
                <div class="bg-shape shape-3"></div>
            `
        },
        // Slide 5: Top Product
        {
            gradient: 'gradient-5',
            content: `
                <h2 class="card-title">Your most purchased item</h2>
                <p class="card-subtitle">${insights.topProduct}</p>
                <div class="card-number">${insights.topProductCount}×</div>
                <p class="card-description">It's not a problem, it's a lifestyle 😎</p>
                <div class="bg-shape shape-2"></div>
            `
        },
        // Slide 6: Flavor of Summer (if available)
        insights.summerFlavor ? {
            gradient: 'gradient-6',
            content: `
                <h2 class="card-title">Your Flavor of the Summer 🍓</h2>
                <p class="card-subtitle">${insights.summerFlavor}</p>
                <div class="card-number">${insights.summerFlavorCount}×</div>
                <p class="card-description">Hot girl summer? More like strawberry summer ☀️</p>
                <div class="bg-shape shape-1"></div>
            `
        } : null,
        // Slide 6.5: Spike Product with Emoji Bar Chart
        insights.spikeProduct ? {
            gradient: 'gradient-11',
            content: `
                <h2 class="card-title">${insights.spikeMonth} Called...</h2>
                <p class="card-subtitle">It wants its ${insights.spikeProduct.split(' ').slice(-2, -1)[0].toLowerCase()} back 🍾</p>
                <div class="emoji-bar-chart">
                    ${generateEmojiBarChart(insights.spikeData, '🍷')}
                </div>
                <p class="card-description" style="margin-top: 20px;">
                    Someone was stocking up! ${insights.spikeData.find(d => d.month === insights.spikeMonth)?.count || 0} bottles in ${insights.spikeMonth} 🎉
                </p>
                <div class="bg-shape shape-2"></div>
            `
        } : null,
        // Slide 7: Chocolate Obsession
        insights.chocolateCount > 0 ? {
            gradient: 'gradient-7',
            content: `
                <h2 class="card-title">Chocolate Obsession Index</h2>
                <div class="card-number">${insights.chocolateCount}</div>
                <p class="card-subtitle">chocolate items purchased</p>
                <p class="card-description">We're not judging... okay, we're impressed 🍫</p>
                <div class="bg-shape shape-3"></div>
            `
        } : null,
        // Slide 8: Night Owl Score
        insights.nightOwlTrips > 0 ? {
            gradient: 'gradient-8',
            content: `
                <h2 class="card-title">Night Owl Score</h2>
                <div class="card-number">${insights.nightOwlTrips}</div>
                <p class="card-subtitle">late-night trips (after 10pm)</p>
                <p class="card-description">Midnight munchies sorted! 🦉</p>
                <div class="bg-shape shape-1"></div>
                <div class="bg-shape shape-2"></div>
            `
        } : null,
        // Slide 9: Savings
        {
            gradient: 'gradient-9',
            content: `
                <h2 class="card-title">Total Clubcard Savings</h2>
                <div class="card-number">£${insights.totalSavings.toFixed(2)}</div>
                <p class="card-description">Financial genius right here 💰</p>
                <div class="bg-shape shape-3"></div>
            `
        },
        // Slide 10: Biggest Splurge
        {
            gradient: 'gradient-10',
            content: `
                <h2 class="card-title">Your Biggest Splurge</h2>
                <div class="card-number">£${insights.biggestShop.toFixed(2)}</div>
                <p class="card-description">
                    You bought ${insights.uniqueProducts} unique products across the year<br>
                    Favorite payment: ${insights.favoritePayment.replace(/_/g, ' ')}
                </p>
                <div class="bg-shape shape-1"></div>
            `
        },
        // Slide 11: Finale
        {
            gradient: 'gradient-12',
            content: `
                <h2 class="card-title">See you at the checkouts, ${insights.customerName}! 🛒</h2>
                <p class="card-description" style="font-size: 1.8rem; margin-top: 40px;">
                    <strong>${insights.totalTrips}</strong> trips<br>
                    <strong>${insights.totalProducts}</strong> items<br>
                    <strong>£${insights.totalSpent.toFixed(2)}</strong> spent<br>
                    <strong>£${insights.totalSavings.toFixed(2)}</strong> saved
                </p>
                <p class="card-subtitle" style="margin-top: 50px;">Thanks for shopping with us! 💙</p>
                <div class="bg-shape shape-1"></div>
                <div class="bg-shape shape-2"></div>
                <div class="bg-shape shape-3"></div>
            `
        }
    ].filter(card => card !== null); // Remove null cards

    return cards;
}

// Render cards to DOM
function renderCards(cards) {
    const container = document.getElementById('container');
    container.innerHTML = '';

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.gradient}`;
        cardElement.innerHTML = card.content;
        container.appendChild(cardElement);
    });

    // Add intersection observer for animation triggers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// Main function
function analyzeAndRender() {
    const insights = analyzeData();
    const cards = generateCards(insights);
    renderCards(cards);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', loadData);
