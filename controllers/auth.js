

export const showResponse = (req, res) => {
  res.status(200).send(req.params.message);
};

