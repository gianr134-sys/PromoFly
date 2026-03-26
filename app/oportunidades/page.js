<div className="bg-white rounded-2xl shadow-md p-5 mb-4 border border-gray-100">
  <div className="flex justify-between items-center mb-2">
    <h2 className="text-lg font-semibold">
      {o.origem} → {o.destino}
    </h2>
    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
      {o.nivel}
    </span>
  </div>

  <div className="grid grid-cols-3 gap-3 mt-4">
    <div>
      <p className="text-gray-400 text-sm">Preço</p>
      <p className="text-green-600 text-xl font-bold">
        R$ {Number(o.preco).toFixed(2)}
      </p>
    </div>

    <div>
      <p className="text-gray-400 text-sm">Companhia</p>
      <p className="font-medium">{o.companhia}</p>
    </div>

    <div>
      <p className="text-gray-400 text-sm">Score</p>
      <p className="font-medium">{o.score}</p>
    </div>
  </div>

  <div className="flex gap-3 mt-5">
    <a
      href={o.link}
      target="_blank"
      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
    >
      Ver promoção
    </a>

    <button className="border border-red-300 text-red-500 px-4 py-2 rounded-xl text-sm">
      Excluir
    </button>
  </div>
</div>
