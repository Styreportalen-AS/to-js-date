/**
 * Convert any object to a date, regardless of format (ish)
 * @param date Give it anything
 * @param throwOnUndefined Throw error when given undefined or null value
 * @returns Parsed or new date
 */
export default function ToJsDate(date: any | Date | string, throwOnNotDefined = false): Date {
    // If it is either undefined or null we should just return the current date
    if (date === undefined || date === null) {
        if (throwOnNotDefined) {
            throw new Error("Date was undefined!");
        }

        return new Date();
    }

    // Check if the given date is a Date object
    if (date instanceof Date) {
        return date;
    }

    // Check if it is a number
    if (typeof date === "number") {
        return new Date(date);
    }

    // Check if it is a string
    if (typeof date === "string") {
        if (date.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/g)) {
            const dateparts: RegExpExecArray = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/g.exec(date)!;
            return new Date(+dateparts[1], +dateparts[2] - 1, +dateparts[3]);
        }

        // Try parsing through new Date(), will return Invalid Date if not accepted
        return new Date(date);
    }

    // Check for firebase timestamp without including the types
    if ("toDate" in date && typeof date["toDate"] === "function") {
        return date.toDate();
    }

    // Check for firebase timestamp, but the object version
    if ("_seconds" in date && typeof date["_seconds"] === "number") {
        return new Date(date._seconds * 1000);
    }

    // Check for firebase timestamp, but the object version
    if ("seconds" in date && typeof date["seconds"] === "number") {
        return new Date(date.seconds * 1000);
    }

    // We really do not know what it is at this point, probably an object so lets just pass it along!
    return new Date(date);
}
