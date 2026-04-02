import Badge from "./ui/Badge";

const statusConfig = {
  PENDING: { color: "yellow", label: "Pending" },
  ESCROWED: { color: "blue", label: "Escrowed" },
  DISPUTED: { color: "red", label: "Disputed" },
  RELEASED: { color: "green", label: "Released" },
  REFUNDED: { color: "orange", label: "Refunded" },
  CANCELLED: { color: "gray", label: "Cancelled" },
  LOCKED: { color: "blue", label: "Locked" },
  FROZEN: { color: "cyan", label: "Frozen" },
  OPEN: { color: "red", label: "Open" },
  RESOLVED_FOR_SELLER: { color: "green", label: "Resolved for Seller" },
  RESOLVED_FOR_BUYER: { color: "orange", label: "Resolved for Buyer" },
  CLOSED: { color: "gray", label: "Closed" },
};

const OrderStatusBadge = ({ status }) => {
  const config = statusConfig[status] || { color: "gray", label: status?.replace(/_/g, " ") || "Unknown" };

  return (
    <Badge color={config.color}>
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
