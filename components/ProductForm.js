import axios from "axios"
import { useRouter } from "next/router.js"
import { useEffect, useState } from "react"
import Spinner from "./Spinner.js"
import { ReactSortable } from "react-sortablejs"
import SpinnerBeat from "./SpinnerBeat.js"

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "")
  const [description, setDescription] = useState(existingDescription || "")
  const [price, setPrice] = useState(existingPrice || "")
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  )
  const [goToProducts, setGoToProducts] = useState(false)

  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(existingCategory || "")
  const router = useRouter()

  const [categoriesLoading, setCategoriesLoading] = useState(false)

  useEffect(() => {
    setCategoriesLoading(true)
    setTimeout(() => {
      axios.get("/api/categories").then((result) => {
        setCategories(result.data)
        setCategoriesLoading(false)
      })
    }, 1500)
  }, [])

  const [images, setImages] = useState(existingImages || [])

  const [isUploading, setIsUploading] = useState(false)

  async function saveProduct(ev) {
    ev.preventDefault()
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    }

    if (_id) {
      await axios.put("/api/products", { ...data, _id })
    } else {
      await axios.post("/api/products", data)
    }
    setGoToProducts(true)
  }

  if (goToProducts) {
    router.push("/products")
  }

  async function uploadImages(ev) {
    const files = ev.target?.files

    if (files?.length > 0) {
      setIsUploading(true)
      const data = new FormData()

      for (const file of files) {
        data.append("file", file)
      }
      const res = await axios.post("/api/upload", data)
      setImages((images) => {
        return [...images, ...res.data.links]
      })
      setIsUploading(false)
    }
  }

  function updateImagesOrder(images) {
    setImages(images)
  }

  const propertiesToFill = []
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category)
    console.log({ catInfo })
    propertiesToFill.push(...catInfo.properties)
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      )
      propertiesToFill.push(...parentCat.properties)
      catInfo = parentCat
    }
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev }
      newProductProps[propName] = value
      return newProductProps
    })
  }

  return (
    <form onSubmit={saveProduct}>
      {/* ****************************  NAME ********************************** */}
      <label htmlFor="">
        <strong>Product name</strong>
      </label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      {/* ****************************  CATEGORY ********************************** */}
      <label htmlFor="">
        <strong>Category</strong>
      </label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>

      {/* ****************************  PROPERTIES ********************************** */}
      {categoriesLoading && (
        <div>
          <SpinnerBeat fullWidth={true} />
        </div>
      )}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>
              <strong>{p.name[0].toUpperCase() + p.name.substring(1)}</strong>
            </label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={p.value} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

      {/* ****************************  PHOTOS ********************************** */}
      <label htmlFor="">
        <strong>Photos</strong>
      </label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="product image" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        )}

        <label className="w-24 h-24 flex flex-col items-center justify-center gap-1 text-sm text-primary rounded-sm bg-gray-200 cursor-pointer bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add Image</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      </div>

      {/* ****************************  DESCRIPTION ********************************** */}
      <label htmlFor="">
        <strong>Description</strong>
      </label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>

      {/* ****************************  PRICE ********************************** */}
      <label htmlFor="">
        <strong>Price (USD)</strong>
      </label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  )
}
