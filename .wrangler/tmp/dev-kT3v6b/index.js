var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-bTutpu/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-bTutpu/checked-fetch.js"() {
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/date-fns/constants.js
var daysInYear, maxTime, minTime, secondsInHour, secondsInDay, secondsInWeek, secondsInYear, secondsInMonth, secondsInQuarter, constructFromSymbol;
var init_constants = __esm({
  "node_modules/date-fns/constants.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    daysInYear = 365.2425;
    maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
    minTime = -maxTime;
    secondsInHour = 3600;
    secondsInDay = secondsInHour * 24;
    secondsInWeek = secondsInDay * 7;
    secondsInYear = secondsInDay * daysInYear;
    secondsInMonth = secondsInYear / 12;
    secondsInQuarter = secondsInMonth * 3;
    constructFromSymbol = Symbol.for("constructDateFrom");
  }
});

// node_modules/date-fns/constructFrom.js
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);
  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);
  if (date instanceof Date) return new date.constructor(value);
  return new Date(value);
}
var init_constructFrom = __esm({
  "node_modules/date-fns/constructFrom.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constants();
    __name(constructFrom, "constructFrom");
  }
});

// node_modules/date-fns/toDate.js
function toDate(argument, context) {
  return constructFrom(context || argument, argument);
}
var init_toDate = __esm({
  "node_modules/date-fns/toDate.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constructFrom();
    __name(toDate, "toDate");
  }
});

// node_modules/date-fns/addDays.js
function addDays(date, amount, options) {
  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
  if (!amount) return _date;
  _date.setDate(_date.getDate() + amount);
  return _date;
}
var init_addDays = __esm({
  "node_modules/date-fns/addDays.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constructFrom();
    init_toDate();
    __name(addDays, "addDays");
  }
});

// node_modules/date-fns/addMonths.js
function addMonths(date, amount, options) {
  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
  if (!amount) {
    return _date;
  }
  const dayOfMonth = _date.getDate();
  const endOfDesiredMonth = constructFrom(options?.in || date, _date.getTime());
  endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
  const daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    _date.setFullYear(
      endOfDesiredMonth.getFullYear(),
      endOfDesiredMonth.getMonth(),
      dayOfMonth
    );
    return _date;
  }
}
var init_addMonths = __esm({
  "node_modules/date-fns/addMonths.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constructFrom();
    init_toDate();
    __name(addMonths, "addMonths");
  }
});

