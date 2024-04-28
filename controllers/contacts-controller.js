import Contact from "../models/Contact.js"

export const getAllContacts = async (req, res, next) => {
  let contacts
  try {
    contacts = await Contact.find()
  } catch (err) {
    console.log(err)
  }
  if (!Contact) {
    return res.status(200).json({ message: "No contacts found" })
  }
  return res.status(200).json(contacts)
}

export const addContact = async (req, res, next) => {
  const { contactName, email, message } = req.body

  const contact = new Contact({
    contactName,
    email,
    message,
  })
  try {
    const result = await contact.save()
    res.status(201).json(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to add contact" })
  }
}
export const updateContact = async (req, res, next) => {
  const { contactName, email, message } = req.body
  const contactId = req.params.id
  let contact

  try {
    contact = await Contact.findByIdAndUpdate(contactId, {
      contactName,
      email,
      message,
    })
  } catch (error) {
    return console.log(error)
  }
  if (!contact) {
    return res.status(500).json({ message: "Unable to update contact" })
  }
  return res.status(200).json(contact)
}

export const getOneContact = async (req, res, next) => {
  const contactId = req.params.id

  let contact

  try {
    contact = await Contact.findById(contactId)
  } catch (error) {
    return console.log(error)
  }
  if (!contact) {
    return res.status(404).json({ message: "No contact found" })
  }
  return res.status(200).json(contact)
}

export const deleteContact = async (req, res, next) => {
  const contactId = req.params.id

  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId)

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" })
    }
    res
      .status(200)
      .json({ message: "Contact deleted successfully", contact: deletedContact })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to delete contact" })
  }
}
