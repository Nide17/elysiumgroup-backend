const Contact = require("../models/Contact")

exports.getAllContacts = async (req, res) => {

  try {
    const contacts = await Contact.find()
    return res.status(200).json(contacts)
  } catch (err) {
    res.status(500).json({ error: "Unable to get all contacts" })
  }
}

exports.addContact = async (req, res) => {
  
  const { contactName, contactEmail, contactMessage } = req.body

  const contact = new Contact({ contactName, contactEmail, contactMessage })
  try {
    const result = await contact.save()
    res.status(201).json({ message: "Message sent!", result })

  } catch (error) {
    res.status(500).json({ message: "Failed to add contact" })
  }
}
exports.updateContact = async (req, res) => {
  const { contactName, contactEmail, contactMessage } = req.body
  const contactID = req.params.contactID
  let contact

  try {
    contact = await Contact.findByIdAndUpdate(contactID, { contactName, contactEmail, contactMessage })
  } catch (error) {
    return console.log(error)
  }
  if (!contact) {
    return res.status(500).json({ message: "Unable to update contact" })
  }
  return res.status(200).json(contact)
}

exports.getOneContact = async (req, res) => {
  const contactID = req.params.contactID

  let contact

  try {
    contact = await Contact.findById(contactID)
  } catch (error) {
    return console.log(error)
  }
  if (!contact) {
    return res.status(404).json({ message: "No contact found" })
  }
  return res.status(200).json(contact)
}

exports.deleteContact = async (req, res) => {
  const contactID = req.params.contactID

  try {
    const deletedContact = await Contact.findByIdAndDelete(contactID)

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" })
    }
    res
      .status(200)
      .json({ message: "Contact deleted successfully", contact: deletedContact })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete contact" })
  }
}
