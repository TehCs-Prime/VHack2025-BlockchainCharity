import React from 'react'

interface LocalAvatarProps {
  user?: {
    username?: string
    profilePicture?: string
  }
  className?: string
}

const LocalAvatar: React.FC<LocalAvatarProps> = ({ user, className }) => {
  const getInitials = (): string => {
    if (!user?.username) return '?'
    return user.username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) // Get first two initials
  }

  return (
    <div className={`local-avatar ${className || ''}`}>
      {user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt="Profile"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <div className="initials-fallback">{getInitials()}</div>
      )}
    </div>
  )
}

export default LocalAvatar
