import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Button from "./ui/Button";

const WalletCard = ({ onBalanceChange }) => {
  const [wallet, setWallet] = useState(null);
  const navigate = useNavigate();

  const fetchWallet = async () => {
    try {
      const { data } = await API.get("/wallet/me");
      setWallet(data.wallet);
      onBalanceChange?.(data.wallet.balance);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchWallet(); }, []);

  if (!wallet) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-600/20 dark:shadow-blue-900/30">
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />

      <div className="relative">
        <p className="text-sm text-blue-100 mb-1 font-medium">Wallet Balance</p>
        <p className="text-3xl font-bold tracking-tight">
          ₹{wallet.balance.toFixed(2)}
        </p>

        <Button
          onClick={() => navigate("/buyer/add-money")}
          variant="secondary"
          className="mt-4 w-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/40 dark:bg-white/15 dark:border-white/25 dark:hover:bg-white/25 backdrop-blur-sm"
        >
          <span className="text-lg">💳</span> Add Money via PalPay
        </Button>
      </div>
    </div>
  );
};

export default WalletCard;
