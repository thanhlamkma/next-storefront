import generateCalendar from "antd/lib/calendar/generateCalendar";
import "antd/lib/calendar/style";
import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export default Calendar;
