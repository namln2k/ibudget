import * as utilHelper from '../../../../helpers/util';
import * as GroupRepository from '../../../../repository/group';

const prepareDetail = (detail) => {
  return {
    ...detail,
    group_id: detail.group._id,
    group_name: detail.group.name,
    group_due_date: detail.group.due_date,
    group_budget: detail.group.budget,
    group_expected_budget: detail.group.expected_budget,
    user_name: detail.user.username
  };
};

export default async function (req, res) {
  try {
    const { id: groupId } = req.query;
    const userId = await utilHelper.getUserIdFromRequest(req);

    let detail = await GroupRepository.findDetail(userId, groupId);

    if (!detail) {
      res.json({ statusCode: 400, error: 'You are not in this group!' });
    } else {
      if (detail.group.holder == userId) {
        const results = await GroupRepository.findDetailsByGroupId(
          detail.group._id
        );

        for (let i = 0; i < results.length; i++) {
          results[i].id = results[i]._id;
          results[i].index = i + 1;

          results[i] = prepareDetail(results[i]);
        }

        res.json({ statusCode: 200, data: results });
      } else {
        detail.id = detail._id;
        detail.index = 1;

        detail = prepareDetail(detail);
        res.json({ statusCode: 200, data: [detail] });
      }
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
