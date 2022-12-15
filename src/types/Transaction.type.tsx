export default interface Transaction {
  id: string;
  description: string;
  date: string;
  type: number;
  amount: number;
  accountId: string;
  accountName: string | null;
  receiptId: string | null;
}
