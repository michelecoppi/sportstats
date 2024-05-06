import React from 'react'

const roles ={

    1: 'Carry',
    2: 'Mid',
    3: 'Offlane',
    4: 'Support',
    5: 'Hard Support',
    6: 'Roamer',
    '4/5': 'Support/Hard Support',
}

function DotaRoles({role}) {
    const rolePlayer = roles[role]
  return (
    <span>{rolePlayer || ""}</span>
  )
}

export default DotaRoles