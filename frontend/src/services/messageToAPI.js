export const messageToAPI = async (message) => {
    const response = await fetch('http://localhost:5000/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });
    const data = await response.json();
    console.log('Data from API:', data);
    return data.response;
}