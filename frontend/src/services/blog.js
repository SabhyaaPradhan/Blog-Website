import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async data => {
  const config ={
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, data, config)
  return response.data
}

const getAll = async() => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { create, setToken, getAll }