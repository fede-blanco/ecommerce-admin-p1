import axios from "axios"
import { useEffect, useState } from "react"
import SpinnerBeat from "./SpinnerBeat.js"
import { subHours } from "date-fns"

export default function HomeStats() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    axios.get("/api/orders").then((response) => {
      setOrders(response.data)
      setIsLoading(false)
    })
  }, [])

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24)
  )
  const ordersThisWeek = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 168)
  )
  const ordersThisMonth = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 720)
  )

  function paidOrdersTotal(orders) {
    const paidOrders = orders.filter((o) => o.paid === true)
    let paidOrdersRevenue = 0
    paidOrders.map((po) => (paidOrdersRevenue += parseFloat(po.totalPrice)))
    return new Intl.NumberFormat("es-AR").format(paidOrdersRevenue)
  }

  function paidOrders(orders) {
    const paidOrders = orders.filter((o) => o.paid === true)
    return paidOrders
  }

  return (
    <>
      {isLoading && <SpinnerBeat fullWidth={true} />}
      {!isLoading && (
        <>
          <div>
            <h2 className="section-title">Orders</h2>
            <div>
              <h3 className="h3-title">All</h3>
              <div className="tiles-grid">
                <div className="tile">
                  <h3 className="tile-header">Today</h3>
                  <div className="tile-number">{ordersToday.length}</div>
                  <div className="tile-desc">
                    {ordersToday.length} orders today
                  </div>
                </div>
                <div className="tile">
                  <h3 className="tile-header">This week</h3>
                  <div className="tile-number">{ordersThisWeek.length}</div>
                  <div className="tile-desc">
                    {ordersThisWeek.length} orders this week
                  </div>
                </div>
                <div className="tile">
                  <h3 className="tile-header">This month</h3>
                  <div className="tile-number">{ordersThisMonth.length}</div>
                  <div className="tile-desc">
                    {ordersThisMonth.length} orders this month
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="h3-title">Paid</h3>
              <div className="tiles-grid">
                <div className="tile">
                  <h3 className="tile-header">Today</h3>
                  <div className="tile-number">
                    {paidOrders(ordersToday).length}
                  </div>
                  <div className="tile-desc">
                    {paidOrders(ordersToday).length} orders paid today
                  </div>
                </div>
                <div className="tile">
                  <h3 className="tile-header">This week</h3>
                  <div className="tile-number">
                    {paidOrders(ordersThisWeek).length}
                  </div>
                  <div className="tile-desc">
                    {paidOrders(ordersThisWeek).length} orders paid this week
                  </div>
                </div>
                <div className="tile">
                  <h3 className="tile-header">This month</h3>
                  <div className="tile-number">
                    {paidOrders(ordersThisMonth).length}
                  </div>
                  <div className="tile-desc">
                    {paidOrders(ordersThisMonth).length} orders paid this month
                  </div>
                </div>
              </div>
            </div>

            <h2 className="section-title">Revenue</h2>
            <div className="tiles-grid">
              <div className="tile">
                <h3 className="tile-header">Today</h3>
                <div className="tile-number">
                  $ {paidOrdersTotal(ordersToday)}
                </div>
                <div className="tile-desc">
                  $ {paidOrdersTotal(ordersToday)} today
                </div>
              </div>
              <div className="tile">
                <h3 className="tile-header">This week</h3>
                <div className="tile-number">
                  $ {paidOrdersTotal(ordersThisWeek)}
                </div>
                <div className="tile-desc">
                  $ {paidOrdersTotal(ordersThisWeek)} this week
                </div>
              </div>
              <div className="tile">
                <h3 className="tile-header">This month</h3>
                <div className="tile-number">
                  $ {paidOrdersTotal(ordersThisMonth)}
                </div>
                <div className="tile-desc">
                  $ {paidOrdersTotal(ordersThisMonth)} this month
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
