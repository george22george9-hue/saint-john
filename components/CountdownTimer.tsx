'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    function getNextFriday() {
      const now = new Date();
      const resultDate = new Date(now);
      resultDate.setHours(19, 0, 0, 0); // 7:00 PM

      let daysToFriday = (5 - now.getDay() + 7) % 7;
      if (daysToFriday === 0 && now.getHours() >= 19) {
        daysToFriday = 7;
      }
      resultDate.setDate(now.getDate() + daysToFriday);
      return resultDate;
    }

    const updateTimer = () => {
      const targetDate = getNextFriday().getTime();
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days < 10 ? '0' + days : String(days),
        hours: hours < 10 ? '0' + hours : String(hours),
        minutes: minutes < 10 ? '0' + minutes : String(minutes),
        seconds: seconds < 10 ? '0' + seconds : String(seconds),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown-wrapper gsap-fade-up" id="countdown-timer">
      <div className="countdown-item">
        <span className="countdown-number" id="cd-days">
          {timeLeft.days}
        </span>
        <span className="countdown-label">يوم</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number" id="cd-hours">
          {timeLeft.hours}
        </span>
        <span className="countdown-label">ساعة</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number" id="cd-minutes">
          {timeLeft.minutes}
        </span>
        <span className="countdown-label">دقيقة</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number" id="cd-seconds">
          {timeLeft.seconds}
        </span>
        <span className="countdown-label">ثانية</span>
      </div>
    </div>
  );
}
