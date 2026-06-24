import { WalletTransactions } from "./wallet-transaction.entity";

export class Revenue {
  // 1. Declare the properties so the class can hold data
  public readonly spending: number;
  public readonly income: number;
  public readonly rawIncome: number | undefined;

  constructor(spending: number, income: number, rawIncome?: number) {
    this.spending = spending;
    this.income = income;
    this.rawIncome = rawIncome;
  }

  // 3. Destructure changes to apply overrides, falling back to current values
  copy(changes: Partial<Revenue>): Revenue {
    return new Revenue(
      changes.spending ?? this.spending,
      changes.income ?? this.income,
      changes.rawIncome ?? this.rawIncome
    );
  }
}
