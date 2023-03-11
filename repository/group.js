import GroupModel from '../models/Group';
import GroupUserModel from '../models/GroupUser';

const ERR_CODE_DUPLICATE_KEY = 11000;

export async function create(group) {
  try {
    const addedGroup = await GroupModel.create(group);

    return addedGroup;
  } catch (error) {
    if (error.code === ERR_CODE_DUPLICATE_KEY) {
      throw new Error(Object.keys(error.keyPattern)[0] + ' must be unique!');
    }

    throw new Error(error.toString());
  }
}

export async function findById(id) {
  try {
    const group = await GroupModel.findOne({
      _id: id
    });

    return group;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function updateOne(groupInfo) {
  try {
    const updatedGroup = await GroupModel.findOneAndUpdate(
      {
        _id: groupInfo._id
      },
      groupInfo
    );

    return updatedGroup;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function createNewEmptyDetail(groupId, userId) {
  try {
    const addedRecord = await GroupUserModel.create({
      user: userId,
      group: groupId,
      amount_to_pay: 0,
      amount_paid: 0,
      verified: 3
    });

    return addedRecord;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function updateOneDetail(detailId, newDetail) {
  try {
    const updatedDetail = await GroupUserModel.updateOne(
      {
        _id: detailId
      },
      newDetail
    );

    return updatedDetail;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findGroupsForUser(userId) {
  try {
    const details = await GroupUserModel.find({
      user: userId
    })
      .populate('group')
      .lean()
      .exec();

    return details;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findDetailsForUser(userId) {
  try {
    const groupDetails = await GroupUserModel.find({
      user: userId
    })
      .populate('group')
      .populate('user')
      .lean()
      .exec();

    return groupDetails;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findDetailsByGroupId(groupId, excludeUserId = null) {
  try {
    const query = {
      group: groupId
    };

    if (excludeUserId) {
      query.user = { $ne: excludeUserId };
    }

    const groupDetails = await GroupUserModel.find(query)
      .populate('group')
      .populate('user')
      .lean()
      .exec();

    return groupDetails;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findDetail(userId, groupId) {
  try {
    const query = {
      group: groupId,
      user: userId
    };

    const groupDetail = await GroupUserModel.find(query)
      .populate('group')
      .populate('user')
      .lean()
      .exec();

    if (groupDetail.length === 1) {
      return groupDetail[0];
    } else if (groupDetail.length === 0) {
      return null;
    } else {
      throw new Error(
        "This group's data has got some errors. Please contact us for support!"
      );
    }
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function deleteDetailById(detailId) {
  const result = await GroupUserModel.deleteOne({ _id: detailId });

  return result.deletedCount;
}

export async function canLeave(userId, groupId) {
  const groupDetails = await findDetailsByGroupId(groupId);

  if (groupDetails.length === 1) {
    return groupDetails[0]._id;
  }

  const detailForThisUser = await findDetail(userId, groupId);

  if (!detailForThisUser) {
    return 'You are no longer in this group!';
  }

  if (detailForThisUser.verified != 3) {
    return 'Some transactions have not been verified. Can not leave group right now';
  }

  if (detailForThisUser.group.holder != userId) {
    if (detailForThisUser.amount_paid >= detailForThisUser.amount_to_pay) {
      return detailForThisUser._id;
    }

    return 'You have not fully paid your part!';
  }

  if (
    groupDetails.every(
      (detail) =>
        detail.verified === 3 &&
        parseFloat(detail.amount_paid) >= parseFloat(detail.amount_to_pay)
    )
  ) {
    return detailForThisUser._id;
  }

  return 'Either some transactions have not been verified or someone has not completed their payments yet. ';
}

export async function findDetailById(detailId) {
  try {
    const result = await GroupUserModel.findOne({ _id: detailId })
      .populate('group')
      .populate('user')
      .lean()
      .exec();

    return result;
  } catch (error) {
    throw new Error(error.toString());
  }
}
