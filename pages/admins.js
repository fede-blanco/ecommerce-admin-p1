import Layout from "@/components/Layout.js"
import SpinnerBeat from "@/components/SpinnerBeat.js"
import prettyDate from "@/lib/date.js"
import axios from "axios"
import Link from "next/link.js"
import { useEffect, useState } from "react"

import { withSwal } from "react-sweetalert2"

function AdminsPage({ swal }) {
  const [email, setEmail] = useState("")
  const [adminEmails, setAdminEmails] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  function loadAdmins() {
    setIsLoading(true)
    setTimeout(() => {
      axios.get("api/admins").then((response) => {
        setAdminEmails(response.data)
        setIsLoading(false)
      })
    }, 1500)
  }

  function addAdmin(ev) {
    ev.preventDefault()
    axios
      .post("/api/admins", { email })
      .then((response) => {
        swal.fire({
          title: "Admin created!",
          text: `Email: ${email}`,
          icon: "success",
        })
        setEmail("")
        loadAdmins()
      })
      .catch((err) => {
        swal.fire({
          title: "Error",
          text: err.response.data.message,
          icon: "error",
        })
      })
  }

  function deleteAdmin(_id, email) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete "${email}" ?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        reverseButtons: true,
        confirmButtonColor: "#d55",
      })
      .then(async (result) => {
        // console.log(result)
        if (result?.isConfirmed) {
          axios.delete("/api/admins?_id=" + _id).then(() => {
            swal.fire({
              title: "Admin deleted!",
              text: `Admin "${email}" deleted!`,
              icon: "success",
            })
          })
          loadAdmins()
        }
      })
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  return (
    <>
      <Layout>
        <h1>Add new admin</h1>
        <form className="py-4" onSubmit={addAdmin}>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Google email"
              className="mb-0"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Add admin
            </button>
          </div>
        </form>
        <hr />
        <div>
          <h2>Existing admins</h2>
          <table className="basic">
            <thead>
              <tr>
                <th className="text-left">Admin google email</th>
                <th className="text-left">Addition date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={2}>
                    <div className="py-6">
                      <SpinnerBeat fullWidth={true} />
                    </div>
                  </td>
                </tr>
              )}
              {adminEmails.length > 0 &&
                !isLoading &&
                adminEmails.map((admin) => (
                  <tr key={admin._id} className="py-2 border-b">
                    <td>
                      <div className="py-2">{admin.email}</div>
                    </td>
                    <td>
                      <div className="py-2">{prettyDate(admin.createdAt)}</div>
                    </td>
                    <td>
                      <button
                        className="btn-red"
                        onClick={() => deleteAdmin(admin._id, admin.email)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </>
  )
}

// exportamos la función withswal que retorna un componente <AdminsPage swal={swal} /> con una prop swal que utilizará en su interior
export default withSwal(({ swal }, ref) => <AdminsPage swal={swal} />)
