import Layout from "@/components/Layout.js"
import SpinnerBeat from "@/components/SpinnerBeat.js"
import axios from "axios"
import { useEffect, useState } from "react"

import { withSwal } from "react-sweetalert2"

function SettingsPage({ swal }) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [featuredProductId, setFeaturedProductId] = useState("")
  const [shippingFee, setShippingFee] = useState("")

  useEffect(() => {
    setIsLoading(true)

    fetchAll().then(() => {
      setIsLoading(false)
    })

  }, [])

  async function fetchAll(){
    await axios.get("/api/products").then((res) => {
      setProducts(res.data)
    })
    await axios.get("/api/settings?name=featuredProductId").then((res) => {
      setFeaturedProductId(res.data.value)
    })
    await axios.get("/api/settings?name=shippingFee").then((res) => {
      setShippingFee(res.data.value)
    })

  }

  async function saveSettings() {
    swal
      .fire({
        title: "Are you sure?",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Save",
        confirmButtonColor: "#5542F6",
        cancelButtonColor: "#f64248",
      })
      .then(async (result) => {
        if (result?.isConfirmed) {
          setIsLoading(true)
          await axios.put("/api/settings", {
            name: "featuredProductId",
            value: featuredProductId,
          })
          await axios.put("/api/settings", {
            name: "shippingFee",
            value: shippingFee,
          })
        }
        setIsLoading(false)
        await swal.fire({
          title: "Featured product saved",
          icon: "success",
        })
      })
  }

  return (
    <Layout>
      <h1>Settings</h1>
      {/* *****************   Featured product setting ************************ */}
      {(isLoading) && <SpinnerBeat fullWidth={true} />}
      {!isLoading && (
        <>
          <label>
            <strong>Featured product</strong>
          </label>
          <select
            size="1"
            value={featuredProductId}
            onChange={(ev) => setFeaturedProductId(ev.target.value)}
          >
            {products.length > 0 && (
              <>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.title}
                  </option>
                ))}
              </>
            )}
          </select>
          {/* ********************************************************************** */}
          
          {/* **********************   Shipping fee setting ************************ */}
          <label>
            <strong>Shipping Price (in USD)</strong>
          </label>
          <input
            type="number"
            value={shippingFee}
            onChange={(ev) => {
              setShippingFee(ev.target.value)
              console.log(shippingFee)
            }}
          />
          {/* ********************************************************************** */}
          <div>
            <button onClick={saveSettings} className="btn-primary">
              Save Settings
            </button>
          </div>
        </>
      )}
    </Layout>
  )
}

export default withSwal(({ swal }, ref) => <SettingsPage swal={swal} />)
