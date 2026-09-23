import mongoose from 'mongoose';
import Task from '../models/Task.js';

const validateId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant de tâche invalide' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description, status });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant de tâche invalide' });
    }

    const { title, description, status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant de tâche invalide' });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};
