import * as utilHelper from '../../../../helpers/util';
import * as GroupRepository from '../../../../repository/group';

export default async function (req, res) {
  try {
    const { id: groupId } = req.query;
    const userId = await utilHelper.getUserIdFromRequest(req);

    const details = await GroupRepository.findDetailsByGroupId(groupId);

    const canLeave = await GroupRepository.canLeave(userId, groupId);

    if (utilHelper.isValidObjectId(canLeave)) {
      const deletedCount = await GroupRepository.deleteDetailById(
        details[0]._id
      );

      if (deletedCount === 1) {
        res.json({ statusCode: 200, data: true });
      } else {
        res.json({
          statusCode: 400,
          error: 'Unsuccessful! Your changes may not have been saved!'
        });
      }
    } else {
      res.json({
        statusCode: 400,
        error: canLeave
      });
    }

    res.json({ statusCode: 200, data: false });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
