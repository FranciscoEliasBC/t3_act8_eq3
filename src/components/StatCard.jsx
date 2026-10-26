export default function StatCard({ icon: Icon, label, value, note }) {
  return (
    <article className="card stat-card">
      <div className="stat-card__top">
        <span className="stat-card__icon"><Icon size={20} /></span>
        <div>
          <p className="stat-card__label">{label}</p>
          <p className="stat-card__value">{value}</p>
        </div>
      </div>
      <p className="stat-card__note">{note}</p>
    </article>
  )
}
