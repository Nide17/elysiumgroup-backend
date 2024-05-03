const Client = require("../models/Client")
const { cloudinary, uploadImagesToCloudinary } = require("../utils/cloudinary");

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

  try {
    const client = await Client.findByIdAndUpdate(clientID, { clientName, clientEmail, clientPhone, clientAddress, clientDetails, clientLogo, createdBy, lastUpdatedBy })

    if (!client) {
      return res.status(500).json({ message: "Unable to update client" })
    }
    return res.status(200).json({ client, message: "Client updated successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Unable to update client" })
  }
}

exports.addClientLogo = async (req, res) => {

  const clientID = req.params.clientID;

  if (!req.file) {
    return res.status(400).json({ message: "Please upload a client logo" });
  }

  try {
    const existingClient = await Client.findById(clientID);

    if (!existingClient) {
      return res.status(400).json({ message: "Client does not exist" });
    }

    // Delete existing logo from cloudinary
    if (existingClient.clientLogo && existingClient.clientLogo.public_id) {
      await cloudinary.uploader.destroy(existingClient.clientLogo.public_id);
    }

    const uploadResults = await uploadImagesToCloudinary(req.file, 'clientLogo', existingClient.clientName);

    if (!uploadResults) {
      return res.status(500).json({ message: "Failed to upload client logo" });
    }

    const successfulUploads = uploadResults && uploadResults.filter(result => result !== null);

    const updatedClient = await Client.findOneAndUpdate(
      { _id: clientID },
      { clientLogo: { public_id: successfulUploads[0].public_id, url: successfulUploads[0].url } },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(500).json({ message: "Failed to update client logo" });
    }

    // update the client's image in the session
    res.status(200).json({ client: updatedClient, message: "Client logo updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
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
