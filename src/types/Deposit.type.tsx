export default interface Deposit {
  id: string;
  name: string;
  initialDeposit: number;
  monthlyContribution: number;
  interestRate: number;
  startDate: string;
  months: number;
}
