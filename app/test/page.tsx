"use client"

import { useEffect } from "react"
import { supabase } from "../../lib/supabaseClient.js"

export default function TestPage() {

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase.from("products").select("*")

      console.log("DATA:", data)
      console.log("ERROR:", error)
    }

    test()
  }, [])

  return (
    <div style={{padding:"40px"}}>
      <h1>Prueba Supabase</h1>
      <p>Abre la consola del navegador</p>
    </div>
  )
}
