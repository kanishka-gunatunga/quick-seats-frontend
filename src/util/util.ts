export const getLocalDateTime = (utcDateTime: string) => {
    const date = new Date(utcDateTime);
    // const localDate = date.toLocaleDateString("en-CA", {
    //     year: "numeric",
    //     month: "2-digit",
    //     day: "2-digit",
    // });
    //
    // const localTime = date.toLocaleTimeString("en-CA", {
    //     hour: "numeric",
    //     minute: "2-digit",
    //     hour12: true,
    // });

    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString();

    const localDate = `${year}-${month}-${day}`;
    const localTime = `${formattedHours}:${minutes} ${ampm}`;

    return {localDate, localTime};
};