import EventModel from '../models/Event';

const ERR_CODE_DUPLICATE_KEY = 11000;

export async function create(event) {
  let result = event;

  try {
    await EventModel.create(event);
  } catch (error) {
    if (error.code === ERR_CODE_DUPLICATE_KEY) {
      throw new Error(Object.keys(error.keyPattern)[0] + ' must be unique!');
    }

    throw new Error(error.toString());
  }

  return result;
}

export async function findAsParticipant(userId) {
  try {
    const events = await EventModel.find({
      user_ids: { $in: [userId] }
    }).exec();

    return events;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findAsHolder(userId) {
  try {
    const events = await EventModel.find({
      holder_id: userId
    })
      .populate('user')
      .exec();

    return events;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findById(eventId) {
  try {
    const event = await EventModel.find({
      _id: eventId
    }).exec();

    if (event.length === 1) {
      return event[0];
    } else {
      throw new Error(
        'Event not found or has been deleted. Please refresh the page and try again!'
      );
    }
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function deleteManyByIds(ids) {
  try {
    const deletedCount = EventModel.deleteMany({ _id: { $in: ids } });

    return deletedCount;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function updateOne(query, event) {
  try {
    const result = await EventModel.findOneAndUpdate(query, { $set: event });

    return result;
  } catch (error) {
    throw new Error(error.toString());
  }
}
