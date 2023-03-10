import * as groupHelper from '../../../../../helpers/group';
import {
  BOTH_VERIFIED,
  HOLDER_ACCEPT,
  HOLDER_REQUEST,
  HOLDER_VERIFIED,
  PARTICIPANT_ACCEPT,
  PARTICIPANT_REQUEST,
  PARTICIPANT_VERIFIED,
  SELF_VERIFY
} from '../../../../../helpers/group';
import * as utilHelper from '../../../../../helpers/util';
import * as GroupRepository from '../../../../../repository/group';
import * as TransactionRepository from '../../../../../repository/transaction';
import * as UserRepository from '../../../../../repository/user';

/**
 * Create a transaction representing that {user} has deposited/withdraw {amount} into/from group {group.name}
 *
 * @param {UUID} userId
 * @param {float/Decimal128} amount
 * @param {object} group
 * @param {int} verifyStatus
 * @returns
 */
const createTransaction = async (userId, amount, group, verifyStatus) => {
  if (amount == 0) {
    return true;
  }

  let title = '';

  if (amount > 0) {
    title = `Deposite money to group "${group.name}"`;
  } else {
    title = `Withdraw money from group "${group.name}"`;
  }

  amount = -1 * amount;

  const detail = `GroupID: ${group._id}\nVerify status: ${
    verifyStatus === PARTICIPANT_REQUEST || verifyStatus === HOLDER_REQUEST
      ? 'Pending'
      : 'Verified'
  }`;

  try {
    let transaction = {
      user_id: userId,
      amount,
      title,
      detail
    };

    await TransactionRepository.create(transaction);

    await UserRepository.updateBalance(userId, amount);

    return true;
  } catch (e) {
    throw new Error(e.toString());
  }
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
      const editMode = groupHelper.getEditMode(userId, detail);

      let updatedDetail = detail;

      switch (editMode) {
        case SELF_VERIFY:
        case HOLDER_ACCEPT:
        case PARTICIPANT_ACCEPT:
          let toUpdate = {
            verified: BOTH_VERIFIED
          };

          const payChange =
            parseFloat(req.body.amount_paid.$numberDecimal) -
            parseFloat(detail.amount_paid);

          if (editMode === SELF_VERIFY) {
            toUpdate = { ...detail, ...req.body, ...toUpdate };

            createTransaction(userId, payChange, detail.group);
          }

          updatedDetail = await GroupRepository.updateOneDetail(
            detail._id,
            toUpdate
          );

          await GroupRepository.updateOne({
            ...detail.group,
            budget: parseFloat(detail.group.budget) + payChange,
            expected_budget:
              parseFloat(detail.group.expected_budget) +
              parseFloat(req.body.amount_to_pay.$numberDecimal) -
              parseFloat(detail.amount_to_pay)
          });

          res.json({ statusCode: 200, data: updatedDetail });
          return;
        case HOLDER_REQUEST:
          if (detail.verified === PARTICIPANT_VERIFIED) {
            res.json({
              statusCode: 400,
              error: 'There may have some changes. Please reload and try again!'
            });
          } else {
            updatedDetail = await GroupRepository.updateOneDetail(detail._id, {
              ...detail,
              ...req.body,
              verified: HOLDER_VERIFIED
            });

            const payChange =
              parseFloat(req.body.amount_paid.$numberDecimal) -
              parseFloat(detail.amount_paid);
            createTransaction(userId, payChange, detail.group, HOLDER_VERIFIED);

            res.json({ statusCode: 200, data: updatedDetail });
          }
          return;
        case PARTICIPANT_REQUEST:
          if (detail.verified === HOLDER_VERIFIED) {
            res.json({
              statusCode: 400,
              error: 'There may have some changes. Please reload and try again!'
            });
          } else {
            updatedDetail = await GroupRepository.updateOneDetail(detail._id, {
              ...detail,
              ...req.body,
              verified: PARTICIPANT_VERIFIED
            });

            const payChange =
              parseFloat(req.body.amount_paid.$numberDecimal) -
              parseFloat(detail.amount_paid);
            createTransaction(
              userId,
              payChange,
              detail.group,
              PARTICIPANT_VERIFIED
            );

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
