export const notFound = (req, res) => {
  res.status(404).json({ message: `Route introuvable: ${req.originalUrl}` });
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(error.errors).map(({ message }) => message).join(', ')
    });
  }

  res.status(statusCode).json({
    message: error.message || 'Une erreur serveur est survenue'
  });
};
