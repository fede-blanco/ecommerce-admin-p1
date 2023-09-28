import Layout from "@/components/Layout.js"
import SpinnerBeat from "@/components/SpinnerBeat.js"
import axios from "axios"
import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  const [isLoading, setisLoading] = useState(false)

  useEffect(() => {
    setisLoading(true)
    setTimeout(() => {
      axios.get("/api/orders").then((res) => {
        setOrders(res.data)
        setisLoading(false)
      })
    }, 1500)
  }, [])

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5}>
                <div className="p-4">
                  <SpinnerBeat fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id} className="border">
                <td>
                  {new Date(order.createdAt).toLocaleString().replace(",", " ")}
                </td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "YES" : "NO"}
                </td>
                <td>
                  Name: {order.name} <br />
                  Email: {order.email} <br />
                  Direction: {order.streetAdress} {order.city} {order.country}{" "}
                  <br />
                  Postal Code: {order.postalCode} <br />
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <div key={l.price_data.product_data.name} className="text-sm">
                      {l.quantity} x {l.price_data.product_data.name}
                    </div>
                  ))}
                </td>
                <td>${order.totalPrice}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  )
}
