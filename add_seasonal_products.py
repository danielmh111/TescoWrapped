#!/usr/bin/env python3
"""
Script to add seasonal products to synthetic Tesco data:
- Strawberries with June-August spike
- Wine/Champagne with December spike
"""

import json
import random
from datetime import datetime

def load_data(filepath):
    """Load JSON data from file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data, filepath):
    """Save JSON data to file."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def add_strawberries(purchases):
    """Add strawberries to purchases with June-August spike."""
    added = 0

    for purchase in purchases:
        if not purchase:  # Skip empty purchases
            continue

        timestamp = purchase.get('timeStamp', '')
        if not timestamp:
            continue

        # Parse month from timestamp (format: "2025-MM-DD HH:MM:SS")
        try:
            date = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
            month = date.month
        except:
            continue

        # Decide whether to add strawberries based on month
        # June (6), July (7), August (8) - 80% chance
        # Other months - 15% chance
        if month in [6, 7, 8]:
            if random.random() < 0.80:  # 80% of summer transactions
                quantity = random.choice([1, 2, 2, 3])  # Weighted toward 2
            else:
                continue
        else:
            if random.random() < 0.15:  # 15% of other transactions
                quantity = 1
            else:
                continue

        # Add strawberry product
        strawberry = {
            "name": "Tesco British Strawberries 400G",
            "quantity": str(quantity),
            "channel": "instore",
            "weightInGrams": "400",
            "price": "2.75",
            "volumeInLitres": "NA"
        }

        purchase['product'].append(strawberry)

        # Update basket values
        item_cost = 2.75 * quantity
        current_net = float(purchase['basketValueNet'])
        current_gross = float(purchase['basketValueGross'])

        purchase['basketValueNet'] = f"{current_net + item_cost:.2f}"
        purchase['basketValueGross'] = f"{current_gross + item_cost + 0.10:.2f}"

        added += 1

    return added

def add_wine(purchases):
    """Add wine/champagne to purchases with balanced distribution across months."""
    added = 0

    for purchase in purchases:
        if not purchase:
            continue

        timestamp = purchase.get('timeStamp', '')
        if not timestamp:
            continue

        try:
            date = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
            month = date.month
        except:
            continue

        # Add wine to ~10% of transactions throughout the year
        if random.random() < 0.10:
            quantity = 1

            wine = {
                "name": "Tesco Finest Prosecco 75Cl",
                "quantity": str(quantity),
                "channel": "instore",
                "weightInGrams": "NA",
                "price": "7.00",
                "volumeInLitres": "0.75"
            }

            purchase['product'].append(wine)

            # Update basket values
            item_cost = 7.00 * quantity
            current_net = float(purchase['basketValueNet'])
            current_gross = float(purchase['basketValueGross'])

            purchase['basketValueNet'] = f"{current_net + item_cost:.2f}"
            purchase['basketValueGross'] = f"{current_gross + item_cost + 0.15:.2f}"

            added += 1

    return added

