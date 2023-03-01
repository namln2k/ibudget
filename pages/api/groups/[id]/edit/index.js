import * as utilHelper from '../../../../../helpers/util';
import * as GroupRepository from '../../../../../repository/group';

export default async function (req, res) {
  try {
    const { id: groupId } = req.query;
    const userId = await utilHelper.getUserIdFromRequest(req);

    const group = await GroupRepository.findById(groupId);

    if (!group) {
      res.json({ statusCode: 404, error: 'Group not found!' });
    } else {
      if (group.holder == userId) {
        const group = await GroupRepository.updateOne(req.body);

        res.json({ statusCode: 200, data: group });
      } else {
        res.json({ statusCode: 401, error: 'You are not authorized!' });
      }
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
