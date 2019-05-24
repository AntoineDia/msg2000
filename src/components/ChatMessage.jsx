import React from 'react'

export default ({ name, message }) =>
  <tr>
    <td className="name">{name}</td>
    <td className="msg">{message}</td>
  </tr>