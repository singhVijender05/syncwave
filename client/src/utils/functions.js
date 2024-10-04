export function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    // Define options for date formatting
    const day = date.getDate(); // Get day of the month
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get short month name
    const year = date.getFullYear(); // Get full year

    // Format hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Add leading zero to minutes if necessary
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert to 12-hour format

    // Build the formatted date string
    return `${day} ${month} ${year} | ${hours}:${minutes} ${ampm}`;
}

export const getYouTubeThumbnail = (url) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` : null;
};
