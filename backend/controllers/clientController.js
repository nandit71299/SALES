import dataModel from "../models/dataModel.js";
import { genNextSequenceValue } from "../utils/sequenceGenerator.js";

const Client = dataModel.Client;

export const getClient = async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createClient = async (req, res) => {
  console.log("createClient");
  try {
    const { name, email, website, phone } = req.body;

    console.log(req.body);
    if (!name && !email)
      return res.status(400).json({
        success: false,
        message: "Please enter a name and email address",
      });
    const newClient = new Client({
      id: await genNextSequenceValue("client"),
      name,
      email,
      website,
      phone,
    });
    await newClient.save();
    return res.status(200).json({
      success: true,
      message: "Client created successfully",
      data: newClient,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server error", error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ id: req.params.id });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ success: true, message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { name, email, website, phone } = req.body;
    const client = await Client.findOneAndUpdate(
      { id: req.params.id },
      { name, email, website, phone },
      { new: true }
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server error", error: error.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    return res.json(clients);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server errors", error: err.message });
  }
};
