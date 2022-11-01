import * as User from '../../../../model/User';

export default async function (req, res) {
  try {
    await User.createNew(req.body);

    res.json({ statusCode: 200 });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
