import * as utilHelper from '../../../../helpers/util';
import * as GroupRepository from '../../../../repository/group';

export default async function (req, res) {
  try {
    const { id: groupId } = req.query;
    const userId = await utilHelper.getUserIdFromRequest(req);

    const detailForThisUser = await GroupRepository.findDetail(userId, groupId);

    if (detailForThisUser) {
      res.json({ statusCode: 400, data: 'You are already in this group!' });
    } else {
      const detail = await GroupRepository.createNewEmptyDetail(
        groupId,
        userId
      );
      res.json({ statusCode: 200, data: detail });
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
