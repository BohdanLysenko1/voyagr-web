export interface TimeData {
  hour: number;
  minute: number;
  ampm: 'AM' | 'PM';
}

export class TimeUtils {
  static readonly HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
  static readonly MINUTES = Array.from({ length: 60 }, (_, i) => i);

  static parseTime(timeString?: string): TimeData {
    if (!timeString) {
      return { hour: 12, minute: 0, ampm: 'AM' };
    }

    try {
      const [time, ampm] = timeString.split(' ');
      const [hourStr, minuteStr] = time.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      return {
        hour: hour === 0 ? 12 : hour > 12 ? hour - 12 : hour,
        minute: isNaN(minute) ? 0 : minute,
        ampm: (ampm?.toUpperCase() as 'AM' | 'PM') || 'AM'
      };
    } catch {
      return { hour: 12, minute: 0, ampm: 'AM' };
    }
  }

  static formatTime(timeData: TimeData): string {
    const { hour, minute, ampm } = timeData;
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${hour}:${formattedMinute} ${ampm}`;
  }

  static formatTimeForDisplay(timeString: string): string {
    const timeData = this.parseTime(timeString);
    return this.formatTime(timeData);
  }

  static convertTo24Hour(timeData: TimeData): number {
    const { hour, minute, ampm } = timeData;
    let hour24 = hour;
    
    if (ampm === 'AM' && hour === 12) {
      hour24 = 0;
    } else if (ampm === 'PM' && hour !== 12) {
      hour24 = hour + 12;
    }
    
    return hour24 * 60 + minute; // Return minutes since midnight for easy sorting
  }

  static isValidTimeString(timeString: string): boolean {
    const timeRegex = /^(1[0-2]|[1-9]):[0-5][0-9] (AM|PM)$/;
    return timeRegex.test(timeString);
  }

  static clearTime(): string {
    return '';
  }

  static getCurrentTime(): string {
    const now = new Date();
    const hour12 = now.getHours() % 12 || 12;
    const minute = now.getMinutes();
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    
    return this.formatTime({ hour: hour12, minute, ampm });
  }
}