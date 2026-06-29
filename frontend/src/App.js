import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
  const [medicines, setMedicines] = useState([])

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/medicines/` : '/api/medicines/')
      .then((res) => setMedicines(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>SISDROG — Medicines</h1>
      <ul>
        {medicines.map((m) => (
          <li key={m.id}>{m.name} — {m.quantity} pcs — ${m.price}</li>
        ))}
      </ul>
    </div>
  )
}