def add_december_transactions(data):
    """Add December transactions with heavy wine purchasing."""
    purchases = data['Purchase'][0]

    # Add 20 December transactions with lots of wine/champagne
    december_dates = [
        "2025-12-01 18:30:00", "2025-12-05 19:00:00", "2025-12-07 14:20:00",
        "2025-12-10 17:45:00", "2025-12-12 20:10:00", "2025-12-14 16:30:00",
        "2025-12-15 11:00:00", "2025-12-17 19:30:00", "2025-12-18 18:00:00",
        "2025-12-19 20:45:00", "2025-12-20 12:30:00", "2025-12-21 15:00:00",
        "2025-12-22 17:20:00", "2025-12-23 10:30:00", "2025-12-23 18:45:00",
        "2025-12-24 09:00:00", "2025-12-24 16:30:00", "2025-12-27 14:00:00",
        "2025-12-29 19:00:00", "2025-12-31 11:30:00"
    ]

    stores = [
        {"id": "5121", "name": "LONDON KENSINGTON EXT", "format": "Extra",
         "address": "Cromwell Road,LONDON,GREATER LONDON"},
        {"id": "5247", "name": "LONDON CAMDEN EXP", "format": "Express",
         "address": "117-125 Camden High Street,LONDON,GREATER LONDON"}
    ]

    for date_str in december_dates:
        store = random.choice(stores)

        # How many bottles of wine/prosecco? (1-4, weighted toward 2-3)
        wine_quantity = random.choices([1, 2, 3, 4], weights=[2, 5, 4, 2])[0]

        products = []
        total_cost = 0

        # Add wine/prosecco
        for _ in range(wine_quantity):
            wine_type = random.choice([
                ("Tesco Finest Prosecco 75Cl", 7.00),
                ("Tesco Finest Champagne 75Cl", 15.00),
                ("Tesco Finest Red Wine 75Cl", 8.50)
            ])

            products.append({
                "name": wine_type[0],
                "quantity": "1",
                "channel": "instore",
                "weightInGrams": "NA",
                "price": f"{wine_type[1]:.2f}",
                "volumeInLitres": "0.75"
            })
            total_cost += wine_type[1]

        # Add a few regular groceries (50% chance)
        if random.random() < 0.5:
            regular_items = [
                ("Tesco Cherry Tomatoes 330G", 2.00, "330", "NA"),
                ("Tesco Finest Sourdough Bread 400G", 2.20, "400", "NA"),
                ("Tesco British Free Range Eggs 6 Pack", 2.85, "NA", "NA"),
                ("Tesco Fresh Milk Semi-Skimmed 2.27L", 1.60, "NA", "2.27")
            ]

            num_regular = random.randint(1, 3)
            for _ in range(num_regular):
                item = random.choice(regular_items)
                products.append({
                    "name": item[0],
                    "quantity": "1",
                    "channel": "instore",
                    "weightInGrams": item[2],
                    "price": f"{item[1]:.2f}",
                    "volumeInLitres": item[3]
                })
                total_cost += item[1]

        # Calculate basket values
        savings = round(total_cost * 0.05, 2)  # 5% savings
        net = round(total_cost, 2)
        gross = round(total_cost + 0.20, 2)

        # Create purchase
        purchase = {
            "basketValueGross": f"{gross:.2f}",
            "purchaseType": "instore",
            "overallBasketSavings": f"{savings:.2f}",
            "storeId": store["id"],
            "storeAddress": store["address"],
            "paymentType": [{
                "type": "MASTERCARD_DEBIT",
                "category": "Contactless",
                "amount": f"{net:.2f}"
            }],
            "timeStamp": date_str,
            "basketValueNet": f"{net:.2f}",
            "says": "NA",
            "storeName": store["name"],
            "storeFormat": store["format"],
            "product": products
        }

        purchases.append(purchase)

    return len(december_dates)

def main():
    """Main execution function."""
    print("Loading Tesco data...")
    data = load_data('./data/synthetic_tesco_data.json')

    purchases = data['Purchase'][0]
    print(f"Found {len(purchases)} existing purchases")

    print("\nAdding strawberries with summer spike...")
    strawberry_count = add_strawberries(purchases)
    print(f"   Added strawberries to {strawberry_count} purchases")

    print("\nAdding wine to existing transactions...")
    wine_count = add_wine(purchases)
    print(f"   Added wine to {wine_count} purchases")

    print("\nAdding December transactions with wine spike...")
    december_count = add_december_transactions(data)
    print(f"   Added {december_count} December purchases")

    print("\nSaving updated data...")
    save_data(data, './data/synthetic_tesco_data.json')

    print(f"\nComplete! Total purchases: {len(data['Purchase'][0])}")
    print(f"   Strawberry additions: {strawberry_count}")
    print(f"   Wine additions (Jan-Oct): {wine_count}")
    print(f"   December wine transactions: {december_count}")

if __name__ == "__main__":
    main()
