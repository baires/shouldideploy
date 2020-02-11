import { getRandom, dayHelper, IS_FRIDAY } from '../../helpers/constans';

export default (req, res) => {
  res.status(200).json({
    shouldideploy: !IS_FRIDAY,
    message: getRandom(dayHelper()),
  });
};
