import Layout from "@/components/Layout.js"
import SpinnerBeat from "@/components/SpinnerBeat.js"
import axios from "axios"
import Link from "next/link.js"
import { useEffect, useState } from "react"

import { withSwal } from "react-sweetalert2"

function Categories({ swal }) {
  const [name, setName] = useState("")
  const [categories, setCategories] = useState([])
  const [parentCategory, setParentCategory] = useState(undefined)
  const [editedCategory, setEditedCategory] = useState(null)

  const [properties, setProperties] = useState([])

  const [isLoading, setisLoading] = useState(false)

  function fetchCategories() {
    setisLoading(true)
    setTimeout(() => {
      axios.get("/api/categories").then((response) => {
        // console.log(response.data);
        setCategories(response.data)
        setisLoading(false)
      })
    }, 1500)
  }

  async function saveCategory(ev) {
    ev.preventDefault()

    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    }

    if (editedCategory) {
      data._id = editedCategory._id
      await axios.put("/api/categories", data)
      setEditedCategory(null)
      setParentCategory(undefined)
      setProperties([])
      ev.target.reset()
    } else {
      await axios.post("/api/categories", data)
      setParentCategory(undefined)
      setProperties([])
      ev.target.reset()
    }

    setName(" ")
    fetchCategories()
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  function editCategory(category) {
    setEditedCategory(category)
    setName(category.name)
    setParentCategory(category.parent?._id)
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    )
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete "${category.name}" category?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        reverseButtons: true,
        confirmButtonColor: "#d55",
      })
      .then(async (result) => {
        console.log(result)
        const { _id } = category
        if (result?.isConfirmed) {
          await axios.delete("/api/categories?_id=" + _id)
          fetchCategories()
        }
      })
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }]
    })
  }

  function handlePropertyNameChange(index, property, newName) {
    console.log({ index, property, newName })

    setProperties((prev) => {
      const Properties = [...prev]
      Properties[index].name = newName
      return Properties
    })
  }

  function handlePropertyValuesChange(index, property, newValues) {
    console.log({ index, property, newValues })

    setProperties((prev) => {
      const Properties = [...prev]
      Properties[index].values = newValues
      return Properties
    })
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((property, pIndex) => {
        return pIndex !== indexToRemove
      })
    })
  }

  return (
    <Layout>
      <h1>Categories section Here</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </label>

      {/* ********************** EDITING FORM ************************** */}
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />

          <select
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            className="btn-default text-sm mb-2"
            type="button"
          >
            Add new property
          </button>

          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  value={property?.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  type="text"
                  placeholder="Property name (example: color)"
                />
                <input
                  value={property?.values}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  type="text"
                  placeholder="Values (separated by a comma)"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-red"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              onClick={() => {
                setEditedCategory(null)
                setName("")
                setParentCategory(undefined)
                setProperties([])
              }}
              type="button"
              className="btn-red"
            >
              Cancel
            </button>
          )}
          <button className="btn-primary py-1" type="submit">
            Save
          </button>
        </div>
      </form>
      {/* ************************************************************* */}

      {/* ******************************  CATEGORY LIST  ****************************** */}
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              {categories.length > 0 && <td></td>}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={3}>
                  <div className="p-6">
                    <SpinnerBeat fullWidth={true} />
                  </div>
                </td>
              </tr>
            )}
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {/* ***************************************************************************** */}
    </Layout>
  )
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />)