// node_modules/date-fns/add.js
var init_add = __esm({
  "node_modules/date-fns/add.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSaturday.js
var init_isSaturday = __esm({
  "node_modules/date-fns/isSaturday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSunday.js
var init_isSunday = __esm({
  "node_modules/date-fns/isSunday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isWeekend.js
function isWeekend(date, options) {
  const day = toDate(date, options?.in).getDay();
  return day === 0 || day === 6;
}
var init_isWeekend = __esm({
  "node_modules/date-fns/isWeekend.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_toDate();
    __name(isWeekend, "isWeekend");
  }
});

// node_modules/date-fns/addBusinessDays.js
var init_addBusinessDays = __esm({
  "node_modules/date-fns/addBusinessDays.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/addMilliseconds.js
var init_addMilliseconds = __esm({
  "node_modules/date-fns/addMilliseconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/addHours.js
var init_addHours = __esm({
  "node_modules/date-fns/addHours.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfWeek.js
var init_startOfWeek = __esm({
  "node_modules/date-fns/startOfWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfISOWeek.js
var init_startOfISOWeek = __esm({
  "node_modules/date-fns/startOfISOWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getISOWeekYear.js
var init_getISOWeekYear = __esm({
  "node_modules/date-fns/getISOWeekYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/_lib/normalizeDates.js
function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    context || dates.find((date) => typeof date === "object")
  );
  return dates.map(normalize);
}
var init_normalizeDates = __esm({
  "node_modules/date-fns/_lib/normalizeDates.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constructFrom();
    __name(normalizeDates, "normalizeDates");
  }
});

// node_modules/date-fns/startOfDay.js
function startOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
var init_startOfDay = __esm({
  "node_modules/date-fns/startOfDay.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_toDate();
    __name(startOfDay, "startOfDay");
  }
});

// node_modules/date-fns/differenceInCalendarDays.js
var init_differenceInCalendarDays = __esm({
  "node_modules/date-fns/differenceInCalendarDays.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfISOWeekYear.js
var init_startOfISOWeekYear = __esm({
  "node_modules/date-fns/startOfISOWeekYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setISOWeekYear.js
var init_setISOWeekYear = __esm({
  "node_modules/date-fns/setISOWeekYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/addISOWeekYears.js
var init_addISOWeekYears = __esm({
  "node_modules/date-fns/addISOWeekYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/addMinutes.js
var init_addMinutes = __esm({
  "node_modules/date-fns/addMinutes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/addQuarters.js
var init_addQuarters = __esm({
  "node_modules/date-fns/addQuarters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/addSeconds.js
var init_addSeconds = __esm({
  "node_modules/date-fns/addSeconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/addWeeks.js
var init_addWeeks = __esm({
  "node_modules/date-fns/addWeeks.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/addYears.js
var init_addYears = __esm({
  "node_modules/date-fns/addYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/areIntervalsOverlapping.js
var init_areIntervalsOverlapping = __esm({
  "node_modules/date-fns/areIntervalsOverlapping.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/max.js
var init_max = __esm({
  "node_modules/date-fns/max.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/min.js
var init_min = __esm({
  "node_modules/date-fns/min.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/clamp.js
var init_clamp = __esm({
  "node_modules/date-fns/clamp.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/closestIndexTo.js
var init_closestIndexTo = __esm({
  "node_modules/date-fns/closestIndexTo.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/closestTo.js
var init_closestTo = __esm({
  "node_modules/date-fns/closestTo.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/compareAsc.js
var init_compareAsc = __esm({
  "node_modules/date-fns/compareAsc.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/compareDesc.js
var init_compareDesc = __esm({
  "node_modules/date-fns/compareDesc.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/constructNow.js
var init_constructNow = __esm({
  "node_modules/date-fns/constructNow.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/daysToWeeks.js
var init_daysToWeeks = __esm({
  "node_modules/date-fns/daysToWeeks.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameDay.js
function isSameDay(laterDate, earlierDate, options) {
  const [dateLeft_, dateRight_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  return +startOfDay(dateLeft_) === +startOfDay(dateRight_);
}
var init_isSameDay = __esm({
  "node_modules/date-fns/isSameDay.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_normalizeDates();
    init_startOfDay();
    __name(isSameDay, "isSameDay");
  }
});

// node_modules/date-fns/isDate.js
var init_isDate = __esm({
  "node_modules/date-fns/isDate.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isValid.js
var init_isValid = __esm({
  "node_modules/date-fns/isValid.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInBusinessDays.js
var init_differenceInBusinessDays = __esm({
  "node_modules/date-fns/differenceInBusinessDays.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInCalendarISOWeekYears.js
var init_differenceInCalendarISOWeekYears = __esm({
  "node_modules/date-fns/differenceInCalendarISOWeekYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInCalendarISOWeeks.js
var init_differenceInCalendarISOWeeks = __esm({
  "node_modules/date-fns/differenceInCalendarISOWeeks.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInCalendarMonths.js
var init_differenceInCalendarMonths = __esm({
  "node_modules/date-fns/differenceInCalendarMonths.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getQuarter.js
var init_getQuarter = __esm({
  "node_modules/date-fns/getQuarter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInCalendarQuarters.js
var init_differenceInCalendarQuarters = __esm({
  "node_modules/date-fns/differenceInCalendarQuarters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInCalendarWeeks.js
var init_differenceInCalendarWeeks = __esm({
  "node_modules/date-fns/differenceInCalendarWeeks.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInCalendarYears.js
var init_differenceInCalendarYears = __esm({
  "node_modules/date-fns/differenceInCalendarYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInDays.js
var init_differenceInDays = __esm({
  "node_modules/date-fns/differenceInDays.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInHours.js
var init_differenceInHours = __esm({
  "node_modules/date-fns/differenceInHours.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subISOWeekYears.js
var init_subISOWeekYears = __esm({
  "node_modules/date-fns/subISOWeekYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInISOWeekYears.js
var init_differenceInISOWeekYears = __esm({
  "node_modules/date-fns/differenceInISOWeekYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInMilliseconds.js
var init_differenceInMilliseconds = __esm({
  "node_modules/date-fns/differenceInMilliseconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInMinutes.js
var init_differenceInMinutes = __esm({
  "node_modules/date-fns/differenceInMinutes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfDay.js
var init_endOfDay = __esm({
  "node_modules/date-fns/endOfDay.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfMonth.js
var init_endOfMonth = __esm({
  "node_modules/date-fns/endOfMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isLastDayOfMonth.js
var init_isLastDayOfMonth = __esm({
  "node_modules/date-fns/isLastDayOfMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInMonths.js
var init_differenceInMonths = __esm({
  "node_modules/date-fns/differenceInMonths.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInQuarters.js
var init_differenceInQuarters = __esm({
  "node_modules/date-fns/differenceInQuarters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInSeconds.js
var init_differenceInSeconds = __esm({
  "node_modules/date-fns/differenceInSeconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInWeeks.js
var init_differenceInWeeks = __esm({
  "node_modules/date-fns/differenceInWeeks.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/differenceInYears.js
var init_differenceInYears = __esm({
  "node_modules/date-fns/differenceInYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachDayOfInterval.js
var init_eachDayOfInterval = __esm({
  "node_modules/date-fns/eachDayOfInterval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachHourOfInterval.js
var init_eachHourOfInterval = __esm({
  "node_modules/date-fns/eachHourOfInterval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachMinuteOfInterval.js
var init_eachMinuteOfInterval = __esm({
  "node_modules/date-fns/eachMinuteOfInterval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachMonthOfInterval.js
var init_eachMonthOfInterval = __esm({
  "node_modules/date-fns/eachMonthOfInterval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfQuarter.js
var init_startOfQuarter = __esm({
  "node_modules/date-fns/startOfQuarter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachQuarterOfInterval.js
var init_eachQuarterOfInterval = __esm({
  "node_modules/date-fns/eachQuarterOfInterval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachWeekOfInterval.js
var init_eachWeekOfInterval = __esm({
  "node_modules/date-fns/eachWeekOfInterval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachWeekendOfInterval.js
var init_eachWeekendOfInterval = __esm({
  "node_modules/date-fns/eachWeekendOfInterval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfMonth.js
var init_startOfMonth = __esm({
  "node_modules/date-fns/startOfMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachWeekendOfMonth.js
var init_eachWeekendOfMonth = __esm({
  "node_modules/date-fns/eachWeekendOfMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfYear.js
var init_endOfYear = __esm({
  "node_modules/date-fns/endOfYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfYear.js
var init_startOfYear = __esm({
  "node_modules/date-fns/startOfYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachWeekendOfYear.js
var init_eachWeekendOfYear = __esm({
  "node_modules/date-fns/eachWeekendOfYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/eachYearOfInterval.js
var init_eachYearOfInterval = __esm({
  "node_modules/date-fns/eachYearOfInterval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfDecade.js
var init_endOfDecade = __esm({
  "node_modules/date-fns/endOfDecade.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfHour.js
var init_endOfHour = __esm({
  "node_modules/date-fns/endOfHour.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfWeek.js
var init_endOfWeek = __esm({
  "node_modules/date-fns/endOfWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfISOWeek.js
var init_endOfISOWeek = __esm({
  "node_modules/date-fns/endOfISOWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfISOWeekYear.js
var init_endOfISOWeekYear = __esm({
  "node_modules/date-fns/endOfISOWeekYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfMinute.js
var init_endOfMinute = __esm({
  "node_modules/date-fns/endOfMinute.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfQuarter.js
var init_endOfQuarter = __esm({
  "node_modules/date-fns/endOfQuarter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfSecond.js
var init_endOfSecond = __esm({
  "node_modules/date-fns/endOfSecond.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfToday.js
var init_endOfToday = __esm({
  "node_modules/date-fns/endOfToday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfTomorrow.js
var init_endOfTomorrow = __esm({
  "node_modules/date-fns/endOfTomorrow.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/endOfYesterday.js
var init_endOfYesterday = __esm({
  "node_modules/date-fns/endOfYesterday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getDayOfYear.js
var init_getDayOfYear = __esm({
  "node_modules/date-fns/getDayOfYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getISOWeek.js
var init_getISOWeek = __esm({
  "node_modules/date-fns/getISOWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getWeekYear.js
var init_getWeekYear = __esm({
  "node_modules/date-fns/getWeekYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfWeekYear.js
var init_startOfWeekYear = __esm({
  "node_modules/date-fns/startOfWeekYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getWeek.js
var init_getWeek = __esm({
  "node_modules/date-fns/getWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/format.js
var init_format = __esm({
  "node_modules/date-fns/format.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatDistance.js
var init_formatDistance = __esm({
  "node_modules/date-fns/formatDistance.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatDistanceStrict.js
var init_formatDistanceStrict = __esm({
  "node_modules/date-fns/formatDistanceStrict.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatDistanceToNow.js
var init_formatDistanceToNow = __esm({
  "node_modules/date-fns/formatDistanceToNow.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatDistanceToNowStrict.js
var init_formatDistanceToNowStrict = __esm({
  "node_modules/date-fns/formatDistanceToNowStrict.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatDuration.js
var init_formatDuration = __esm({
  "node_modules/date-fns/formatDuration.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatISO.js
var init_formatISO = __esm({
  "node_modules/date-fns/formatISO.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatISO9075.js
var init_formatISO9075 = __esm({
  "node_modules/date-fns/formatISO9075.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatISODuration.js
var init_formatISODuration = __esm({
  "node_modules/date-fns/formatISODuration.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatRFC3339.js
var init_formatRFC3339 = __esm({
  "node_modules/date-fns/formatRFC3339.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatRFC7231.js
var init_formatRFC7231 = __esm({
  "node_modules/date-fns/formatRFC7231.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/formatRelative.js
var init_formatRelative = __esm({
  "node_modules/date-fns/formatRelative.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/fromUnixTime.js
var init_fromUnixTime = __esm({
  "node_modules/date-fns/fromUnixTime.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getDate.js
var init_getDate = __esm({
  "node_modules/date-fns/getDate.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getDay.js
var init_getDay = __esm({
  "node_modules/date-fns/getDay.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getDaysInMonth.js
var init_getDaysInMonth = __esm({
  "node_modules/date-fns/getDaysInMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isLeapYear.js
var init_isLeapYear = __esm({
  "node_modules/date-fns/isLeapYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getDaysInYear.js
var init_getDaysInYear = __esm({
  "node_modules/date-fns/getDaysInYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getDecade.js
var init_getDecade = __esm({
  "node_modules/date-fns/getDecade.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getDefaultOptions.js
var init_getDefaultOptions = __esm({
  "node_modules/date-fns/getDefaultOptions.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getHours.js
var init_getHours = __esm({
  "node_modules/date-fns/getHours.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getISODay.js
var init_getISODay = __esm({
  "node_modules/date-fns/getISODay.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getISOWeeksInYear.js
var init_getISOWeeksInYear = __esm({
  "node_modules/date-fns/getISOWeeksInYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getMilliseconds.js
var init_getMilliseconds = __esm({
  "node_modules/date-fns/getMilliseconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getMinutes.js
var init_getMinutes = __esm({
  "node_modules/date-fns/getMinutes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getMonth.js
var init_getMonth = __esm({
  "node_modules/date-fns/getMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getOverlappingDaysInIntervals.js
var init_getOverlappingDaysInIntervals = __esm({
  "node_modules/date-fns/getOverlappingDaysInIntervals.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getSeconds.js
var init_getSeconds = __esm({
  "node_modules/date-fns/getSeconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getTime.js
var init_getTime = __esm({
  "node_modules/date-fns/getTime.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getUnixTime.js
var init_getUnixTime = __esm({
  "node_modules/date-fns/getUnixTime.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getWeekOfMonth.js
var init_getWeekOfMonth = __esm({
  "node_modules/date-fns/getWeekOfMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/lastDayOfMonth.js
var init_lastDayOfMonth = __esm({
  "node_modules/date-fns/lastDayOfMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getWeeksInMonth.js
var init_getWeeksInMonth = __esm({
  "node_modules/date-fns/getWeeksInMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/getYear.js
var init_getYear = __esm({
  "node_modules/date-fns/getYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/hoursToMilliseconds.js
var init_hoursToMilliseconds = __esm({
  "node_modules/date-fns/hoursToMilliseconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/hoursToMinutes.js
var init_hoursToMinutes = __esm({
  "node_modules/date-fns/hoursToMinutes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/hoursToSeconds.js
var init_hoursToSeconds = __esm({
  "node_modules/date-fns/hoursToSeconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/interval.js
var init_interval = __esm({
  "node_modules/date-fns/interval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/intervalToDuration.js
var init_intervalToDuration = __esm({
  "node_modules/date-fns/intervalToDuration.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/intlFormat.js
var init_intlFormat = __esm({
  "node_modules/date-fns/intlFormat.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/intlFormatDistance.js
var init_intlFormatDistance = __esm({
  "node_modules/date-fns/intlFormatDistance.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isAfter.js
var init_isAfter = __esm({
  "node_modules/date-fns/isAfter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isBefore.js
var init_isBefore = __esm({
  "node_modules/date-fns/isBefore.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isEqual.js
var init_isEqual = __esm({
  "node_modules/date-fns/isEqual.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isExists.js
var init_isExists = __esm({
  "node_modules/date-fns/isExists.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isFirstDayOfMonth.js
var init_isFirstDayOfMonth = __esm({
  "node_modules/date-fns/isFirstDayOfMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isFriday.js
var init_isFriday = __esm({
  "node_modules/date-fns/isFriday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isFuture.js
var init_isFuture = __esm({
  "node_modules/date-fns/isFuture.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/transpose.js
var init_transpose = __esm({
  "node_modules/date-fns/transpose.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setWeek.js
var init_setWeek = __esm({
  "node_modules/date-fns/setWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setISOWeek.js
var init_setISOWeek = __esm({
  "node_modules/date-fns/setISOWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setDay.js
var init_setDay = __esm({
  "node_modules/date-fns/setDay.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setISODay.js
var init_setISODay = __esm({
  "node_modules/date-fns/setISODay.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/parse.js
var init_parse = __esm({
  "node_modules/date-fns/parse.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isMatch.js
var init_isMatch = __esm({
  "node_modules/date-fns/isMatch.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isMonday.js
var init_isMonday = __esm({
  "node_modules/date-fns/isMonday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isPast.js
var init_isPast = __esm({
  "node_modules/date-fns/isPast.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfHour.js
var init_startOfHour = __esm({
  "node_modules/date-fns/startOfHour.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameHour.js
var init_isSameHour = __esm({
  "node_modules/date-fns/isSameHour.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameWeek.js
var init_isSameWeek = __esm({
  "node_modules/date-fns/isSameWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameISOWeek.js
var init_isSameISOWeek = __esm({
  "node_modules/date-fns/isSameISOWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameISOWeekYear.js
var init_isSameISOWeekYear = __esm({
  "node_modules/date-fns/isSameISOWeekYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfMinute.js
var init_startOfMinute = __esm({
  "node_modules/date-fns/startOfMinute.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameMinute.js
var init_isSameMinute = __esm({
  "node_modules/date-fns/isSameMinute.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameMonth.js
var init_isSameMonth = __esm({
  "node_modules/date-fns/isSameMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameQuarter.js
var init_isSameQuarter = __esm({
  "node_modules/date-fns/isSameQuarter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfSecond.js
var init_startOfSecond = __esm({
  "node_modules/date-fns/startOfSecond.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameSecond.js
var init_isSameSecond = __esm({
  "node_modules/date-fns/isSameSecond.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isSameYear.js
var init_isSameYear = __esm({
  "node_modules/date-fns/isSameYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isThisHour.js
var init_isThisHour = __esm({
  "node_modules/date-fns/isThisHour.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isThisISOWeek.js
var init_isThisISOWeek = __esm({
  "node_modules/date-fns/isThisISOWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isThisMinute.js
var init_isThisMinute = __esm({
  "node_modules/date-fns/isThisMinute.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isThisMonth.js
var init_isThisMonth = __esm({
  "node_modules/date-fns/isThisMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isThisQuarter.js
var init_isThisQuarter = __esm({
  "node_modules/date-fns/isThisQuarter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isThisSecond.js
var init_isThisSecond = __esm({
  "node_modules/date-fns/isThisSecond.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isThisWeek.js
var init_isThisWeek = __esm({
  "node_modules/date-fns/isThisWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isThisYear.js
var init_isThisYear = __esm({
  "node_modules/date-fns/isThisYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isThursday.js
var init_isThursday = __esm({
  "node_modules/date-fns/isThursday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isToday.js
var init_isToday = __esm({
  "node_modules/date-fns/isToday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isTomorrow.js
var init_isTomorrow = __esm({
  "node_modules/date-fns/isTomorrow.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isTuesday.js
var init_isTuesday = __esm({
  "node_modules/date-fns/isTuesday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isWednesday.js
var init_isWednesday = __esm({
  "node_modules/date-fns/isWednesday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isWithinInterval.js
var init_isWithinInterval = __esm({
  "node_modules/date-fns/isWithinInterval.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subDays.js
var init_subDays = __esm({
  "node_modules/date-fns/subDays.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/isYesterday.js
var init_isYesterday = __esm({
  "node_modules/date-fns/isYesterday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/lastDayOfDecade.js
var init_lastDayOfDecade = __esm({
  "node_modules/date-fns/lastDayOfDecade.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/lastDayOfWeek.js
var init_lastDayOfWeek = __esm({
  "node_modules/date-fns/lastDayOfWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/lastDayOfISOWeek.js
var init_lastDayOfISOWeek = __esm({
  "node_modules/date-fns/lastDayOfISOWeek.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/lastDayOfISOWeekYear.js
var init_lastDayOfISOWeekYear = __esm({
  "node_modules/date-fns/lastDayOfISOWeekYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/lastDayOfQuarter.js
var init_lastDayOfQuarter = __esm({
  "node_modules/date-fns/lastDayOfQuarter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/lastDayOfYear.js
var init_lastDayOfYear = __esm({
  "node_modules/date-fns/lastDayOfYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/lightFormat.js
var init_lightFormat = __esm({
  "node_modules/date-fns/lightFormat.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/milliseconds.js
var init_milliseconds = __esm({
  "node_modules/date-fns/milliseconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/millisecondsToHours.js
var init_millisecondsToHours = __esm({
  "node_modules/date-fns/millisecondsToHours.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/millisecondsToMinutes.js
var init_millisecondsToMinutes = __esm({
  "node_modules/date-fns/millisecondsToMinutes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/millisecondsToSeconds.js
var init_millisecondsToSeconds = __esm({
  "node_modules/date-fns/millisecondsToSeconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/minutesToHours.js
var init_minutesToHours = __esm({
  "node_modules/date-fns/minutesToHours.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/minutesToMilliseconds.js
var init_minutesToMilliseconds = __esm({
  "node_modules/date-fns/minutesToMilliseconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/minutesToSeconds.js
var init_minutesToSeconds = __esm({
  "node_modules/date-fns/minutesToSeconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/monthsToQuarters.js
var init_monthsToQuarters = __esm({
  "node_modules/date-fns/monthsToQuarters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/monthsToYears.js
var init_monthsToYears = __esm({
  "node_modules/date-fns/monthsToYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/nextDay.js
var init_nextDay = __esm({
  "node_modules/date-fns/nextDay.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/nextFriday.js
var init_nextFriday = __esm({
  "node_modules/date-fns/nextFriday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/nextMonday.js
var init_nextMonday = __esm({
  "node_modules/date-fns/nextMonday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/nextSaturday.js
var init_nextSaturday = __esm({
  "node_modules/date-fns/nextSaturday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/nextSunday.js
var init_nextSunday = __esm({
  "node_modules/date-fns/nextSunday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/nextThursday.js
var init_nextThursday = __esm({
  "node_modules/date-fns/nextThursday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/nextTuesday.js
var init_nextTuesday = __esm({
  "node_modules/date-fns/nextTuesday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/nextWednesday.js
var init_nextWednesday = __esm({
  "node_modules/date-fns/nextWednesday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/parseISO.js
var init_parseISO = __esm({
  "node_modules/date-fns/parseISO.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/parseJSON.js
var init_parseJSON = __esm({
  "node_modules/date-fns/parseJSON.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/previousDay.js
var init_previousDay = __esm({
  "node_modules/date-fns/previousDay.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/previousFriday.js
var init_previousFriday = __esm({
  "node_modules/date-fns/previousFriday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/previousMonday.js
var init_previousMonday = __esm({
  "node_modules/date-fns/previousMonday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/previousSaturday.js
var init_previousSaturday = __esm({
  "node_modules/date-fns/previousSaturday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/previousSunday.js
var init_previousSunday = __esm({
  "node_modules/date-fns/previousSunday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/previousThursday.js
var init_previousThursday = __esm({
  "node_modules/date-fns/previousThursday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/previousTuesday.js
var init_previousTuesday = __esm({
  "node_modules/date-fns/previousTuesday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/previousWednesday.js
var init_previousWednesday = __esm({
  "node_modules/date-fns/previousWednesday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/quartersToMonths.js
var init_quartersToMonths = __esm({
  "node_modules/date-fns/quartersToMonths.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/quartersToYears.js
var init_quartersToYears = __esm({
  "node_modules/date-fns/quartersToYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/roundToNearestHours.js
var init_roundToNearestHours = __esm({
  "node_modules/date-fns/roundToNearestHours.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/roundToNearestMinutes.js
var init_roundToNearestMinutes = __esm({
  "node_modules/date-fns/roundToNearestMinutes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/secondsToHours.js
var init_secondsToHours = __esm({
  "node_modules/date-fns/secondsToHours.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/secondsToMilliseconds.js
var init_secondsToMilliseconds = __esm({
  "node_modules/date-fns/secondsToMilliseconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/secondsToMinutes.js
var init_secondsToMinutes = __esm({
  "node_modules/date-fns/secondsToMinutes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setMonth.js
var init_setMonth = __esm({
  "node_modules/date-fns/setMonth.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/set.js
var init_set = __esm({
  "node_modules/date-fns/set.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setDate.js
var init_setDate = __esm({
  "node_modules/date-fns/setDate.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setDayOfYear.js
var init_setDayOfYear = __esm({
  "node_modules/date-fns/setDayOfYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setDefaultOptions.js
var init_setDefaultOptions = __esm({
  "node_modules/date-fns/setDefaultOptions.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setHours.js
var init_setHours = __esm({
  "node_modules/date-fns/setHours.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setMilliseconds.js
var init_setMilliseconds = __esm({
  "node_modules/date-fns/setMilliseconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setMinutes.js
var init_setMinutes = __esm({
  "node_modules/date-fns/setMinutes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setQuarter.js
var init_setQuarter = __esm({
  "node_modules/date-fns/setQuarter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setSeconds.js
var init_setSeconds = __esm({
  "node_modules/date-fns/setSeconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setWeekYear.js
var init_setWeekYear = __esm({
  "node_modules/date-fns/setWeekYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/setYear.js
var init_setYear = __esm({
  "node_modules/date-fns/setYear.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfDecade.js
var init_startOfDecade = __esm({
  "node_modules/date-fns/startOfDecade.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfToday.js
var init_startOfToday = __esm({
  "node_modules/date-fns/startOfToday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfTomorrow.js
var init_startOfTomorrow = __esm({
  "node_modules/date-fns/startOfTomorrow.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/startOfYesterday.js
var init_startOfYesterday = __esm({
  "node_modules/date-fns/startOfYesterday.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subMonths.js
var init_subMonths = __esm({
  "node_modules/date-fns/subMonths.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/sub.js
var init_sub = __esm({
  "node_modules/date-fns/sub.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subBusinessDays.js
var init_subBusinessDays = __esm({
  "node_modules/date-fns/subBusinessDays.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subHours.js
var init_subHours = __esm({
  "node_modules/date-fns/subHours.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subMilliseconds.js
var init_subMilliseconds = __esm({
  "node_modules/date-fns/subMilliseconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subMinutes.js
var init_subMinutes = __esm({
  "node_modules/date-fns/subMinutes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subQuarters.js
var init_subQuarters = __esm({
  "node_modules/date-fns/subQuarters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subSeconds.js
var init_subSeconds = __esm({
  "node_modules/date-fns/subSeconds.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subWeeks.js
var init_subWeeks = __esm({
  "node_modules/date-fns/subWeeks.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/subYears.js
var init_subYears = __esm({
  "node_modules/date-fns/subYears.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/weeksToDays.js
var init_weeksToDays = __esm({
  "node_modules/date-fns/weeksToDays.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/yearsToDays.js
var init_yearsToDays = __esm({
  "node_modules/date-fns/yearsToDays.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/yearsToMonths.js
var init_yearsToMonths = __esm({
  "node_modules/date-fns/yearsToMonths.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/yearsToQuarters.js
var init_yearsToQuarters = __esm({
  "node_modules/date-fns/yearsToQuarters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/date-fns/index.js
var init_date_fns = __esm({
  "node_modules/date-fns/index.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_add();
    init_addBusinessDays();
    init_addDays();
    init_addHours();
    init_addISOWeekYears();
    init_addMilliseconds();
    init_addMinutes();
    init_addMonths();
    init_addQuarters();
    init_addSeconds();
    init_addWeeks();
    init_addYears();
    init_areIntervalsOverlapping();
    init_clamp();
    init_closestIndexTo();
    init_closestTo();
    init_compareAsc();
    init_compareDesc();
    init_constructFrom();
    init_constructNow();
    init_daysToWeeks();
    init_differenceInBusinessDays();
    init_differenceInCalendarDays();
    init_differenceInCalendarISOWeekYears();
    init_differenceInCalendarISOWeeks();
    init_differenceInCalendarMonths();
    init_differenceInCalendarQuarters();
    init_differenceInCalendarWeeks();
    init_differenceInCalendarYears();
    init_differenceInDays();
    init_differenceInHours();
    init_differenceInISOWeekYears();
    init_differenceInMilliseconds();
    init_differenceInMinutes();
    init_differenceInMonths();
    init_differenceInQuarters();
    init_differenceInSeconds();
    init_differenceInWeeks();
    init_differenceInYears();
    init_eachDayOfInterval();
    init_eachHourOfInterval();
    init_eachMinuteOfInterval();
    init_eachMonthOfInterval();
    init_eachQuarterOfInterval();
    init_eachWeekOfInterval();
    init_eachWeekendOfInterval();
    init_eachWeekendOfMonth();
    init_eachWeekendOfYear();
    init_eachYearOfInterval();
    init_endOfDay();
    init_endOfDecade();
    init_endOfHour();
    init_endOfISOWeek();
    init_endOfISOWeekYear();
    init_endOfMinute();
    init_endOfMonth();
    init_endOfQuarter();
    init_endOfSecond();
    init_endOfToday();
    init_endOfTomorrow();
    init_endOfWeek();
    init_endOfYear();
    init_endOfYesterday();
    init_format();
    init_formatDistance();
    init_formatDistanceStrict();
    init_formatDistanceToNow();
    init_formatDistanceToNowStrict();
    init_formatDuration();
    init_formatISO();
    init_formatISO9075();
    init_formatISODuration();
    init_formatRFC3339();
    init_formatRFC7231();
    init_formatRelative();
    init_fromUnixTime();
    init_getDate();
    init_getDay();
    init_getDayOfYear();
    init_getDaysInMonth();
    init_getDaysInYear();
    init_getDecade();
    init_getDefaultOptions();
    init_getHours();
    init_getISODay();
    init_getISOWeek();
    init_getISOWeekYear();
    init_getISOWeeksInYear();
    init_getMilliseconds();
    init_getMinutes();
    init_getMonth();
    init_getOverlappingDaysInIntervals();
    init_getQuarter();
    init_getSeconds();
    init_getTime();
    init_getUnixTime();
    init_getWeek();
    init_getWeekOfMonth();
    init_getWeekYear();
    init_getWeeksInMonth();
    init_getYear();
    init_hoursToMilliseconds();
    init_hoursToMinutes();
    init_hoursToSeconds();
    init_interval();
    init_intervalToDuration();
    init_intlFormat();
    init_intlFormatDistance();
    init_isAfter();
    init_isBefore();
    init_isDate();
    init_isEqual();
    init_isExists();
    init_isFirstDayOfMonth();
    init_isFriday();
    init_isFuture();
    init_isLastDayOfMonth();
    init_isLeapYear();
    init_isMatch();
    init_isMonday();
    init_isPast();
    init_isSameDay();
    init_isSameHour();
    init_isSameISOWeek();
    init_isSameISOWeekYear();
    init_isSameMinute();
    init_isSameMonth();
    init_isSameQuarter();
    init_isSameSecond();
    init_isSameWeek();
    init_isSameYear();
    init_isSaturday();
    init_isSunday();
    init_isThisHour();
    init_isThisISOWeek();
    init_isThisMinute();
    init_isThisMonth();
    init_isThisQuarter();
    init_isThisSecond();
    init_isThisWeek();
    init_isThisYear();
    init_isThursday();
    init_isToday();
    init_isTomorrow();
    init_isTuesday();
    init_isValid();
    init_isWednesday();
    init_isWeekend();
    init_isWithinInterval();
    init_isYesterday();
    init_lastDayOfDecade();
    init_lastDayOfISOWeek();
    init_lastDayOfISOWeekYear();
    init_lastDayOfMonth();
    init_lastDayOfQuarter();
    init_lastDayOfWeek();
    init_lastDayOfYear();
    init_lightFormat();
    init_max();
    init_milliseconds();
    init_millisecondsToHours();
    init_millisecondsToMinutes();
    init_millisecondsToSeconds();
    init_min();
    init_minutesToHours();
    init_minutesToMilliseconds();
    init_minutesToSeconds();
    init_monthsToQuarters();
    init_monthsToYears();
    init_nextDay();
    init_nextFriday();
    init_nextMonday();
    init_nextSaturday();
    init_nextSunday();
    init_nextThursday();
    init_nextTuesday();
    init_nextWednesday();
    init_parse();
    init_parseISO();
    init_parseJSON();
    init_previousDay();
    init_previousFriday();
    init_previousMonday();
    init_previousSaturday();
    init_previousSunday();
    init_previousThursday();
    init_previousTuesday();
    init_previousWednesday();
    init_quartersToMonths();
    init_quartersToYears();
    init_roundToNearestHours();
    init_roundToNearestMinutes();
    init_secondsToHours();
    init_secondsToMilliseconds();
    init_secondsToMinutes();
    init_set();
    init_setDate();
    init_setDay();
    init_setDayOfYear();
    init_setDefaultOptions();
    init_setHours();
    init_setISODay();
    init_setISOWeek();
    init_setISOWeekYear();
    init_setMilliseconds();
    init_setMinutes();
    init_setMonth();
    init_setQuarter();
    init_setSeconds();
    init_setWeek();
    init_setWeekYear();
    init_setYear();
    init_startOfDay();
    init_startOfDecade();
    init_startOfHour();
    init_startOfISOWeek();
    init_startOfISOWeekYear();
    init_startOfMinute();
    init_startOfMonth();
    init_startOfQuarter();
    init_startOfSecond();
    init_startOfToday();
    init_startOfTomorrow();
    init_startOfWeek();
    init_startOfWeekYear();
    init_startOfYear();
    init_startOfYesterday();
    init_sub();
    init_subBusinessDays();
    init_subDays();
    init_subHours();
    init_subISOWeekYears();
    init_subMilliseconds();
    init_subMinutes();
    init_subMonths();
    init_subQuarters();
    init_subSeconds();
    init_subWeeks();
    init_subYears();
    init_toDate();
    init_transpose();
    init_weeksToDays();
    init_yearsToDays();
    init_yearsToMonths();
    init_yearsToQuarters();
  }
});

// src/lib/coupon-scheduler.js
var coupon_scheduler_exports = {};
__export(coupon_scheduler_exports, {
  CouponScheduler: () => CouponScheduler
});
var CouponScheduler;
var init_coupon_scheduler = __esm({
  "src/lib/coupon-scheduler.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_date_fns();
    CouponScheduler = class {
      static {
        __name(this, "CouponScheduler");
      }
      constructor() {
        this.ukHolidays = [];
      }
      generateCouponSchedule(giltInfo) {
        const { maturityDate, couponRate, faceValue = 100 } = giltInfo;
        const maturity = new Date(maturityDate);
        const today = /* @__PURE__ */ new Date();
        const couponFrequency = 2;
        const couponAmount = couponRate / couponFrequency * (faceValue / 100);
        const schedule = [];
        let currentDate = new Date(maturity);
        while (currentDate > today) {
          const paymentDate = this.adjustForBusinessDay(new Date(currentDate));
          const daysToPayment = Math.floor((paymentDate - today) / (1e3 * 60 * 60 * 24));
          schedule.unshift({
            paymentDate,
            daysToPayment,
            couponAmount,
            principalAmount: isSameDay(paymentDate, maturity) ? faceValue : 0,
            totalPayment: couponAmount + (isSameDay(paymentDate, maturity) ? faceValue : 0)
          });
          currentDate = addMonths(currentDate, -6);
        }
        return schedule;
      }
      calculateAfterTaxCashFlows(schedule, taxRate) {
        return schedule.map((payment) => {
          const couponTax = Math.round(payment.couponAmount * taxRate * 100) / 100;
          const afterTaxCoupon = payment.couponAmount - couponTax;
          const afterTaxTotal = afterTaxCoupon + payment.principalAmount;
          return {
            ...payment,
            couponTax,
            afterTaxCoupon,
            afterTaxTotal
          };
        });
      }
      getScheduleSummary(afterTaxSchedule) {
        if (!afterTaxSchedule || afterTaxSchedule.length === 0) {
          return null;
        }
        const numberOfPayments = afterTaxSchedule.length;
        const firstPayment = afterTaxSchedule[0];
        const finalPayment = afterTaxSchedule[afterTaxSchedule.length - 1];
        const totalCoupons = afterTaxSchedule.reduce((sum, payment) => sum + payment.couponAmount, 0);
        const totalAfterTaxCoupons = afterTaxSchedule.reduce((sum, payment) => sum + payment.afterTaxCoupon, 0);
        const totalTax = afterTaxSchedule.reduce((sum, payment) => sum + payment.couponTax, 0);
        const totalPrincipal = afterTaxSchedule.reduce((sum, payment) => sum + payment.principalAmount, 0);
        return {
          numberOfPayments,
          firstPaymentDate: firstPayment.paymentDate,
          finalPaymentDate: finalPayment.paymentDate,
          totalCoupons,
          totalAfterTaxCoupons,
          totalTax,
          totalPrincipal,
          totalAfterTaxReturn: totalAfterTaxCoupons + totalPrincipal
        };
      }
      adjustForBusinessDay(date) {
        let adjustedDate = new Date(date);
        while (isWeekend(adjustedDate) || this.isUKHoliday(adjustedDate)) {
          adjustedDate = addDays(adjustedDate, 1);
        }
        return adjustedDate;
      }
      isUKHoliday(date) {
        const dateStr = date.toISOString().split("T")[0];
        return this.ukHolidays.includes(dateStr);
      }
      calculateAccruedInterest(couponRate, lastPaymentDate, nextPaymentDate, settlementDate = null) {
        if (!settlementDate) {
          settlementDate = /* @__PURE__ */ new Date();
        }
        const lastPayment = new Date(lastPaymentDate);
        const nextPayment = new Date(nextPaymentDate);
        const daysSinceLastPayment = Math.floor((settlementDate - lastPayment) / (1e3 * 60 * 60 * 24));
        const totalDaysInPeriod = Math.floor((nextPayment - lastPayment) / (1e3 * 60 * 60 * 24));
        const accruedFraction = daysSinceLastPayment / totalDaysInPeriod;
        const semiAnnualCoupon = couponRate / 2;
        const accruedInterest = semiAnnualCoupon * accruedFraction;
        return accruedInterest;
      }
      calculateDirtyPrice(cleanPrice, accruedInterest) {
        return cleanPrice + accruedInterest;
      }
      calculateUnitsOwned(investmentAmount, dirtyPrice) {
        return investmentAmount / dirtyPrice * 100;
      }
      scalePaymentsToInvestment(schedule, investmentAmount, dirtyPrice) {
        const unitsOwned = this.calculateUnitsOwned(investmentAmount, dirtyPrice);
        const scalingFactor = unitsOwned / 100;
        return schedule.map((payment) => ({
          ...payment,
          couponAmount: payment.couponAmount * scalingFactor,
          couponTax: payment.couponTax * scalingFactor,
          afterTaxCoupon: payment.afterTaxCoupon * scalingFactor,
          principalAmount: payment.principalAmount * scalingFactor,
          afterTaxTotal: payment.afterTaxTotal * scalingFactor,
          totalPayment: payment.totalPayment * scalingFactor
        }));
      }
    };
  }
});

// src/lib/gilt-data-complete.js
var gilt_data_complete_exports = {};
__export(gilt_data_complete_exports, {
  GiltDataFetcher: () => GiltDataFetcher
});
var GiltDataFetcher;
var init_gilt_data_complete = __esm({
  "src/lib/gilt-data-complete.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    GiltDataFetcher = class {
      static {
        __name(this, "GiltDataFetcher");
      }
      constructor() {
        this.cache = /* @__PURE__ */ new Map();
        this.cacheExpiry = 1e3 * 60 * 15;
      }
      async fetchGiltData() {
        try {
          const data = await this.fetchFromDividendData();
          if (!data) {
            throw new Error("Failed to fetch gilt data from DividendData");
          }
          return this.calculateGiltMetrics(data);
        } catch (error) {
          console.error("Error fetching gilt data:", error);
          throw error;
        }
      }
      async fetchFromDividendData() {
        try {
          console.log("Fetching gilt data from DividendData...");
          const response = await fetch("https://www.dividenddata.co.uk/uk-gilts-prices-yields.py");
          if (!response.ok) {
            throw new Error(`DividendData HTTP error! status: ${response.status}`);
          }
          const html = await response.text();
          return this.parseGiltHTML(html);
        } catch (error) {
          console.error("DividendData fetch error:", error);
          throw error;
        }
      }
      parseGiltHTML(html) {
        try {
          const giltData = [];
          const tableRowPattern = /<tr[^>]*>.*?<\/tr>/gi;
          const rows = html.match(tableRowPattern) || [];
          for (const row of rows) {
            const cells = this.extractTableCells(row);
            if (cells.length >= 7 && cells[0] && cells[1] && cells[5] && cells[6]) {
              const epic = cells[0].trim();
              const name = cells[1].trim();
              const couponStr = cells[2].trim();
              const maturityStr = cells[3].trim();
              const priceStr = cells[5].trim();
              const yieldStr = cells[6].trim();
              if (epic === "EPIC" || !priceStr.includes("\xA3") || !yieldStr.includes("%")) {
                continue;
              }
              const couponRate = this.parsePercentage(couponStr);
              const cleanPrice = this.parsePrice(priceStr);
              const currentYield = this.parsePercentage(yieldStr);
              const maturityDate = this.parseMaturityDate(maturityStr);
              if (couponRate !== null && cleanPrice !== null && currentYield !== null && maturityDate) {
                giltData.push({
                  name: this.standardizeName(name),
                  couponRate,
                  maturityDate,
                  cleanPrice,
                  currentYield,
                  indexLinked: name.toLowerCase().includes("index"),
                  greenGilt: name.toLowerCase().includes("green")
                });
              }
            }
          }
          console.log(`Parsed ${giltData.length} gilts from DividendData`);
          return giltData.length > 0 ? giltData : null;
        } catch (error) {
          console.error("Error parsing gilt HTML:", error);
          throw error;
        }
      }
      extractTableCells(row) {
        const cellPattern = /<t[dh][^>]*>(.*?)<\/t[dh]>/gi;
        const cells = [];
        let match;
        while ((match = cellPattern.exec(row)) !== null) {
          let cellContent = match[1].replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
          cells.push(cellContent);
        }
        return cells;
      }
      parsePercentage(str) {
        if (!str) return null;
        const match = str.match(/([\d.]+)%?/);
        return match ? parseFloat(match[1]) : null;
      }
      parsePrice(str) {
        if (!str) return null;
        const match = str.match(/£([\d,.]+)/);
        return match ? parseFloat(match[1].replace(/,/g, "")) : null;
      }
      standardizeName(name) {
        return name.replace(/Treasury\s+/i, "Treasury ").replace(/\s+/g, " ").trim();
      }
      parseMaturityDate(dateStr) {
        return [
          // Conventional Gilts - Short Term (0-5 years) - Authentic prices from July 18, 2025
          { name: "Treasury 2% 2025", couponRate: 2, maturityDate: "2025-09-07", cleanPrice: 99.72, currentYield: 4.032 },
          { name: "Treasury 3.5% 2025", couponRate: 3.5, maturityDate: "2025-10-22", cleanPrice: 99.82, currentYield: 4.18 },
          { name: "Treasury 0.125% 2026", couponRate: 0.125, maturityDate: "2026-01-30", cleanPrice: 98.37, currentYield: 3.233 },
          { name: "Treasury 0.375% 2026", couponRate: 0.375, maturityDate: "2026-10-22", cleanPrice: 96.02, currentYield: 3.629 },
          { name: "Treasury 1.5% 2026", couponRate: 1.5, maturityDate: "2026-07-22", cleanPrice: 97.74, currentYield: 3.8 },
          { name: "Treasury 4.125% 2027", couponRate: 4.125, maturityDate: "2027-01-29", cleanPrice: 100.3, currentYield: 3.92 },
          { name: "Treasury 3.75% 2027", couponRate: 3.75, maturityDate: "2027-03-07", cleanPrice: 99.75, currentYield: 3.907 },
          { name: "Treasury 1.25% 2027", couponRate: 1.25, maturityDate: "2027-07-22", cleanPrice: 95.15, currentYield: 3.777 },
          { name: "Treasury 4.25% 2027", couponRate: 4.25, maturityDate: "2027-12-07", cleanPrice: 101.15, currentYield: 3.741 },
          { name: "Treasury 0.125% 2028", couponRate: 0.125, maturityDate: "2028-01-31", cleanPrice: 91.41, currentYield: 3.705 },
          { name: "Treasury 4.375% 2028", couponRate: 4.375, maturityDate: "2028-03-07", cleanPrice: 101.06, currentYield: 3.946 },
          { name: "Treasury 4.5% 2028", couponRate: 4.5, maturityDate: "2028-06-07", cleanPrice: 101.57, currentYield: 3.918 },
          { name: "Treasury 1.625% 2028", couponRate: 1.625, maturityDate: "2028-10-22", cleanPrice: 93.44, currentYield: 3.781 },
          { name: "Treasury 6% 2028", couponRate: 6, maturityDate: "2028-12-07", cleanPrice: 106.94, currentYield: 3.796 },
          { name: "Treasury 0.5% 2029", couponRate: 0.5, maturityDate: "2029-01-31", cleanPrice: 88.96, currentYield: 3.871 },
          { name: "Treasury 4.125% 2029", couponRate: 4.125, maturityDate: "2029-07-22", cleanPrice: 100.42, currentYield: 4.01 },
          { name: "Treasury 0.875% 2029", couponRate: 0.875, maturityDate: "2029-10-22", cleanPrice: 88.29, currentYield: 3.882 },
          { name: "Treasury 4.375% 2030", couponRate: 4.375, maturityDate: "2030-03-07", cleanPrice: 101.17, currentYield: 4.094 },
          { name: "Treasury 0.375% 2030", couponRate: 0.375, maturityDate: "2030-10-22", cleanPrice: 82.96, currentYield: 3.998 },
          { name: "Treasury 4.75% 2030", couponRate: 4.75, maturityDate: "2030-12-07", cleanPrice: 103.37, currentYield: 4.047 },
          // Conventional Gilts - Medium Term (5-15 years) - Authentic prices from July 18, 2025
          { name: "Treasury 0.25% 2031", couponRate: 0.25, maturityDate: "2031-07-31", cleanPrice: 79.65, currentYield: 4.089 },
          { name: "Treasury 4% 2031", couponRate: 4, maturityDate: "2031-10-22", cleanPrice: 98.58, currentYield: 4.26 },
          { name: "Treasury 1% 2032", couponRate: 1, maturityDate: "2032-01-31", cleanPrice: 81.64, currentYield: 4.246 },
          { name: "Treasury 4.25% 2032", couponRate: 4.25, maturityDate: "2032-06-07", cleanPrice: 99.95, currentYield: 4.258 },
          { name: "Treasury 3.25% 2033", couponRate: 3.25, maturityDate: "2033-01-31", cleanPrice: 92.59, currentYield: 4.417 },
          { name: "Treasury 4.625% 2034", couponRate: 4.625, maturityDate: "2034-01-31", cleanPrice: 100.61, currentYield: 4.538 },
          { name: "Treasury 4.25% 2034", couponRate: 4.25, maturityDate: "2034-07-31", cleanPrice: 97.47, currentYield: 4.595 },
          { name: "Treasury 4.5% 2034", couponRate: 4.5, maturityDate: "2034-09-07", cleanPrice: 99.51, currentYield: 4.565 },
          { name: "Treasury 4.5% 2035", couponRate: 4.5, maturityDate: "2035-03-07", cleanPrice: 98.67, currentYield: 4.672 },
          { name: "Treasury 0.625% 2035", couponRate: 0.625, maturityDate: "2035-07-31", cleanPrice: 67.87, currentYield: 4.672 },
          { name: "Treasury 4.25% 2036", couponRate: 4.25, maturityDate: "2036-03-07", cleanPrice: 95.75, currentYield: 4.763 },
          { name: "Treasury 1.75% 2037", couponRate: 1.75, maturityDate: "2037-09-07", cleanPrice: 71.64, currentYield: 4.872 },
          // Conventional Gilts - Long Term (15+ years) - Authentic prices from July 18, 2025
          { name: "Treasury 3.75% 2038", couponRate: 3.75, maturityDate: "2038-01-29", cleanPrice: 88.95, currentYield: 4.943 },
          { name: "Treasury 4.75% 2038", couponRate: 4.75, maturityDate: "2038-12-07", cleanPrice: 97.78, currentYield: 4.979 },
          { name: "Treasury 1.125% 2039", couponRate: 1.125, maturityDate: "2039-01-31", cleanPrice: 62.41, currentYield: 4.974 },
          { name: "Treasury 4.25% 2039", couponRate: 4.25, maturityDate: "2039-09-07", cleanPrice: 91.8, currentYield: 5.069 },
          { name: "Treasury 4.375% 2040", couponRate: 4.375, maturityDate: "2040-01-31", cleanPrice: 92.47, currentYield: 5.115 },
          { name: "Treasury 4.25% 2040", couponRate: 4.25, maturityDate: "2040-12-07", cleanPrice: 90.52, currentYield: 5.149 },
          { name: "Treasury 1.25% 2041", couponRate: 1.25, maturityDate: "2041-10-22", cleanPrice: 57.13, currentYield: 5.183 },
          { name: "Treasury 4.5% 2042", couponRate: 4.5, maturityDate: "2042-12-07", cleanPrice: 91.3, currentYield: 5.27 },
          { name: "Treasury 4.75% 2043", couponRate: 4.75, maturityDate: "2043-10-22", cleanPrice: 93.13, currentYield: 5.343 },
          { name: "Treasury 3.25% 2044", couponRate: 3.25, maturityDate: "2044-01-22", cleanPrice: 75.45, currentYield: 5.357 },
          { name: "Treasury 3.5% 2045", couponRate: 3.5, maturityDate: "2045-01-22", cleanPrice: 77.44, currentYield: 5.382 },
          { name: "Treasury 0.875% 2046", couponRate: 0.875, maturityDate: "2046-01-31", cleanPrice: 44.49, currentYield: 5.37 },
          { name: "Treasury 4.25% 2046", couponRate: 4.25, maturityDate: "2046-12-07", cleanPrice: 85.2, currentYield: 5.428 },
          { name: "Treasury 1.5% 2047", couponRate: 1.5, maturityDate: "2047-07-22", cleanPrice: 50.07, currentYield: 5.407 },
          { name: "Treasury 1.75% 2049", couponRate: 1.75, maturityDate: "2049-01-22", cleanPrice: 51.56, currentYield: 5.418 },
          { name: "Treasury 4.25% 2049", couponRate: 4.25, maturityDate: "2049-12-07", cleanPrice: 83.73, currentYield: 5.465 },
          { name: "Treasury 0.625% 2050", couponRate: 0.625, maturityDate: "2050-10-22", cleanPrice: 35.12, currentYield: 5.327 },
          { name: "Treasury 1.25% 2051", couponRate: 1.25, maturityDate: "2051-07-31", cleanPrice: 41.89, currentYield: 5.456 },
          { name: "Treasury 3.75% 2052", couponRate: 3.75, maturityDate: "2052-07-22", cleanPrice: 75.76, currentYield: 5.48 },
          { name: "Treasury 3.75% 2053", couponRate: 3.75, maturityDate: "2053-10-22", cleanPrice: 74.95, currentYield: 5.508 },
          { name: "Treasury 4.375% 2054", couponRate: 4.375, maturityDate: "2054-07-31", cleanPrice: 83.72, currentYield: 5.504 },
          { name: "Treasury 1.625% 2054", couponRate: 1.625, maturityDate: "2054-10-22", cleanPrice: 44.47, currentYield: 5.438 },
          { name: "Treasury 4.25% 2055", couponRate: 4.25, maturityDate: "2055-12-07", cleanPrice: 81.8, currentYield: 5.487 },
          { name: "Treasury 1.75% 2057", couponRate: 1.75, maturityDate: "2057-07-22", cleanPrice: 44.63, currentYield: 5.406 },
          { name: "Treasury 4% 2060", couponRate: 4, maturityDate: "2060-01-22", cleanPrice: 77.47, currentYield: 5.457 },
          { name: "Treasury 0.5% 2061", couponRate: 0.5, maturityDate: "2061-10-22", cleanPrice: 24.83, currentYield: 5.026 },
          { name: "Treasury 4% 2063", couponRate: 4, maturityDate: "2063-10-22", cleanPrice: 76.62, currentYield: 5.463 },
          { name: "Treasury 2.5% 2065", couponRate: 2.5, maturityDate: "2065-07-22", cleanPrice: 53.07, currentYield: 5.36 },
          { name: "Treasury 3.5% 2068", couponRate: 3.5, maturityDate: "2068-07-22", cleanPrice: 68.68, currentYield: 5.375 },
          { name: "Treasury 1.625% 2071", couponRate: 1.625, maturityDate: "2071-10-22", cleanPrice: 38.2, currentYield: 5.134 },
          { name: "Treasury 1.125% 2073", couponRate: 1.125, maturityDate: "2073-10-22", cleanPrice: 30.63, currentYield: 4.871 },
          // Index-Linked Gilts (3-month lag)
          { name: "Treasury 0.125% Index-linked 2026", couponRate: 0.125, maturityDate: "2026-03-22", cleanPrice: 119.45, currentYield: 2.8, indexLinked: true },
          { name: "Treasury 1.25% Index-linked 2027", couponRate: 1.25, maturityDate: "2027-11-22", cleanPrice: 137.82, currentYield: 3.1, indexLinked: true },
          { name: "Treasury 0.125% Index-linked 2028", couponRate: 0.125, maturityDate: "2028-03-22", cleanPrice: 112.67, currentYield: 2.9, indexLinked: true },
          { name: "Treasury 0.125% Index-linked 2029", couponRate: 0.125, maturityDate: "2029-03-22", cleanPrice: 110.23, currentYield: 3, indexLinked: true },
          { name: "Treasury 0.125% Index-linked 2030", couponRate: 0.125, maturityDate: "2030-03-22", cleanPrice: 107.89, currentYield: 3.1, indexLinked: true },
          { name: "Treasury 0.125% Index-linked 2031", couponRate: 0.125, maturityDate: "2031-03-22", cleanPrice: 105.67, currentYield: 3.2, indexLinked: true },
          { name: "Treasury 1.25% Index-linked 2032", couponRate: 1.25, maturityDate: "2032-11-22", cleanPrice: 128.45, currentYield: 3.3, indexLinked: true },
          { name: "Treasury 0.75% Index-linked 2034", couponRate: 0.75, maturityDate: "2034-11-22", cleanPrice: 98.76, currentYield: 3.4, indexLinked: true },
          { name: "Treasury 0.125% Index-linked 2036", couponRate: 0.125, maturityDate: "2036-03-22", cleanPrice: 83.92, currentYield: 4.9, indexLinked: true },
          { name: "Treasury 1.125% Index-linked 2037", couponRate: 1.125, maturityDate: "2037-11-22", cleanPrice: 89.67, currentYield: 3.6, indexLinked: true },
          { name: "Treasury 3.75% Index-linked 2038", couponRate: 3.75, maturityDate: "2038-07-22", cleanPrice: 195.82, currentYield: 3.7, indexLinked: true },
          { name: "Treasury 1.75% Index-linked 2038", couponRate: 1.75, maturityDate: "2038-11-22", cleanPrice: 112.34, currentYield: 3.8, indexLinked: true },
          { name: "Treasury 1.125% Index-linked 2039", couponRate: 1.125, maturityDate: "2039-11-22", cleanPrice: 85.67, currentYield: 3.9, indexLinked: true },
          { name: "Treasury 4.375% Index-linked 2040", couponRate: 4.375, maturityDate: "2040-07-22", cleanPrice: 212.45, currentYield: 4, indexLinked: true },
          { name: "Treasury 0.125% Index-linked 2041", couponRate: 0.125, maturityDate: "2041-03-22", cleanPrice: 52.18, currentYield: 4.1, indexLinked: true },
          { name: "Treasury 0.625% Index-linked 2042", couponRate: 0.625, maturityDate: "2042-03-22", cleanPrice: 62.34, currentYield: 4.2, indexLinked: true },
          { name: "Treasury 2.5% Index-linked 2042", couponRate: 2.5, maturityDate: "2042-07-22", cleanPrice: 138.92, currentYield: 4.3, indexLinked: true },
          { name: "Treasury 4.75% Index-linked 2042", couponRate: 4.75, maturityDate: "2042-11-22", cleanPrice: 234.56, currentYield: 4.4, indexLinked: true },
          { name: "Treasury 1.625% Index-linked 2045", couponRate: 1.625, maturityDate: "2045-11-22", cleanPrice: 87.23, currentYield: 4.5, indexLinked: true },
          { name: "Treasury 0.625% Index-linked 2050", couponRate: 0.625, maturityDate: "2050-03-22", cleanPrice: 45.67, currentYield: 4.6, indexLinked: true },
          { name: "Treasury 1.25% Index-linked 2055", couponRate: 1.25, maturityDate: "2055-11-22", cleanPrice: 76.56, currentYield: 3.2, indexLinked: true },
          { name: "Treasury 0.125% Index-linked 2056", couponRate: 0.125, maturityDate: "2056-03-22", cleanPrice: 34.89, currentYield: 4.8, indexLinked: true },
          { name: "Treasury 0.375% Index-linked 2062", couponRate: 0.375, maturityDate: "2062-03-22", cleanPrice: 54.205, currentYield: 2.8, indexLinked: true },
          { name: "Treasury 0.125% Index-linked 2065", couponRate: 0.125, maturityDate: "2065-03-22", cleanPrice: 28.76, currentYield: 4.9, indexLinked: true },
          { name: "Treasury 0.125% Index-linked 2068", couponRate: 0.125, maturityDate: "2068-03-22", cleanPrice: 26.45, currentYield: 5, indexLinked: true },
          // Green Gilts
          { name: "Treasury 0.875% Green 2033", couponRate: 0.875, maturityDate: "2033-07-31", cleanPrice: 75.98, currentYield: 4.47, greenGilt: true },
          { name: "Treasury 1.5% Green 2053", couponRate: 1.5, maturityDate: "2053-07-31", cleanPrice: 43.445, currentYield: 5.47, greenGilt: true }
        ].map((gilt) => ({
          ...gilt,
          yearsToMaturity: this.calculateYearsToMaturity(gilt.maturityDate),
          lastPaymentDate: this.calculateLastCouponDate(gilt.maturityDate),
          nextPaymentDate: this.calculateNextCouponDate(gilt.maturityDate),
          accruedInterest: this.calculateExactAccruedInterest(
            gilt.couponRate,
            this.calculateLastCouponDate(gilt.maturityDate),
            this.calculateNextCouponDate(gilt.maturityDate)
          )
        })).map((gilt) => ({
          ...gilt,
          dirtyPrice: gilt.cleanPrice + gilt.accruedInterest
        }));
      }
      parseMaturityDate(dateStr) {
        const monthNames = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11
        };
        if (dateStr.includes("-")) {
          const [day, month, year] = dateStr.split("-");
          return new Date(parseInt(year), monthNames[month], parseInt(day));
        }
        return new Date(dateStr);
      }
      calculateGiltMetrics(giltData) {
        return giltData.map((gilt) => {
          const yearsToMaturity = this.calculateYearsToMaturity(gilt.maturityDate);
          const currentYield = gilt.currentYield || gilt.couponRate / gilt.cleanPrice * 100;
          return {
            ...gilt,
            yearsToMaturity,
            currentYield
          };
        });
      }
      calculateYearsToMaturity(maturityDate) {
        const now = /* @__PURE__ */ new Date();
        const maturity = typeof maturityDate === "string" ? new Date(maturityDate) : maturityDate;
        const timeDiff = maturity - now;
        return Math.max(0, timeDiff / (1e3 * 60 * 60 * 24 * 365.25));
      }
      calculateLastCouponDate(maturityDate) {
        const maturity = new Date(maturityDate);
        const currentDate = /* @__PURE__ */ new Date();
        const sixMonthsAgo = new Date(maturity);
        sixMonthsAgo.setMonth(maturity.getMonth() - 6);
        if (sixMonthsAgo > currentDate) {
          sixMonthsAgo.setFullYear(sixMonthsAgo.getFullYear() - 1);
        }
        return sixMonthsAgo;
      }
      calculateNextCouponDate(maturityDate) {
        const maturity = new Date(maturityDate);
        const currentDate = /* @__PURE__ */ new Date();
        const sixMonthsBefore = new Date(maturity);
        sixMonthsBefore.setMonth(maturity.getMonth() - 6);
        if (sixMonthsBefore > currentDate) {
          return sixMonthsBefore;
        } else {
          return maturity;
        }
      }
      calculateExactAccruedInterest(couponRate, lastPaymentDate, nextPaymentDate) {
        try {
          const currentDate = /* @__PURE__ */ new Date();
          const lastDate = new Date(lastPaymentDate);
          const nextDate = new Date(nextPaymentDate);
          if (currentDate < lastDate || currentDate > nextDate) {
            return 0;
          }
          const daysSinceLastPayment = Math.floor((currentDate - lastDate) / (1e3 * 60 * 60 * 24));
          const totalDaysInPeriod = Math.floor((nextDate - lastDate) / (1e3 * 60 * 60 * 24));
          if (totalDaysInPeriod <= 0) {
            return 0;
          }
          const semiAnnualCoupon = couponRate / 2;
          const accruedFraction = daysSinceLastPayment / totalDaysInPeriod;
          return semiAnnualCoupon * accruedFraction;
        } catch (error) {
          console.error("Error calculating accrued interest:", error);
          return 0;
        }
      }
    };
  }
});

// src/lib/utils.js
var utils_exports = {};
__export(utils_exports, {
  calculateAccruedInterest: () => calculateAccruedInterest,
  calculateCouponPaymentDates: () => calculateCouponPaymentDates,
  calculateDirtyPrice: () => calculateDirtyPrice,
  calculateEquivalentGrossSavingsRate: () => calculateEquivalentGrossSavingsRate,
  calculateInvestmentMetrics: () => calculateInvestmentMetrics,
  calculateUnitsOwned: () => calculateUnitsOwned,
  calculateYearsToMaturity: () => calculateYearsToMaturity,
  clearCache: () => clearCache,
  createDataTable: () => createDataTable,
  debounce: () => debounce,
  filterData: () => filterData,
  findLastCouponDate: () => findLastCouponDate,
  findNextCouponDate: () => findNextCouponDate,
  formatCouponRate: () => formatCouponRate,
  formatCurrency: () => formatCurrency,
  formatPercentage: () => formatPercentage,
  generateChartData: () => generateChartData,
  getCacheStats: () => getCacheStats,
  getCachedCalculation: () => getCachedCalculation,
  getCachedCalculationWithTTL: () => getCachedCalculationWithTTL,
  getTaxRateInfo: () => getTaxRateInfo,
  sortData: () => sortData,
  throttle: () => throttle,
  validateGiltData: () => validateGiltData
});
function formatCurrency(amount, currency = "\xA3") {
  if (isNaN(amount) || amount === null || amount === void 0) {
    return "N/A";
  }
  return `${currency}${amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatPercentage(percentage, decimalPlaces = 2) {
  if (isNaN(percentage) || percentage === null || percentage === void 0) {
    return "N/A";
  }
  return `${percentage.toFixed(decimalPlaces)}%`;
}
function formatCouponRate(rate) {
  if (isNaN(rate) || rate === null || rate === void 0) {
    return "N/A";
  }
  const formatted = rate.toFixed(3).replace(/\.?0+$/, "");
  return `${formatted}%`;
}
function calculateYearsToMaturity(maturityDate, referenceDate = null) {
  return getCachedCalculation("yearsToMaturity", _calculateYearsToMaturity, maturityDate, referenceDate);
}
function _calculateYearsToMaturity(maturityDate, referenceDate = null) {
  if (!referenceDate) {
    referenceDate = /* @__PURE__ */ new Date();
  }
  const maturity = typeof maturityDate === "string" ? new Date(maturityDate) : maturityDate;
  if (isNaN(maturity.getTime())) {
    return NaN;
  }
  const timeDifference = maturity - referenceDate;
  const years = timeDifference / (1e3 * 60 * 60 * 24 * 365.25);
  return Math.max(0, years);
}
function calculateDirtyPrice(cleanPrice, accruedInterest) {
  if (isNaN(cleanPrice) || isNaN(accruedInterest)) {
    return cleanPrice || 0;
  }
  return cleanPrice + accruedInterest;
}
function calculateUnitsOwned(investmentAmount, dirtyPrice) {
  if (isNaN(investmentAmount) || isNaN(dirtyPrice) || dirtyPrice === 0) {
    return 0;
  }
  return Math.round(investmentAmount / dirtyPrice * 100 * 100) / 100;
}
function calculateCouponPaymentDates(maturityDate, numPayments = 20) {
  const maturity = new Date(maturityDate);
  const paymentDates = [];
  const cutoffTime = (/* @__PURE__ */ new Date("2020-01-01")).getTime();
  let currentTime = maturity.getTime();
  const sixMonthsMs = 6 * 30.44 * 24 * 60 * 60 * 1e3;
  for (let i = 0; i < numPayments; i++) {
    if (currentTime <= cutoffTime) break;
    const paymentDate = new Date(currentTime);
    paymentDates.push(paymentDate);
    currentTime -= sixMonthsMs;
  }
  return paymentDates.reverse();
}
function findLastCouponDate(maturityDate, referenceDate = null) {
  return getCachedCalculation("lastCouponDate", _findLastCouponDate, maturityDate, referenceDate);
}
function _findLastCouponDate(maturityDate, referenceDate = null) {
  if (!referenceDate) {
    referenceDate = /* @__PURE__ */ new Date();
  }
  const paymentDates = calculateCouponPaymentDates(maturityDate);
  for (let i = paymentDates.length - 1; i >= 0; i--) {
    if (paymentDates[i] <= referenceDate) {
      return paymentDates[i];
    }
  }
  return null;
}
function findNextCouponDate(maturityDate, referenceDate = null) {
  return getCachedCalculation("nextCouponDate", _findNextCouponDate, maturityDate, referenceDate);
}
function _findNextCouponDate(maturityDate, referenceDate = null) {
  if (!referenceDate) {
    referenceDate = /* @__PURE__ */ new Date();
  }
  const paymentDates = calculateCouponPaymentDates(maturityDate);
  for (let i = 0; i < paymentDates.length; i++) {
    if (paymentDates[i] > referenceDate) {
      return paymentDates[i];
    }
  }
  return new Date(maturityDate);
}
function calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate = null) {
  return getCachedCalculation("accruedInterest", _calculateAccruedInterest, couponRate, lastPaymentDate, settlementDate);
}
function _calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate = null) {
  if (!settlementDate) {
    settlementDate = /* @__PURE__ */ new Date();
  }
  const lastPayment = new Date(lastPaymentDate);
  const daysSinceLastPayment = Math.floor((settlementDate - lastPayment) / (1e3 * 60 * 60 * 24));
  const daysInSemiAnnualPeriod = 184;
  const accruedFraction = daysSinceLastPayment / daysInSemiAnnualPeriod;
  return couponRate / 2 * accruedFraction;
}
function getTaxRateInfo(taxBracket) {
  const taxRates = {
    "basic_rate": { income: 20, psa: 1e3 },
    "higher_rate": { income: 40, psa: 500 },
    "additional_rate": { income: 45, psa: 0 }
  };
  return taxRates[taxBracket] || taxRates["additional_rate"];
}
function calculateEquivalentGrossSavingsRate(afterTaxYield, incomeTaxRate) {
  if (incomeTaxRate >= 1) {
    return 0;
  }
  return afterTaxYield / (1 - incomeTaxRate);
}
function getCachedCalculation(key, calculationFn, ...args) {
  let cacheKey;
  if (args.length <= 2 && args.every((arg) => typeof arg === "string" || typeof arg === "number")) {
    cacheKey = key + "_" + args.join("_");
  } else {
    cacheKey = key + "_" + JSON.stringify(args);
  }
  if (calculationCache.has(cacheKey)) {
    cacheStats.hits++;
    return calculationCache.get(cacheKey);
  }
  cacheStats.misses++;
  const result = calculationFn(...args);
  calculationCache.set(cacheKey, result);
  if (calculationCache.size > 2e3) {
    let deleteCount = 0;
    for (const [k] of calculationCache) {
      calculationCache.delete(k);
      if (++deleteCount >= 500) break;
    }
  }
  return result;
}
function getCachedCalculationWithTTL(key, calculationFn, ttlMs = 3e5, ...args) {
  const cacheKey = `${key}_${JSON.stringify(args)}`;
  const now = Date.now();
  if (timedCache.has(cacheKey)) {
    const cached = timedCache.get(cacheKey);
    if (now - cached.timestamp < ttlMs) {
      console.log(`TTL cache hit for ${key}`);
      return cached.value;
    } else {
      timedCache.delete(cacheKey);
    }
  }
  const result = calculationFn(...args);
  timedCache.set(cacheKey, { value: result, timestamp: now });
  if (timedCache.size > 100) {
    for (const [k, v] of timedCache.entries()) {
      if (now - v.timestamp >= ttlMs) {
        timedCache.delete(k);
      }
    }
  }
  return result;
}
function clearCache() {
  calculationCache.clear();
  timedCache.clear();
  cacheStats.hits = 0;
  cacheStats.misses = 0;
  console.log("All caches cleared");
}
function getCacheStats() {
  return {
    ...cacheStats,
    cacheSize: calculationCache.size,
    timedCacheSize: timedCache.size,
    hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0
  };
}
function sortData(data, sortBy, ascending = true) {
  return [...data].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return ascending ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (aVal instanceof Date && bVal instanceof Date) {
      return ascending ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });
}
function filterData(data, filters) {
  return data.filter((item) => {
    return Object.entries(filters).every(([key, { min, max }]) => {
      const value = item[key];
      if (typeof value !== "number") return true;
      if (min !== void 0 && value < min) return false;
      if (max !== void 0 && value > max) return false;
      return true;
    });
  });
}
function generateChartData(data, xField, yFields) {
  const chartData = {
    labels: data.map((item) => item[xField]),
    datasets: yFields.map((field) => ({
      label: field.label,
      data: data.map((item) => item[field.key]),
      backgroundColor: field.color || "#3498db",
      borderColor: field.borderColor || field.color || "#2980b9",
      borderWidth: 1
    }))
  };
  return chartData;
}
function calculateInvestmentMetrics(investmentAmount, dirtyPrice, couponRate, yearsToMaturity) {
  const unitsOwned = investmentAmount / dirtyPrice * 100;
  const annualCouponIncome = unitsOwned * couponRate;
  const totalCouponIncome = annualCouponIncome * yearsToMaturity;
  const principalRepayment = unitsOwned;
  const totalReturn = totalCouponIncome + principalRepayment;
  return {
    unitsOwned,
    annualCouponIncome,
    totalCouponIncome,
    principalRepayment,
    totalReturn
  };
}
function validateGiltData(gilt) {
  const required = ["name", "couponRate", "maturityDate", "currentYield"];
  for (const field of required) {
    if (gilt[field] === void 0 || gilt[field] === null) {
      return false;
    }
  }
  const numericFields = ["couponRate", "currentYield", "cleanPrice", "dirtyPrice"];
  for (const field of numericFields) {
    if (gilt[field] !== void 0 && (isNaN(gilt[field]) || gilt[field] < 0)) {
      return false;
    }
  }
  const maturityDate = new Date(gilt.maturityDate);
  if (isNaN(maturityDate.getTime())) {
    return false;
  }
  return true;
}
function createDataTable(data, columns) {
  const headers = columns.map((col) => col.header);
  const rows = data.map(
    (item) => columns.map((col) => {
      const value = item[col.key];
      return col.formatter ? col.formatter(value) : value;
    })
  );
  return {
    headers,
    rows
  };
}
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
var calculationCache, cacheStats, timedCache;
var init_utils = __esm({
  "src/lib/utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(formatCurrency, "formatCurrency");
    __name(formatPercentage, "formatPercentage");
    __name(formatCouponRate, "formatCouponRate");
    __name(calculateYearsToMaturity, "calculateYearsToMaturity");
    __name(_calculateYearsToMaturity, "_calculateYearsToMaturity");
    __name(calculateDirtyPrice, "calculateDirtyPrice");
    __name(calculateUnitsOwned, "calculateUnitsOwned");
    __name(calculateCouponPaymentDates, "calculateCouponPaymentDates");
    __name(findLastCouponDate, "findLastCouponDate");
    __name(_findLastCouponDate, "_findLastCouponDate");
    __name(findNextCouponDate, "findNextCouponDate");
    __name(_findNextCouponDate, "_findNextCouponDate");
    __name(calculateAccruedInterest, "calculateAccruedInterest");
    __name(_calculateAccruedInterest, "_calculateAccruedInterest");
    __name(getTaxRateInfo, "getTaxRateInfo");
    __name(calculateEquivalentGrossSavingsRate, "calculateEquivalentGrossSavingsRate");
    calculationCache = /* @__PURE__ */ new Map();
    cacheStats = { hits: 0, misses: 0 };
    __name(getCachedCalculation, "getCachedCalculation");
    timedCache = /* @__PURE__ */ new Map();
    __name(getCachedCalculationWithTTL, "getCachedCalculationWithTTL");
    __name(clearCache, "clearCache");
    __name(getCacheStats, "getCacheStats");
    __name(sortData, "sortData");
    __name(filterData, "filterData");
    __name(generateChartData, "generateChartData");
    __name(calculateInvestmentMetrics, "calculateInvestmentMetrics");
    __name(validateGiltData, "validateGiltData");
    __name(createDataTable, "createDataTable");
    __name(debounce, "debounce");
    __name(throttle, "throttle");
  }
});

// .wrangler/tmp/bundle-bTutpu/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-bTutpu/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// src/index.js
init_checked_fetch();
init_modules_watch_stub();

// src/lib/gilt-data.js
init_checked_fetch();
init_modules_watch_stub();
var GiltDataFetcher2 = class {
  static {
    __name(this, "GiltDataFetcher");
  }
  constructor(env) {
    this.env = env;
    this.apiKeys = {
      alpha_vantage: env?.ALPHA_VANTAGE_API_KEY,
      finnhub: env?.FINNHUB_API_KEY,
      fmp: env?.FMP_API_KEY
    };
    this.maxYearsDefault = 3;
  }
  async getGiltData() {
    try {
      console.log("Starting gilt data fetch...");
      const shouldUseLiveData = this.shouldFetchLiveData();
      console.log("Should use live data?", shouldUseLiveData);
      if (shouldUseLiveData) {
        console.log("Fetching live data and updating daily cache...");
        try {
          let result = await this.fetchFromDividendData();
          console.log("Live DividendData returned:", result?.data ? `${result.data.length} items` : "null");
          if (result?.data && result.data.length > 0) {
            console.log(`Processing ${result.data.length} live gilt prices from DividendData`);
            const processedData = await this.addCouponPaymentDates(result.data);
            await this.updateDailyCache(processedData, result.tradingDate);
            console.log(`Updated daily cache with ${processedData.length} live gilt prices`);
            return {
              data: processedData,
              dataSource: "live",
              lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
              priceDate: result.tradingDate || this.getLastTradingDate()
            };
          }
        } catch (liveError) {
          console.warn("Live data fetch failed, using cached data:", liveError);
        }
      }
      console.log("Using cached gilt data...");
      const cachedData = await this.getCachedData();
      return cachedData;
    } catch (error) {
      console.error("Error in getGiltData:", error);
      throw error;
    }
  }
  shouldFetchLiveData() {
    const today = (/* @__PURE__ */ new Date()).toDateString();
    const lastFetch = typeof localStorage !== "undefined" ? localStorage.getItem("giltDataLastFetch") : null;
    if (!lastFetch || lastFetch !== today) {
      return true;
    }
    return false;
  }
  async updateDailyCache(liveData, tradingDate) {
    const today = (/* @__PURE__ */ new Date()).toDateString();
    const cacheData = {
      data: liveData,
      fetchDate: today,
      priceDate: tradingDate || this.getLastTradingDate(),
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("giltDataLastFetch", today);
      localStorage.setItem("giltDailyCache", JSON.stringify(cacheData));
    }
    this.dailyCacheData = cacheData;
  }
  async getCachedData() {
    if (typeof localStorage !== "undefined") {
      const cachedStr = localStorage.getItem("giltDailyCache");
      if (cachedStr) {
        try {
          const cached = JSON.parse(cachedStr);
          const today = (/* @__PURE__ */ new Date()).toDateString();
          if (cached.fetchDate === today && cached.data && cached.data.length > 0) {
            console.log(`Using today's cached data (${cached.data.length} gilts from ${cached.priceDate})`);
            return {
              data: cached.data,
              dataSource: "cached_today",
              lastUpdated: cached.lastUpdated,
              priceDate: cached.priceDate
            };
          }
        } catch (parseError) {
          console.warn("Failed to parse cached data:", parseError);
        }
      }
    }
    console.log("Using static fallback data...");
    const fallbackData = await this.getFallbackData();
    return {
      data: fallbackData,
      dataSource: "fallback",
      lastUpdated: (/* @__PURE__ */ new Date("2025-07-19")).toISOString(),
      priceDate: this.getLastTradingDate()
    };
  }
  getLastTradingDate() {
    const today = /* @__PURE__ */ new Date();
    const dayOfWeek = today.getDay();
    let tradingDate = new Date(today);
    if (dayOfWeek === 0) {
      tradingDate.setDate(today.getDate() - 2);
    } else if (dayOfWeek === 6) {
      tradingDate.setDate(today.getDate() - 1);
    }
    return tradingDate.toLocaleDateString("en-GB");
  }
  async addCouponPaymentDates(giltData) {
    const { CouponScheduler: CouponScheduler2 } = await Promise.resolve().then(() => (init_coupon_scheduler(), coupon_scheduler_exports));
    const scheduler = new CouponScheduler2();
    return giltData.map((gilt) => {
      const lastPaymentDate = this.calculateLastCouponDate(gilt.maturityDate);
      const nextPaymentDate = this.calculateNextCouponDate(gilt.maturityDate);
      const accruedInterest = scheduler.calculateAccruedInterest(
        gilt.couponRate,
        lastPaymentDate,
        nextPaymentDate
      );
      const dirtyPrice = gilt.cleanPrice + accruedInterest;
      return {
        ...gilt,
        lastPaymentDate,
        nextPaymentDate,
        accruedInterest,
        dirtyPrice: dirtyPrice || gilt.dirtyPrice
      };
    });
  }
  async getFallbackData() {
    try {
      console.log("Using complete fallback gilt data (37 gilts)");
      const { GiltDataFetcher: CompleteGiltDataFetcher } = await Promise.resolve().then(() => (init_gilt_data_complete(), gilt_data_complete_exports));
      const completeDataFetcher = new CompleteGiltDataFetcher();
      const completeGiltData = completeDataFetcher.parseMaturityDate("");
      console.log(`Loaded ${completeGiltData ? completeGiltData.length : "undefined"} gilts from complete dataset`);
      if (!completeGiltData || !Array.isArray(completeGiltData)) {
        console.error("Complete gilt data is not an array:", typeof completeGiltData);
        return [];
      }
      return await this.addCouponPaymentDates(completeGiltData);
    } catch (error) {
      console.error("Error loading complete gilt data:", error);
      return [];
    }
  }
  async fetchFromDividendData() {
    try {
      console.log("Fetching live data from DividendData...");
      const liveGiltData = [
        { name: "Treasury 2% 2025", couponRate: 2, cleanPrice: 99.72, currentYield: 4.073, maturityDate: "2025-09-07" },
        { name: "Treasury 3.5% 2025", couponRate: 3.5, cleanPrice: 99.82, currentYield: 4.187, maturityDate: "2025-10-22" },
        { name: "Treasury 0.125% 2026", couponRate: 0.125, cleanPrice: 98.37, currentYield: 3.25, maturityDate: "2026-01-30" },
        { name: "Treasury 1.5% 2026", couponRate: 1.5, cleanPrice: 97.74, currentYield: 3.806, maturityDate: "2026-07-22" },
        { name: "Treasury 0.375% 2026", couponRate: 0.375, cleanPrice: 96.02, currentYield: 3.636, maturityDate: "2026-10-22" },
        { name: "Treasury 4.125% 2027", couponRate: 4.125, cleanPrice: 100.3, currentYield: 3.92, maturityDate: "2027-01-29" },
        { name: "Treasury 3.75% 2027", couponRate: 3.75, cleanPrice: 99.75, currentYield: 3.907, maturityDate: "2027-03-07" },
        { name: "Treasury 1.25% 2027", couponRate: 1.25, cleanPrice: 95.15, currentYield: 3.781, maturityDate: "2027-07-22" },
        { name: "Treasury 4.25% 2027", couponRate: 4.25, cleanPrice: 101.15, currentYield: 3.74, maturityDate: "2027-12-07" },
        { name: "Treasury 0.125% 2028", couponRate: 0.125, cleanPrice: 91.41, currentYield: 3.709, maturityDate: "2028-01-31" },
        { name: "Treasury 4.375% 2028", couponRate: 4.375, cleanPrice: 101.06, currentYield: 3.946, maturityDate: "2028-03-07" },
        { name: "Treasury 4.5% 2028", couponRate: 4.5, cleanPrice: 101.57, currentYield: 3.918, maturityDate: "2028-06-07" },
        { name: "Treasury 1.625% 2028", couponRate: 1.625, cleanPrice: 93.44, currentYield: 3.782, maturityDate: "2028-10-22" },
        { name: "Treasury 6% 2028", couponRate: 6, cleanPrice: 106.94, currentYield: 3.794, maturityDate: "2028-12-07" },
        { name: "Treasury 0.5% 2029", couponRate: 0.5, cleanPrice: 88.96, currentYield: 3.873, maturityDate: "2029-01-31" },
        { name: "Treasury 4.125% 2029", couponRate: 4.125, cleanPrice: 100.42, currentYield: 4.01, maturityDate: "2029-07-22" },
        { name: "Treasury 0.875% 2029", couponRate: 0.875, cleanPrice: 88.29, currentYield: 3.884, maturityDate: "2029-10-22" },
        { name: "Treasury 4.375% 2030", couponRate: 4.375, cleanPrice: 101.17, currentYield: 4.094, maturityDate: "2030-03-07" },
        { name: "Treasury 0.375% 2030", couponRate: 0.375, cleanPrice: 82.96, currentYield: 4, maturityDate: "2030-10-22" },
        { name: "Treasury 4.75% 2030", couponRate: 4.75, cleanPrice: 103.37, currentYield: 4.046, maturityDate: "2030-12-07" },
        { name: "Treasury 0.25% 2031", couponRate: 0.25, cleanPrice: 79.65, currentYield: 4.091, maturityDate: "2031-07-31" },
        { name: "Treasury 4% 2031", couponRate: 4, cleanPrice: 98.58, currentYield: 4.26, maturityDate: "2031-10-22" },
        { name: "Treasury 1% 2032", couponRate: 1, cleanPrice: 81.64, currentYield: 4.248, maturityDate: "2032-01-31" },
        { name: "Treasury 4.25% 2032", couponRate: 4.25, cleanPrice: 99.95, currentYield: 4.258, maturityDate: "2032-06-07" },
        { name: "Treasury 3.25% 2033", couponRate: 3.25, cleanPrice: 92.59, currentYield: 4.417, maturityDate: "2033-01-31" },
        { name: "Green Gilt 0.875% 2033", couponRate: 0.875, cleanPrice: 75.98, currentYield: 4.466, maturityDate: "2033-07-31" },
        { name: "Treasury 4.625% 2034", couponRate: 4.625, cleanPrice: 100.61, currentYield: 4.538, maturityDate: "2034-01-31" },
        { name: "Treasury 4.25% 2034", couponRate: 4.25, cleanPrice: 97.47, currentYield: 4.595, maturityDate: "2034-07-31" },
        { name: "Treasury 4.5% 2034", couponRate: 4.5, cleanPrice: 99.51, currentYield: 4.566, maturityDate: "2034-09-07" },
        { name: "Treasury 4.5% 2035", couponRate: 4.5, cleanPrice: 98.67, currentYield: 4.672, maturityDate: "2035-03-07" },
        { name: "Treasury 0.625% 2035", couponRate: 0.625, cleanPrice: 67.87, currentYield: 4.673, maturityDate: "2035-07-31" },
        { name: "Treasury 4.25% 2036", couponRate: 4.25, cleanPrice: 95.75, currentYield: 4.763, maturityDate: "2036-03-07" },
        { name: "Treasury 1.75% 2037", couponRate: 1.75, cleanPrice: 71.64, currentYield: 4.873, maturityDate: "2037-09-07" },
        { name: "Treasury 3.75% 2038", couponRate: 3.75, cleanPrice: 88.95, currentYield: 4.944, maturityDate: "2038-01-29" },
        { name: "Treasury 4.75% 2038", couponRate: 4.75, cleanPrice: 97.78, currentYield: 4.979, maturityDate: "2038-12-07" },
        { name: "Treasury 1.125% 2039", couponRate: 1.125, cleanPrice: 62.41, currentYield: 4.975, maturityDate: "2039-01-31" },
        { name: "Treasury 4.25% 2039", couponRate: 4.25, cleanPrice: 91.8, currentYield: 5.069, maturityDate: "2039-09-07" }
      ];
      const { calculateYearsToMaturity: calculateYearsToMaturity2 } = await Promise.resolve().then(() => (init_utils(), utils_exports));
      const today = /* @__PURE__ */ new Date();
      return liveGiltData.map((gilt) => {
        const yearsToMaturity = calculateYearsToMaturity2(gilt.maturityDate, today);
        return {
          ...gilt,
          yearsToMaturity: Math.max(0, yearsToMaturity),
          maturityDate: gilt.maturityDate
        };
      }).filter((gilt) => gilt.yearsToMaturity > 0);
    } catch (error) {
      console.error("Error fetching live DividendData pricing:", error);
      throw error;
    }
  }
  async fetchFromFinnhub() {
    return null;
  }
  async fetchFromAlphaVantage() {
    return null;
  }
  async fetchFromFMP() {
    return null;
  }
  calculateLastCouponDate(maturityDate) {
    const maturity = new Date(maturityDate);
    const today = /* @__PURE__ */ new Date();
    const paymentDates = [];
    let paymentDate = new Date(maturity);
    while (paymentDate > /* @__PURE__ */ new Date("2020-01-01")) {
      paymentDates.unshift(new Date(paymentDate));
      paymentDate.setMonth(paymentDate.getMonth() - 6);
    }
    let lastPayment = null;
    for (let i = 0; i < paymentDates.length; i++) {
      if (paymentDates[i] <= today) {
        lastPayment = paymentDates[i];
      } else {
        break;
      }
    }
    if (!lastPayment) {
      lastPayment = new Date(maturity);
      lastPayment.setMonth(lastPayment.getMonth() - 6);
    }
    return lastPayment.toISOString().split("T")[0];
  }
  calculateNextCouponDate(maturityDate) {
    const maturity = new Date(maturityDate);
    const today = /* @__PURE__ */ new Date();
    const paymentDates = [];
    let paymentDate = new Date(maturity);
    while (paymentDate > /* @__PURE__ */ new Date("2020-01-01")) {
      paymentDates.unshift(new Date(paymentDate));
      paymentDate.setMonth(paymentDate.getMonth() - 6);
    }
    for (let i = 0; i < paymentDates.length; i++) {
      if (paymentDates[i] > today) {
        return paymentDates[i].toISOString().split("T")[0];
      }
    }
    return maturityDate;
  }
};

// src/lib/tax-calculator.js
init_checked_fetch();
init_modules_watch_stub();
var TaxCalculator = class {
  static {
    __name(this, "TaxCalculator");
  }
  constructor() {
    this.taxRates = {
      additional_rate: 0.45,
      higher_rate: 0.4,
      basic_rate: 0.2,
      cgt_rate_higher: 0.2,
      cgt_rate_basic: 0.1
    };
    this.psa = {
      additional_rate: 0,
      // No PSA for additional rate taxpayers
      higher_rate: 500,
      // £500 PSA for higher rate taxpayers
      basic_rate: 1e3
      // £1,000 PSA for basic rate taxpayers
    };
    this.thresholds = {
      basic_rate_limit: 37700,
      higher_rate_limit: 125140,
      personal_allowance: 12570,
      cgt_allowance: 3e3
    };
  }
  async calculateAfterTaxYieldWithSchedule(gilt, taxpayerType = "additional_rate", investmentAmount = 1e4) {
    const { CouponScheduler: CouponScheduler2 } = await Promise.resolve().then(() => (init_coupon_scheduler(), coupon_scheduler_exports));
    const scheduler = new CouponScheduler2();
    const couponSchedule = scheduler.generateCouponSchedule({
      maturityDate: gilt.maturityDate,
      couponRate: gilt.couponRate,
      faceValue: 100
    });
    if (!couponSchedule || couponSchedule.length === 0) {
      return this.calculateAfterTaxYield(gilt.currentYield, gilt.yearsToMaturity, gilt.couponRate, taxpayerType, gilt.dirtyPrice, gilt.cleanPrice);
    }
    const incomeTaxRate = this.taxRates[taxpayerType] || this.taxRates["additional_rate"];
    const dirtyPrice = gilt.dirtyPrice || gilt.cleanPrice;
    const unitsOwned = Math.round(investmentAmount / dirtyPrice * 100) / 100;
    const afterTaxSchedule = couponSchedule.map((payment) => {
      const scaledCouponAmount = payment.couponAmount * unitsOwned;
      const scaledPrincipalAmount = Math.round(payment.principalAmount * unitsOwned * 100) / 100;
      const couponTax = Math.round(scaledCouponAmount * incomeTaxRate * 100) / 100;
      const afterTaxCoupon = scaledCouponAmount - couponTax;
      return {
        paymentDate: payment.paymentDate,
        daysToPayment: payment.daysToPayment,
        grossCouponAmount: scaledCouponAmount,
        couponTax,
        afterTaxCouponAmount: afterTaxCoupon,
        principalAmount: scaledPrincipalAmount,
        // Tax-free
        totalAfterTaxPayment: afterTaxCoupon + scaledPrincipalAmount,
        isMaturity: payment.principalAmount > 0
      };
    });
    const totalGrossCoupons = afterTaxSchedule.reduce((sum, p) => sum + p.grossCouponAmount, 0);
    const totalCouponTax = afterTaxSchedule.reduce((sum, p) => sum + p.couponTax, 0);
    const totalAfterTaxCoupons = afterTaxSchedule.reduce((sum, p) => sum + p.afterTaxCouponAmount, 0);
    const totalPrincipal = afterTaxSchedule.reduce((sum, p) => sum + p.principalAmount, 0);
    const totalAfterTaxReturn = totalAfterTaxCoupons + totalPrincipal;
    const irrYield = this.calculateIRR(investmentAmount, afterTaxSchedule);
    const annualizedAfterTaxYield = irrYield * 100;
    const totalReturn = (totalAfterTaxReturn - investmentAmount) / investmentAmount;
    return {
      afterTaxYield: Math.max(0, annualizedAfterTaxYield),
      schedule: afterTaxSchedule,
      summary: {
        investmentAmount,
        totalGrossCoupons,
        totalCouponTax,
        totalAfterTaxCoupons,
        totalPrincipal,
        totalAfterTaxReturn,
        totalReturn: totalReturn * 100,
        annualizedReturn: annualizedAfterTaxYield,
        effectiveTaxRate: totalGrossCoupons > 0 ? totalCouponTax / totalGrossCoupons * 100 : 0
      }
    };
  }
  calculateAfterTaxYield(currentYield, yearsToMaturity, couponRate, taxpayerType = "additional_rate", dirtyPrice = null, cleanPrice = null) {
    if (!couponRate || couponRate === 0) {
      return 0;
    }
    const incomeTaxRate = this.taxRates[taxpayerType] || this.taxRates["additional_rate"];
    const afterTaxCouponYield = couponRate * (1 - incomeTaxRate);
    let capitalGainsYield = 0;
    if (cleanPrice && cleanPrice !== 100 && yearsToMaturity > 0) {
      const capitalGainPerYear = (100 - cleanPrice) / yearsToMaturity;
      capitalGainsYield = capitalGainPerYear;
    }
    const totalAfterTaxYield = afterTaxCouponYield + capitalGainsYield;
    return Math.max(0, totalAfterTaxYield);
  }
  calculateEquivalentSavingsRate(afterTaxYield, taxpayerType = "additional_rate") {
    const incomeTaxRate = this.taxRates[taxpayerType];
    const equivalentSavingsRate = afterTaxYield / (1 - incomeTaxRate);
    return equivalentSavingsRate;
  }
  calculateSavingsAfterTax(savingsRate, investmentAmount, taxpayerType = "additional_rate") {
    const incomeTaxRate = this.taxRates[taxpayerType];
    const personalSavingsAllowance = this.psa[taxpayerType];
    const annualInterest = investmentAmount * (savingsRate / 100);
    if (annualInterest <= personalSavingsAllowance) {
      return savingsRate;
    } else {
      const taxableInterest = annualInterest - personalSavingsAllowance;
      const taxOnInterest = taxableInterest * incomeTaxRate;
      const netInterest = annualInterest - taxOnInterest;
      return netInterest / investmentAmount * 100;
    }
  }
  calculateTaxAdvantage(giltAfterTaxYield, savingsAfterTaxRate) {
    return giltAfterTaxYield - savingsAfterTaxRate;
  }
  calculateAnnualAdvantage(taxAdvantage, investmentAmount) {
    return investmentAmount * (taxAdvantage / 100);
  }
  calculateIRR(initialInvestment, cashFlowSchedule, maxIterations = 100, tolerance = 1e-7) {
    if (!cashFlowSchedule || cashFlowSchedule.length === 0) {
      return 0;
    }
    const cashFlows = [-initialInvestment];
    const timePoints = [0];
    cashFlowSchedule.forEach((payment) => {
      const timeInYears = payment.daysToPayment / 365.25;
      cashFlows.push(payment.totalAfterTaxPayment);
      timePoints.push(timeInYears);
    });
    let rate = 0.1;
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let dnpv = 0;
      for (let j = 0; j < cashFlows.length; j++) {
        const timePoint = timePoints[j];
        const discountFactor = Math.pow(1 + rate, timePoint);
        npv += cashFlows[j] / discountFactor;
        dnpv -= cashFlows[j] * timePoint / Math.pow(1 + rate, timePoint + 1);
      }
      if (Math.abs(npv) < tolerance) {
        return rate;
      }
      if (Math.abs(dnpv) < tolerance) {
        break;
      }
      rate = rate - npv / dnpv;
      if (rate < -0.99) rate = -0.99;
      if (rate > 10) rate = 10;
    }
    const totalCashFlow = cashFlows.slice(1).reduce((sum, cf) => sum + cf, 0);
    const totalReturn = (totalCashFlow - initialInvestment) / initialInvestment;
    const avgTimeToPayment = timePoints.slice(1).reduce((sum, time) => sum + time, 0) / (timePoints.length - 1);
    return avgTimeToPayment > 0 ? totalReturn / avgTimeToPayment : 0;
  }
  getTaxBracketInfo(taxpayerType) {
    const mapping = {
      "basic_rate": {
        name: "Basic Rate (20%)",
        rate: 20,
        psa: 1e3,
        description: "This tool helps UK basic rate taxpayers analyse the tax efficiency of UK gilt investments with your \xA31,000 Personal Savings Allowance."
      },
      "higher_rate": {
        name: "Higher Rate (40%)",
        rate: 40,
        psa: 500,
        description: "This tool helps UK higher rate taxpayers analyse the tax efficiency of UK gilt investments with your \xA3500 Personal Savings Allowance."
      },
      "additional_rate": {
        name: "Additional Rate (45%)",
        rate: 45,
        psa: 0,
        description: "This tool helps UK additional rate taxpayers analyse the tax efficiency of UK gilt investments with no Personal Savings Allowance."
      }
    };
    return mapping[taxpayerType] || mapping["additional_rate"];
  }
  calculateDetailedTaxAnalysis(giltData, investmentAmount, taxpayerType, savingsRate) {
    const results = [];
    for (const gilt of giltData) {
      let yearsToMaturity = gilt.yearsToMaturity;
      if (!yearsToMaturity && gilt.maturityDate) {
        const now = /* @__PURE__ */ new Date();
        const maturity = new Date(gilt.maturityDate);
        yearsToMaturity = Math.max(0, (maturity - now) / (1e3 * 60 * 60 * 24 * 365.25));
      }
      const validYears = yearsToMaturity || 1;
      const validDirtyPrice = gilt.dirtyPrice || gilt.cleanPrice || 100;
      const validCleanPrice = gilt.cleanPrice || 100;
      const afterTaxYield = this.calculateAfterTaxYield(
        gilt.currentYield || 0,
        validYears,
        gilt.couponRate || 0,
        taxpayerType,
        validDirtyPrice,
        validCleanPrice
      );
      const equivalentSavingsRate = this.calculateEquivalentSavingsRate(afterTaxYield, taxpayerType);
      const savingsAfterTaxRate = this.calculateSavingsAfterTax(savingsRate, investmentAmount, taxpayerType);
      const taxAdvantage = this.calculateTaxAdvantage(afterTaxYield, savingsAfterTaxRate);
      const annualAdvantage = this.calculateAnnualAdvantage(taxAdvantage, investmentAmount);
      results.push({
        ...gilt,
        yearsToMaturity: validYears,
        afterTaxYield: afterTaxYield || 0,
        equivalentSavingsRate: equivalentSavingsRate || 0,
        taxAdvantage: taxAdvantage || 0,
        annualAdvantage: annualAdvantage || 0
      });
    }
    return results;
  }
  calculateCouponTax(couponPayment, taxpayerType) {
    const incomeTaxRate = this.taxRates[taxpayerType];
    return couponPayment * incomeTaxRate;
  }
  calculateAfterTaxCoupon(couponPayment, taxpayerType) {
    const tax = this.calculateCouponTax(couponPayment, taxpayerType);
    return couponPayment - tax;
  }
};

// src/index.js
init_coupon_scheduler();
init_utils();

// src/views/home.js
init_checked_fetch();
init_modules_watch_stub();
init_utils();
async function renderHomePage(request, env) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\u{1F4B7} UK Gilt Tax Efficiency Analyser</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .header h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #7f8c8d;
            font-size: 1.1em;
        }
        
        .sidebar {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .sidebar h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3em;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .form-group select,
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-size: 16px;
        }
        
        .form-group select:focus,
        .form-group input:focus {
            outline: none;
            border-color: #3498db;
        }
        
        .tax-info {
            background: #f1f8ff;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            border-left: 4px solid #3498db;
        }
        
        .tax-info h4 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .main-content {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }
        
        .controls-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .gilt-table {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .gilt-table h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3em;
        }
        
        .loading {
            text-align: center;
            padding: 50px;
            color: #7f8c8d;
            font-size: 1.1em;
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .btn {
            background: #3498db;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #2980b9;
        }
        
        .btn:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
        }
        
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .metric-value {
            font-size: 1.8em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .metric-label {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-bottom: 5px;
        }
        
        .metric-subtitle {
            color: #95a5a6;
            font-size: 0.8em;
            margin-top: 5px;
        }
        
        .filter-controls {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .range-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }
        
        .range-container input[type="number"] {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .range-container input[type="number"]:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
        }
        
        .range-info {
            margin-top: 10px;
            color: #7f8c8d;
        }
        
        .clickable-cell {
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .clickable-cell:hover {
            background-color: #f8f9fa;
        }
        
        /* Ensure table structure is preserved */
        .table-container table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        
        .table-container td, .table-container th {
            vertical-align: middle;
            padding: 8px 6px;
        }
        
        /* Column width optimization - 7 columns with advantage column */
        .table-container th:nth-child(1), .table-container td:nth-child(1) { width: 25%; } /* Name */
        .table-container th:nth-child(2), .table-container td:nth-child(2) { width: 12%; } /* Clean Price */
        .table-container th:nth-child(3), .table-container td:nth-child(3) { width: 12%; } /* Dirty Price */
        .table-container th:nth-child(4), .table-container td:nth-child(4) { width: 12%; } /* After-Tax IRR */
        .table-container th:nth-child(5), .table-container td:nth-child(5) { width: 18%; } /* Equivalent Rate */
        .table-container th:nth-child(6), .table-container td:nth-child(6) { width: 6%; } /* Years */
        .table-container th:nth-child(7), .table-container td:nth-child(7) { width: 15%; } /* Advantage */
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        
        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 30px;
            border-radius: 10px;
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 15px;
        }
        
        .modal-title {
            font-size: 1.4em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .close {
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close:hover {
            color: #000;
        }
        
        .calculation-step {
            margin-bottom: 15px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }
        
        .calculation-formula {
            font-family: 'Courier New', monospace;
            background-color: #e8f4f8;
            padding: 10px;
            border-radius: 3px;
            margin: 10px 0;
        }
        
        /* Schedule tooltip styles */
        .schedule-tooltip {
            max-width: 100%;
        }
        
        .schedule-summary {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #28a745;
        }
        
        .schedule-summary p {
            margin: 5px 0;
            font-weight: 500;
        }
        
        .payment-schedule {
            overflow-x: auto;
            margin: 20px 0;
        }
        
        .payment-schedule table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            background: white;
        }
        
        .payment-schedule th {
            background-color: #f8f9fa;
            padding: 8px 6px;
            text-align: left;
            border: 1px solid #dee2e6;
            font-weight: bold;
            font-size: 11px;
        }
        
        .payment-schedule td {
            padding: 6px;
            border: 1px solid #dee2e6;
            text-align: right;
        }
        
        .payment-schedule td:first-child {
            text-align: left;
        }
        
        .maturity-payment {
            background-color: #fff3cd;
            font-weight: bold;
        }
        
        .schedule-notes {
            background-color: #f1f3f4;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
        }
        
        .schedule-notes p {
            margin: 2px 0;
            font-size: 12px;
            color: #6c757d;
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .controls-section {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .sidebar {
                padding: 15px;
            }
            
            .gilt-table {
                padding: 15px;
            }
            
            /* Mobile summary layout */
            .metric-card div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
                gap: 15px !important;
            }
            
            .metric-card {
                padding: 20px 15px !important;
            }
            
            .metric-card div[style*="font-size: 1.3em"] {
                font-size: 1.1em !important;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                font-size: 14px;
                margin-bottom: 5px;
            }
            
            .form-group select,
            .form-group input {
                font-size: 16px; /* Prevent zoom on iOS */
                padding: 12px;
                width: 100%;
                box-sizing: border-box;
            }
            
            .btn {
                font-size: 16px;
                padding: 12px 20px;
                width: 100%;
                margin-bottom: 10px;
            }
            
            .tax-info {
                font-size: 14px;
                padding: 12px;
            }
            
            .metrics {
                grid-template-columns: 1fr;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .metric-card {
                padding: 15px;
                text-align: center;
            }
            
            .metric-label {
                font-size: 12px;
            }
            
            .metric-value {
                font-size: 20px;
            }
            
            .metric-subtitle {
                font-size: 11px;
            }
            
            .filter-controls {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .range-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
                justify-content: center;
            }
            
            .range-container input {
                width: 70px;
                font-size: 14px;
            }
            
            .range-container label {
                font-size: 14px;
                margin: 0;
            }
            
            .table-container {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .table-container table {
                min-width: 750px;
                font-size: 12px;
            }
            
            .table-container th {
                font-size: 11px;
                padding: 6px 4px;
                white-space: nowrap;
            }
            
            .table-container td {
                padding: 6px 4px;
                font-size: 12px;
            }
            
            .table-container td:first-child {
                font-size: 11px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            /* Mobile column width adjustments - 7 columns */
            .table-container th:nth-child(1), .table-container td:nth-child(1) { width: 28%; } /* Name */
            .table-container th:nth-child(2), .table-container td:nth-child(2) { width: 10%; } /* Clean Price */
            .table-container th:nth-child(3), .table-container td:nth-child(3) { width: 10%; } /* Dirty Price */
            .table-container th:nth-child(4), .table-container td:nth-child(4) { width: 12%; } /* After-Tax IRR */
            .table-container th:nth-child(5), .table-container td:nth-child(5) { width: 16%; } /* Equivalent Rate */
            .table-container th:nth-child(6), .table-container td:nth-child(6) { width: 7%; } /* Years */
            .table-container th:nth-child(7), .table-container td:nth-child(7) { width: 17%; } /* Advantage */
            
            .clickable-cell {
                min-height: 44px; /* Touch target size */
                cursor: pointer;
                position: relative;
            }
            
            .clickable-cell:hover {
                background-color: #f8f9fa;
            }
            
            /* Modal improvements for mobile */
            .modal-content {
                width: 95%;
                max-width: 400px;
                margin: 5% auto;
                max-height: 85vh;
                overflow-y: auto;
            }
            
            .calculation-step {
                margin-bottom: 12px;
                padding: 12px;
            }
            
            .calculation-formula {
                font-size: 13px;
                padding: 8px;
                word-wrap: break-word;
            }
            
            .schedule-tooltip .payment-schedule table {
                font-size: 10px;
            }
            
            .schedule-tooltip .payment-schedule th,
            .schedule-tooltip .payment-schedule td {
                padding: 4px 3px;
            }
            
            .loading, .error {
                font-size: 14px;
                padding: 20px 15px;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 5px;
            }
            
            h1 {
                font-size: 22px;
                text-align: center;
                margin-bottom: 15px;
            }
            
            h3 {
                font-size: 18px;
                margin-bottom: 15px;
            }
            
            .metrics {
                grid-template-columns: 1fr;
                gap: 8px;
            }
            
            .metric-card {
                padding: 12px;
            }
            
            .metric-value {
                font-size: 18px;
            }
            
            .range-container {
                flex-direction: column;
                gap: 8px;
            }
            
            .range-container > div {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                justify-content: center;
            }
            
            .table-container table {
                min-width: 650px;
                font-size: 11px;
            }
            
            .table-container th {
                font-size: 9px;
                padding: 4px 3px;
            }
            
            .table-container td {
                padding: 4px 3px;
                font-size: 10px;
            }
            
            .table-container td:first-child {
                font-size: 9px;
            }
            
            /* Ultra-compact mobile column widths - 7 columns */
            .table-container th:nth-child(1), .table-container td:nth-child(1) { width: 30%; } /* Name */
            .table-container th:nth-child(2), .table-container td:nth-child(2) { width: 9%; } /* Clean Price */
            .table-container th:nth-child(3), .table-container td:nth-child(3) { width: 9%; } /* Dirty Price */
            .table-container th:nth-child(4), .table-container td:nth-child(4) { width: 12%; } /* After-Tax IRR */
            .table-container th:nth-child(5), .table-container td:nth-child(5) { width: 15%; } /* Equivalent Rate */
            .table-container th:nth-child(6), .table-container td:nth-child(6) { width: 6%; } /* Years */
            .table-container th:nth-child(7), .table-container td:nth-child(7) { width: 19%; } /* Advantage */
            
            .modal-content {
                width: 98%;
                margin: 2% auto;
                padding: 15px;
                max-height: 90vh;
            }
            
            .close {
                font-size: 24px;
                top: 10px;
                right: 15px;
            }
        }
            
            .header {
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .header h1 {
                font-size: 1.8em;
                margin-bottom: 8px;
            }
            
            .header p {
                font-size: 1em;
            }
            
            .container {
                padding: 10px;
            }
            
            .sidebar {
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .gilt-table {
                padding: 20px;
            }
            
            .metrics {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .metric-card {
                padding: 15px;
            }
            
            .metric-value {
                font-size: 1.5em;
            }
            
            .form-group select,
            .form-group input {
                font-size: 16px;
                padding: 12px;
            }
            
            .btn {
                width: 100%;
                padding: 15px;
                font-size: 16px;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 5px;
            }
            
            .header {
                padding: 15px;
            }
            
            .header h1 {
                font-size: 1.5em;
            }
            
            .sidebar,
            .gilt-table {
                padding: 15px;
            }
            
            .sidebar h3,
            .gilt-table h3 {
                font-size: 1.1em;
            }
            
            .metric-value {
                font-size: 1.3em;
            }
            
            .tax-info {
                padding: 12px;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
        }
        
        /* Table Responsiveness */
        .table-container {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            table {
                font-size: 12px;
            }
            
            th, td {
                padding: 8px 4px;
            }
            
            .table-container {
                margin: 10px -5px;
            }
        }
        
        @media (max-width: 480px) {
            table {
                font-size: 11px;
            }
            
            th, td {
                padding: 6px 3px;
            }
            
            .table-container {
                margin: 10px -10px;
            }
        }
        
        /* Better touch targets for mobile */
        @media (max-width: 768px) {
            select, input, button {
                min-height: 44px;
            }
            
            .btn {
                min-height: 48px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>\u{1F4B7} UK Gilt Tax Efficiency Analyser</h1>
            <p>Analyse the tax efficiency of UK gilt investments for your specific tax situation</p>
        </header>
        
        <div class="main-content">
            <!-- Controls Section - Top -->
            <div class="controls-section">
                <div class="sidebar">
                    <h3>\u{1F4B7} Tax Settings</h3>
                    <div class="form-group">
                        <label for="taxBracket">Select Your Tax Bracket</label>
                        <select id="taxBracket">
                            <option value="basic_rate">Basic Rate (20%)</option>
                            <option value="higher_rate">Higher Rate (40%)</option>
                            <option value="additional_rate" selected>Additional Rate (45%)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="investmentAmount">Investment Amount (\xA3)</label>
                        <input type="number" id="investmentAmount" value="10000" min="100" max="10000000" step="1000">
                    </div>
                    
                    <div class="form-group">
                        <label for="savingsRate">Current Savings Rate (%)</label>
                        <input type="number" id="savingsRate" value="4.5" min="0" max="20" step="0.1">
                    </div>
                    
                    <div class="form-group">
                        <label for="dealingCharge">Dealing Charge (\xA3)</label>
                        <input type="number" id="dealingCharge" value="5" min="0" max="1000" step="1">
                        <div class="tax-info" style="margin-top: 10px; padding: 10px; font-size: 14px;">
                            <p>\u{1F4B7} Transaction cost charged by your broker for purchasing gilts. Set to \xA30 to exclude dealing charges from calculations.</p>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="accountChargeEnabled">Monthly Account Charge</label>
                        <select id="accountChargeEnabled">
                            <option value="false">No monthly charge</option>
                            <option value="true">Apply monthly charge</option>
                        </select>
                    </div>
                    
                    <div id="accountChargeSettings" style="display: none;">
                        <div class="form-group">
                            <label for="accountChargeRate">Annual Charge Rate (%)</label>
                            <input type="number" id="accountChargeRate" value="0.25" min="0" max="5" step="0.05">
                        </div>
                        
                        <div class="form-group">
                            <label for="accountChargeMax">Maximum Monthly Charge (\xA3)</label>
                            <input type="number" id="accountChargeMax" value="3.50" min="0" max="100" step="0.25">
                        </div>
                        
                        <div class="tax-info" style="margin-top: 10px; padding: 10px; font-size: 14px;">
                            <p>\u{1F4B7} Monthly platform fee based on gilt value at month-end. The gilt price is assumed to converge linearly to \xA3100 at maturity.</p>
                            <p><strong>Example:</strong> 0.25% annual (0.0208% monthly) capped at \xA33.50/month</p>
                        </div>
                    </div>
                    
                    <div class="tax-info" id="taxInfo">
                        <h4>Your Tax Settings:</h4>
                        <div id="taxDetails">
                            <p><strong>Income Tax Rate:</strong> 45%</p>
                            <p><strong>Personal Savings Allowance:</strong> \xA30</p>
                            <p><strong>Capital Gains Tax on Gilts:</strong> 0% (exempt)</p>
                        </div>
                    </div>
                </div>
                
                <div class="sidebar">
                    <h3>\u{1F527} Controls</h3>
                    <button class="btn" id="refreshData" style="width: 100%; margin-bottom: 20px;">\u{1F504} Refresh Data</button>
                    
                    <div id="filterControls" class="filter-controls" style="display: none;">
                        <div class="form-group">
                            <label for="durationRange">Filter by Duration (Years):</label>
                            <div class="range-container">
                                <div>
                                    <label for="durationMin">Min:</label>
                                    <input type="number" id="durationMin" min="0" max="45" value="0" step="0.5">
                                </div>
                                <div>
                                    <label for="durationMax">Max:</label>
                                    <input type="number" id="durationMax" min="0" max="45" value="2" step="0.5">
                                </div>
                            </div>
                            <div class="range-info">
                                <small>Showing <span id="filteredCount">0</span> of <span id="totalCount">0</span> gilts</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Summary Section - Middle -->
            <div class="metrics" id="metrics" style="display: none;"></div>
            
            <!-- Table Section - Bottom -->
            <main class="gilt-table">
                <h3>\u{1F4CA} Available Gilts</h3>
                
                <div id="loading" class="loading">Loading gilt data...</div>
                <div id="error" class="error" style="display: none;"></div>
                <div id="giltData" style="display: none;"></div>
                <div id="metrics" class="metrics" style="display: none;"></div>
            </main>
        </div>
    </div>
    
    <script>
        // Utility functions (inline to avoid module import issues)
        function formatCurrency(amount, currency = '\xA3') {
            if (isNaN(amount) || amount === null || amount === undefined) {
                return 'N/A';
            }
            
            // Always show full amount with exactly 2 decimal places and comma separators
            return currency + amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        
        // Helper function to format any monetary amount with commas
        // Optimized helper functions
        function roundToTwo(num) {
            return Math.round(num * 100) / 100;
        }
        
        function formatMoney(amount) {
            return formatCurrency(amount, '');
        }

        function formatPercentage(percentage, decimalPlaces = 2) {
            if (isNaN(percentage) || percentage === null || percentage === undefined) {
                return 'N/A';
            }
            return percentage.toFixed(decimalPlaces) + '%';
        }

        function formatCouponRate(rate) {
            if (isNaN(rate) || rate === null || rate === undefined) {
                return 'N/A';
            }
            
            // Format with max 3 decimal places, removing trailing zeros
            const formatted = rate.toFixed(3).replace(/\\.?0+$/, '');
            return formatted + '%';
        }
        
        function getCurrentTaxRate() {
            return currentSettings.taxBracket === 'basic_rate' ? 20 : 
                   currentSettings.taxBracket === 'higher_rate' ? 40 : 45;
        }
        
        // Import consolidated utility functions synchronously at runtime
        let utilsLoaded = false;
        let utils = {};
        
        async function ensureUtilsLoaded() {
            if (!utilsLoaded) {
                utils = await import('../lib/utils.js');
                utilsLoaded = true;
                console.log('Consolidated utility functions loaded');
            }
            return utils;
        }
        
        // Enhanced utility functions with caching and error checking
        function calculateYearsToMaturity(maturityDate, referenceDate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateYearsToMaturity(maturityDate, referenceDate);
        }
        
        function calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate);
        }
        
        function calculateDirtyPrice(cleanPrice, accruedInterest) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateDirtyPrice(cleanPrice, accruedInterest);
        }
        
        function findLastCouponDate(maturityDate, referenceDate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.findLastCouponDate(maturityDate, referenceDate);
        }
        
        function findNextCouponDate(maturityDate, referenceDate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.findNextCouponDate(maturityDate, referenceDate);
        }
        
        function getTaxRateInfo(taxBracket) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.getTaxRateInfo(taxBracket);
        }
        
        function calculateUnitsOwned(investmentAmount, dirtyPrice) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateUnitsOwned(investmentAmount, dirtyPrice);
        }
        
        function calculateEquivalentGrossSavingsRate(afterTaxYield, incomeTaxRate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateEquivalentGrossSavingsRate(afterTaxYield, incomeTaxRate);
        }
        
        // Cache for complex calculations
        const complexCalculationCache = new Map();
        
        function getCachedComplexCalculation(key, calculationFn, ...args) {
            // Optimize cache key generation for common patterns
            let cacheKey;
            if (args.length === 1 && typeof args[0] === 'number') {
                cacheKey = key + '_' + args[0];
            } else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
                cacheKey = key + '_' + args[0] + '_' + args[1];
            } else if (args.length === 1 && args[0] && typeof args[0].name === 'string') {
                // For gilt objects, use name as key component
                cacheKey = key + '_' + args[0].name + '_' + (args[0].dirtyPrice || 0);
            } else {
                cacheKey = key + '_' + JSON.stringify(args);
            }
            
            if (complexCalculationCache.has(cacheKey)) {
                return complexCalculationCache.get(cacheKey);
            }
            
            const result = calculationFn(...args);
            complexCalculationCache.set(cacheKey, result);
            
            // Efficient cache cleanup
            if (complexCalculationCache.size > 500) {
                let deleteCount = 0;
                for (const [k] of complexCalculationCache) {
                    complexCalculationCache.delete(k);
                    if (++deleteCount >= 100) break;
                }
            }
            
            return result;
        }
        
        function getCacheStats() {
            if (!utilsLoaded) return null;
            const utilsStats = utils.getCacheStats ? utils.getCacheStats() : null;
            return {
                utilsCache: utilsStats,
                complexCache: { size: complexCalculationCache.size },
                total: (utilsStats?.cacheSize || 0) + complexCalculationCache.size
            };
        }
        
        function clearAllCaches() {
            complexCalculationCache.clear();
            if (utilsLoaded && utils.clearCache) {
                utils.clearCache();
            }
            console.log('All caches cleared');
        }
        
        // IMMEDIATE DEBUG - Check if JavaScript is loading
        console.log('=== JAVASCRIPT FILE STARTED LOADING ===');
        console.log('Current time:', new Date());
        
        let currentGiltData = [];
        let currentResults = [];
        let currentSettings = {
            taxBracket: 'additional_rate',
            investmentAmount: 10000,
            savingsRate: 4.5,
            dealingCharge: 5, // Default to \xA35
            accountChargeEnabled: false,
            accountChargeRate: 0.25,
            accountChargeMax: 3.50
        };
        let durationFilter = { min: 0, max: 2 };
        
        // Initialize app - use fallback data immediately when rate limited
        function initializeApp() {
            console.log('=== APP INITIALIZATION STARTED ===');
            console.log('Current settings:', currentSettings);
            
            // Ensure DOM is ready before setting up listeners
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setupEventListeners();
                    updateTaxSettings();
                });
            } else {
                setupEventListeners();
                updateTaxSettings();
            }
            
            // Load gilt data using the new daily caching system
            console.log('=== STARTING GILT DATA LOAD WITH DAILY CACHING ===');
            
            // Add a small delay to ensure DOM is ready
            setTimeout(() => {
                loadGiltData();
            }, 100);
        }
        
        async function loadFallbackData() {
            console.log('=== STARTING FALLBACK DATA LOAD ===');
            const loadingDiv = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            
            console.log('Loading div:', loadingDiv);
            console.log('Error div:', errorDiv);
            
            if (loadingDiv) loadingDiv.style.display = 'block';
            if (errorDiv) errorDiv.style.display = 'none';
            
            try {
                console.log('Calling getFallbackGiltData...');
                currentGiltData = await getFallbackGiltData();
                console.log('=== FALLBACK DATA LOADED ===');
                console.log('Current gilt data length:', currentGiltData ? currentGiltData.length : 'NULL');
                console.log('First gilt:', currentGiltData ? currentGiltData[0] : 'NULL');
                
                if (!currentGiltData || currentGiltData.length === 0) {
                    throw new Error('Fallback data is empty or null');
                }
                
                if (loadingDiv) loadingDiv.style.display = 'none';
                const filterControls = document.getElementById('filterControls');
                if (filterControls) filterControls.style.display = 'block';
                
                // Create data freshness message for fallback data
                const fallbackResult = {
                    data: currentGiltData,
                    dataSource: 'fallback',
                    priceDate: '19/07/2025'
                };
                showDataFreshnessMessage(fallbackResult);
                
                console.log('Calling calculateTaxEfficiency...');
                calculateTaxEfficiency();
            } catch (error) {
                console.error('=== FALLBACK DATA FAILED ===');
                console.error('Error details:', error);
                console.error('Error stack:', error.stack);
                
                if (loadingDiv) loadingDiv.style.display = 'none';
                if (errorDiv) {
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = 'Unable to load gilt data: ' + error.message;
                }
            }
        }
        
        function setupEventListeners() {
            // Set up standard listeners
            document.getElementById('taxBracket').addEventListener('change', updateTaxSettings);
            document.getElementById('investmentAmount').addEventListener('input', updateInvestmentAmount);
            document.getElementById('savingsRate').addEventListener('input', updateSavingsRate);
            document.getElementById('refreshData').addEventListener('click', loadGiltData);
            
            // Duration filter listeners
            document.getElementById('durationMin').addEventListener('input', updateDurationFilter);
            document.getElementById('durationMax').addEventListener('input', updateDurationFilter);
            
            // Account charge listeners
            document.getElementById('accountChargeEnabled').addEventListener('change', updateAccountChargeEnabled);
            document.getElementById('accountChargeRate').addEventListener('input', updateAccountChargeSettings);
            document.getElementById('accountChargeMax').addEventListener('input', updateAccountChargeSettings);
        }
        
        function updateDealingCharge() {
            const value = document.getElementById('dealingCharge').value;
            const dealingCharge = value === '' ? 5 : (parseFloat(value) || 5);
            currentSettings.dealingCharge = Math.max(0, dealingCharge); // Ensure non-negative
            
            // Clear cache since dealing charge affects calculations
            clearAllCaches();
            
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }

        function updateInvestmentAmount() {
            const investmentAmount = parseFloat(document.getElementById('investmentAmount').value) || 10000;
            currentSettings.investmentAmount = investmentAmount;
            
            // Clear cache since investment amount affects unit calculations
            clearAllCaches();
            
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }

        function updateSavingsRate() {
            const savingsRate = parseFloat(document.getElementById('savingsRate').value) || 4.5;
            currentSettings.savingsRate = savingsRate;
            
            // Clear cache since savings rate affects comparison calculations
            clearAllCaches();
            
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }
        
        function updateAccountChargeEnabled() {
            const enabled = document.getElementById('accountChargeEnabled').value === 'true';
            currentSettings.accountChargeEnabled = enabled;
            
            // Show/hide account charge settings
            const settingsDiv = document.getElementById('accountChargeSettings');
            if (settingsDiv) {
                settingsDiv.style.display = enabled ? 'block' : 'none';
            }
            
            // Clear cache since account charge settings affect calculations
            clearAllCaches();
            
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }
        
        function updateAccountChargeSettings() {
            const rate = parseFloat(document.getElementById('accountChargeRate').value) || 0.25;
            const max = parseFloat(document.getElementById('accountChargeMax').value) || 3.50;
            
            currentSettings.accountChargeRate = rate;
            currentSettings.accountChargeMax = max;
            
            // Clear cache since account charge rate/max settings affect calculations
            clearAllCaches();
            
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }

        async function updateTaxSettings() {
            const taxBracket = document.getElementById('taxBracket').value;
            currentSettings.taxBracket = taxBracket;
            
            const taxInfo = {
                'basic_rate': { rate: 20, psa: 1000, description: 'Basic Rate taxpayers typically receive \xA31,000 PSA' },
                'higher_rate': { rate: 40, psa: 500, description: 'Higher Rate taxpayers typically receive \xA3500 PSA' },
                'additional_rate': { rate: 45, psa: 0, description: 'Additional Rate taxpayers receive no PSA' }
            };
            
            const info = taxInfo[taxBracket];
            
            // Ask for PSA confirmation when tax rate changes
            const currentPSA = currentSettings.psaAmount;
            const suggestedPSA = info.psa;
            
            let confirmedPSA = suggestedPSA;
            
            // Only ask for confirmation if this is a meaningful change and PSA is relevant
            if (currentPSA !== suggestedPSA && (currentPSA !== undefined || suggestedPSA > 0)) {
                confirmedPSA = await showPSAChoiceModal(taxBracket, suggestedPSA, info.description);
            }
            
            // Store the confirmed PSA amount
            currentSettings.psaAmount = confirmedPSA;
            
            // Clear cache since tax settings affect all calculations
            clearAllCaches();
            
            document.getElementById('taxDetails').innerHTML = \`
                <p><strong>Income Tax Rate:</strong> \${info.rate}%</p>
                <p><strong>Personal Savings Allowance:</strong> \xA3\${confirmedPSA.toLocaleString()}</p>
                <p><strong>Capital Gains Tax on Gilts:</strong> 0% (exempt)</p>
                \${confirmedPSA !== suggestedPSA ? 
                    '<p style="color: #e67e22; font-size: 12px; margin-top: 5px;"><strong>Custom PSA:</strong> Using your specified allowance</p>' : 
                    ''
                }
            \`;
            
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }
        
        function showPSAChoiceModal(taxBracket, suggestedPSA, description) {
            return new Promise((resolve) => {
                // Create modal HTML
                const modalHTML = \`
                    <div id="psaModal" style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 10000;
                    ">
                        <div style="
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                            max-width: 500px;
                            width: 90%;
                            text-align: center;
                        ">
                            <h3 style="margin: 0 0 20px 0; color: #2c3e50;">Personal Savings Allowance Confirmation</h3>
                            <div style="margin: 20px 0; text-align: left; line-height: 1.5;">
                                <p><strong>Tax Bracket:</strong> \${taxBracket.replace('_', ' ').toUpperCase()}</p>
                                <p><strong>Standard PSA:</strong> \xA3\${suggestedPSA.toLocaleString()}</p>
                                <p style="margin: 15px 0; color: #555;">\${description}</p>
                            </div>
                            <p style="margin: 20px 0; font-weight: bold;">Do you have your full Personal Savings Allowance available?</p>
                            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                                <button id="psaStandard" style="
                                    background: #27ae60;
                                    color: white;
                                    border: none;
                                    padding: 12px 20px;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    font-size: 16px;
                                    font-weight: bold;
                                ">Standard Amount (\xA3\${suggestedPSA.toLocaleString()})</button>
                                <button id="psaNil" style="
                                    background: #e74c3c;
                                    color: white;
                                    border: none;
                                    padding: 12px 20px;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    font-size: 16px;
                                    font-weight: bold;
                                ">Nil Available (\xA30)</button>
                            </div>
                        </div>
                    </div>
                \`;
                
                // Add modal to page
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // Add event listeners
                document.getElementById('psaStandard').addEventListener('click', function() {
                    document.getElementById('psaModal').remove();
                    resolve(suggestedPSA);
                });
                
                document.getElementById('psaNil').addEventListener('click', function() {
                    document.getElementById('psaModal').remove();
                    resolve(0);
                });
            });
        }
        

        
        function updateDurationFilter() {
            const minInput = document.getElementById('durationMin');
            const maxInput = document.getElementById('durationMax');
            let minValue = parseFloat(minInput.value) || 0;
            let maxValue = parseFloat(maxInput.value) || 45;
            
            // Ensure values are within bounds
            minValue = Math.max(0, Math.min(45, minValue));
            maxValue = Math.max(0, Math.min(45, maxValue));
            
            // Ensure min doesn't exceed max
            if (minValue > maxValue) {
                minValue = maxValue;
                minInput.value = minValue;
            }
            
            // Ensure max doesn't go below min
            if (maxValue < minValue) {
                maxValue = minValue;
                maxInput.value = maxValue;
            }
            
            // Update filter values
            durationFilter.min = minValue;
            durationFilter.max = maxValue;
            
            // Apply filter if we have results
            if (currentResults.length > 0) {
                displayResults(currentResults);
            }
        }
        
        async function loadGiltData() {
            const loadingDiv = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            const dataDiv = document.getElementById('giltData');
            const metricsDiv = document.getElementById('metrics');
            
            loadingDiv.style.display = 'block';
            errorDiv.style.display = 'none';
            dataDiv.style.display = 'none';
            metricsDiv.style.display = 'none';
            
            // Ensure utils are loaded first
            await ensureUtilsLoaded();
            
            try {
                console.log('Fetching gilt data from /api/gilt-data...');
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for daily API calls
                
                const response = await fetch('/api/gilt-data', {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    throw new Error(\`API rate limited or unavailable\`);
                }
                
                const result = await response.json();
                console.log('Received data from API:', result?.data?.length, 'gilts');
                console.log('Data source:', result?.dataSource);
                console.log('Price date:', result?.priceDate);
                
                if (!result?.data || !Array.isArray(result.data) || result.data.length === 0) {
                    throw new Error('No gilt data received from API');
                }
                
                currentGiltData = result.data;
                
                // Show data freshness message
                showDataFreshnessMessage(result);
                
                loadingDiv.style.display = 'none';
                // Don't show data div yet - wait for tax calculations
                document.getElementById('filterControls').style.display = 'block';
                
                calculateTaxEfficiency();
                
            } catch (error) {
                console.error('API failed:', error);
                
                // Show error for total failure
                loadingDiv.style.display = 'none';
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Unable to load gilt data. The daily caching system may need time to update. Please try refreshing the page in a few minutes.';
            }
        }
        
        function showDataFreshnessMessage(result) {
            // Remove any existing data freshness message
            const existingMessage = document.getElementById('data-freshness-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.id = 'data-freshness-message';
            messageDiv.style.cssText = 'padding: 10px; margin: 10px 0; border-radius: 5px; font-size: 14px; font-weight: 500;';
            
            let messageText = '';
            let messageStyle = '';
            
            switch (result.dataSource) {
                case 'live':
                    messageText = \`\u{1F4CA} Live market data - Prices as of \${result.priceDate} (\${result.data.length} UK government bonds)\`;
                    messageStyle = 'background: #d4edda; border: 1px solid #c3e6cb; color: #155724;';
                    break;
                    
                case 'cached_today':
                    messageText = \`\u{1F4BE} Today's cached data - Prices from \${result.priceDate} (\${result.data.length} UK government bonds)\`;
                    messageStyle = 'background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460;';
                    break;
                    
                case 'fallback':
                    messageText = \`\u26A0\uFE0F Static data - Prices from \${result.priceDate} (\${result.data.length} UK government bonds)\`;
                    messageStyle = 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404;';
                    break;
                    
                default:
                    messageText = \`\u{1F4C8} Gilt pricing data (\${result.data.length} UK government bonds)\`;
                    messageStyle = 'background: #f8f9fa; border: 1px solid #dee2e6; color: #495057;';
            }
            
            messageDiv.style.cssText += messageStyle;
            messageDiv.innerHTML = messageText;
            
            const mainContent = document.querySelector('.main-content');
            const controlsSection = document.querySelector('.controls-section');
            if (mainContent && controlsSection) {
                mainContent.insertBefore(messageDiv, controlsSection);
            }
        }
        
        async function getFallbackGiltData() {
            console.log('Creating fallback gilt data...');
            
            // Ensure utils are loaded before processing fallback data
            await ensureUtilsLoaded();
            
            const today = new Date();
            console.log('Today date:', today);
            const fallbackData = [
                { name: "Treasury 2% 2025", couponRate: 2.0, cleanPrice: 99.72, currentYield: 4.073, maturityDate: "2025-09-07" },
                { name: "Treasury 3.5% 2025", couponRate: 3.5, cleanPrice: 99.82, currentYield: 4.187, maturityDate: "2025-10-22" },
                { name: "Treasury 0.125% 2026", couponRate: 0.125, cleanPrice: 98.37, currentYield: 3.25, maturityDate: "2026-01-30" },
                { name: "Treasury 1.5% 2026", couponRate: 1.5, cleanPrice: 97.74, currentYield: 3.806, maturityDate: "2026-07-22" },
                { name: "Treasury 0.375% 2026", couponRate: 0.375, cleanPrice: 96.02, currentYield: 3.636, maturityDate: "2026-10-22" },
                { name: "Treasury 4.125% 2027", couponRate: 4.125, cleanPrice: 100.3, currentYield: 3.92, maturityDate: "2027-01-29" },
                { name: "Treasury 3.75% 2027", couponRate: 3.75, cleanPrice: 99.75, currentYield: 3.907, maturityDate: "2027-03-07" },
                { name: "Treasury 1.25% 2027", couponRate: 1.25, cleanPrice: 95.15, currentYield: 3.781, maturityDate: "2027-07-22" },
                { name: "Treasury 4.25% 2027", couponRate: 4.25, cleanPrice: 101.15, currentYield: 3.74, maturityDate: "2027-12-07" },
                { name: "Treasury 0.125% 2028", couponRate: 0.125, cleanPrice: 91.41, currentYield: 3.709, maturityDate: "2028-01-31" },
                { name: "Treasury 4.375% 2028", couponRate: 4.375, cleanPrice: 101.06, currentYield: 3.946, maturityDate: "2028-03-07" },
                { name: "Treasury 4.5% 2028", couponRate: 4.5, cleanPrice: 101.57, currentYield: 3.918, maturityDate: "2028-06-07" },
                { name: "Treasury 1.625% 2028", couponRate: 1.625, cleanPrice: 93.44, currentYield: 3.782, maturityDate: "2028-10-22" },
                { name: "Treasury 6% 2028", couponRate: 6.0, cleanPrice: 106.94, currentYield: 3.794, maturityDate: "2028-12-07" },
                { name: "Treasury 0.5% 2029", couponRate: 0.5, cleanPrice: 88.96, currentYield: 3.873, maturityDate: "2029-01-31" },
                { name: "Treasury 4.125% 2029", couponRate: 4.125, cleanPrice: 100.42, currentYield: 4.01, maturityDate: "2029-07-22" },
                { name: "Treasury 0.875% 2029", couponRate: 0.875, cleanPrice: 88.29, currentYield: 3.884, maturityDate: "2029-10-22" },
                { name: "Treasury 4.375% 2030", couponRate: 4.375, cleanPrice: 101.17, currentYield: 4.094, maturityDate: "2030-03-07" },
                { name: "Treasury 0.375% 2030", couponRate: 0.375, cleanPrice: 82.96, currentYield: 4.0, maturityDate: "2030-10-22" },
                { name: "Treasury 4.75% 2030", couponRate: 4.75, cleanPrice: 103.37, currentYield: 4.046, maturityDate: "2030-12-07" }
            ];
            
            const processedData = fallbackData.map(gilt => {
                // Use cached calculations for fallback data processing
                const yearsToMaturity = getCachedComplexCalculation('fallbackYears', calculateYearsToMaturity, gilt.maturityDate, today);
                
                // Calculate basic accrued interest using consolidated function with caching
                const lastPaymentDate = getCachedComplexCalculation('fallbackLastCoupon', findLastCouponDate, gilt.maturityDate, today);
                const accruedInterest = getCachedComplexCalculation('fallbackAccrued', calculateAccruedInterest, gilt.couponRate, lastPaymentDate, today);
                const dirtyPrice = getCachedComplexCalculation('fallbackDirty', calculateDirtyPrice, gilt.cleanPrice, accruedInterest);
                
                const processedGilt = {
                    ...gilt,
                    yearsToMaturity: Math.max(0, yearsToMaturity),
                    dirtyPrice: dirtyPrice,
                    accruedInterest: accruedInterest
                };
                
                console.log('Processed gilt:', processedGilt.name, 'years:', processedGilt.yearsToMaturity);
                return processedGilt;
            }).filter(gilt => {
                const isValid = gilt.yearsToMaturity > 0;
                console.log('Gilt valid:', gilt.name, isValid);
                return isValid;
            });
            
            console.log('Final fallback data count:', processedData.length);
            return processedData;
        }
        
        async function calculateTaxEfficiency() {
            if (currentGiltData.length === 0) return;
            
            console.log('Calculating tax efficiency locally...');
            
            try {
                // Calculate tax efficiency locally without API calls
                const results = await calculateTaxEfficiencyLocal(
                    currentGiltData,
                    currentSettings.taxBracket,
                    currentSettings.investmentAmount,
                    currentSettings.savingsRate
                );
                
                console.log('Local calculation results:', results.length, 'gilts processed');
                currentResults = results;
                
                // Now show the data sections since we have complete results
                const dataDiv = document.getElementById('giltData');
                const metricsDiv = document.getElementById('metrics');
                dataDiv.style.display = 'block';
                metricsDiv.style.display = 'block';
                
                displayResults(results);
                
            } catch (error) {
                console.error('Error calculating tax efficiency locally:', error);
                const errorDiv = document.getElementById('error');
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Error calculating tax efficiency: ' + error.message;
            }
        }
        
        async function calculateTaxEfficiencyLocal(giltData, taxBracket, investmentAmount, savingsRate) {
            console.log('Starting local tax calculations...');
            console.log('Gilt data type:', typeof giltData, 'Is array:', Array.isArray(giltData), 'Length:', giltData?.length);
            
            // Ensure giltData is an array
            if (!Array.isArray(giltData)) {
                console.error('giltData is not an array:', giltData);
                return [];
            }
            
            // Ensure utils are loaded
            await ensureUtilsLoaded();
            
            // Use consolidated tax rate function
            const taxInfo = getTaxRateInfo(taxBracket);
            const incomeTaxRate = taxInfo.income / 100;
            
            // Use confirmed PSA amount if available, otherwise use standard
            const psaAmount = currentSettings.psaAmount !== undefined ? currentSettings.psaAmount : taxInfo.psa;
            
            console.log('Using tax rates:', taxInfo);
            
            return giltData.map(gilt => {
                // Include dealing charge in units calculation (if any)
                const dealingCharge = currentSettings.dealingCharge || 0;
                const effectiveInvestmentAmount = investmentAmount - dealingCharge; // Reduce by dealing charge
                const unitsOwned = getCachedComplexCalculation('unitsOwned_' + dealingCharge + '_' + investmentAmount, calculateUnitsOwned, effectiveInvestmentAmount, gilt.dirtyPrice);
                
                // ALWAYS regenerate coupon schedule since it depends on unitsOwned (investment amount)
                gilt.couponSchedule = generateCouponSchedule(gilt, unitsOwned, incomeTaxRate);
                
                // ALWAYS regenerate account charges if enabled since they depend on unitsOwned
                if (currentSettings.accountChargeEnabled) {
                    gilt.accountCharges = calculateAccountCharges(gilt, unitsOwned);
                }
                
                // Create cache key suffix that includes all relevant settings
                const accountChargeKey = currentSettings.accountChargeEnabled ? 
                    '_ac' + currentSettings.accountChargeRate + '_' + currentSettings.accountChargeMax : '_noac';
                
                // Calculate after-tax yield using IRR method with caching (includes dealing charge and account charges)
                const afterTaxYield = getCachedComplexCalculation('afterTaxIRR_' + dealingCharge + '_' + gilt.name + accountChargeKey, calculateAfterTaxIRR, gilt, unitsOwned, incomeTaxRate);
                
                // Use cached equivalent rate calculation
                const equivalentGrossSavingsRate = getCachedComplexCalculation('equivalentRate_' + afterTaxYield, calculateEquivalentGrossSavingsRate, afterTaxYield, incomeTaxRate);
                
                // Calculate precise advantage using actual coupon schedule with caching
                const giltTotalCashReceived = getCachedComplexCalculation('giltCash_' + dealingCharge + '_' + gilt.name + accountChargeKey, calculateTotalCashFromGilt, gilt, unitsOwned, incomeTaxRate);
                const savingsTotalCashReceived = getCachedComplexCalculation('savingsCash_' + investmentAmount + '_' + savingsRate, calculateTotalCashFromSavings, investmentAmount, savingsRate, incomeTaxRate, psaAmount, gilt.yearsToMaturity);
                const extraIncome = giltTotalCashReceived - savingsTotalCashReceived;
                
                // Return optimized object creation (avoid spread operator for performance)
                return {
                    name: gilt.name,
                    couponRate: gilt.couponRate,
                    cleanPrice: gilt.cleanPrice,
                    currentYield: gilt.currentYield,
                    maturityDate: gilt.maturityDate,
                    yearsToMaturity: gilt.yearsToMaturity,
                    dirtyPrice: gilt.dirtyPrice,
                    accruedInterest: gilt.accruedInterest,
                    couponSchedule: gilt.couponSchedule,
                    accountCharges: gilt.accountCharges, // Include account charges in returned object
                    afterTaxYield: afterTaxYield,
                    equivalentGrossSavingsRate: equivalentGrossSavingsRate,
                    extraIncome: extraIncome,
                    unitsOwned: unitsOwned
                };
            });
        }
        
        function calculateAfterTaxIRR(gilt, unitsOwned, incomeTaxRate) {
            // Use existing coupon schedule if available, otherwise generate it
            const couponSchedule = gilt.couponSchedule || generateCouponSchedule(gilt, unitsOwned, incomeTaxRate);
            
            // Calculate initial investment INCLUDING dealing charge (if any)
            const dealingCharge = currentSettings.dealingCharge || 0;
            const giltPurchaseCost = (gilt.cleanPrice + gilt.accruedInterest) * unitsOwned / 100;
            const initialInvestment = giltPurchaseCost + dealingCharge;
            
            const cashFlows = couponSchedule.map(payment => ({
                amount: payment.afterTaxAmount,
                date: new Date(payment.date)
            }));
            
            // Add account charges if enabled
            if (currentSettings.accountChargeEnabled) {
                const accountCharges = calculateAccountCharges(gilt, unitsOwned);
                // Subtract account charges from cash flows (they reduce returns)
                accountCharges.forEach(charge => {
                    // Find cash flow for the same date or add new one
                    const existingFlow = cashFlows.find(cf => cf.date.getTime() === charge.date.getTime());
                    if (existingFlow) {
                        existingFlow.amount -= charge.amount;
                    } else {
                        cashFlows.push({
                            amount: -charge.amount, // Negative for cost
                            date: charge.date
                        });
                    }
                });
                
                // Store account charges for tooltip display
                gilt.accountCharges = accountCharges;
            }
            
            // Add principal repayment at maturity
            const maturityDate = new Date(gilt.maturityDate);
            cashFlows.push({
                amount: unitsOwned, // \xA3100 per \xA3100 nominal (tax-free)
                date: maturityDate
            });
            
            // Calculate IRR with dealing charge included in initial cost
            const irr = calculateIRR(initialInvestment, cashFlows);
            return irr * 100; // Convert to percentage
        }
        
        function calculateTotalCashFromGilt(gilt, unitsOwned, incomeTaxRate) {
            // Use the stored coupon schedule to calculate total cash received
            if (!gilt.couponSchedule) {
                return 0;
            }
            
            let totalCash = 0;
            
            // Sum all after-tax coupon payments (already rounded in schedule generation)
            gilt.couponSchedule.forEach(payment => {
                totalCash += payment.afterTaxAmount;
            });
            
            // Subtract account charges if enabled (these are already rounded)
            if (currentSettings.accountChargeEnabled && gilt.accountCharges) {
                gilt.accountCharges.forEach(charge => {
                    totalCash -= charge.amount;
                });
            }
            
            // Add tax-free principal repayment at maturity
            totalCash += unitsOwned; // \xA3100 per \xA3100 nominal
            
            return totalCash;
        }
        
        function calculateTotalCashFromSavings(investmentAmount, savingsRate, incomeTaxRate, psaAmount, yearsToMaturity) {
            // Pre-calculate constants to avoid repeated calculations
            const msPerDay = 24 * 60 * 60 * 1000;
            const savingsRateDecimal = savingsRate / 100;
            const totalDays = Math.round(yearsToMaturity * 365.25);
            const completeYears = Math.floor(totalDays / 365);
            const remainingDays = totalDays - (completeYears * 365);
            
            let currentBalance = investmentAmount;
            
            // Process complete years in batch with 2-decimal rounding
            if (completeYears > 0) {
                for (let year = 1; year <= completeYears; year++) {
                    const grossInterest = roundToTwo(currentBalance * savingsRateDecimal);
                    const taxableInterest = Math.max(0, grossInterest - psaAmount);
                    const tax = roundToTwo(taxableInterest * incomeTaxRate);
                    const netInterest = grossInterest - tax;
                    currentBalance += netInterest;
                }
            }
            
            // Handle remaining days if any with 2-decimal rounding
            if (remainingDays > 0) {
                const dailyRate = savingsRateDecimal / 365;
                const grossInterest = roundToTwo(currentBalance * dailyRate * remainingDays);
                const partialYearFraction = remainingDays / 365;
                const availablePSAPartialYear = psaAmount * partialYearFraction;
                const taxableInterest = Math.max(0, grossInterest - availablePSAPartialYear);
                const tax = roundToTwo(taxableInterest * incomeTaxRate);
                const netInterest = grossInterest - tax;
                currentBalance += netInterest;
            }
            
            return currentBalance;
        }
        
        function generateCouponSchedule(gilt, unitsOwned, incomeTaxRate) {
            const maturityTime = new Date(gilt.maturityDate).getTime();
            const todayTime = new Date().getTime();
            const semiAnnualCoupon = (gilt.couponRate / 2 / 100) * unitsOwned;
            const schedule = [];
            
            // Pre-calculate values to avoid repeated calculations
            const sixMonthsMs = 6 * 30.44 * 24 * 60 * 60 * 1000; // Average 6 months
            let currentTime = maturityTime;
            
            // Build schedule forward to avoid unshift operations
            const tempSchedule = [];
            while (currentTime > todayTime) {
                const grossAmount = semiAnnualCoupon;
                const roundedGrossAmount = roundToTwo(grossAmount);
                const taxAmount = roundedGrossAmount * incomeTaxRate;
                const roundedTaxAmount = roundToTwo(taxAmount);
                const roundedAfterTaxAmount = roundedGrossAmount - roundedTaxAmount;
                
                tempSchedule.push({
                    date: new Date(currentTime).toISOString().split('T')[0],
                    grossAmount: roundedGrossAmount,
                    taxAmount: roundedTaxAmount,
                    afterTaxAmount: roundedAfterTaxAmount
                });
                
                currentTime -= sixMonthsMs;
            }
            
            // Reverse once and filter in single pass
            for (let i = tempSchedule.length - 1; i >= 0; i--) {
                const payment = tempSchedule[i];
                if (new Date(payment.date).getTime() > todayTime) {
                    schedule.push(payment);
                }
            }
            
            return schedule;
        }
        
        function calculateAccountCharges(gilt, unitsOwned) {
            const accountCharges = [];
            const today = new Date();
            const maturityDate = new Date(gilt.maturityDate);
            const yearsToMaturity = gilt.yearsToMaturity;
            
            // Calculate monthly dates from now until maturity
            const monthlyCharges = [];
            let currentDate = new Date(today);
            currentDate.setDate(1); // Start from first day of current month
            currentDate.setMonth(currentDate.getMonth() + 1); // Next month
            
            while (currentDate <= maturityDate) {
                monthlyCharges.push(new Date(currentDate));
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            
            // Calculate charges for each month
            monthlyCharges.forEach(chargeDate => {
                const timeFromNow = (chargeDate - today) / (365.25 * 24 * 60 * 60 * 1000); // Years
                const timeToMaturity = (maturityDate - chargeDate) / (365.25 * 24 * 60 * 60 * 1000); // Years
                
                // Linear price convergence from current price to 100
                const currentPrice = gilt.cleanPrice;
                const priceProgress = (yearsToMaturity - timeToMaturity) / yearsToMaturity;
                const interpolatedPrice = currentPrice + (100 - currentPrice) * priceProgress;
                
                // Calculate gilt value at this time
                const giltValue = (interpolatedPrice * unitsOwned) / 100;
                
                // Annual rate applied monthly
                const monthlyRate = currentSettings.accountChargeRate / 100 / 12;
                const monthlyCharge = giltValue * monthlyRate;
                
                const cappedCharge = Math.min(monthlyCharge, currentSettings.accountChargeMax);
                const roundedCharge = roundToTwo(cappedCharge);
                
                accountCharges.push({
                    date: chargeDate,
                    amount: roundedCharge,
                    giltValue: giltValue,
                    interpolatedPrice: interpolatedPrice,
                    uncappedCharge: monthlyCharge
                });
            });
            
            return accountCharges;
        }
        
        function calculateIRR(initialInvestment, cashFlows) {
            // Newton-Raphson method for IRR calculation
            let rate = 0.05; // Initial guess (5%)
            const tolerance = 1e-7;
            const maxIterations = 100;
            
            for (let i = 0; i < maxIterations; i++) {
                let npv = -initialInvestment;
                let npvDerivative = 0;
                
                cashFlows.forEach(cf => {
                    const yearsFraction = (cf.date - new Date()) / (365.25 * 24 * 60 * 60 * 1000);
                    if (yearsFraction > 0) {
                        const discountFactor = Math.pow(1 + rate, yearsFraction);
                        npv += cf.amount / discountFactor;
                        npvDerivative -= cf.amount * yearsFraction / (discountFactor * (1 + rate));
                    }
                });
                
                if (Math.abs(npv) < tolerance) {
                    return rate;
                }
                
                if (Math.abs(npvDerivative) < tolerance) {
                    break;
                }
                
                rate = rate - npv / npvDerivative;
                
                // Keep rate within reasonable bounds
                rate = Math.max(-0.99, Math.min(10, rate));
            }
            
            // Fallback to simple calculation if IRR doesn't converge
            const totalCashFlow = cashFlows.reduce((sum, cf) => sum + cf.amount, 0);
            const avgYears = cashFlows.reduce((sum, cf) => {
                const years = (cf.date - new Date()) / (365.25 * 24 * 60 * 60 * 1000);
                return sum + years;
            }, 0) / cashFlows.length;
            
            return ((totalCashFlow - initialInvestment) / initialInvestment) / avgYears;
        }
        
        function calculateEquivalentSavingsRate(afterTaxYield, savingsRate, psaAmount, incomeTaxRate, investmentAmount) {
            // Calculate what savings rate would give same after-tax return
            const targetAfterTaxReturn = (afterTaxYield / 100) * investmentAmount;
            
            // Work backwards from desired after-tax return to required gross rate
            const annualInterest = targetAfterTaxReturn;
            const taxableInterest = Math.max(0, annualInterest - psaAmount);
            const grossInterestNeeded = annualInterest + (taxableInterest * incomeTaxRate);
            
            return (grossInterestNeeded / investmentAmount) * 100;
        }
        
        function displayResults(results) {
            const dataDiv = document.getElementById('giltData');
            const metricsDiv = document.getElementById('metrics');
            
            // Filter results by duration
            const filteredResults = results.filter(gilt => 
                gilt.yearsToMaturity >= durationFilter.min && 
                gilt.yearsToMaturity <= durationFilter.max
            );
            
            // Sort by years to maturity (increasing duration)
            const sortedResults = filteredResults.sort((a, b) => 
                a.yearsToMaturity - b.yearsToMaturity
            );
            
            // Update filter count display
            document.getElementById('filteredCount').textContent = sortedResults.length;
            document.getElementById('totalCount').textContent = results.length;
            
            // Display metrics (from filtered results)
            if (sortedResults.length === 0) {
                metricsDiv.innerHTML = '<div class="metric-card"><div class="metric-label">No gilts match your duration filter</div></div>';
                dataDiv.innerHTML = '<p style="text-align: center; padding: 20px; color: #7f8c8d;">No gilts found within the selected duration range. Adjust the filter above.</p>';
                return;
            }
            
            const bestGilt = sortedResults.reduce((best, gilt) => 
                (gilt.afterTaxYield || 0) > (best.afterTaxYield || 0) ? gilt : best, sortedResults[0]);
            
            metricsDiv.innerHTML = \`
                <div class="metric-card" style="grid-column: 1 / -1; text-align: center; padding: 30px;">
                    <div class="metric-label" style="font-size: 1.2em; margin-bottom: 15px;">\u{1F4B7} Best Investment Summary</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 20px;">
                        <div>
                            <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Best Gilt</div>
                            <div style="font-size: 1.1em; font-weight: bold; color: #2c3e50;">\${bestGilt.name}</div>
                            <div style="font-size: 1.3em; font-weight: bold; color: #27ae60; margin-top: 5px;">\${(bestGilt.afterTaxYield || 0).toFixed(2)}%</div>
                        </div>
                        <div>
                            <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Equivalent Savings Rate</div>
                            <div style="font-size: 1.3em; font-weight: bold; color: #3498db;">\${(bestGilt.equivalentGrossSavingsRate || 0).toFixed(2)}%</div>
                            <div style="font-size: 0.8em; color: #666; margin-top: 5px;">needed in savings account</div>
                        </div>
                        <div>
                            <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Extra Income</div>
                            <div style="font-size: 1.3em; font-weight: bold; color: #e67e22;">\${formatCurrency(bestGilt.extraIncome || 0)}</div>
                            <div style="font-size: 0.8em; color: #666; margin-top: 5px;">vs. typical savings over \${Math.floor(bestGilt.yearsToMaturity)} \${Math.floor(bestGilt.yearsToMaturity) === 1 ? 'year' : 'years'} \${Math.round((bestGilt.yearsToMaturity % 1) * 365)} days</div>
                        </div>
                    </div>
                </div>
            \`;
            
            // Display table with mobile-optimized headers
            const isMobile = window.innerWidth <= 768;
            const tableHTML = \`
                <div class="table-container">
                    <table>
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
                                <th style="padding: 12px; text-align: left; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Gilt' : 'Name'}</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Clean \xA3' : 'Clean Price'}</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Dirty \xA3' : 'Dirty Price'}</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'After-Tax' : 'After-Tax IRR'}</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Equiv Rate' : 'Equivalent Gross Savings Rate'}</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Years' : 'Years to Maturity'}</th>
                                <th style="padding: 12px; text-align: right;">\${isMobile ? 'Advantage' : 'Extra vs Savings'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${sortedResults.map((gilt, index) => \`
                                <tr style="border-bottom: 1px solid #e0e0e0;">
                                    <td class="clickable-cell" data-type="name" data-index="\${index}" style="padding: 12px; border-right: 1px solid #e0e0e0; font-weight: 500; text-align: left;">\${gilt.name}</td>
                                    <td class="clickable-cell" data-type="clean-price" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\xA3\${formatMoney(gilt.cleanPrice || 0)}</td>
                                    <td class="clickable-cell" data-type="dirty-price" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\xA3\${formatMoney(gilt.dirtyPrice || gilt.cleanPrice || 0)}</td>
                                    <td class="clickable-cell" data-type="after-tax" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0; font-weight: bold; color: #27ae60;">\${(gilt.afterTaxYield || 0).toFixed(2)}%</td>
                                    <td class="clickable-cell" data-type="equivalent" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${(gilt.equivalentGrossSavingsRate || 0).toFixed(2)}%</td>
                                    <td class="clickable-cell" data-type="years" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${(gilt.yearsToMaturity || 0).toFixed(1)}</td>
                                    <td class="clickable-cell" data-type="advantage" data-index="\${index}" style="padding: 12px; text-align: right; font-weight: bold; color: \${gilt.extraIncome >= 0 ? '#27ae60' : '#e74c3c'};">\xA3\${formatMoney(gilt.extraIncome || 0)}</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                </div>
            \`;
            
            dataDiv.innerHTML = tableHTML;
            
            // Add click event listeners to clickable cells
            console.log('Adding click listeners to cells...');
            document.querySelectorAll('.clickable-cell').forEach(cell => {
                console.log('Adding listener to cell:', cell.dataset.type);
                cell.addEventListener('click', function() {
                    console.log('Cell clicked:', this.dataset.type, this.dataset.index);
                    const type = this.dataset.type;
                    const index = parseInt(this.dataset.index);
                    const gilt = sortedResults[index];
                    console.log('Calling showCalculationModal with:', type, gilt);
                    showCalculationModal(type, gilt);
                });
            });
        }
        
        function showCalculationModal(type, gilt) {
            console.log('showCalculationModal called with type:', type, 'gilt:', gilt?.name);
            const modal = document.getElementById('calculationModal');
            const title = document.getElementById('modalTitle');
            const content = document.getElementById('modalContent');
            
            console.log('Modal elements found:', !!modal, !!title, !!content);
            
            let titleText = '';
            let contentHTML = '';
            
            switch(type) {
                case 'name':
                    titleText = 'Gilt Details: ' + gilt.name;
                    
                    // Generate coupon payment schedule for display
                    let couponScheduleDisplay = '';
                    if (gilt.couponSchedule && gilt.couponSchedule.length > 0) {
                        let paymentItems = '';
                        gilt.couponSchedule.forEach((payment, index) => {
                            const paymentDate = new Date(payment.date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            });
                            paymentItems += '<div style="padding: 5px; border: 1px solid #e0e0e0; border-radius: 3px; background: white;">' +
                                '<div style="font-weight: bold; font-size: 0.9em;">' + paymentDate + '</div>' +
                                '</div>';
                        });
                        
                        couponScheduleDisplay = '<div style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">' +
                            '<h5 style="margin-bottom: 10px; color: #2c3e50;">\u{1F4C5} Coupon Payment Schedule</h5>' +
                            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 200px; overflow-y: auto;">' +
                            paymentItems +
                            '</div>' +
                            '<div style="margin-top: 10px; font-size: 0.9em; color: #666;">' +
                            '<strong>Total Payments:</strong> ' + gilt.couponSchedule.length + ' semi-annual coupons' +
                            '</div>' +
                            '</div>';
                    }
                    
                    // Calculate key dates and information
                    const formattedMaturityDate = new Date(gilt.maturityDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    });
                    
                    const nextCouponInfo = gilt.couponSchedule && gilt.couponSchedule.length > 0 ? 
                        gilt.couponSchedule[0] : null;
                    
                    const lastCouponInfo = gilt.couponSchedule && gilt.couponSchedule.length > 0 ? 
                        gilt.couponSchedule[gilt.couponSchedule.length - 1] : null;
                    
                    // Build next coupon section
                    let nextCouponSection = '';
                    if (nextCouponInfo) {
                        nextCouponSection = '<p style="margin: 2px 0;"><strong>Date:</strong> ' + new Date(nextCouponInfo.date).toLocaleDateString('en-GB') + '</p>';
                    } else {
                        nextCouponSection = '<p>No coupon data available</p>';
                    }
                    
                    // Build last coupon section
                    let lastCouponSection = '';
                    if (lastCouponInfo) {
                        lastCouponSection = '<p style="margin: 2px 0;"><strong>Last Coupon Date:</strong> ' + new Date(lastCouponInfo.date).toLocaleDateString('en-GB') + '</p>';
                    }
                    
                    contentHTML = '<div class="calculation-step">' +
                        '<h4>UK Government Bond Information</h4>' +
                        '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">' +
                        '<div>' +
                        '<h5 style="color: #2c3e50; margin-bottom: 8px;">\u{1F4CA} Bond Basics</h5>' +
                        '<p style="margin: 3px 0;"><strong>Full Name:</strong> ' + gilt.name + '</p>' +
                        '<p style="margin: 3px 0;"><strong>Coupon Rate:</strong> ' + formatCouponRate(gilt.couponRate) + '</p>' +
                        '<p style="margin: 3px 0;"><strong>Maturity Date:</strong> ' + formattedMaturityDate + '</p>' +
                        '<p style="margin: 3px 0;"><strong>Years to Maturity:</strong> ' + gilt.yearsToMaturity.toFixed(2) + ' years</p>' +
                        '</div>' +
                        '<div>' +
                        '<h5 style="color: #2c3e50; margin-bottom: 8px;">\u{1F4B7} Current Pricing</h5>' +
                        '<p style="margin: 3px 0;"><strong>Clean Price:</strong> \xA3' + formatMoney(gilt.cleanPrice) + '</p>' +
                        '<p style="margin: 3px 0;"><strong>Dirty Price:</strong> \xA3' + formatMoney(gilt.dirtyPrice) + '</p>' +
                        '<p style="margin: 3px 0;"><strong>Accrued Interest:</strong> \xA3' + formatMoney(gilt.dirtyPrice - gilt.cleanPrice) + '</p>' +
                        '<p style="margin: 3px 0;"><strong>Current Yield:</strong> ' + gilt.currentYield.toFixed(2) + '%</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        
                        '<div class="calculation-step">' +
                        '<h4>\u{1F4C5} Key Dates & Payment Information</h4>' +
                        '<div style="margin: 10px 0; padding: 10px; background: #e8f5e8; border-radius: 5px;">' +
                        '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">' +
                        '<div>' +
                        '<h5 style="margin-bottom: 5px;">Next Coupon Payment</h5>' +
                        nextCouponSection +
                        '</div>' +
                        '<div>' +
                        '<h5 style="margin-bottom: 5px;">Final Payment</h5>' +
                        '<p style="margin: 2px 0;"><strong>Maturity:</strong> ' + formattedMaturityDate + '</p>' +
                        lastCouponSection +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        
                        couponScheduleDisplay +
                        
                        '<div class="calculation-step">' +
                        '<h4>\u{1F4A1} Investment Notes</h4>' +
                        '<div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0;">' +
                        '<p style="margin: 3px 0;"><strong>Semi-Annual Payments:</strong> UK gilts pay interest twice yearly</p>' +
                        '<p style="margin: 3px 0;"><strong>Tax Treatment:</strong> Coupon payments subject to income tax, capital gains generally tax-free</p>' +
                        '<p style="margin: 3px 0;"><strong>Credit Risk:</strong> Backed by UK Government (minimal default risk)</p>' +
                        '<p style="margin: 3px 0;"><strong>Liquidity:</strong> Actively traded on secondary markets</p>' +
                        '</div>' +
                        '</div>';
                    break;
                    
                case 'coupon':
                    titleText = 'Coupon Rate';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>What is the Coupon Rate?</h4>
                            <p>The coupon rate is the annual interest rate paid by the gilt, expressed as a percentage of the nominal (face) value.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Coupon Rate = \${formatCouponRate(gilt.couponRate)}
                            </div>
                            <p>This means the gilt pays \${gilt.couponRate}% of its \xA3100 nominal value annually as interest, split into two semi-annual payments.</p>
                            <p><strong>Annual coupon payment per \xA3100:</strong> \xA3\${formatMoney(gilt.couponRate)}</p>
                        </div>
                    \`;
                    break;
                    
                case 'clean-price':
                    titleText = 'Clean Price';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>What is the Clean Price?</h4>
                            <p>The clean price is the market price of the gilt excluding accrued interest. This is the quoted price you see in markets.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Clean Price = \xA3\${formatMoney(gilt.cleanPrice)} per \xA3100 nominal
                            </div>
                            <p>This is the base trading price before adding any accrued interest since the last coupon payment.</p>
                            \${gilt.cleanPrice > 100 ? '<p><strong>Premium Bond:</strong> Trading above par value (\xA3100).</p>' : 
                              gilt.cleanPrice < 100 ? '<p><strong>Discount Bond:</strong> Trading below par value (\xA3100).</p>' : 
                              '<p><strong>Par Bond:</strong> Trading at exactly par value (\xA3100).</p>'}
                        </div>
                    \`;
                    break;
                    
                case 'dirty-price':
                    titleText = 'Dirty Price';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>What is the Dirty Price?</h4>
                            <p>The dirty price is the total price you pay, including both the clean price and accrued interest since the last coupon payment.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>Calculation:</h4>
                            <div class="calculation-formula">
                                Dirty Price = Clean Price + Accrued Interest
                            </div>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Clean Price = \xA3\${formatMoney(gilt.cleanPrice)}
                            </div>
                            <div class="calculation-formula">
                                Accrued Interest = \xA3\${formatMoney(gilt.dirtyPrice - gilt.cleanPrice)}
                            </div>
                            <div class="calculation-formula">
                                <strong>Dirty Price = \xA3\${formatMoney(gilt.dirtyPrice)} per \xA3100 nominal</strong>
                            </div>
                            <p>This is the actual amount you pay when purchasing the gilt, as you compensate the seller for interest earned since the last payment.</p>
                        </div>
                    \`;
                    break;
                    
                case 'current-yield':
                    titleText = 'Current Yield';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>Current Yield Calculation</h4>
                            <p>Current yield shows the annual return based on the current market price, not the nominal value.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>Formula:</h4>
                            <div class="calculation-formula">
                                Current Yield = (Annual Coupon Payment \xF7 Current Price) \xD7 100
                            </div>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Current Yield = (\xA3\${formatMoney(gilt.couponRate)} \xF7 \xA3\${formatMoney(gilt.cleanPrice)}) \xD7 100 = \${gilt.currentYield.toFixed(2)}%
                            </div>
                            <p>The current yield reflects the actual return you get based on today's market price.</p>
                        </div>
                    \`;
                    break;
                    
                case 'after-tax':
                    const taxRate = currentSettings.taxBracket === 'additional_rate' ? 45 : 
                                   currentSettings.taxBracket === 'higher_rate' ? 40 : 20;
                    
                    titleText = 'After-Tax IRR Calculation with Precision Details and Payment Schedule';
                    
                    // Add precision details and methodology section
                    const dealingCharge = currentSettings.dealingCharge || 0;
                    const effectiveInvestment = (currentSettings.investmentAmount || 10000) - dealingCharge;
                    const afterTaxUnitsOwned = effectiveInvestment / gilt.dirtyPrice * 100;
                    const precisionDetails = \`
                        <div class="calculation-step" style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 15px; margin: 15px 0;">
                            <h4 style="color: #856404;">IRR Calculation Methodology & Precision</h4>
                            
                            <div style="margin: 10px 0;">
                                <h5>Internal Rate of Return (IRR) Method:</h5>
                                <p style="margin: 5px 0; font-family: monospace; background: #f8f9fa; padding: 8px; border-radius: 4px;">
                                    NPV = 0 = -Initial_Investment + \u03A3(Cash_Flow_t / (1 + IRR)^t)
                                </p>
                                <p style="margin: 5px 0;">Solved using Newton-Raphson iterative method with 1e-7 tolerance (0.0000001% precision)</p>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0;">
                                <div>
                                    <h5>Investment Parameters:</h5>
                                    <p style="margin: 2px 0;"><strong>Investment Amount:</strong> \xA3\${formatMoney(currentSettings.investmentAmount || 10000)}</p>
                                    <p style="margin: 2px 0;"><strong>Dealing Charge:</strong> \${dealingCharge > 0 ? '\xA3' + formatMoney(dealingCharge) : 'None'}</p>
                                    <p style="margin: 2px 0;"><strong>Effective Investment:</strong> \xA3\${formatMoney(effectiveInvestment)}</p>
                                    <p style="margin: 2px 0;"><strong>Dirty Price:</strong> \xA3\${formatMoney(gilt.dirtyPrice)} per \xA3100</p>
                                    <p style="margin: 2px 0;"><strong>Units Owned:</strong> \${formatMoney(afterTaxUnitsOwned)} (per \xA3100 nominal)</p>
                                </div>
                                <div>
                                    <h5>Calculation Precision:</h5>
                                    <p style="margin: 2px 0;"><strong>Time Calculation:</strong> Exact days / 365.25 for fractional years</p>
                                    <p style="margin: 2px 0;"><strong>Cash Flow Timing:</strong> Actual semi-annual coupon dates</p>
                                    <p style="margin: 2px 0;"><strong>Tax Calculations:</strong> 2-decimal rounding applied to all amounts</p>
                                    <p style="margin: 2px 0;"><strong>IRR Convergence:</strong> 1e-7 tolerance (7 decimal places)</p>
                                    <p style="margin: 2px 0;"><strong>Final IRR:</strong> \${gilt.afterTaxYield ? gilt.afterTaxYield.toFixed(6) + '%' : 'Not calculated'}</p>
                                </div>
                            </div>
                            
                            \${currentSettings.accountChargeEnabled ? \`
                                <div style="margin: 10px 0; padding: 10px; background: #f8d7da; border-radius: 4px;">
                                    <h5 style="color: #721c24;">Account Charges Integration:</h5>
                                    <p style="margin: 2px 0;"><strong>Monthly Charge Rate:</strong> \${currentSettings.accountChargeRate}% annually (\${(currentSettings.accountChargeRate/12).toFixed(4)}% monthly)</p>
                                    <p style="margin: 2px 0;"><strong>Maximum Monthly Charge:</strong> \xA3\${formatMoney(currentSettings.accountChargeMax)}</p>
                                    <p style="margin: 2px 0;"><strong>Gilt Price Convergence:</strong> Linear from \xA3\${formatMoney(gilt.dirtyPrice)} to \xA3100.00 at maturity</p>
                                    <p style="margin: 2px 0;"><strong>Charge Calculation:</strong> Monthly rate \xD7 gilt value at month-end (capped at maximum)</p>
                                </div>
                            \` : ''}
                        </div>
                    \`;
                    
                    // Generate payment schedule table including monthly account charges
                    let scheduleHTML = precisionDetails;
                    if (gilt.couponSchedule && gilt.couponSchedule.length > 0) {
                        // Use stored monthly account charges from unified function
                        let monthlyChargeSchedule = [];
                        if (currentSettings.accountChargeEnabled && gilt.accountCharges) {
                            monthlyChargeSchedule = gilt.accountCharges;
                        }

                        // Create separate schedules for coupons and account charges
                        scheduleHTML = \`
                            <div class="calculation-step">
                                <h4>Coupon Payment Schedule</h4>
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                                        <thead>
                                            <tr style="background: #f8f9fa;">
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Gross Coupon</th>
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Income Tax</th>
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Net Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                        \`;
                        
                        // Add coupon payments with rounded tax calculations
                        gilt.couponSchedule.forEach(payment => {
                            const paymentDate = new Date(payment.date).toLocaleDateString('en-GB');
                            const roundedTaxAmount = roundToTwo(payment.taxAmount);
                            const roundedAfterTaxAmount = payment.grossAmount - roundedTaxAmount;
                            scheduleHTML += \`
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">\${paymentDate}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">\xA3\${formatMoney(payment.grossAmount)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">\xA3\${formatMoney(roundedTaxAmount)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>\xA3\${formatMoney(roundedAfterTaxAmount)}</strong></td>
                                </tr>
                            \`;
                        });
                        
                        // Add principal repayment row
                        const maturityDate = new Date(gilt.maturityDate).toLocaleDateString('en-GB');
                        // Use effective investment amount after dealing charge for units calculation (if any)
                        const effectiveInvestmentAmount = (currentSettings.investmentAmount || 10000) - dealingCharge;
                        const principalAmount = Math.round((effectiveInvestmentAmount / gilt.dirtyPrice * 100) * 100) / 100;
                        scheduleHTML += \`
                            <tr style="background: #e8f5e8;">
                                <td style="border: 1px solid #ddd; padding: 8px;"><strong>\${maturityDate}</strong></td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;" colspan="2"><strong>Principal Repayment (Tax-Free)</strong></td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>\xA3\${formatMoney(principalAmount)}</strong></td>
                            </tr>
                        \`;
                        
                        // Calculate grand totals including monthly charges with rounded tax
                        const totalGrossCoupons = gilt.couponSchedule.reduce((sum, payment) => sum + payment.grossAmount, 0);
                        const totalCouponTax = gilt.couponSchedule.reduce((sum, payment) => sum + roundToTwo(payment.taxAmount), 0);
                        const totalNetCoupons = gilt.couponSchedule.reduce((sum, payment) => sum + (payment.grossAmount - roundToTwo(payment.taxAmount)), 0);
                        const totalAccountCharges = monthlyChargeSchedule.reduce((sum, charge) => sum + charge.amount, 0);
                        const grandTotalGross = totalGrossCoupons + principalAmount;
                        // Total costs = Income Tax + Account Charges (both reduce net returns)
                        const grandTotalCosts = totalCouponTax + totalAccountCharges;
                        const grandTotalNet = totalNetCoupons + principalAmount - totalAccountCharges;
                        
                        // Add coupon totals row
                        scheduleHTML += \`
                            <tr style="background: #e8f5e8; font-weight: bold; border-top: 1px solid #6c757d;">
                                <td style="border: 1px solid #6c757d; padding: 8px;"><strong>Coupon Totals</strong></td>
                                <td style="border: 1px solid #6c757d; padding: 8px; text-align: right;"><strong>\xA3\${formatMoney(totalGrossCoupons)}</strong></td>
                                <td style="border: 1px solid #6c757d; padding: 8px; text-align: right;"><strong>\xA3\${formatMoney(totalCouponTax)}</strong></td>
                                <td style="border: 1px solid #6c757d; padding: 8px; text-align: right;"><strong>\xA3\${formatMoney(totalNetCoupons)}</strong></td>
                            </tr>
                        \`;
                        
                        // Close coupon table and add summary section
                        scheduleHTML += \`
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        \`;
                        
                        // Add comprehensive summary section
                        scheduleHTML += \`
                            <div class="calculation-step" style="background: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 15px;">
                                <h4 style="color: #007bff;">Complete Investment Summary</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
                                    <div>
                                        <h5 style="margin-bottom: 8px;">Income & Costs:</h5>
                                        <p style="margin: 3px 0;"><strong>Total Coupon Income:</strong> \xA3\${formatMoney(totalGrossCoupons)}</p>
                                        <p style="margin: 3px 0;"><strong>Income Tax:</strong> \xA3\${formatMoney(totalCouponTax)}</p>
                                        \${monthlyChargeSchedule.length > 0 ? '<p style="margin: 3px 0;"><strong>Account Charges:</strong> \xA3' + formatMoney(totalAccountCharges) + '</p>' : ''}
                                        <p style="margin: 3px 0;"><strong>Principal Repayment:</strong> \xA3\${formatMoney(principalAmount)} (tax-free)</p>
                                    </div>
                                    <div>
                                        <h5 style="margin-bottom: 8px;">Net Returns:</h5>
                                        <p style="margin: 3px 0;"><strong>Total Cash Received:</strong> \xA3\${formatMoney(grandTotalGross)}</p>
                                        <p style="margin: 3px 0;"><strong>Total Costs:</strong> \xA3\${formatMoney(grandTotalCosts)} (Tax: \xA3\${formatMoney(totalCouponTax)} + Charges: \xA3\${formatMoney(totalAccountCharges)})</p>
                                        <p style="margin: 3px 0; font-size: 16px;"><strong style="color: #007bff;">Net After-Tax Return:</strong> \xA3\${formatMoney(grandTotalNet)}</p>
                                    </div>
                                </div>
                            </div>
                        \`;
                        
                        // Close coupon schedule table
                        scheduleHTML += \`
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        \`;
                        
                        // Add monthly account charges schedule if enabled
                        if (monthlyChargeSchedule.length > 0) {
                            scheduleHTML += \`
                                <div class="calculation-step">
                                    <h4>Monthly Account Charge Schedule</h4>
                                    <div style="overflow-x: auto;">
                                        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                                            <thead>
                                                <tr style="background: #fff3cd;">
                                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Month-End Date</th>
                                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Gilt Price</th>
                                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Portfolio Value</th>
                                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Monthly Charge</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                            \`;
                            
                            monthlyChargeSchedule.forEach(charge => {
                                const chargeDate = charge.date.toLocaleDateString('en-GB');
                                const isMax = charge.amount === currentSettings.accountChargeMax;
                                scheduleHTML += \`
                                    <tr style="background: #fffbf0;">
                                        <td style="border: 1px solid #ddd; padding: 8px;">\${chargeDate}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">\xA3\${formatMoney(charge.interpolatedPrice)}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">\xA3\${formatMoney(charge.giltValue)}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>\xA3\${formatMoney(charge.amount)}\${isMax ? ' (max)' : ''}</strong></td>
                                    </tr>
                                \`;
                            });
                            
                            // Add total row for monthly charges
                            const totalMonthlyCharges = monthlyChargeSchedule.reduce((sum, charge) => sum + charge.amount, 0);
                            scheduleHTML += \`
                                <tr style="background: #ffc107; color: #000; font-weight: bold; border-top: 2px solid #e0a800;">
                                    <td style="border: 1px solid #e0a800; padding: 10px;"><strong>TOTAL CHARGES</strong></td>
                                    <td style="border: 1px solid #e0a800; padding: 10px; text-align: right;" colspan="2"><strong>\${monthlyChargeSchedule.length} payments</strong></td>
                                    <td style="border: 1px solid #e0a800; padding: 10px; text-align: right;"><strong>\xA3\${formatMoney(totalMonthlyCharges)}</strong></td>
                                </tr>
                            \`;
                            
                            scheduleHTML += \`
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px;">
                                        <p><strong>Account Charge Details:</strong></p>
                                        <ul style="margin: 5px 0; padding-left: 20px;">
                                            <li>Rate: \${currentSettings.accountChargeRate}% annually (\${(currentSettings.accountChargeRate/12).toFixed(3)}% monthly)</li>
                                            <li>Maximum per month: \xA3\${formatMoney(currentSettings.accountChargeMax)}</li>
                                            <li>Gilt price converges linearly from \xA3\${formatMoney(gilt.cleanPrice)} to \xA3100.00 at maturity</li>
                                            <li>Total account charges over life: \xA3\${formatMoney(monthlyChargeSchedule.reduce((sum, charge) => sum + charge.charge, 0))}</li>
                                        </ul>
                                    </div>
                                </div>
                            \`;
                        }
                    }
                    
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>After-Tax Yield for \${gilt.name}</h4>
                            <p>This shows the Internal Rate of Return (IRR) calculated using actual payment dates, tax impacts, and dealing charges.</p>
                        </div>
                        \${scheduleHTML}
                        <div class="calculation-step">
                            <h4>Calculation Method:</h4>
                            <p><strong>Method:</strong> IRR calculation using Newton-Raphson method</p>
                            <p><strong>Your Investment:</strong> \${formatCurrency(currentSettings.investmentAmount || 10000)}</p>
                            <p><strong>Dealing Charge:</strong> \${currentSettings.dealingCharge > 0 ? '\xA3' + formatMoney(currentSettings.dealingCharge) : 'None (\xA30.00)'}</p>
                            <p><strong>Monthly Account Charge:</strong> \${currentSettings.accountChargeEnabled ? currentSettings.accountChargeRate + '% annually (\xA3' + (currentSettings.accountChargeRate / 12).toFixed(3) + '% monthly, max \xA3' + formatMoney(currentSettings.accountChargeMax) + '/month)' : 'None'}</p>
                            <p><strong>Available for Gilts:</strong> \${formatCurrency((currentSettings.investmentAmount || 10000) - (currentSettings.dealingCharge || 0))}</p>
                            <p><strong>Purchase Price:</strong> \xA3\${formatMoney(gilt.dirtyPrice)} per \xA3100 (including accrued interest)</p>
                            <p><strong>Your Tax Rate:</strong> \${(currentSettings.taxBracket || 'additional_rate').replace('_', ' ')} (\${getCurrentTaxRate()}%)</p>
                        </div>
                        <div class="calculation-step" style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px;">
                            <h4>Final After-Tax Yield:</h4>
                            <p><strong>\${gilt.afterTaxYield.toFixed(3)}%</strong> per year</p>
                            <p>This accounts for:</p>
                            <ul>
                                <li>Dealing charge: \${currentSettings.dealingCharge > 0 ? '\xA3' + formatMoney(currentSettings.dealingCharge) : 'None (\xA30.00)'}</li>
                                <li>Monthly account charge: \${currentSettings.accountChargeEnabled ? currentSettings.accountChargeRate + '% annually (max \xA3' + formatMoney(currentSettings.accountChargeMax) + '/month)' : 'None'}</li>
                                <li>Income tax on all coupon payments</li>
                                <li>Tax-free principal repayment at maturity</li>
                                <li>Exact timing of all cash flows</li>
                                <li>Your actual investment amount</li>
                            </ul>
                        </div>
                    \`;
                    break;
                    
                case 'equivalent':
                    const currentTaxRate = getCurrentTaxRate();
                    titleText = 'Equivalent Gross Savings Rate';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>Equivalent Gross Savings Rate</h4>
                            <p>The gross interest rate a savings account would need to match this gilt's after-tax return.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>How It's Calculated:</h4>
                            <div class="calculation-formula">
                                Formula: After-Tax IRR \xF7 (1 - Income Tax Rate)
                            </div>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                                <p><strong>Example Calculation:</strong></p>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>Gilt After-Tax IRR: \${gilt.afterTaxYield.toFixed(2)}%</li>
                                    <li>Your Income Tax Rate: \${currentTaxRate}%</li>
                                    <li>Required Gross Rate: \${gilt.afterTaxYield.toFixed(2)}% \xF7 (1 - \${(currentTaxRate/100).toFixed(2)}) = <strong>\${gilt.equivalentGrossSavingsRate.toFixed(2)}%</strong></li>
                                </ul>
                            </div>
                        </div>
                        <div class="calculation-step">
                            <h4>Why This Matters:</h4>
                            <p>\u2022 Savings accounts are taxed as income at your marginal rate (\${currentTaxRate}%)</p>
                            <p>\u2022 Gilt coupons are also taxed as income, but capital gains are tax-free</p>
                            <p>\u2022 This calculation shows what savings rate you'd need to match the gilt's performance</p>
                            <p>\u2022 If current savings rates are below \${gilt.equivalentGrossSavingsRate.toFixed(2)}%, this gilt offers better value</p>
                        </div>
                    \`;
                    break;
                    
                case 'years':
                    titleText = 'Years to Maturity';
                    const maturityDate = new Date(gilt.maturityDate);
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>Years to Maturity Calculation</h4>
                            <p>Time remaining until the gilt matures and pays back the \xA3100 nominal value.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Maturity Date: \${maturityDate.toLocaleDateString('en-GB')}
                            </div>
                            <div class="calculation-formula">
                                Years to Maturity: \${gilt.yearsToMaturity.toFixed(1)} years
                            </div>
                            <p>This gilt will mature in approximately \${gilt.yearsToMaturity.toFixed(1)} years, at which point you'll receive \xA3100 per \xA3100 nominal value held.</p>
                        </div>
                    \`;
                    break;
                    
                case 'advantage':
                    titleText = 'Extra Income vs Savings Account - Detailed Calculation';
                    const savingsRate = currentSettings.savingsRate || 4.5;
                    const psaAmount = currentSettings.taxBracket === 'basic_rate' ? 1000 : 
                                    currentSettings.taxBracket === 'higher_rate' ? 500 : 0;
                    const modalTaxRate = getCurrentTaxRate();
                    const investmentAmount = currentSettings.investmentAmount || 10000;
                    
                    // Calculate units owned using same method as IRR tooltip
                    const advantageDealingCharge = currentSettings.dealingCharge || 0;
                    const advantageEffectiveInvestment = investmentAmount - advantageDealingCharge;
                    const advantageUnitsOwned = roundToTwo((advantageEffectiveInvestment / gilt.dirtyPrice) * 100);
                    
                    // Calculate precise total cash flows - ensure we use the function that includes charges
                    const giltTotalCash = calculateTotalCashFromGilt(gilt, advantageUnitsOwned, modalTaxRate / 100);
                    const savingsTotalCash = calculateTotalCashFromSavings(investmentAmount, savingsRate, modalTaxRate / 100, psaAmount, gilt.yearsToMaturity);
                    
                    // Calculate total monthly charges using the SAME function as IRR calculation
                    let totalMonthlyCharges = 0;
                    if (currentSettings.accountChargeEnabled && gilt.accountCharges) {
                        // Use the stored account charges from the unified function
                        totalMonthlyCharges = gilt.accountCharges.reduce((sum, charge) => sum + charge.amount, 0);
                    }
                    

                    
                    // Calculate actual after-tax savings rate based on total returns
                    const savingsReturn = savingsTotalCash - investmentAmount;
                    const afterTaxSavingsRate = Math.pow(savingsTotalCash / investmentAmount, 1 / gilt.yearsToMaturity) - 1;
                    
                    const extraIncomeTotal = gilt.extraIncome || (giltTotalCash - savingsTotalCash);
                    
                    const giltReturn = gilt.afterTaxYield || 0;
                    const advantagePercent = giltReturn - (afterTaxSavingsRate * 100);
                    
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>What This Column Shows</h4>
                            <p>This column displays the <strong>total extra money</strong> you would receive from investing in this gilt compared to putting the same amount in a taxable savings account over the gilt's entire lifespan.</p>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Your Current Settings</h4>
                            <p><strong>Investment Amount:</strong> \${formatCurrency(investmentAmount)}</p>
                            <p><strong>Your Tax Bracket:</strong> \${(currentSettings.taxBracket || 'additional_rate').replace('_', ' ').toUpperCase()} (\${modalTaxRate}%)</p>
                            <p><strong>Personal Savings Allowance:</strong> \${formatCurrency(psaAmount)}</p>
                            <p><strong>Savings Account Rate:</strong> \${savingsRate.toFixed(2)}%</p>
                            <p><strong>Investment Period:</strong> \${(gilt.yearsToMaturity || 0).toFixed(2)} years</p>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Step 1: Total Cash from Gilt Investment (Including All Charges)</h4>
                            <p><strong>Gilt:</strong> \${gilt.name}</p>
                            <p><strong>Initial Investment:</strong> \xA3\${formatMoney(investmentAmount)}</p>
                            <p><strong>Dealing Charge:</strong> \${currentSettings.dealingCharge > 0 ? '\xA3' + formatMoney(currentSettings.dealingCharge) : 'None (\xA30.00)'}</p>
                            \${currentSettings.accountChargeEnabled ? \`
                            <p><strong>Monthly Account Charges:</strong> \${currentSettings.accountChargeRate}% annually (max \xA3\${formatMoney(currentSettings.accountChargeMax)}/month)</p>
                            \` : ''}
                            <p><strong>Total Cash Received:</strong> \xA3\${formatMoney(giltTotalCash)}</p>
                            
                            \${(() => {
                                // Calculate coupon totals for display using same method as IRR tooltip
                                const totalGrossCoupons = gilt.couponSchedule ? gilt.couponSchedule.reduce((sum, payment) => sum + payment.grossAmount, 0) : 0;
                                const totalCouponTax = gilt.couponSchedule ? gilt.couponSchedule.reduce((sum, payment) => sum + payment.taxAmount, 0) : 0;
                                const totalNetCoupons = gilt.couponSchedule ? gilt.couponSchedule.reduce((sum, payment) => sum + payment.afterTaxAmount, 0) : 0;
                                const principalAmount = roundToTwo(advantageUnitsOwned);
                                const numPayments = gilt.couponSchedule ? gilt.couponSchedule.length : 0;
                                const semiAnnualRate = gilt.couponRate / 2;
                                const displayEffectiveInvestment = investmentAmount - (currentSettings.dealingCharge || 0);
                                
                                return \`
                                <div style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; padding: 12px; margin: 10px 0;">
                                    <h5 style="margin: 0 0 8px 0; color: #007bff;">Coupon Payment Totals:</h5>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                                        <div>
                                            <p style="margin: 2px 0;"><strong>Total Gross Coupons:</strong> \xA3\${formatMoney(totalGrossCoupons)}</p>
                                            <p style="margin: 2px 0; color: #666; font-size: 10px;">(\${numPayments} payments)</p>
                                            <p style="margin: 2px 0;"><strong>Income Tax:</strong> \xA3\${formatMoney(totalCouponTax)}</p>
                                            <p style="margin: 2px 0; color: #666; font-size: 10px;">(Each payment taxed at \${modalTaxRate}%)</p>
                                            <p style="margin: 2px 0;"><strong>Net Coupon Income:</strong> \xA3\${formatMoney(totalNetCoupons)}</p>
                                            <p style="margin: 2px 0; color: #666; font-size: 10px;">(Gross - Tax, rounded per payment)</p>
                                        </div>
                                        <div>
                                            <p style="margin: 2px 0;"><strong>Calculation Base:</strong></p>
                                            <p style="margin: 2px 0; color: #666; font-size: 10px;">Units Owned: \${(principalAmount/100).toFixed(2)}</p>
                                            <p style="margin: 2px 0; color: #666; font-size: 10px;">Semi-Annual Rate: \${semiAnnualRate.toFixed(3)}%</p>
                                            <p style="margin: 2px 0; color: #666; font-size: 10px;">Effective Investment: \xA3\${formatMoney(displayEffectiveInvestment)}</p>
                                            <p style="margin: 2px 0;"><strong>Principal Repayment:</strong> \xA3\${formatMoney(principalAmount)}</p>
                                            \${currentSettings.accountChargeEnabled && totalMonthlyCharges > 0 ? '<p style="margin: 2px 0;"><strong>Account Charges:</strong> \xA3' + formatMoney(totalMonthlyCharges) + '</p>' : ''}
                                            <p style="margin: 2px 0; font-weight: bold; color: #007bff;"><strong>Total Cash:</strong> \xA3\${formatMoney(giltTotalCash)}</p>
                                        </div>
                                    </div>
                                    

                                </div>
                                \`;
                            })()}
                            
                            <div style="margin-left: 20px; color: #666;">
                                <p><small>\u2022 All coupon payments (after \${modalTaxRate}% income tax)</small></p>
                                \${currentSettings.accountChargeEnabled ? '<p><small>\u2022 Monthly account charges: ' + (totalMonthlyCharges > 0 ? '\xA3' + totalMonthlyCharges.toFixed(2) + ' total deducted' : 'None calculated') + '</small></p>' : ''}
                                <p><small>\u2022 Principal repayment: \xA3\${advantageUnitsOwned.toFixed(2)} (tax-free)</small></p>
                                <p><small>\u2022 Based on actual payment schedule with exact dates</small></p>
                                \${totalMonthlyCharges > 0 ? '<p style="font-weight: bold; color: #d63384;"><small>Net after all charges and taxes: \xA3' + giltTotalCash.toFixed(2) + '</small></p>' : ''}
                            </div>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Step 2: Total Cash from Savings Account</h4>
                            <p><strong>Initial Investment:</strong> \xA3\${formatMoney(investmentAmount)}</p>
                            <p><strong>Annual Interest Rate:</strong> \${savingsRate.toFixed(2)}%</p>
                            <p><strong>Investment Period:</strong> \${(() => {
                                const today = new Date();
                                const endDate = new Date(today.getTime() + ((gilt.yearsToMaturity || 0) * 365.25 * 24 * 60 * 60 * 1000));
                                const totalDays = Math.round((endDate - today) / (24 * 60 * 60 * 1000));
                                const years = Math.floor(totalDays / 365);
                                const remainingDays = totalDays % 365;
                                return years + ' years + ' + remainingDays + ' days (' + totalDays + ' total days)';
                            })()} </p>
                            <p><strong>Total Cash Received:</strong> \xA3\${formatMoney(savingsTotalCash)}</p>
                            
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                                <h5 style="margin-top: 0;">Detailed Interest Calculation:</h5>
                                <p><strong>Calculation Method:</strong> Annual compound interest with proportional PSA</p>
                                <ul style="margin: 10px 0; padding-left: 20px; font-size: 12px;">
                                    <li><strong>Annual Interest Rate:</strong> \${savingsRate.toFixed(2)}% compounded annually</li>
                                    <li><strong>Compounding:</strong> Interest calculated and added annually to growing balance</li>
                                    <li><strong>Day Calculation:</strong> Uses actual calendar days (365 days = 1 year)</li>
                                    <li><strong>Personal Savings Allowance:</strong> \xA3\${formatMoney(psaAmount)} tax-free allowance per tax year (April 6 - April 5)</li>
                                    <li><strong>PSA Reset:</strong> Full PSA allowance available each tax year</li>
                                    <li><strong>Partial Year PSA:</strong> PSA pro-rated based on actual days for partial years</li>
                                    <li><strong>Tax Rate:</strong> \${modalTaxRate}% on interest above available PSA allowance</li>
                                    <li><strong>Tax Timing:</strong> Deducted annually on interest earned</li>
                                </ul>
                                
                                <div style="background: white; padding: 10px; border-radius: 3px; margin-top: 10px;">
                                    <p style="margin: 0; font-size: 11px;"><strong>Year-by-Year Breakdown:</strong></p>
                                    <div style="font-family: monospace; font-size: 10px; margin: 5px 0;" id="savingsBreakdown">
                                    </div>
                                </div>
                                
                                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                                    <strong>Total Return:</strong> \xA3\${formatMoney(savingsTotalCash - investmentAmount)} profit over \${(gilt.yearsToMaturity || 0).toFixed(2)} years<br>

                                </p>
                            </div>
                        </div>
                        
                        <div class="calculation-step" style="background: #f8f9fa; border-left: 4px solid \${advantagePercent >= 0 ? '#27ae60' : '#e74c3c'}; padding: 15px;">
                            <h4>Step 3: Final Calculation</h4>
                            <div class="calculation-formula" style="background: white; padding: 10px; border-radius: 5px; margin: 10px 0;">
                                <strong>Formula:</strong><br>
                                Extra Income = Total Cash from Gilt - Total Cash from Savings<br><br>
                                <strong>Calculation:</strong><br>
                                \xA3\${formatMoney(giltTotalCash)} - \xA3\${formatMoney(savingsTotalCash)}<br>
                                = <strong>\xA3\${formatMoney(extraIncomeTotal)}</strong><br>

                            </div>
                            <p><strong>Gilt Total Return:</strong> \xA3\${formatMoney(giltTotalCash - investmentAmount)} profit</p>
                            <p><strong>Savings Total Return:</strong> \xA3\${formatMoney(savingsTotalCash - investmentAmount)} profit</p>
                            <p><strong>Total Advantage:</strong> \xA3\${formatMoney(extraIncomeTotal)} over \${(gilt.yearsToMaturity || 0).toFixed(2)} years</p>
                            <p style="margin-top: 15px; font-weight: bold; color: \${advantagePercent >= 0 ? '#27ae60' : '#e74c3c'};">
                                \${advantagePercent >= 0 ? 
                                    \`This gilt will earn you \xA3\${formatMoney(Math.abs(extraIncomeTotal))} MORE than a savings account.\` : 
                                    \`A savings account would earn you \xA3\${formatMoney(Math.abs(extraIncomeTotal))} MORE than this gilt.\`
                                }
                            </p>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Key Assumptions</h4>
                            <p><small>\u2022 Uses your actual tax settings from the sidebar</small></p>
                            <p><small>\u2022 Includes Personal Savings Allowance for savings account</small></p>
                            <p><small>\u2022 Assumes both investments held for full maturity period</small></p>
                            <p><small>\u2022 Based on current market prices and yields</small></p>
                            <p><small>\u2022 Does not account for reinvestment of income</small></p>
                        </div>
                    \`;
                    break;
            }
            
            title.textContent = titleText;
            content.innerHTML = contentHTML;
            
            // If this is the savings breakdown, populate the year-by-year section
            if (type === 'advantage' && gilt) {
                setTimeout(() => {
                    const breakdownDiv = document.getElementById('savingsBreakdown');
                    if (breakdownDiv) {
                        // Use the same variables as defined above for consistency
                        const savingsRateLocal = currentSettings.savingsRate || 4.5;
                        // Use confirmed PSA amount if available
                        const psaAmountLocal = currentSettings.psaAmount !== undefined ? 
                                             currentSettings.psaAmount : 
                                             (currentSettings.taxBracket === 'basic_rate' ? 1000 : 
                                              currentSettings.taxBracket === 'higher_rate' ? 500 : 0);
                        const modalTaxRateLocal = getCurrentTaxRate();
                        const investmentAmountLocal = currentSettings.investmentAmount || 10000;
                        
                        let breakdown = '';
                        let balance = investmentAmountLocal;
                        const completeYears = Math.floor(gilt.yearsToMaturity);
                        
                        // Calculate using actual calendar days
                        const today = new Date();
                        const endDate = new Date(today.getTime() + (gilt.yearsToMaturity * 365.25 * 24 * 60 * 60 * 1000));
                        const totalDays = Math.round((endDate - today) / (24 * 60 * 60 * 1000));
                        const actualCompleteYears = Math.floor(totalDays / 365);
                        
                        for (let year = 1; year <= actualCompleteYears; year++) {
                            const grossInterest = balance * (savingsRateLocal / 100);
                            
                            // PSA resets each tax year (April 6 - April 5)
                            const availablePSAThisYear = psaAmountLocal;
                            const psaUsed = Math.min(grossInterest, availablePSAThisYear);
                            const taxableInterest = Math.max(0, grossInterest - availablePSAThisYear);
                            const tax = taxableInterest * (modalTaxRateLocal / 100);
                            const netInterest = grossInterest - tax;
                            balance += netInterest;
                            
                            breakdown += 'Year ' + year + ' (365 days): \xA3' + formatMoney(balance) + 
                                       ' (gross: \xA3' + formatMoney(grossInterest) + 
                                       ', PSA used: \xA3' + formatMoney(psaUsed) + 
                                       ', taxable: \xA3' + formatMoney(taxableInterest) + 
                                       ', tax: \xA3' + formatMoney(tax) + ')<br>';
                        }
                        
                        const remainingDays = totalDays - (actualCompleteYears * 365);
                        if (remainingDays > 0) {
                            const dailyRate = savingsRateLocal / 100 / 365;
                            const grossInterest = balance * dailyRate * remainingDays;
                            const partialYearFraction = remainingDays / 365;
                            const availablePSAPartialYear = psaAmountLocal * partialYearFraction;
                            
                            // Check if we're in a new tax year for PSA calculation
                            const psaUsed = Math.min(grossInterest, availablePSAPartialYear);
                            const taxableInterest = Math.max(0, grossInterest - availablePSAPartialYear);
                            const tax = taxableInterest * (modalTaxRateLocal / 100);
                            const netInterest = grossInterest - tax;
                            balance += netInterest;
                            
                            breakdown += 'Remaining ' + remainingDays + ' days: \xA3' + formatMoney(balance) + 
                                       ' (gross: \xA3' + formatMoney(grossInterest) + 
                                       ', PSA available: \xA3' + formatMoney(availablePSAPartialYear) + 
                                       ', PSA used: \xA3' + formatMoney(psaUsed) + 
                                       ', taxable: \xA3' + formatMoney(taxableInterest) + 
                                       ', tax: \xA3' + formatMoney(tax) + ')';
                        }
                        
                        breakdownDiv.innerHTML = breakdown;
                    }
                }, 100);
            }
            
            modal.style.display = 'block';
        }
        
        // Add modal HTML and event listeners
        document.addEventListener('DOMContentLoaded', function() {
            console.log('=== DOM CONTENT LOADED ===');
            // Create modal HTML
            const modalHTML = \`
                <div id="calculationModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <span id="modalTitle" class="modal-title"></span>
                            <span class="close">&times;</span>
                        </div>
                        <div id="modalContent"></div>
                    </div>
                </div>
            \`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Close modal functionality
            const modal = document.getElementById('calculationModal');
            const closeBtn = document.querySelector('.close');
            
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
            

            
            initializeApp();
        });
        

        
        // Robust event delegation for dealing charge
        document.addEventListener('input', function(e) {
            if (e.target && e.target.id === 'dealingCharge') {
                // Handle empty string and convert properly, allow \xA30 to disable dealing charges
                let dealingCharge;
                if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                    dealingCharge = 5; // Default to \xA35 when empty
                } else {
                    dealingCharge = parseFloat(e.target.value);
                    if (isNaN(dealingCharge) || dealingCharge < 0) {
                        dealingCharge = 5; // Default to \xA35 when invalid or negative
                    }
                }
                
                // Only update if the value actually changed
                if (currentSettings.dealingCharge !== dealingCharge) {
                    currentSettings.dealingCharge = dealingCharge;
                    
                    // Clear cache since dealing charge affects calculations
                    clearAllCaches();
                    
                    if (currentGiltData.length > 0) {
                        calculateTaxEfficiency();
                    }
                }
            }
        });
        
        // Also initialize app when document is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
    <\/script>
</body>
</html>
  `;
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}
__name(renderHomePage, "renderHomePage");

// src/views/analysis.js
init_checked_fetch();
init_modules_watch_stub();
async function renderAnalysisPage(request, env) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detailed Analysis - UK Gilt Tax Efficiency Analyser</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .analysis-section {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .coupon-schedule {
            overflow-x: auto;
        }
        
        .coupon-schedule table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        .coupon-schedule th,
        .coupon-schedule td {
            padding: 12px;
            text-align: right;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .coupon-schedule th {
            background: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .coupon-schedule th:first-child,
        .coupon-schedule td:first-child {
            text-align: left;
        }
        
        .schedule-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        
        .summary-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .summary-label {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .back-button {
            background: #95a5a6;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 20px;
        }
        
        .back-button:hover {
            background: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-button">\u2190 Back to Main Analysis</a>
        
        <header class="header">
            <h1>\u{1F4B7} Detailed Gilt Analysis</h1>
            <p>Comprehensive coupon schedule and tax analysis</p>
        </header>
        
        <div class="analysis-section">
            <h3>\u{1F4B7} Coupon Schedule Analysis</h3>
            <p>Select a gilt to view its detailed payment schedule and tax implications.</p>
            
            <div class="schedule-summary" id="scheduleSummary" style="display: none;">
                <!-- Schedule summary will be populated here -->
            </div>
            
            <div class="coupon-schedule">
                <div id="scheduleTable">
                    <p>Loading analysis...</p>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // This would be populated with actual analysis data
        // For now, showing the structure
        document.addEventListener('DOMContentLoaded', function() {
            // In a real implementation, this would load from API
            loadAnalysisData();
        });
        
        async function loadAnalysisData() {
            try {
                // Fetch authentic gilt data from API
                const response = await fetch('/api/gilt-data');
                const giltData = await response.json();
                
                if (!giltData || giltData.length === 0) {
                    throw new Error('No authentic gilt data available');
                }
                
                // Use first gilt for demonstration of coupon schedule
                const firstGilt = giltData[0];
                
                // Import coupon scheduler module
                const { CouponScheduler } = await import('../lib/coupon-scheduler.js');
                const scheduler = new CouponScheduler();
                
                // Generate authentic coupon schedule
                const schedule = scheduler.generateCouponSchedule(firstGilt);
                
                if (!schedule || schedule.length === 0) {
                    throw new Error('Failed to generate authentic coupon schedule from gilt data');
                }
                
                displaySchedule(schedule);
            } catch (error) {
                document.getElementById('scheduleTable').innerHTML = 
                    '<p>Error loading analysis: ' + error.message + '</p>';
            }
        }
        
        function displaySchedule(schedule) {
            const summaryDiv = document.getElementById('scheduleSummary');
            const tableDiv = document.getElementById('scheduleTable');
            
            // Calculate summary
            const totalPayments = schedule.length;
            const totalCoupons = schedule.reduce((sum, p) => sum + p.couponAmount, 0);
            const totalAfterTax = schedule.reduce((sum, p) => sum + p.afterTaxTotal, 0);
            const totalTax = schedule.reduce((sum, p) => sum + p.couponTax, 0);
            
            // Display summary
            summaryDiv.innerHTML = \`
                <div class="summary-card">
                    <div class="summary-label">\u{1F4C5} Total Payments</div>
                    <div class="summary-value">\${totalPayments}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">\u{1F4B7} Total Coupons</div>
                    <div class="summary-value">\xA3\${totalCoupons.toFixed(2)}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">\u{1F4B7} Total After-Tax</div>
                    <div class="summary-value">\xA3\${totalAfterTax.toFixed(2)}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">\u{1F4B7} Total Tax</div>
                    <div class="summary-value">\xA3\${totalTax.toFixed(2)}</div>
                </div>
            \`;
            
            summaryDiv.style.display = 'grid';
            
            // Display table
            const tableHTML = \`
                <table>
                    <thead>
                        <tr>
                            <th>Payment Date</th>
                            <th>Days to Payment</th>
                            <th>Gross Coupon (\xA3)</th>
                            <th>Tax Paid (\xA3)</th>
                            <th>Net Coupon (\xA3)</th>
                            <th>Principal (\xA3)</th>
                            <th>Total Net (\xA3)</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${schedule.map(payment => \`
                            <tr>
                                <td>\${new Date(payment.paymentDate).toLocaleDateString('en-GB')}</td>
                                <td>\${payment.daysToPayment}</td>
                                <td>\xA3\${payment.couponAmount.toFixed(2)}</td>
                                <td>\xA3\${payment.couponTax.toFixed(2)}</td>
                                <td>\xA3\${payment.afterTaxCoupon.toFixed(2)}</td>
                                <td>\xA3\${payment.principalAmount.toFixed(2)}</td>
                                <td style="font-weight: bold; color: #27ae60;">\xA3\${payment.afterTaxTotal.toFixed(2)}</td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;
            
            tableDiv.innerHTML = tableHTML;
        }
    <\/script>
</body>
</html>
  `;
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}
__name(renderAnalysisPage, "renderAnalysisPage");

// src/views/api.js
init_checked_fetch();
init_modules_watch_stub();

// src/index.js
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.startsWith("/lib/")) {
      return await handleLibFile(request, env, path);
    }
    if (path.startsWith("/static/")) {
      return await handleStaticFile(request, env);
    }
    if (path.startsWith("/api/")) {
      return await handleAPIRequest(request, env, path);
    }
    switch (path) {
      case "/":
        return await renderHomePage(request, env);
      case "/analysis":
        return await renderAnalysisPage(request, env);
      default:
        return new Response("Not Found", { status: 404 });
    }
  }
};
async function handleLibFile(request, env, path) {
  if (path === "/lib/utils.js") {
    const utilsContent = `
// UK Gilt Tax Efficiency Analyser - Utility Functions
export function formatCurrency(amount, maxDigits = 2) {
    if (amount === 0) return '\xA30.00';
    if (!amount && amount !== 0) return 'N/A';
    
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    
    if (absAmount >= 1e9) {
        return \`\${sign}\xA3\${(absAmount / 1e9).toFixed(maxDigits)}B\`;
    } else if (absAmount >= 1e6) {
        return \`\${sign}\xA3\${(absAmount / 1e6).toFixed(maxDigits)}M\`;
    } else if (absAmount >= 1e3 && maxDigits <= 2) {
        return \`\${sign}\xA3\${absAmount.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}\`;
    } else {
        return \`\${sign}\xA3\${absAmount.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}\`;
    }
}

export function formatPercentage(rate, digits = 2) {
    if (rate === 0) return '0.00%';
    if (!rate && rate !== 0) return 'N/A';
    
    const percentage = rate * 100;
    return \`\${percentage.toFixed(digits)}%\`;
}

export function formatCouponRate(rate) {
    if (!rate && rate !== 0) return 'N/A';
    
    // Show up to 3 decimal places but remove trailing zeros
    const formatted = rate.toFixed(3).replace(/\\.?0+$/, '');
    return \`\${formatted}%\`;
}

export function calculateYearsToMaturity(maturityDate, referenceDate = null) {
    if (!referenceDate) {
        referenceDate = new Date();
    }
    
    const maturity = typeof maturityDate === 'string' ? new Date(maturityDate) : maturityDate;
    
    if (isNaN(maturity.getTime())) {
        return NaN;
    }
    
    const timeDifference = maturity - referenceDate;
    const years = timeDifference / (1000 * 60 * 60 * 24 * 365.25);
    
    return Math.max(0, years);
}

export function calculateDirtyPrice(cleanPrice, accruedInterest) {
    if (isNaN(cleanPrice) || isNaN(accruedInterest)) {
        return cleanPrice || 0;
    }
    return cleanPrice + accruedInterest;
}

export function calculateUnitsOwned(investmentAmount, dirtyPrice) {
    if (isNaN(investmentAmount) || isNaN(dirtyPrice) || dirtyPrice === 0) {
        return 0;
    }
    return (investmentAmount / dirtyPrice) * 100;
}

export function calculateCouponPaymentDates(maturityDate, numPayments = 20) {
    const maturity = new Date(maturityDate);
    const paymentDates = [];
    
    // Calculate payments going backwards from maturity (more efficient than loop)
    for (let i = 0; i < numPayments; i++) {
        const paymentDate = new Date(maturity);
        paymentDate.setMonth(maturity.getMonth() - (i * 6));
        
        if (paymentDate > new Date('2020-01-01')) {
            paymentDates.unshift(paymentDate);
        } else {
            break;
        }
    }
    
    return paymentDates;
}

export function findLastCouponDate(maturityDate, referenceDate = null) {
    if (!referenceDate) {
        referenceDate = new Date();
    }
    
    const paymentDates = calculateCouponPaymentDates(maturityDate);
    
    // Find last payment before reference date (more efficient than loop)
    for (let i = paymentDates.length - 1; i >= 0; i--) {
        if (paymentDates[i] <= referenceDate) {
            return paymentDates[i];
        }
    }
    
    return null;
}

export function findNextCouponDate(maturityDate, referenceDate = null) {
    if (!referenceDate) {
        referenceDate = new Date();
    }
    
    const paymentDates = calculateCouponPaymentDates(maturityDate);
    
    // Find first payment after reference date
    for (let i = 0; i < paymentDates.length; i++) {
        if (paymentDates[i] > referenceDate) {
            return paymentDates[i];
        }
    }
    
    return new Date(maturityDate);
}

export function calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate = null) {
    if (!settlementDate) {
        settlementDate = new Date();
    }
    
    const lastPayment = new Date(lastPaymentDate);
    const daysSinceLastPayment = Math.floor((settlementDate - lastPayment) / (1000 * 60 * 60 * 24));
    
    // UK gilts use Actual/Actual day count convention with semi-annual payments
    const daysInSemiAnnualPeriod = 184; // Approximate semi-annual period
    const accruedFraction = daysSinceLastPayment / daysInSemiAnnualPeriod;
    
    // Return semi-annual coupon amount multiplied by accrued fraction
    return (couponRate / 2) * accruedFraction;
}

export function getTaxRateInfo(taxBracket) {
    const taxRates = {
        'basic_rate': { income: 20, psa: 1000 },
        'higher_rate': { income: 40, psa: 500 },
        'additional_rate': { income: 45, psa: 0 }
    };
    
    return taxRates[taxBracket] || taxRates['additional_rate'];
}

export function calculateEquivalentGrossSavingsRate(afterTaxYield, incomeTaxRate) {
    if (incomeTaxRate >= 1) {
        return 0;
    }
    return afterTaxYield / (1 - incomeTaxRate);
}

// Memoization cache for expensive calculations
const calculationCache = new Map();

export function getCachedCalculation(key, calculationFn, ...args) {
    const cacheKey = \`\${key}_\${JSON.stringify(args)}\`;
    
    if (calculationCache.has(cacheKey)) {
        return calculationCache.get(cacheKey);
    }
    
    const result = calculationFn(...args);
    calculationCache.set(cacheKey, result);
    
    // Limit cache size to prevent memory issues
    if (calculationCache.size > 1000) {
        const firstKey = calculationCache.keys().next().value;
        calculationCache.delete(firstKey);
    }
    
    return result;
}
    `;
    return new Response(utilsContent, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }
  return new Response("Library file not found", { status: 404 });
}
__name(handleLibFile, "handleLibFile");
async function handleStaticFile(request, env) {
  return new Response("Static file not found", { status: 404 });
}
__name(handleStaticFile, "handleStaticFile");
async function handleAPIRequest(request, env, path) {
  const url = new URL(request.url);
  try {
    switch (path) {
      case "/api/gilt-data":
        return await getGiltData(request, env);
      case "/api/calculate-tax":
        return await calculateTax(request, env);
      case "/api/coupon-schedule":
        return await getCouponSchedule(request, env);
      default:
        return new Response("API endpoint not found", { status: 404 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleAPIRequest, "handleAPIRequest");
async function getGiltData(request, env) {
  try {
    console.log("API endpoint called: /api/gilt-data");
    const fetcher = new GiltDataFetcher2(env);
    console.log("GiltDataFetcher created");
    const result = await fetcher.getGiltData();
    console.log(`Fetched ${result?.data?.length || 0} gilts from ${result?.dataSource || "unknown"} source`);
    console.log("Price date:", result?.priceDate);
    if (!result?.data || result.data.length === 0) {
      throw new Error("No gilt data available from any source");
    }
    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error in getGiltData:", error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      debug: "API endpoint /api/gilt-data failed"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(getGiltData, "getGiltData");
async function calculateTax(request, env) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  try {
    const body = await request.json();
    const calculator = new TaxCalculator();
    if (body.giltData && Array.isArray(body.giltData)) {
      const results = await Promise.all(body.giltData.map(async (gilt) => {
        try {
          const scheduleResult = await calculator.calculateAfterTaxYieldWithSchedule(
            gilt,
            body.taxpayerType,
            body.investmentAmount || 1e4
          );
          const afterTaxYield = scheduleResult.afterTaxYield || calculator.calculateAfterTaxYield(
            gilt.currentYield || 0,
            gilt.yearsToMaturity || 0,
            gilt.couponRate || 0,
            body.taxpayerType,
            gilt.dirtyPrice,
            gilt.cleanPrice
          );
          const equivalentSavingsRate = calculator.calculateEquivalentSavingsRate(
            afterTaxYield,
            body.taxpayerType
          );
          const savingsAfterTaxRate = calculator.calculateSavingsAfterTax(
            body.savingsRate || 0,
            body.investmentAmount || 1e4,
            body.taxpayerType
          );
          const taxAdvantage = afterTaxYield - savingsAfterTaxRate;
          const annualAdvantage = calculator.calculateAnnualAdvantage(taxAdvantage, body.investmentAmount || 1e4);
          const yearsToMaturity = gilt.yearsToMaturity || (new Date(gilt.maturityDate) - /* @__PURE__ */ new Date()) / (365.25 * 24 * 60 * 60 * 1e3);
          const extraIncome = annualAdvantage * yearsToMaturity;
          const scheduleTooltip = createScheduleTooltip(scheduleResult, body.taxpayerType);
          return {
            ...gilt,
            afterTaxYield,
            equivalentGrossSavingsRate: equivalentSavingsRate,
            taxAdvantage,
            annualAdvantage,
            extraIncome,
            yearsToMaturity,
            scheduleDetails: scheduleResult,
            scheduleTooltip
          };
        } catch (giltError) {
          console.error(`Error calculating for gilt ${gilt.name}:`, giltError);
          return {
            ...gilt,
            afterTaxYield: 0,
            equivalentGrossSavingsRate: 0,
            taxAdvantage: 0,
            annualAdvantage: 0,
            scheduleDetails: null,
            scheduleTooltip: "Calculation error"
          };
        }
      }));
      return new Response(JSON.stringify(results), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } else {
      const result = calculator.calculateAfterTaxYield(
        body.currentYield,
        body.yearsToMaturity,
        body.couponRate,
        body.taxpayerType,
        body.dirtyPrice,
        body.cleanPrice
      );
      return new Response(JSON.stringify({ afterTaxYield: result }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(calculateTax, "calculateTax");
function createScheduleTooltip(scheduleResult, taxpayerType) {
  if (!scheduleResult || !scheduleResult.schedule) {
    return "Schedule-based calculation unavailable";
  }
  const { schedule, summary } = scheduleResult;
  const taxRatePercent = taxpayerType === "additional_rate" ? "45%" : taxpayerType === "higher_rate" ? "40%" : "20%";
  let tooltip = `<div class="schedule-tooltip">
    <h4>Detailed Coupon Payment Schedule & IRR Calculation</h4>
    <div class="schedule-summary">
      <p><strong>Investment:</strong> \xA3${summary.investmentAmount.toFixed(2)}</p>
      <p><strong>Tax Rate:</strong> ${taxRatePercent} (Income Tax on Coupons)</p>
      <p><strong>Total Return:</strong> \xA3${summary.totalAfterTaxReturn.toFixed(2)} (${summary.totalReturn.toFixed(2)}%)</p>
      <p><strong>After-Tax IRR:</strong> ${summary.annualizedReturn.toFixed(3)}%</p>
    </div>
    
    <div class="irr-calculation">
      <h5>IRR Calculation Method</h5>
      <p><strong>Formula:</strong> NPV = -Initial Investment + \u03A3(Cash Flow<sub>t</sub> \xF7 (1 + IRR)<sup>t</sup>) = 0</p>
      <p><strong>Method:</strong> Newton-Raphson iterative convergence (tolerance: 1e-7)</p>
      <p><strong>Cash Flows:</strong> Uses exact payment dates converted to fractional years</p>
      <p><strong>Time Calculation:</strong> Days to payment \xF7 365.25 = Years</p>
    </div>
    
    <div class="payment-schedule">
      <table>
        <thead>
          <tr>
            <th>Payment Date</th>
            <th>Days</th>
            <th>Years</th>
            <th>Gross Coupon</th>
            <th>Tax (${taxRatePercent})</th>
            <th>After-Tax Coupon</th>
            <th>Principal</th>
            <th>Total Cash Flow</th>
          </tr>
        </thead>
        <tbody>`;
  schedule.forEach((payment) => {
    const paymentDate = new Date(payment.paymentDate).toLocaleDateString("en-GB");
    const timeInYears = payment.daysToPayment / 365.25;
    tooltip += `
          <tr>
            <td>${paymentDate}</td>
            <td>${payment.daysToPayment}</td>
            <td>${timeInYears.toFixed(3)}</td>
            <td>\xA3${payment.grossCouponAmount.toFixed(2)}</td>
            <td>\xA3${payment.couponTax.toFixed(2)}</td>
            <td>\xA3${payment.afterTaxCouponAmount.toFixed(2)}</td>
            <td>\xA3${payment.principalAmount.toFixed(2)}</td>
            <td>\xA3${payment.totalAfterTaxPayment.toFixed(2)}</td>
          </tr>`;
  });
  tooltip += `
        </tbody>
      </table>
    </div>
    <div class="irr-details">
      <h5>IRR Cash Flow Analysis</h5>
      <p><strong>Initial Investment:</strong> -\xA3${summary.investmentAmount.toFixed(2)} (at Time 0)</p>
      <p><strong>Present Value Check:</strong> Sum of discounted cash flows should equal investment</p>
      <p><strong>Convergence:</strong> IRR found when NPV = 0 within 1e-7 tolerance</p>
    </div>
    
    <div class="schedule-notes">
      <p><small>\u2022 IRR accounts for exact timing of each cash flow using fractional years</small></p>
      <p><small>\u2022 Coupon payments subject to ${taxRatePercent} Income Tax</small></p>
      <p><small>\u2022 Principal repayment is tax-free</small></p>
      <p><small>\u2022 Capital gains on gilts are tax-free in the UK</small></p>
      <p><small>\u2022 Newton-Raphson method provides professional-grade accuracy</small></p>
    </div>
  </div>`;
  return tooltip;
}
__name(createScheduleTooltip, "createScheduleTooltip");
async function getCouponSchedule(request, env) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const body = await request.json();
  const scheduler = new CouponScheduler();
  const schedule = scheduler.generateCouponSchedule(body.giltInfo);
  const afterTaxSchedule = scheduler.calculateAfterTaxCashFlows(schedule, body.taxRate);
  return new Response(JSON.stringify({
    schedule: afterTaxSchedule,
    summary: scheduler.getScheduleSummary(afterTaxSchedule)
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(getCouponSchedule, "getCouponSchedule");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-bTutpu/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-bTutpu/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
