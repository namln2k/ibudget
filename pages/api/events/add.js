import * as EventRepository from '../../../repository/event';

export default async function (req, res) {
  try {
    const addedEvent = await EventRepository.create(req.body);

    res.json({ statusCode: 200, data: addedEvent });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
