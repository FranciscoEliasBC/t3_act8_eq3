import { useState } from 'react'

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join('')
}

export default function Avatar({ src, name, size = 36 }) {
  const [failed, setFailed] = useState(false)
  const style = { width: size, height: size, fontSize: size * 0.36 }

  if (src && !failed) {
    return <img className="avatar" style={style} src={src} alt={name} onError={() => setFailed(true)} />
  }
  return <span className="avatar avatar--initials" style={style} aria-label={name}>{getInitials(name)}</span>
}
