import Client from "../models/Client.js"

export const getAllClients = async (req, res, next) => {
  let clients
  try {
    clients = await Client.find()
  } catch (err) {
    console.log(err)
  }
  if (!Client) {
    return res.status(200).json({ message: "No clients found" })
  }
  return res.status(200).json(clients)
}

export const addClient = async (req, res, next) => {
  const {
    clientName,
    email,
    phone,
    address,
    clientDetails,
    clientLogo,
    projects,
  } = req.body

  const client = new Client({
    clientName,
    email,
    phone,
    address,
    clientDetails,
    clientLogo,
  })
  try {
    const result = await client.save()
    res.status(201).json({ client: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to add client" })
  }
}
export const updateClient = async (req, res, next) => {
  const { clientName, email, phone, address, clientDetails, clientLogo } =
    req.body
  const clientId = req.params.id
  let client

  try {
    client = await Client.findByIdAndUpdate(clientId, {
      clientName,
      email,
      phone,
      address,
      clientDetails,
      clientLogo,
    })
  } catch (error) {
    return console.log(error)
  }
  if (!client) {
    return res.status(500).json({ message: "Unable to update client" })
  }
  return res.status(200).json(client)
}

export const getOneClient = async (req, res, next) => {
  const clientId = req.params.id

  let client

  try {
    client = await Client.findById(clientId)
  } catch (error) {
    return console.log(error)
  }
  if (!client) {
    return res.status(404).json({ message: "No client found" })
  }
  return res.status(200).json(client)
}

export const deleteClient = async (req, res, next) => {
  const clientId = req.params.id

  try {
    const deletedClient = await Client.findByIdAndDelete(clientId)

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" })
    }
    res
      .status(200)
      .json({ message: "Client deleted successfully", client: deletedClient })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to delete client" })
  }
}
