import Project from "../models/project";
import User from "../models/user";
import cloudinary from "../utils/cloudinary";

export const getAllProjects = async (req, res, next) => {
  let projects;

  try {
    projects = await Project.find();
  } catch (err) {
    console.log(err);
  }
  if (!projects) {
    return res.status(200).json({ message: "No Projects Found" });
  }
  return res.status(200).json({ projects });
};

export const addProject = async (req, res, next) => {
  const {
    pName,
    pClient,
    pDate,
    pType,
    finished,
    pLocation,
    pDescription,
    user,
  } = req.body;

  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "projects",
    });

    // Create project with Cloudinary image details
    const project = await Project.create({
      pName,
      pClient,
      pDate,
      pType,
      finished,
      pLocation,
      pDescription,
      pGallery: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      user,
    });

    // Send success response with project details and a message
    res
      .status(201)
      .json({ success: true, project, message: "Project added successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  const { pName, pClient, pType, finished, pDescription, pGallery, user } =
    req.body;
  const projectId = req.params.id;
  let project;

  try {
    project = await Project.findByIdAndUpdate(projectId, {
      pName,
      pClient,
      pType,
      finished,
      pDescription,
      pGallery,
      user,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!project) {
    return res.status(500).json({ message: "Unable to update project" });
  }
  return res.status(200).json({ project });
};

export const getOneProject = async (req, res, next) => {
  const projectId = req.params.id;
  let project;

  try {
    project = await Project.findById(projectId);
  } catch (err) {
    return console.log(err);
  }
  if (!project) {
    return res.status(404).json({ message: "No project found " });
  }
  return res.status(200).json({ project });
};

export const deleteProject = async (req, res, next) => {
  const projectId = req.params.id;

  let project;
  try {
    project = await Project.findOneAndDelete(projectId).populate("user");
    await project.user.projects.pull(project);
    await project.user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!project) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "Successfully deleted" });
};

export const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userProjects;
  try {
    userProjects = await User.findById(userId).populate("projects");
  } catch (err) {
    return console.log(err);
  }
  if (!userProjects) {
    return res.status(404).json({ message: "No Project found" });
  }
  return res.status(200).json({ project: userProjects });
};
