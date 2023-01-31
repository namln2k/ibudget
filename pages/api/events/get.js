import * as EventRepository from '../../../repository/event';

export default async function (req, res) {
  try {
    if (req.query.id) {
      let responseData = await EventRepository.findById(req.query.id);

      res.json({ statusCode: 200, data: responseData });
    } else {
      let responseData = undefined;

      switch (req.query.role) {
        case 'participant':
          responseData = await EventRepository.findAsParticipant(
            req.query.userId
          );

          responseData.forEach((element, index) => {
            element.index = index + 1;
            element.id = element._id;
          });

          res.json({ statusCode: 200, data: responseData });
          break;
        case 'holder':
          responseData = await EventRepository.findAsHolder(req.query.userId);

          responseData.forEach((element, index) => {
            element.index = index + 1;
            element.id = element._id;
          });

          res.json({ statusCode: 200, data: responseData });
          break;
        default:
          res.json({ statusCode: 400, error: 'Invalid role!' });
      }
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
