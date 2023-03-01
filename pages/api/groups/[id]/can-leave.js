import * as utilHelper from '../../../../helpers/util';
import * as GroupRepository from '../../../../repository/group';

export default async function (req, res) {
  try {
    const { id: groupId } = req.query;
    const userId = await utilHelper.getUserIdFromRequest(req);

    const canLeave = await GroupRepository.canLeave(userId, groupId);

    if (utilHelper.isValidObjectId(canLeave)) {
      res.json({ statusCode: 200, data: true });
    } else {
      res.json({ statusCode: 400, error: canLeave });
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
