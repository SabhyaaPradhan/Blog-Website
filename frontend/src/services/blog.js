import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async data => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(data),
  }

  try {
    const response = await fetch(baseUrl, config)
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

const getAll = async () => {
  const config = {
    headers: {
      'Authorization': token,
    },
  }

  try {
    const response = await fetch(baseUrl, config)
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

const getSingleBlog = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const update = async (id, data) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(data),
  }

  try {
    const response = await fetch(`${baseUrl}/${id}`, config)
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

const remove = async id => {
  const config = {
    method: 'DELETE',
    headers: {
      'Authorization': token,
    },
  }

  try {
    const response = await fetch(`${baseUrl}/${id}`, config)
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

export default { create, setToken, getAll, update, remove, getSingleBlog }
