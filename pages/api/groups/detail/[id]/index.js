import * as utilHelper from '../../../../../helpers/util';
import * as GroupRepository from '../../../../../repository/group';

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
    const { id: detailId } = req.query;
    const userId = await utilHelper.getUserIdFromRequest(req);

    let detail = await GroupRepository.findDetailById(detailId);

    if (!detail) {
      res.json({ statusCode: 404, error: 'Not found' });
      return;
    }

    if (detail.group.holder == userId || detail.user._id == userId) {
      detail = prepareDetail(detail);
      res.json({ statusCode: 200, data: detail });
    } else {
      res.json({ statusCode: 401, error: 'You are not authorized' });
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
