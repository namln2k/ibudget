import * as utilHelper from '../../../../helpers/util';
import * as GroupRepository from '../../../../repository/group';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);

    const responseData = await GroupRepository.findGroupsForUser(userId);

    responseData.forEach((group, index) => {
      group.index = index + 1;
      group.id = group._id;
      
      if (group.holder = userId) {
        group.role = 'Holder'
      } else {
        group.role = 'Participant'
      }
    })

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
