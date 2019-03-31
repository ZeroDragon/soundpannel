export const loadFromMemory = async (resource) => {
  const response = await window.fetch(resource)
  return response.json()
}

export const saveToMemory = async (resource, payload) => {
  const response = await window.fetch(resource, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  return response.json()
}
