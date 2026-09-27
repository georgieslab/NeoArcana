import { useState, useEffect, useRef } from 'react';
import { calculateZodiacSign, zodiacDetails } from '../utils/zodiac';

const MONTH_DATA = [
  { value: '01', name: 'January', glyph: '♑/♒' },
  { value: '02', name: 'February', glyph: '♒/♓' },
  { value: '03', name: 'March', glyph: '♓/♈' },
  { value: '04', name: 'April', glyph: '♈/♉' },
  { value: '05', name: 'May', glyph: '♉/♊' },
  { value: '06', name: 'June', glyph: '♊/♋' },
  { value: '07', name: 'July', glyph: '♋/♌' },
  { value: '08', name: 'August', glyph: '♌/♍' },
  { value: '09', name: 'September', glyph: '♍/♎' },
  { value: '10', name: 'October', glyph: '♎/♏' },
  { value: '11', name: 'November', glyph: '♏/♐' },
  { value: '12', name: 'December', glyph: '♐/♑' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1920 + 1 }, (_, i) => CURRENT_YEAR - i);

export default function CosmicDatePicker({ value, onChange, required = false, showBadge = false }) {
  // Parse incoming value 'YYYY-MM-DD'
  const parseValue = (val) => {
    if (!val || typeof val !== 'string') return { d: '', m: '', y: '' };
    const parts = val.split('-');
    if (parts.length === 3) {
      return { y: parts[0], m: parts[1], d: parts[2] };
    }
    return { d: '', m: '', y: '' };
  };

  const initial = parseValue(value);
  const [day, setDay] = useState(initial.d);
  const [month, setMonth] = useState(initial.m);
  const [year, setYear] = useState(initial.y);

  // Popover calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewYear, setViewYear] = useState(parseInt(initial.y, 10) || 2000);
  const [viewMonth, setViewMonth] = useState(parseInt(initial.m, 10) ? parseInt(initial.m, 10) - 1 : 0);

  const containerRef = useRef(null);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const parsed = parseValue(value);
    setDay(parsed.d);
    setMonth(parsed.m);
    setYear(parsed.y);
    if (parsed.y) setViewYear(parseInt(parsed.y, 10));
    if (parsed.m) setViewMonth(parseInt(parsed.m, 10) - 1);
  }

  // Click outside to close calendar popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // Max days in the selected month/year
  const daysInMonth = (y, m) => {
    if (!m) return 31;
    const yr = parseInt(y, 10) || 2000;
    const mo = parseInt(m, 10);
    return new Date(yr, mo, 0).getDate();
  };

  const maxDays = daysInMonth(year, month);
  const daysList = Array.from({ length: maxDays }, (_, i) => String(i + 1).padStart(2, '0'));

  // Trigger parent onChange when all 3 values are selected
  const handleUpdate = (newD, newM, newY) => {
    setDay(newD);
    setMonth(newM);
    setYear(newY);

    if (newD && newM && newY) {
      const iso = `${newY}-${newM}-${newD}`;
      onChange(iso);
    } else {
      onChange('');
    }
  };

  const onDayChange = (e) => handleUpdate(e.target.value, month, year);
  const onMonthChange = (e) => {
    const newM = e.target.value;
    let newD = day;
    const maxForNewMonth = daysInMonth(year, newM);
    if (newD && parseInt(newD, 10) > maxForNewMonth) {
      newD = String(maxForNewMonth).padStart(2, '0');
    }
    handleUpdate(newD, newM, year);
  };
  const onYearChange = (e) => handleUpdate(day, month, e.target.value);

  // Calendar Day Click Handler
  const handleCalendarDayClick = (dNum) => {
    const dStr = String(dNum).padStart(2, '0');
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const yStr = String(viewYear);

    handleUpdate(dStr, mStr, yStr);
    setShowCalendar(false);
  };

  // Calendar Navigation
  const prevMonth = (e) => {
    e.preventDefault();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const nextMonth = (e) => {
    e.preventDefault();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Compute calendar days grid
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday = 0
  const daysInViewMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const calendarCells = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInViewMonth; i++) {
    calendarCells.push(i);
  }

  // Active zodiac sign info
  const dateIso = day && month && year ? `${year}-${month}-${day}` : '';
  const zodiac = dateIso ? calculateZodiacSign(dateIso) : null;
  const zodiacProfile = zodiac ? zodiacDetails[zodiac] : null;

  return (
    <div className={`cosmic-date-picker-wrap ${showCalendar ? 'calendar-open' : ''}`} ref={containerRef}>
      {/* Trio Segmented Selectors */}
      <div className="cosmic-date-selectors">
        {/* Day Select */}
        <select
          value={day}
          onChange={onDayChange}
          className="cosmic-date-select"
          required={required}
          aria-label="Day of birth"
        >
          <option value="">Day</option>
          {daysList.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Month Select */}
        <select
          value={month}
          onChange={onMonthChange}
          className="cosmic-date-select"
          required={required}
          aria-label="Month of birth"
        >
          <option value="">Month</option>
          {MONTH_DATA.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name} ({m.glyph})
            </option>
          ))}
        </select>

        {/* Year Select */}
        <select
          value={year}
          onChange={onYearChange}
          className="cosmic-date-select"
          required={required}
          aria-label="Year of birth"
        >
          <option value="">Year</option>
          {YEARS.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        {/* Calendar Popup Button */}
        <button
          type="button"
          onClick={() => setShowCalendar((prev) => !prev)}
          className={`cosmic-calendar-toggle-btn ${showCalendar ? 'active' : ''}`}
          title="Open Celestial Calendar"
          aria-label="Toggle calendar view"
        >
          📅
        </button>
      </div>

      {/* Instant Zodiac Badge Feedback */}
      {showBadge && zodiac && zodiacProfile && (
        <div className="cosmic-dob-badge">
          <span className="badge-icon">{zodiacProfile.symbol}</span>
          <span className="badge-sign">{zodiac}</span>
          <span>•</span>
          <span>{zodiacProfile.element} Element ({zodiacProfile.ruler})</span>
        </div>
      )}

      {/* Floating Celestial Calendar Popover */}
      {showCalendar && (
        <div className="celestial-calendar-popover">
          {/* Calendar Header */}
          <div className="cal-header">
            <button type="button" onClick={prevMonth} className="cal-nav-btn" aria-label="Previous month">
              ◀
            </button>

            <div className="cal-title-wrap">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="cal-title-select"
              >
                {MONTH_DATA.map((m, idx) => (
                  <option key={m.value} value={idx}>
                    {m.name}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="cal-title-select"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" onClick={nextMonth} className="cal-nav-btn" aria-label="Next month">
              ▶
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="cal-weekdays">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((w) => (
              <span key={w} className="cal-weekday">
                {w}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="cal-days-grid">
            {calendarCells.map((cellDay, idx) => {
              if (cellDay === null) {
                return <div key={`empty-${idx}`} className="cal-day-cell empty" />;
              }

              const isSelected =
                day &&
                month &&
                year &&
                parseInt(day, 10) === cellDay &&
                parseInt(month, 10) === viewMonth + 1 &&
                parseInt(year, 10) === viewYear;

              return (
                <button
                  key={`day-${cellDay}`}
                  type="button"
                  onClick={() => handleCalendarDayClick(cellDay)}
                  className={`cal-day-cell ${isSelected ? 'selected' : ''}`}
                >
                  {cellDay}
                </button>
              );
            })}
          </div>

          {/* Quick Year Shortcuts Footer */}
          <div className="cal-footer">
            <button
              type="button"
              onClick={() => {
                setViewYear(2000);
                setViewMonth(0);
              }}
              className="cal-quick-btn"
            >
              Jump to 2000
            </button>
            <button
              type="button"
              onClick={() => {
                setViewYear(1990);
                setViewMonth(0);
              }}
              className="cal-quick-btn"
            >
              Jump to 1990
            </button>
            <button
              type="button"
              onClick={() => setShowCalendar(false)}
              className="cal-quick-btn"
              style={{ color: '#f4a261' }}
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
