const Project = require("../models/Project")
const User = require("../models/User")
const { cloudinary, uploadImagesToCloudinary } = require("../utils/cloudinary")

exports.getAllProjects = async (req, res) => {
  let projects

  try {
    projects = await Project.find()
      .populate({ path: 'pClient', select: 'clientName' })
      .populate({ path: 'pType', select: 'typeName' })
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
  if (!projects) {
    return res.status(400).json({ message: "No Projects Found" })
  }

  return res.status(200).json(projects)
}

exports.getOneProject = async (req, res) => {
  let project

  try {
    project = await Project.findById(req.params.projectID)
  } catch (err) {
    return console.log(err)
  }
  if (!project) {
    return res.status(404).json({ message: "Project not found! " })
  }

  return res.status(200).json(project)
}

exports.getByUserId = async (req, res) => {
  const userId = req.params.id
  let userProjects
  try {
    userProjects = await User.findById(userId).populate("projects")
  } catch (err) {
    return console.log(err)
  }
  if (!userProjects) {
    return res.status(404).json({ message: "No Project found" })
  }
  return res.status(200).json(userProjects)
}

exports.addProject = async (req, res) => {
  const { pName, pClient, pStartDate, pType, status, pLocation, pDescription, createdBy, lastUpdatedBy } = req.body
  let uploadResults

  // validate
  if (!pName || !pLocation) {
    return res.status(400).json({ message: "Name and location fields are required!" })
  }

  try {

    // Upload files to Cloudinary if any are provided
    if (req.files && req.files.length > 0) {
      uploadResults = await uploadImagesToCloudinary(req.files, 'projects', pName.replace(/\s+/g, '_').toLowerCase())
    }

    // Filter out any failed uploads
    const successfulUploads = uploadResults && uploadResults.filter(result => result !== null)

    // Prepare the project gallery with uploaded images
    const pGallery = successfulUploads && successfulUploads.map(image => ({
      public_id: image.public_id,
      url: image.url
    }))

    // Create project with Cloudinary image details
    const project = await Project.create({
      pName, pClient, pStartDate, pType, status, pLocation, pDescription, pGallery, createdBy, lastUpdatedBy: createdBy
    })

    // Send success response with project details and a message
    res.status(201).json({ success: true, project, message: "Project added successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Failed to add project" })
  }
}

exports.addProjectImages = async (req, res) => {
  let project;
  let newImages;

  try {
    project = await Project.findById(req.params.projectID);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadImagesToCloudinary(req.files, 'projects', project.pName.replace(/\s+/g, '_').toLowerCase());
      const successfulUploads = uploadResults.filter(result => result !== null);
      newImages = successfulUploads.map(image => ({
        public_id: image.public_id,
        url: image.url,
      }));

      project.pGallery = [...project.pGallery, ...newImages];
    }

    await project.save();
    return res.status(200).json({ message: "Image(s) uploaded successfully", newImages })
  } catch (err) {

    return res.status(500).json({ message: "Failed to upload image(s)" })
  }
};

exports.deleteProjectImage = async (req, res) => {

  let projectID = req.params.projectID;
  let imageID = req.params.imageID;
  try {
    let project = await Project.findById(projectID);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Filter out the image to be deleted
    const public_id = project.pGallery.find(image => image._id.toString() === imageID).public_id;

    await cloudinary.uploader.destroy(public_id);
    project.pGallery = project.pGallery.filter(image => image._id.toString() !== imageID);
    await project.save();

    // Send success response with updated project details
    return res.status(200).json({ message: "Image deleted successfully", image_id: imageID });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Failed to delete image" });
  }
};

exports.updateProject = async (req, res) => {
  const { pName, pClient, pStartDate, pType, status, pLocation, pDescription, createdBy, lastUpdatedBy } = req.body;
  let project;
  let projectID = req.params.projectID

  try {
    // First, find the project by its ID
    project = await Project.findById(projectID);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update the project with the new data
    project.pName = pName;
    project.pClient = pClient;
    project.pStartDate = pStartDate;
    project.pType = pType;
    project.status = status;
    project.pLocation = pLocation;
    project.pDescription = pDescription;
    project.createdBy = createdBy;
    project.lastUpdatedBy = lastUpdatedBy;

    // Save the updated project
    await project.save();

    // Send success response with updated project details
    return res.status(200).json({ updatedProject: project, message: "Project updated successfully" })
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Failed to update project" });
  }
};

exports.deleteProject = async (req, res) => {

  // let project
  try {
    // project = await Project.findOneAndDelete(req.params.projectID).populate("user")
    // await project.user.projects.pull(project)
    // await project.user.save()
    let result = await Project.findByIdAndDelete(req.params.projectID)

    if (!result) {
      return res.status(500).json({ message: "Unable to delete" })
    }

    return res.status(200).json({ _id: req.params.projectID, message: "Project deleted successfully" })

  } catch (err) {
    return console.log(err)
  }
}


// Get featured projects by createdBy
exports.getFeaturedProjects = async (req, res) => {
  let projects
  const userID = req.params.userID
  try {
    projects = await Project.find({ createdBy: userID })
  } catch (err) {
    return console.log(err)
  }
  if (!projects?.length) {
    return res.status(200).json({ message: "No Featured Projects found" })
  }

  return res.status(200).json(projects)
}