const Client = require("../models/Client")

exports.getAllClients = async (req, res) => {
  let clients
  try {
    clients = await Client.find()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  if (!Client) {
    return res.status(200).json({ message: "No clients found" })
  }
  return res.status(200).json(clients)
}

exports.addClient = async (req, res) => {
  
  const { clientName, clientEmail, clientPhone, clientAddress, clientDetails, clientLogo, createdBy, lastUpdatedBy } = req.body

  const client = new Client({ clientName, clientEmail, clientPhone, clientAddress, clientDetails, clientLogo, createdBy, lastUpdatedBy })

  try {
    const result = await client.save()
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ message: "Failed to add client" })
  }
}
exports.updateClient = async (req, res) => {
  const { clientName, clientEmail, clientPhone, clientAddress, clientDetails, clientLogo, createdBy, lastUpdatedBy } = req.body

  const clientID = req.params.clientID
  let newClient

  try {
    newClient = await Client.findByIdAndUpdate(clientID, { clientName, clientEmail, clientPhone, clientAddress, clientDetails, clientLogo, createdBy, lastUpdatedBy })
  } catch (error) {
    return res.status(500).json({ message: "Unable to update client" })
  }
  if (!newClient) {
    return res.status(500).json({ message: "Unable to update client" })
  }
  return res.status(200).json({ newClient, message: "Client updated successfully" })
}

exports.getOneClient = async (req, res) => {
  const clientID = req.params.clientID

  let client

  try {
    client = await Client.findById(clientID)
  } catch (error) {
    return res.status(500).json({ message: "Unable to get client" })
  }
  if (!client) {
    return res.status(404).json({ message: "No client found" })
  }
  return res.status(200).json(client)
}

exports.deleteClient = async (req, res) => {
  const clientID = req.params.id

  try {
    const deletedClient = await Client.findByIdAndDelete(clientID)

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" })
    }
    res
      .status(200)
      .json({ message: "Client deleted successfully", client: deletedClient })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete client" })
  }
}
