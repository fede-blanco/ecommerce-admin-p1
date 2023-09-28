import Layout from "@/components/Layout.js"
import ProductForm from "@/components/ProductForm.js"
import SpinnerBeat from "@/components/SpinnerBeat.js"
import axios from "axios"
import { useRouter } from "next/router.js"
import { useEffect, useState } from "react"

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null)

  const [isLoading, setisLoading] = useState(false)

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!id) {
      return
    }
    setisLoading(true)
    setTimeout(() => {
      axios.get("/api/products?id=" + id).then((response) => {
        setProductInfo(response.data)
        setisLoading(false)
      })
    }, 1500)
  }, [id])

  return (
    <Layout>
      <h1>Edit Product</h1>
      {isLoading && (
        <div className="p-6">
          <SpinnerBeat fullWidth={true} />
        </div>
      )}
      {productInfo && <ProductForm {...productInfo}/>}
    </Layout>
  )
}
