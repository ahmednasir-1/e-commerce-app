const COLORS = {
  pending: 'bg-gray-200 text-gray-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
export default function OrderStatusBadge({ status }) {
  return <span
    className={`px-2 py-1 rounded text-xs font-semibold ${COLORS[status] || COLORS.pending}`}>
    {status}
  </span>;
}
