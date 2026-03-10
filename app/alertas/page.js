"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AlertasPage() {

  const [alertas,setAlertas] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    carregarAlertas()
  },[])

  async function carregarAlertas(){

    const { data:{ user } } = await supabase.auth.getUser()

    if(!user){
      window.location.href="/login"
      return
    }

    const { data, error } = await supabase
      .from("alertas")
      .select("*")
      .eq("user_id", user.id)

    if(error){
      alert(error.message)
      return
    }

    setAlertas(data)
    setLoading(false)

  }

  async function excluirAlerta(id){

    const { error } = await supabase
      .from("alertas")
      .delete()
      .eq("id", id)

    if(error){
      alert(error.message)
      return
    }

    carregarAlertas()

  }

  if(loading){

    return(
      <div style={{padding:40}}>
      Carregando alertas...
      </div>
    )

  }

  return(

    <div style={page}>

      <div style={container}>

        <h1 style={title}>
        Meus alertas ✈️
        </h1>

        <div style={topButtons}>

          <a href="/painel" style={btnVoltar}>
          Voltar ao painel
          </a>

          <a href="/alerta" style={btnCriar}>
          Criar novo alerta
          </a>

        </div>

        {alertas.length === 0 && (

          <div style={card}>
          Você ainda não criou nenhum alerta
          </div>

        )}

        {alertas.map((alerta)=>(
          
          <div key={alerta.id} style={card}>

            <p>
            <b>Origem:</b> {alerta.origem}
            </p>

            <p>
            <b>Destino:</b> {alerta.destino || "Todos"}
            </p>

            <button
            style={btnExcluir}
            onClick={()=>excluirAlerta(alerta.id)}
            >
            Excluir alerta
            </button>

          </div>

        ))}

      </div>

    </div>

  )

}

const page = {

  minHeight:"100vh",
  background:"#eef8ff",
  padding:"40px 20px",
  fontFamily:"Arial"

}

const container = {

  maxWidth:"700px",
  margin:"0 auto"

}

const title = {

  fontSize:"32px",
  fontWeight:"800",
  marginBottom:"20px"

}

const topButtons = {

  display:"flex",
  gap:"10px",
  marginBottom:"20px",
  flexWrap:"wrap"

}

const btnVoltar = {

  background:"#3478f6",
  color:"#fff",
  padding:"12px 18px",
  borderRadius:"999px",
  textDecoration:"none",
  fontWeight:"700"

}

const btnCriar = {

  background:"#f29d32",
  color:"#fff",
  padding:"12px 18px",
  borderRadius:"999px",
  textDecoration:"none",
  fontWeight:"700"

}

const card = {

  background:"#fff",
  borderRadius:"20px",
  padding:"20px",
  marginBottom:"15px"

}

const btnExcluir = {

  marginTop:"10px",
  background:"#ff4d4f",
  color:"#fff",
  border:"none",
  padding:"10px 16px",
  borderRadius:"999px",
  cursor:"pointer",
  fontWeight:"700"

}
