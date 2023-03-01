import * as utilHelper from '../../../../helpers/util';
import * as GroupRepository from '../../../../repository/group';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);
    req.body.holder = userId;

    const addedGroup = await GroupRepository.create(req.body);
    
    await GroupRepository.createNewEmptyDetail(addedGroup._id, userId);

    res.json({ statusCode: 200, data: addedGroup });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
