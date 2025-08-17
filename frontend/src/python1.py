
def cokemachine():
    total_inserted = 0

    while total_inserted < 50:
        coin = int(input("Insert Coin (25, 10, or 5 cents): "))

        if coin in {25, 10, 5}:
            total_inserted += coin
            if total_inserted < 50:
                print("Amount Due:", 50 - total_inserted)
            elif total_inserted == 50:
                print("Amount Due: No change owed.")
        else:
            print("Amount Due: 50")
            print("Invalid coin. Accepted denominations are 25, 10, or 5 cents.")

    if total_inserted > 50:
        change_due = total_inserted - 50
        print("Change Owed:", change_due)
    elif total_inserted == 50:
        print("Change Owed: 0")

def main():
    cokemachine()

if __name__ == "__main__":
    main()