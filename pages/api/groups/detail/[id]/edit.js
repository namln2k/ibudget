import * as groupHelper from '../../../../../helpers/group';
import {
  BOTH_VERIFIED,
  HOLDER_ACCEPT,
  HOLDER_REQUEST,
  HOLDER_VERIFIED,
  PARTICIPANT_ACCEPT,
  PARTICIPANT_REQUEST,
  SELF_VERIFY,
  PARTICIPANT_VERIFIED,
  HOLDER_VERIFIED
} from '../../../../../helpers/group';
import * as utilHelper from '../../../../../helpers/util';
import * as GroupRepository from '../../../../../repository/group';

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
      const editMode = groupHelper.getEditMode(userId, detail);

      let updatedDetail = detail;

      switch (editMode) {
        case SELF_VERIFY:
        case HOLDER_ACCEPT:
        case PARTICIPANT_ACCEPT:
          updatedDetail = await GroupRepository.updateOneDetail(detail._id, {
            ...detail,
            ...req.body,
            verified: BOTH_VERIFIED
          });
          res.json({ statusCode: 200, data: updatedDetail });
          return;
        case HOLDER_REQUEST:
          if (detail.verified === PARTICIPANT_VERIFIED) {
            updatedDetail = await GroupRepository.updateOneDetail(detail._id, {
              ...detail,
              ...req.body,
              verified: HOLDER_VERIFIED
            });
            res.json({ statusCode: 200, data: updatedDetail });
          } else {
            updatedDetail = await GroupRepository.updateOneDetail(detail._id, {
              ...detail,
              ...req.body,
              verified: HOLDER_VERIFIED
            });
            res.json({ statusCode: 200, data: updatedDetail });
          }
          return;
        case PARTICIPANT_REQUEST:
          if (detail.verified === HOLDER_VERIFIED) {
            updatedDetail = await GroupRepository.updateOneDetail(detail._id, {
              ...detail,
              ...req.body,
              verified: HOLDER_VERIFIED
            });
            res.json({ statusCode: 200, data: updatedDetail });
          } else {
            updatedDetail = await GroupRepository.updateOneDetail(detail._id, {
              ...detail,
              ...req.body,
              verified: PARTICIPANT_VERIFIED
            });
            res.json({ statusCode: 200, data: updatedDetail });
          }
          return;
        default:
          res.json({
            statusCode: 400,
            error: 'Something went wrong. Try checking your payload!'
          });
          return;
      }
    } else {
      res.json({ statusCode: 401, error: 'You are not authorized' });
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
