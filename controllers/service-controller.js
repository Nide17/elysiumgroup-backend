import Service from "../models/service";
import ServiceSchema from "../models/service";

export const getAllServices = async (req, res, next) => {
  let services;

  try {
    services = await ServiceSchema.find();
  } catch (err) {
    console.log(err);
  }
  if (!services) {
    return res.status(200).json({ message: "No services found" });
  }
  return res.status(200).json({ services });
};

export const addServices = async (req, res, next) => {
  const { serviceName, serviceDetail, serviceTitle } = req.body;

  const service = new Service({
    serviceName,
    serviceDetail,
    serviceTitle,
  });
  try {
    await service.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ service });
};

export const updateService = async (req, res, next) => {
  const { serviceName, serviceDetail, serviceTitle } = req.body;
  const serviceId = req.params.id;

  let service;
  try {
    service = await Service.findByIdAndUpdate(serviceId, {
      serviceName,
      serviceDetail,
      serviceTitle,
    });
  } catch (error) {
    return console.log(error);
  }
  if (!service) {
    return res.status(500).json({ message: "Unable to update service" });
  }
  return res.status(200).json({ service });
};

export const deleteService = async (req, res, next) => {
  const serviceId = req.params.id;
  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      return res.status(400).json({ message: "This service not found" });
    }
    res
      .status(200)
      .json({
        message: "Service deleted successfully",
        service: deletedService,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete this service" });
  }
};
