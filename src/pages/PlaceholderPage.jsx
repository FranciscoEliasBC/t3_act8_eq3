export default function PlaceholderPage({ title, description }) {
  return (
    <>
      <div className="page-header"><div><h1>{title}</h1><p>{description}</p></div></div>
      <div className="card empty-state">Sección simulada para la navegación del sidebar.</div>
    </>
  )
}
