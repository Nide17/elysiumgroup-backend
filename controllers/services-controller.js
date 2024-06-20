const Service = require("../models/Service")
const ServiceSchema = require("../models/Service")

exports.getAllServices = async (req, res) => {
  let services

  try {
    services = await ServiceSchema.find()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
  if (!services) {
    return res.status(200).json({ message: "No services found" })
  }
  return res.status(200).json(services)
}

exports.addService = async (req, res) => {

  const { serviceName, serviceDetail, serviceTitle, createdBy } = req.body

  const service = new Service({
    serviceName,
    serviceDetail,
    serviceTitle,
    createdBy,
    lastUpdatedBy: createdBy
  })

  try {
    await service.save()
  } catch (err) {
    return res.status(500).json({ message: err })
  }

  res.status(201).json({ service, message: "Service added successfully" })
}

exports.updateService = async (req, res) => {

  const { serviceName, serviceDetail, serviceTitle, creator } = req.body
  const serviceID = req.params.serviceID

  let service
  try {
    service = await Service.findByIdAndUpdate(serviceID, {
      serviceName,
      serviceDetail,
      serviceTitle,
      lastUpdatedBy: creator && creator._id
    })
  } catch (error) {
    return console.log(error)
  }
  if (!service) {
    return res.status(500).json({ message: "Unable to update service" })
  }
  return res.status(200).json(service)
}

exports.deleteService = async (req, res) => {

  const serviceID = req.params.serviceID
  
  try {
    const deletedService = await Service.findByIdAndDelete(serviceID)
    if (!deletedService) {
      return res.status(400).json({ message: "This service not found" })
    }
    res
      .status(200)
      .json({
        message: "Service deleted successfully",
        service: deletedService,
      })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete this service" })
  }
}
