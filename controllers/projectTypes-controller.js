const PType = require("../models/PType")

exports.getAllProjectTypes = async (req, res) => {
  try {
    const projectTypes = await PType.find()

    if (!projectTypes || projectTypes.length === 0) {
      return res.status(404).json({ message: "No project types found" })
    }
    return res.status(200).json(projectTypes)
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.addProjectType = async (req, res) => {
  
  const { typeName, creator } = req.body

  if (!typeName) {
    return res.status(400).json({ message: "Type name is required" })
  }
  // if (!creator) {
  //   return res.status(400).json({ message: "Creator is required" })
  // }
  // if (creator.role !== "admin") {
  //   return res.status(400).json({ message: "You are not allowed to create a project type" })
  // }

  try {
    // Create a new project type - Unique
    const existingProjectType = await PType.findOne({ typeName })

    if (existingProjectType) {
      return res.status(400).json({ message: "Project type already exists" })
    }
    
    // Create a new project type
    const projectType = await PType.create({ typeName, createdBy: creator && creator._id, lastUpdatedBy: creator && creator._id })

    return res.status(200).json(projectType)
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

exports.updateProjectType = async (req, res) => {

  const { typeName, lastUpdatedBy } = req.body
  const pTypeID = req.params.pTypeID

  // if (!typeName || !lastUpdatedBy) {
  //   return res.status(400).json({ message: "Type name and user are required" })
  // }

  try {

    const pType = await PType.findOneAndUpdate(
      { _id: pTypeID },
      { typeName, lastUpdatedBy },
      { new: true }
    );

    if (!pType) {
      return res.status(404).json({ message: "Cannot update project type" });
    }

    res.status(200).json({ pType, message: "Project type updated successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.deleteProjectType = async (req, res) => {
  const pTypeID = req.params.pTypeID

  try {
    const deletedProjectType = await PType.findByIdAndDelete(pTypeID)

    if (!deletedProjectType) {
      return res.status(404).json({ message: "project type not found" })
    }
    res.status(200).json({ message: "Project deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" })
  }
}
