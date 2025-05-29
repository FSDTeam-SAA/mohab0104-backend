const servicesAdmin = require("./servicesAdmin.model");
// const User = require("../models/user.model");
const { uploadOnCloudinary } = require("../../utilts/cloudnary");
const cloudinary = require("cloudinary").v2;

exports.createServices = async (req, res) => {
  try {
    const { serviceTitle, serviceDescription } = req.body;
    // const author = req.user._id; // Assuming you have user authentication middleware
    if (!serviceTitle || !serviceDescription) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    let imageLink;
    if (req.file) {
      try {
        const image = await uploadOnCloudinary(req.file.buffer, "service");
        imageLink = image.secure_url;
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: "Failed to upload image",
        });
      }
    }
    // Create a new ad item
    const service = new servicesAdmin({
      serviceTitle,
      serviceDescription,
      imageLink,
      // author,
    });
    await service.save();
    return res.status(201).json({
      status: true,
      message: "service created successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({
      status: false,
      message: "Error creating service",
      error: error.message,
    });
  }
};

//_______________________________________

//getting all service

exports.getAllService = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const filter = {
    $or: [{ serviceTitle: { $regex: search, $options: "i" } }],
  };
  const service = await servicesAdmin
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalService = await servicesAdmin.countDocuments(filter);
  const totalPages = Math.ceil(totalService / limit);
  if (service.length === 0) {
    return res.status(404).json({
      status: false,
      message: "No service found",
    });
  }

  res.status(200).json({
    status: true,
    message: "service fetched successfully",
    data: service,
    meta: {
      total: totalService,
      page: page,
      limit: limit,
      totalPages: totalPages,
    },
  });
};

//_______________________________________

//getting single ad

exports.getSingleService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await servicesAdmin.findById(id);
    if (!service) {
      return res.status(404).json({
        status: false,
        message: "Services not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Services fetched successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error fetching Services:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching Services",
      error: error.message,
    });
  }
};

//_______________________________________

//updating services

exports.updateService = async (req, res) => {
  try {
    const id = req.params.id;
    const { serviceTitle, serviceDescription } = req.body;
    // const author = req.user._id; // Assuming you have user authentication middleware
    const existingService = await servicesAdmin.findById(id);
    if (!existingService) {
      return res.status(404).json({
        status: false,
        message: "services not found",
      });
    }
    // Validate the request body
    if (!serviceTitle || !serviceDescription) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(existingService.imageLink);
        const image = await uploadOnCloudinary(req.file.buffer, "service");
        existingService.imageLink = image.secure_url;
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: "Failed to upload image",
        });
      }
    }

    // Update the ad item
    existingService.serviceTitle = serviceTitle;
    existingService.serviceDescription = serviceDescription;
    // existingAd.author = author;

    await existingService.save();
    return res.status(200).json({
      status: true,
      message: "service updated successfully",
      data: existingAd,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({
      status: false,
      message: "Error updating service",
      error: error.message,
    });
  }
};

//_______________________________________

//deleting services

exports.deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await servicesAdmin.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({
        status: false,
        message: "service not found",
        data: "",
      });
    }
    res.status(200).json({
      status: true,
      message: "service deleted successfully",
      data: "",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({
      status: false,
      message: "Error deleting service",
      error: error.message,
    });
  }
};
