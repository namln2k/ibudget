import * as utilHelper from '../../../../helpers/util';
import * as GroupRepository from '../../../../repository/group';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);

    const responseData = await GroupRepository.findGroupsForUser(userId);

    responseData.forEach((groupData, index) => {
      groupData.index = index + 1;
      groupData.id = groupData.group._id;
      
      if (groupData.group.holder == userId) {
        groupData.role = 'Holder'
      } else {
        groupData.role = 'Participant'
      }
    })

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
