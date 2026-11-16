export default function MyOrders() {
  const orders = [{ id: 'NF-1001', date: '2026-11-01' }];

  return (
    <div className="page">
      <h1>My orders</h1>
      <div className="card">
        {orders.map((order) => (
          <p key={order.id}>#{order.id} — {order.date}</p>
        ))}
      </div>
    </div>
  );
}
