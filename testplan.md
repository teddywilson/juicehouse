## Juicer.deploy(...) by `<address>` should:

#### revert if

- the provided `_discountRate` is < 900 or > 1000.
- the provided `_bondingCurveRate` is <= 0 or > 1000.
- the provided `_reserved` percent is > 1000.

#### succeed with

- BudgetStore.budgetCount(){after} == BudgetStore.budgetCount(){before} + 1.
- BudgetStore.latestBudgetId(`<address>`) == BudgetStore.budgetCount(){after}.
- BudgetStore.budgets(BudgetStore.budgetCount(){after}) has the properties that were provided.
- Projects.projectCount(){after} == Projects.projectCount(){before} + 1.
- Projects.identifiers(Projects.projectCount(){after}) has the properties that were provided.
- Projects.handleResolver(`<provided handle>`) == Projects.projectCount(){after}
- Projects.balanceOf(`<address>`){after} == Projects.balanceOf(`<address>`){before} + 1.
- Projects.ownerOf(Projects.projectCount(){after}
  ) == `<address>`
- Projects.totalSupply(){after} == Projects.totalSupply(){before} + 1
- Projects.tokenOfOwnerByIndex(`<address>`, Projects.balanceOf(`<address>`){before}) == Projects.projectCount(){after}
