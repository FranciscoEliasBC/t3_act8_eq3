export const ROLE_LABELS = { admin: 'Administrador', moderator: 'Moderador', user: 'Estudiante' }

export default function RoleBadge({ role }) {
  return <span className={`badge badge--${role}`}>{ROLE_LABELS[role] ?? role}</span>
}
