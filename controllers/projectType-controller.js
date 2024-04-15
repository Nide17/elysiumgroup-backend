import PType from "../models/ptype";

export const getAllProjectTypes = async (req, res, next) => {
  try {
    const projectTypes = await PType.find();
    if (!projectTypes || projectTypes.length === 0) {
      return res.status(404).json({ message: "No project types found" });
    }
    return res.status(200).json({ projectTypes });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addProjectType = async (req, res, next) => {
  const { typeName } = req.body;

  try {
    const projectType = await PType.create({ typeName });

    return res.status(200).json({ projectType });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

export const updateProjectType = async (req, res, next) => {
  const { typeName } = req.body;
  const projectTypeId = req.params.id;

  try {
    const projectType = await PType.findByIdAndUpdate(
      projectTypeId,
      { typeName },
      { new: true }
    );

    if (!projectType) {
      return res.status(404).json({ message: "Project type not found" });
    }

    return res.status(200).json({ projectType });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProjectType = async (req, res, next) => {
  const projectTypeId = req.params.id;

  try {
    const deletedProjectType = await PType.findByIdAndDelete(projectTypeId);

    if (!deletedProjectType) {
      return res.status(404).json({ message: "project type not found" });
    }
    res
      .status(200)
      .json({
        message: "Project deleted successfully",
        projectType: deleteProjectType,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
