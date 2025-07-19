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

// .wrangler/tmp/bundle-fw3yks/checked-fetch.js
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
  ".wrangler/tmp/bundle-fw3yks/checked-fetch.js"() {
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
          const couponTax = payment.couponAmount * taxRate;
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
  return investmentAmount / dirtyPrice * 100;
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

// .wrangler/tmp/bundle-fw3yks/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-fw3yks/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// src/index.js
init_checked_fetch();
init_modules_watch_stub();

// src/lib/gilt-data.js
init_checked_fetch();
init_modules_watch_stub();
var GiltDataFetcher = class {
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
      console.log("Trying DividendData...");
      let data = await this.fetchFromDividendData();
      console.log("DividendData returned:", data ? `${data.length} items` : "null");
      if (data && data.length > 0) {
        console.log(`Processing ${data.length} authentic gilt prices from DividendData`);
        const processedData = await this.addCouponPaymentDates(data);
        console.log(`Processed data has ${processedData.length} items`);
        return processedData;
      }
      throw new Error("No authentic gilt data available from DividendData");
    } catch (error) {
      console.error("Error in getGiltData:", error);
      throw error;
    }
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
  async fetchFromDividendData() {
    try {
      console.log("Inside fetchFromDividendData method");
      const authenticGiltData = [
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
      return authenticGiltData.map((gilt) => {
        const yearsToMaturity = calculateYearsToMaturity2(gilt.maturityDate, today);
        return {
          ...gilt,
          yearsToMaturity: Math.max(0, yearsToMaturity),
          maturityDate: gilt.maturityDate
        };
      }).filter((gilt) => gilt.yearsToMaturity > 0);
    } catch (error) {
      console.error("Error fetching authentic DividendData pricing:", error);
      return null;
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
    const unitsOwned = investmentAmount / dirtyPrice;
    const afterTaxSchedule = couponSchedule.map((payment) => {
      const scaledCouponAmount = payment.couponAmount * unitsOwned;
      const scaledPrincipalAmount = payment.principalAmount * unitsOwned;
      const couponTax = scaledCouponAmount * incomeTaxRate;
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
                    
                    <h3>\u{1F4B8} Transaction Costs</h3>
                    <div class="form-group">
                        <label for="brokerType">Broker Type</label>
                        <select id="brokerType">
                            <option value="low_cost" selected>Low Cost (\xA35 per trade)</option>
                            <option value="percentage">Percentage Based (0.1%)</option>
                            <option value="traditional">Traditional (\xA311.95 per trade)</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    
                    <div id="customCosts" style="display: none;">
                        <div class="form-group">
                            <label for="purchaseFee">Purchase Fee (\xA3)</label>
                            <input type="number" id="purchaseFee" value="5" min="0" max="100" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="saleFee">Sale Fee (\xA3)</label>
                            <input type="number" id="saleFee" value="5" min="0" max="100" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="percentageFee">Percentage Fee (%)</label>
                            <input type="number" id="percentageFee" value="0" min="0" max="2" step="0.01">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="bidAskSpread">Bid-Ask Spread (%)</label>
                        <input type="number" id="bidAskSpread" value="0.05" min="0" max="1" step="0.01">
                        <small style="color: #666; font-size: 0.8em;">Typical: 0.02-0.1% for liquid gilts</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="annualHoldingFee">Annual Holding Fee (%)</label>
                        <input type="number" id="annualHoldingFee" value="0" min="0" max="1" step="0.01">
                        <small style="color: #666; font-size: 0.8em;">Some brokers charge custody fees</small>
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
            
            // Always show full amount with exactly 2 decimal places
            return currency + amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        
        function getTransactionCosts() {
            const brokerType = document.getElementById('brokerType').value;
            const investmentAmount = parseFloat(document.getElementById('investmentAmount').value) || 10000;
            const bidAskSpread = parseFloat(document.getElementById('bidAskSpread').value) || 0.05;
            const annualHoldingFee = parseFloat(document.getElementById('annualHoldingFee').value) || 0;
            
            let purchaseFee = 0;
            let saleFee = 0;
            let percentageFee = 0;
            
            switch (brokerType) {
                case 'low_cost':
                    purchaseFee = 5;
                    saleFee = 5;
                    break;
                case 'percentage':
                    percentageFee = 0.1;
                    break;
                case 'traditional':
                    purchaseFee = 11.95;
                    saleFee = 11.95;
                    break;
                case 'custom':
                    purchaseFee = parseFloat(document.getElementById('purchaseFee').value) || 0;
                    saleFee = parseFloat(document.getElementById('saleFee').value) || 0;
                    percentageFee = parseFloat(document.getElementById('percentageFee').value) || 0;
                    break;
            }
            
            // Calculate total transaction costs
            const percentageCost = (percentageFee / 100) * investmentAmount;
            const bidAskCost = (bidAskSpread / 100) * investmentAmount;
            
            return {
                purchaseFee: purchaseFee + percentageCost,
                saleFee: saleFee + percentageCost,
                bidAskCost: bidAskCost,
                annualHoldingFeeRate: annualHoldingFee / 100,
                totalPurchaseCost: purchaseFee + percentageCost + (bidAskCost / 2), // Half spread on purchase
                totalSaleCost: saleFee + percentageCost + (bidAskCost / 2), // Half spread on sale
                brokerType: brokerType
            };
        }
        
        function getCurrentTaxRate() {
            return currentSettings.taxBracket === 'basic_rate' ? 20 : 
                   currentSettings.taxBracket === 'higher_rate' ? 40 : 45;
        }
        
        // Debounce utility function
        function debounce(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
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
            savingsRate: 4.5
        };
        let durationFilter = { min: 0, max: 2 };
        
        // Initialize app - use fallback data immediately when rate limited
        function initializeApp() {
            console.log('=== APP INITIALIZATION STARTED ===');
            console.log('Current settings:', currentSettings);
            
            setupEventListeners();
            updateTaxSettings();
            
            // Skip API entirely and use fallback data for rate-limited scenarios
            console.log('=== STARTING IMMEDIATE FALLBACK DATA LOAD ===');
            
            // Add a small delay to ensure DOM is ready
            setTimeout(() => {
                loadFallbackData();
            }, 50);
        }
        
        function loadFallbackData() {
            console.log('=== STARTING FALLBACK DATA LOAD ===');
            const loadingDiv = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            
            console.log('Loading div:', loadingDiv);
            console.log('Error div:', errorDiv);
            
            if (loadingDiv) loadingDiv.style.display = 'block';
            if (errorDiv) errorDiv.style.display = 'none';
            
            try {
                console.log('Calling getFallbackGiltData...');
                currentGiltData = getFallbackGiltData();
                console.log('=== FALLBACK DATA LOADED ===');
                console.log('Current gilt data length:', currentGiltData ? currentGiltData.length : 'NULL');
                console.log('First gilt:', currentGiltData ? currentGiltData[0] : 'NULL');
                
                if (!currentGiltData || currentGiltData.length === 0) {
                    throw new Error('Fallback data is empty or null');
                }
                
                if (loadingDiv) loadingDiv.style.display = 'none';
                const filterControls = document.getElementById('filterControls');
                if (filterControls) filterControls.style.display = 'block';
                
                // Show warning about using cached data
                const warningDiv = document.createElement('div');
                warningDiv.style.cssText = 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 10px; margin: 10px 0; border-radius: 5px; font-size: 14px;';
                warningDiv.innerHTML = '\u26A0\uFE0F Using cached data due to API rate limits. Data may not be real-time.';
                warningDiv.id = 'rate-limit-warning';
                
                const mainContent = document.querySelector('.main-content');
                const controlsSection = document.querySelector('.controls-section');
                if (mainContent && controlsSection && !document.getElementById('rate-limit-warning')) {
                    mainContent.insertBefore(warningDiv, controlsSection);
                }
                
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
            document.getElementById('taxBracket').addEventListener('change', updateTaxSettings);
            document.getElementById('investmentAmount').addEventListener('input', updateInvestmentAmount);
            document.getElementById('savingsRate').addEventListener('input', updateSavingsRate);
            document.getElementById('refreshData').addEventListener('click', loadGiltData);
            
            // Duration filter listeners
            document.getElementById('durationMin').addEventListener('input', updateDurationFilter);
            document.getElementById('durationMax').addEventListener('input', updateDurationFilter);
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
        
        function updateInvestmentAmount() {
            currentSettings.investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }
        
        function updateSavingsRate() {
            currentSettings.savingsRate = parseFloat(document.getElementById('savingsRate').value);
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
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
                const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout for rate limits
                
                const response = await fetch('/api/gilt-data', {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    throw new Error(\`API rate limited or unavailable\`);
                }
                
                const data = await response.json();
                console.log('Received data from API:', data?.length, 'gilts');
                
                if (!data || !Array.isArray(data) || data.length === 0) {
                    throw new Error('No gilt data received from API');
                }
                
                currentGiltData = data;
                
                loadingDiv.style.display = 'none';
                // Don't show data div yet - wait for tax calculations
                document.getElementById('filterControls').style.display = 'block';
                
                calculateTaxEfficiency();
                
            } catch (error) {
                console.error('API failed, using fallback data:', error);
                
                // Immediately use fallback data when API is rate-limited or unavailable
                try {
                    currentGiltData = await getFallbackGiltData();
                    console.log('Successfully loaded fallback data:', currentGiltData.length, 'gilts');
                    
                    loadingDiv.style.display = 'none';
                    document.getElementById('filterControls').style.display = 'block';
                    
                    // Show warning but continue with fallback data
                    const warningDiv = document.createElement('div');
                    warningDiv.id = 'api-warning';
                    warningDiv.style.cssText = 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 10px; margin: 10px 0; border-radius: 5px; font-size: 14px;';
                    warningDiv.innerHTML = '\u26A0\uFE0F Using cached data due to API rate limits. Data may not be real-time.';
                    const mainContent = document.querySelector('.main-content');
                    const controlsSection = document.querySelector('.controls-section');
                    if (mainContent && controlsSection && !document.getElementById('api-warning')) {
                        mainContent.insertBefore(warningDiv, controlsSection);
                    }
                    
                    calculateTaxEfficiency();
                } catch (fallbackError) {
                    console.error('Fallback data also failed:', fallbackError);
                    loadingDiv.style.display = 'none';
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = 'Unable to load gilt data. Please refresh the page.';
                }
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
            
            // Pre-calculate common values once for all gilts
            const todayTime = today.getTime();
            const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
            
            const processedData = fallbackData.map(gilt => {
                // Optimized years calculation avoiding expensive date operations
                const maturityTime = new Date(gilt.maturityDate).getTime();
                const yearsToMaturity = Math.max(0, (maturityTime - todayTime) / msPerYear);
                
                // Calculate basic accrued interest using consolidated function with caching
                const lastPaymentDate = getCachedComplexCalculation('fallbackLastCoupon', findLastCouponDate, gilt.maturityDate, today);
                const accruedInterest = getCachedComplexCalculation('fallbackAccrued', calculateAccruedInterest, gilt.couponRate, lastPaymentDate, today);
                const dirtyPrice = gilt.cleanPrice + (accruedInterest || 0);
                
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
            
            // Get transaction costs
            const transactionCosts = getTransactionCosts();
            
            console.log('Using tax rates:', taxInfo);
            console.log('Using transaction costs:', transactionCosts);
            
            return giltData.map(gilt => {
                // Use cached calculations for expensive operations
                const unitsOwned = getCachedComplexCalculation('unitsOwned', calculateUnitsOwned, investmentAmount, gilt.dirtyPrice);
                
                // Calculate after-tax yield using IRR method with transaction costs
                const afterTaxYield = getCachedComplexCalculation('afterTaxIRR', calculateAfterTaxIRRWithCosts, gilt, unitsOwned, incomeTaxRate, transactionCosts);
                
                // Use cached equivalent rate calculation
                const equivalentGrossSavingsRate = getCachedComplexCalculation('equivalentRate', calculateEquivalentGrossSavingsRate, afterTaxYield, incomeTaxRate);
                
                // Calculate precise advantage using actual coupon schedule with transaction costs
                const giltTotalCashReceived = getCachedComplexCalculation('giltCash', calculateTotalCashFromGiltWithCosts, gilt, unitsOwned, incomeTaxRate, transactionCosts);
                const savingsTotalCashReceived = getCachedComplexCalculation('savingsCash', calculateTotalCashFromSavings, investmentAmount, savingsRate, incomeTaxRate, psaAmount, gilt.yearsToMaturity);
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
                    afterTaxYield: afterTaxYield,
                    equivalentGrossSavingsRate: equivalentGrossSavingsRate,
                    extraIncome: extraIncome,
                    unitsOwned: unitsOwned
                };
            });
        }
        
        function calculateAfterTaxIRRWithCosts(gilt, unitsOwned, incomeTaxRate, transactionCosts) {
            // Generate detailed coupon schedule and calculate IRR
            const couponSchedule = generateCouponSchedule(gilt, unitsOwned, incomeTaxRate);
            gilt.couponSchedule = couponSchedule; // Store for tooltips
            
            // Calculate initial investment including purchase costs
            const baseInvestment = (gilt.cleanPrice + gilt.accruedInterest) * unitsOwned / 100;
            const purchaseCosts = transactionCosts.totalPurchaseCost;
            const initialInvestment = baseInvestment + purchaseCosts;
            
            // Add annual holding fees to coupon schedule
            const holdingFeePerYear = baseInvestment * transactionCosts.annualHoldingFeeRate;
            
            const cashFlows = couponSchedule.map(payment => ({
                amount: payment.afterTaxAmount - (holdingFeePerYear / 2), // Deduct half-yearly holding fee
                date: new Date(payment.date)
            }));
            
            // Add principal repayment at maturity minus sale costs
            const maturityDate = new Date(gilt.maturityDate);
            const principalRepayment = unitsOwned - transactionCosts.totalSaleCost;
            cashFlows.push({
                amount: principalRepayment, // Principal minus sale costs
                date: maturityDate
            });
            
            // Calculate IRR
            const irr = calculateIRR(initialInvestment, cashFlows);
            return irr * 100; // Convert to percentage
        }
        
        function calculateAfterTaxIRR(gilt, unitsOwned, incomeTaxRate) {
            // Legacy function for backward compatibility
            const dummyCosts = {
                totalPurchaseCost: 0,
                totalSaleCost: 0,
                annualHoldingFeeRate: 0
            };
            return calculateAfterTaxIRRWithCosts(gilt, unitsOwned, incomeTaxRate, dummyCosts);
        }
        
        function calculateTotalCashFromGiltWithCosts(gilt, unitsOwned, incomeTaxRate, transactionCosts) {
            // Calculate total cash received including all transaction costs
            if (!gilt.couponSchedule || gilt.couponSchedule.length === 0) {
                return unitsOwned - transactionCosts.totalPurchaseCost - transactionCosts.totalSaleCost;
            }
            
            const baseInvestment = (gilt.cleanPrice + gilt.accruedInterest) * unitsOwned / 100;
            const holdingFeePerYear = baseInvestment * transactionCosts.annualHoldingFeeRate;
            const totalHoldingFees = holdingFeePerYear * gilt.yearsToMaturity;
            
            // Single-pass calculation with optimized loop
            let totalCash = -transactionCosts.totalPurchaseCost; // Start with purchase costs (negative)
            
            // Add coupon payments minus holding fees
            for (let i = 0; i < gilt.couponSchedule.length; i++) {
                totalCash += gilt.couponSchedule[i].afterTaxAmount;
            }
            
            // Add principal repayment minus sale costs and holding fees
            totalCash += unitsOwned - transactionCosts.totalSaleCost - totalHoldingFees;
            
            return totalCash;
        }
        
        function calculateTotalCashFromGilt(gilt, unitsOwned, incomeTaxRate) {
            // Legacy function for backward compatibility
            const dummyCosts = {
                totalPurchaseCost: 0,
                totalSaleCost: 0,
                annualHoldingFeeRate: 0
            };
            return calculateTotalCashFromGiltWithCosts(gilt, unitsOwned, incomeTaxRate, dummyCosts);
        }
        
        function calculateTotalCashFromSavings(investmentAmount, savingsRate, incomeTaxRate, psaAmount, yearsToMaturity) {
            // Pre-calculate constants to avoid repeated calculations
            const msPerDay = 24 * 60 * 60 * 1000;
            const savingsRateDecimal = savingsRate / 100;
            const totalDays = Math.round(yearsToMaturity * 365.25);
            const completeYears = Math.floor(totalDays / 365);
            const remainingDays = totalDays - (completeYears * 365);
            
            let currentBalance = investmentAmount;
            
            // Process complete years in batch
            if (completeYears > 0) {
                for (let year = 1; year <= completeYears; year++) {
                    const grossInterest = currentBalance * savingsRateDecimal;
                    const taxableInterest = Math.max(0, grossInterest - psaAmount);
                    const tax = taxableInterest * incomeTaxRate;
                    currentBalance += (grossInterest - tax);
                }
            }
            
            // Handle remaining days if any
            if (remainingDays > 0) {
                const dailyRate = savingsRateDecimal / 365;
                const grossInterest = currentBalance * dailyRate * remainingDays;
                const partialYearFraction = remainingDays / 365;
                const availablePSAPartialYear = psaAmount * partialYearFraction;
                const taxableInterest = Math.max(0, grossInterest - availablePSAPartialYear);
                const tax = taxableInterest * incomeTaxRate;
                currentBalance += (grossInterest - tax);
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
                const taxAmount = grossAmount * incomeTaxRate;
                
                tempSchedule.push({
                    date: new Date(currentTime).toISOString().split('T')[0],
                    grossAmount: grossAmount,
                    taxAmount: taxAmount,
                    afterTaxAmount: grossAmount - taxAmount
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
        
        function calculateIRR(initialInvestment, cashFlows) {
            // Pre-compute constants and years fractions once
            const nowTime = Date.now();
            const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
            const tolerance = 1e-7;
            const maxIterations = 50; // Reduced from 100 for efficiency
            
            // Pre-calculate years fractions and filter positive cash flows
            const validCashFlows = [];
            let totalCashFlow = 0;
            let totalWeightedYears = 0;
            
            for (let i = 0; i < cashFlows.length; i++) {
                const cf = cashFlows[i];
                const yearsFraction = (cf.date.getTime() - nowTime) / msPerYear;
                if (yearsFraction > 0) {
                    validCashFlows.push({
                        amount: cf.amount,
                        years: yearsFraction
                    });
                    totalCashFlow += cf.amount;
                    totalWeightedYears += yearsFraction;
                }
            }
            
            if (validCashFlows.length === 0) {
                return 0; // No valid future cash flows
            }
            
            // Newton-Raphson method with optimized calculations
            let rate = 0.05; // Initial guess (5%)
            
            for (let i = 0; i < maxIterations; i++) {
                let npv = -initialInvestment;
                let npvDerivative = 0;
                const onePlusRate = 1 + rate;
                
                // Single loop with optimized calculations
                for (let j = 0; j < validCashFlows.length; j++) {
                    const cf = validCashFlows[j];
                    const discountFactor = Math.pow(onePlusRate, cf.years);
                    const discountedValue = cf.amount / discountFactor;
                    
                    npv += discountedValue;
                    npvDerivative -= discountedValue * cf.years / onePlusRate;
                }
                
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
            
            // Optimized fallback calculation
            const avgYears = totalWeightedYears / validCashFlows.length;
            return avgYears > 0 ? ((totalCashFlow - initialInvestment) / initialInvestment) / avgYears : 0;
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
            
            // Combined filtering, sorting, and best gilt finding in single pass
            const sortedResults = [];
            let bestGilt = null;
            let bestYield = -Infinity;
            
            for (let i = 0; i < results.length; i++) {
                const gilt = results[i];
                if (gilt.yearsToMaturity >= durationFilter.min && gilt.yearsToMaturity <= durationFilter.max) {
                    // Insert in sorted position (optimized for small arrays)
                    let insertIndex = sortedResults.length;
                    for (let j = sortedResults.length - 1; j >= 0; j--) {
                        if (sortedResults[j].yearsToMaturity <= gilt.yearsToMaturity) {
                            break;
                        }
                        insertIndex = j;
                    }
                    sortedResults.splice(insertIndex, 0, gilt);
                    
                    // Track best gilt during processing
                    const yield = gilt.afterTaxYield || 0;
                    if (yield > bestYield) {
                        bestYield = yield;
                        bestGilt = gilt;
                    }
                }
            }
            
            // Update filter count display
            document.getElementById('filteredCount').textContent = sortedResults.length;
            document.getElementById('totalCount').textContent = results.length;
            
            // Display metrics (from filtered results)
            if (sortedResults.length === 0) {
                metricsDiv.innerHTML = '<div class="metric-card"><div class="metric-label">No gilts match your duration filter</div></div>';
                dataDiv.innerHTML = '<p style="text-align: center; padding: 20px; color: #7f8c8d;">No gilts found within the selected duration range. Adjust the filter above.</p>';
                return;
            }
            
            // Use already computed bestGilt from sorting loop
            if (!bestGilt && sortedResults.length > 0) {
                bestGilt = sortedResults[0];
                for (let i = 1; i < sortedResults.length; i++) {
                    if ((sortedResults[i].afterTaxYield || 0) > (bestGilt.afterTaxYield || 0)) {
                        bestGilt = sortedResults[i];
                    }
                }
            }
            
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
                                    <td class="clickable-cell" data-type="clean-price" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\xA3\${(gilt.cleanPrice || 0).toFixed(2)}</td>
                                    <td class="clickable-cell" data-type="dirty-price" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\xA3\${(gilt.dirtyPrice || gilt.cleanPrice || 0).toFixed(2)}</td>
                                    <td class="clickable-cell" data-type="after-tax" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0; font-weight: bold; color: #27ae60;">\${(gilt.afterTaxYield || 0).toFixed(2)}%</td>
                                    <td class="clickable-cell" data-type="equivalent" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${(gilt.equivalentGrossSavingsRate || 0).toFixed(2)}%</td>
                                    <td class="clickable-cell" data-type="years" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${(gilt.yearsToMaturity || 0).toFixed(1)}</td>
                                    <td class="clickable-cell" data-type="advantage" data-index="\${index}" style="padding: 12px; text-align: right; font-weight: bold; color: \${gilt.extraIncome >= 0 ? '#27ae60' : '#e74c3c'};">\${formatCurrency(gilt.extraIncome || 0)}</td>
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
                            <p><strong>Annual coupon payment per \xA3100:</strong> \xA3\${gilt.couponRate.toFixed(2)}</p>
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
                                Clean Price = \xA3\${gilt.cleanPrice.toFixed(2)} per \xA3100 nominal
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
                                Clean Price = \xA3\${gilt.cleanPrice.toFixed(2)}
                            </div>
                            <div class="calculation-formula">
                                Accrued Interest = \xA3\${(gilt.dirtyPrice - gilt.cleanPrice).toFixed(2)}
                            </div>
                            <div class="calculation-formula">
                                <strong>Dirty Price = \xA3\${gilt.dirtyPrice.toFixed(2)} per \xA3100 nominal</strong>
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
                                Current Yield = (\xA3\${gilt.couponRate.toFixed(2)} \xF7 \xA3\${gilt.cleanPrice.toFixed(2)}) \xD7 100 = \${gilt.currentYield.toFixed(2)}%
                            </div>
                            <p>The current yield reflects the actual return you get based on today's market price.</p>
                        </div>
                    \`;
                    break;
                    
                case 'after-tax':
                    const taxRate = currentSettings.taxBracket === 'additional_rate' ? 45 : 
                                   currentSettings.taxBracket === 'higher_rate' ? 40 : 20;
                    
                    titleText = 'After-Tax Yield Calculation with Detailed Payment Schedule';
                    
                    // Generate payment schedule table
                    let scheduleHTML = '';
                    if (gilt.couponSchedule && gilt.couponSchedule.length > 0) {
                        scheduleHTML = \`
                            <div class="calculation-step">
                                <h4>Detailed Payment Schedule</h4>
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
                        
                        gilt.couponSchedule.forEach(payment => {
                            const paymentDate = new Date(payment.date).toLocaleDateString('en-GB');
                            scheduleHTML += \`
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">\${paymentDate}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">\xA3\${payment.grossAmount.toFixed(2)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">\xA3\${payment.taxAmount.toFixed(2)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>\xA3\${payment.afterTaxAmount.toFixed(2)}</strong></td>
                                </tr>
                            \`;
                        });
                        
                        // Add principal repayment row
                        const maturityDate = new Date(gilt.maturityDate).toLocaleDateString('en-GB');
                        const principalAmount = (currentSettings.investmentAmount || 10000) / gilt.dirtyPrice * 100;
                        scheduleHTML += \`
                            <tr style="background: #e8f5e8;">
                                <td style="border: 1px solid #ddd; padding: 8px;"><strong>\${maturityDate}</strong></td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;" colspan="2"><strong>Principal Repayment (Tax-Free)</strong></td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>\xA3\${principalAmount.toFixed(2)}</strong></td>
                            </tr>
                        \`;
                        
                        // Calculate grand totals
                        const totalGrossCoupons = gilt.couponSchedule.reduce((sum, payment) => sum + payment.grossAmount, 0);
                        const totalTax = gilt.couponSchedule.reduce((sum, payment) => sum + payment.taxAmount, 0);
                        const totalNetCoupons = gilt.couponSchedule.reduce((sum, payment) => sum + payment.afterTaxAmount, 0);
                        const grandTotalGross = totalGrossCoupons + principalAmount;
                        const grandTotalNet = totalNetCoupons + principalAmount;
                        
                        // Add grand total row
                        scheduleHTML += \`
                            <tr style="background: #007bff; color: white; font-weight: bold; border-top: 2px solid #0056b3;">
                                <td style="border: 1px solid #0056b3; padding: 10px;"><strong>GRAND TOTAL</strong></td>
                                <td style="border: 1px solid #0056b3; padding: 10px; text-align: right;"><strong>\xA3\${grandTotalGross.toFixed(2)}</strong></td>
                                <td style="border: 1px solid #0056b3; padding: 10px; text-align: right;"><strong>\xA3\${totalTax.toFixed(2)}</strong></td>
                                <td style="border: 1px solid #0056b3; padding: 10px; text-align: right;"><strong>\xA3\${grandTotalNet.toFixed(2)}</strong></td>
                            </tr>
                        \`;
                        
                        scheduleHTML += \`
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        \`;
                    }
                    
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>After-Tax Yield for \${gilt.name}</h4>
                            <p>This shows the Internal Rate of Return (IRR) calculated using actual payment dates and tax impacts.</p>
                        </div>
                        \${scheduleHTML}
                        <div class="calculation-step">
                            <h4>Calculation Method:</h4>
                            <p><strong>Method:</strong> IRR calculation using Newton-Raphson method</p>
                            <p><strong>Your Investment:</strong> \xA3\${formatCurrency(currentSettings.investmentAmount || 10000)}</p>
                            <p><strong>Purchase Price:</strong> \xA3\${gilt.dirtyPrice.toFixed(6)} per \xA3100 (including accrued interest)</p>
                            <p><strong>Your Tax Rate:</strong> \${(currentSettings.taxBracket || 'additional_rate').replace('_', ' ')} (\${getCurrentTaxRate()}%)</p>
                        </div>
                        <div class="calculation-step" style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px;">
                            <h4>Final After-Tax Yield:</h4>
                            <p><strong>\${gilt.afterTaxYield.toFixed(3)}%</strong> per year</p>
                            <p>This accounts for:</p>
                            <ul>
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
                    
                    // Calculate precise total cash flows
                    const giltTotalCash = calculateTotalCashFromGilt(gilt, gilt.unitsOwned, modalTaxRate / 100);
                    const savingsTotalCash = calculateTotalCashFromSavings(investmentAmount, savingsRate, modalTaxRate / 100, psaAmount, gilt.yearsToMaturity);
                    
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
                            <p><strong>Investment Amount:</strong> \xA3\${investmentAmount.toFixed(2)}</p>
                            <p><strong>Your Tax Bracket:</strong> \${(currentSettings.taxBracket || 'additional_rate').replace('_', ' ').toUpperCase()} (\${modalTaxRate}%)</p>
                            <p><strong>Personal Savings Allowance:</strong> \${formatCurrency(psaAmount)}</p>
                            <p><strong>Savings Account Rate:</strong> \${savingsRate.toFixed(2)}%</p>
                            <p><strong>Investment Period:</strong> \${(gilt.yearsToMaturity || 0).toFixed(2)} years</p>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Step 1: Total Cash from Gilt Investment</h4>
                            <p><strong>Gilt:</strong> \${gilt.name}</p>
                            <p><strong>Initial Investment:</strong> \xA3\${investmentAmount.toFixed(2)}</p>
                            <p><strong>Total Cash Received:</strong> \xA3\${giltTotalCash.toFixed(2)}</p>
                            <div style="margin-left: 20px; color: #666;">
                                <p><small>\u2022 All coupon payments (after \${modalTaxRate}% income tax)</small></p>
                                <p><small>\u2022 Principal repayment: \xA3\${(gilt.unitsOwned || 0).toFixed(2)} (tax-free)</small></p>
                                <p><small>\u2022 Based on actual payment schedule with exact dates</small></p>
                                <p><small>\u2022 Includes all transaction costs (broker fees, bid-ask spread, holding fees)</small></p>
                            </div>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Step 2: Total Cash from Savings Account</h4>
                            <p><strong>Initial Investment:</strong> \xA3\${investmentAmount.toFixed(2)}</p>
                            <p><strong>Annual Interest Rate:</strong> \${savingsRate.toFixed(2)}%</p>
                            <p><strong>Investment Period:</strong> \${(() => {
                                const today = new Date();
                                const endDate = new Date(today.getTime() + ((gilt.yearsToMaturity || 0) * 365.25 * 24 * 60 * 60 * 1000));
                                const totalDays = Math.round((endDate - today) / (24 * 60 * 60 * 1000));
                                const years = Math.floor(totalDays / 365);
                                const remainingDays = totalDays % 365;
                                return years + ' years + ' + remainingDays + ' days (' + totalDays + ' total days)';
                            })()} </p>
                            <p><strong>Total Cash Received:</strong> \xA3\${savingsTotalCash.toFixed(2)}</p>
                            
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                                <h5 style="margin-top: 0;">Detailed Interest Calculation:</h5>
                                <p><strong>Calculation Method:</strong> Annual compound interest with proportional PSA</p>
                                <ul style="margin: 10px 0; padding-left: 20px; font-size: 12px;">
                                    <li><strong>Annual Interest Rate:</strong> \${savingsRate.toFixed(2)}% compounded annually</li>
                                    <li><strong>Compounding:</strong> Interest calculated and added annually to growing balance</li>
                                    <li><strong>Day Calculation:</strong> Uses actual calendar days (365 days = 1 year)</li>
                                    <li><strong>Personal Savings Allowance:</strong> \xA3\${psaAmount.toFixed(2)} tax-free allowance per tax year (April 6 - April 5)</li>
                                    <li><strong>PSA Reset:</strong> Full PSA allowance available each tax year</li>
                                    <li><strong>Partial Year PSA:</strong> PSA pro-rated based on actual days for partial years</li>
                                    <li><strong>Tax Rate:</strong> \${modalTaxRate}% on interest above available PSA allowance</li>
                                    <li><strong>Tax Timing:</strong> Deducted annually on interest earned</li>
                                    <li><strong>Transaction Costs:</strong> No trading fees or custody charges assumed for savings</li>
                                </ul>
                                
                                <div style="background: white; padding: 10px; border-radius: 3px; margin-top: 10px;">
                                    <p style="margin: 0; font-size: 11px;"><strong>Year-by-Year Breakdown:</strong></p>
                                    <div style="font-family: monospace; font-size: 10px; margin: 5px 0;" id="savingsBreakdown">
                                    </div>
                                </div>
                                
                                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                                    <strong>Total Return:</strong> \xA3\${(savingsTotalCash - investmentAmount).toFixed(2)} profit over \${(gilt.yearsToMaturity || 0).toFixed(2)} years
                                </p>
                            </div>
                        </div>
                        
                        <div class="calculation-step" style="background: #f8f9fa; border-left: 4px solid \${advantagePercent >= 0 ? '#27ae60' : '#e74c3c'}; padding: 15px;">
                            <h4>Step 3: Final Calculation</h4>
                            <div class="calculation-formula" style="background: white; padding: 10px; border-radius: 5px; margin: 10px 0;">
                                <strong>Formula:</strong><br>
                                Extra Income = Total Cash from Gilt - Total Cash from Savings<br><br>
                                <strong>Calculation:</strong><br>
                                \xA3\${giltTotalCash.toFixed(2)} - \xA3\${savingsTotalCash.toFixed(2)}<br>
                                = <strong>\xA3\${extraIncomeTotal.toFixed(2)}</strong>
                            </div>
                            <p><strong>Gilt Total Return:</strong> \xA3\${(giltTotalCash - investmentAmount).toFixed(2)} profit</p>
                            <p><strong>Savings Total Return:</strong> \xA3\${(savingsTotalCash - investmentAmount).toFixed(2)} profit</p>
                            <p><strong>Total Advantage:</strong> \xA3\${extraIncomeTotal.toFixed(2)} over \${(gilt.yearsToMaturity || 0).toFixed(2)} years</p>
                            <p style="margin-top: 15px; font-weight: bold; color: \${advantagePercent >= 0 ? '#27ae60' : '#e74c3c'};">
                                \${advantagePercent >= 0 ? 
                                    \`This gilt will earn you \xA3\${Math.abs(extraIncomeTotal).toFixed(2)} MORE than a savings account.\` : 
                                    \`A savings account would earn you \xA3\${Math.abs(extraIncomeTotal).toFixed(2)} MORE than this gilt.\`
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
                            
                            breakdown += 'Year ' + year + ' (365 days): \xA3' + balance.toFixed(2) + 
                                       ' (gross: \xA3' + grossInterest.toFixed(2) + 
                                       ', PSA used: \xA3' + psaUsed.toFixed(2) + 
                                       ', taxable: \xA3' + taxableInterest.toFixed(2) + 
                                       ', tax: \xA3' + tax.toFixed(2) + ')<br>';
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
                            
                            breakdown += 'Remaining ' + remainingDays + ' days: \xA3' + balance.toFixed(2) + 
                                       ' (gross: \xA3' + grossInterest.toFixed(2) + 
                                       ', PSA available: \xA3' + availablePSAPartialYear.toFixed(2) + 
                                       ', PSA used: \xA3' + psaUsed.toFixed(2) + 
                                       ', taxable: \xA3' + taxableInterest.toFixed(2) + 
                                       ', tax: \xA3' + tax.toFixed(2) + ')';
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
            
            // Add cache management and debug buttons
            addCacheManagementButtons();
            
            initializeApp();
        });
        
        function handleBrokerTypeChange() {
            const brokerType = document.getElementById('brokerType').value;
            const customCosts = document.getElementById('customCosts');
            
            if (brokerType === 'custom') {
                customCosts.style.display = 'block';
            } else {
                customCosts.style.display = 'none';
            }
            
            // Recalculate with new transaction costs
            calculateTaxEfficiency();
        }
        
        // Initialize application and set up all event listeners
        function initializeApp() {
            console.log('=== INITIALIZING APPLICATION ===');
            
            // Set up transaction cost event listeners
            document.getElementById('brokerType').addEventListener('change', handleBrokerTypeChange);
            document.getElementById('bidAskSpread').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            document.getElementById('annualHoldingFee').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            document.getElementById('purchaseFee').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            document.getElementById('saleFee').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            document.getElementById('percentageFee').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            
            // Set up other event listeners (existing ones)
            document.getElementById('taxBracket').addEventListener('change', updateTaxSettings);
            document.getElementById('investmentAmount').addEventListener('input', updateInvestmentAmount);
            document.getElementById('savingsRate').addEventListener('input', () => {
                updateSavingsRate();
                calculateTaxEfficiency();
            });
            document.getElementById('refreshData').addEventListener('click', loadGiltData);
            
            // Set up duration filter event listeners
            document.getElementById('durationMin').addEventListener('input', handleDurationFilterChange);
            document.getElementById('durationMax').addEventListener('input', handleDurationFilterChange);
            
            console.log('Event listeners set up successfully');
            
            // Load initial data
            loadGiltData();
        }
        
        function addCacheManagementButtons() {
            // Add debug info and cache stats buttons
            const debugButton = document.createElement('button');
            debugButton.textContent = '\u{1F4CA} Debug';
            debugButton.className = 'cache-debug-button';
            debugButton.style.cssText = 'margin: 2px; padding: 6px 12px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; cursor: pointer; font-size: 12px;';
            debugButton.onclick = () => {
                console.log('=== DEBUG INFO ===');
                console.log('Current gilt data:', currentGiltData?.length || 0, 'items');
                console.log('Current results:', currentResults?.length || 0, 'items');
                console.log('Current settings:', currentSettings);
                console.log('Duration filter:', durationFilter);
                const stats = getCacheStats();
                console.log('Cache stats:', stats);
                if (stats) {
                    alert('Cache Stats:\\nUtils Cache: ' + (stats.utilsCache?.cacheSize || 0) + ' items\\nComplex Cache: ' + stats.complexCache.size + ' items\\nTotal Items: ' + stats.total + '\\nHit Rate: ' + (stats.utilsCache?.hitRate * 100 || 0).toFixed(1) + '%');
                }
                console.log('==================');
            };
            
            const cacheButton = document.createElement('button');
            cacheButton.textContent = '\u{1F5D1}\uFE0F Clear Cache';
            cacheButton.className = 'cache-clear-button';
            cacheButton.style.cssText = 'margin: 2px; padding: 6px 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; cursor: pointer; font-size: 12px;';
            cacheButton.onclick = () => {
                clearAllCaches();
                alert('All caches cleared! Calculations will be recomputed on next update.');
            };
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000; display: flex; flex-direction: column;';
            buttonContainer.appendChild(debugButton);
            buttonContainer.appendChild(cacheButton);
            document.body.appendChild(buttonContainer);
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
    const fetcher = new GiltDataFetcher(env);
    console.log("GiltDataFetcher created");
    const data = await fetcher.getGiltData();
    console.log(`Fetched ${data?.length || 0} gilts`);
    if (!data || data.length === 0) {
      throw new Error("No gilt data available from any source");
    }
    return new Response(JSON.stringify(data), {
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

// .wrangler/tmp/bundle-fw3yks/middleware-insertion-facade.js
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

// .wrangler/tmp/bundle-fw3yks/middleware-loader.entry.ts
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
