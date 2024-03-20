import PType from "../models/ptype";
import mongoose from "mongoose";

export const getAllProjectTypes = async(req,res,next) => {
    let projectTypes;

    try{
        projectTypes = await PType.find();
    }
    catch (err){
        console.log(err);
    }
    if(!projectTypes){
        return res.status(200).json({message: "No projects type found"});
    }
    return res.status(200).json({projectTypes});
};

export const addProjectType = async(req,res,next) =>{
    const{
        typeName
    } = req.body;

    const projectType = new PType({
        typeName
    });
      try {
        PType.push(projectType);
       
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
      }
      return res.status(200).json({ projectType });
};

