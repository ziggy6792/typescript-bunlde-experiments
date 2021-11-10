import localMomemt from 'moment-timezone';

localMomemt.tz.setDefault('Asia/Singapore');

localMomemt.defaultFormat = 'ddd DD MMM HH:mm';

export default localMomemt;
