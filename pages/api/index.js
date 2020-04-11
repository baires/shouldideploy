import Time from "../../helpers/time";
import { getRandom, dayHelper } from '../../helpers/constans';

export default (req, res) => {
  let timezone = req.query.tz || 'UTC';
  let time = new Time(timezone);

  res.status(200).json({
    timezone: timezone,
    shouldideploy: !time.isFriday(),
    message: getRandom(dayHelper(time)),
  });
};
